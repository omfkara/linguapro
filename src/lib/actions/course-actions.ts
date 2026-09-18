"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { courses, videos, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const courseSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı."),
  language: z.string().min(2),
  level: z.enum(CEFR),
  shortDescription: z.string().max(200).optional(),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı."),
  price: z.coerce.number().min(0).default(0),
  teacherId: z.string().uuid().optional(),
});

export type FormState = { error?: string; success?: boolean };

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
    redirect("/giris");
  }
  return session;
}

export async function createCourseAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireStaff();

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    language: formData.get("language"),
    level: formData.get("level"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description"),
    price: formData.get("price") || 0,
    teacherId: formData.get("teacherId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  const teacherId =
    session.user.role === "TEACHER"
      ? session.user.id
      : parsed.data.teacherId || session.user.id;

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (true) {
    const [existing] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1);
    if (!existing) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  await db.insert(courses).values({
    title: parsed.data.title,
    slug,
    language: parsed.data.language,
    level: parsed.data.level,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    price: parsed.data.price,
    teacherId,
    published: false,
  });

  revalidatePath("/panel/yonetim/kurslar");
  revalidatePath("/panel/ogretmen/kurslar");
  revalidatePath("/kurslar");
  return { success: true };
}

async function assertCourseAccess(courseId: string) {
  const session = await requireStaff();
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) redirect("/panel");
  if (session.user.role === "TEACHER" && course.teacherId !== session.user.id) {
    redirect("/panel/ogretmen/kurslar");
  }
  return { session, course };
}

export async function togglePublishAction(courseId: string) {
  const { course } = await assertCourseAccess(courseId);
  await db
    .update(courses)
    .set({ published: !course.published, updatedAt: new Date() })
    .where(eq(courses.id, courseId));

  revalidatePath("/panel/yonetim/kurslar");
  revalidatePath("/panel/ogretmen/kurslar");
  revalidatePath("/kurslar");
}

export async function deleteCourseAction(courseId: string) {
  await assertCourseAccess(courseId);
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/panel/yonetim/kurslar");
  revalidatePath("/panel/ogretmen/kurslar");
  revalidatePath("/kurslar");
}

const videoSchema = z.object({
  title: z.string().min(2, "Video başlığı en az 2 karakter olmalı."),
  description: z.string().optional(),
  provider: z.enum(["youtube", "vimeo", "diger"]).default("youtube"),
  videoUrl: z.string().url("Geçerli bir video bağlantısı girin."),
  durationSeconds: z.coerce.number().min(0).default(0),
  isFreePreview: z.coerce.boolean().default(false),
});

function toEmbedUrl(provider: string, url: string): string {
  try {
    if (provider === "youtube") {
      const u = new URL(url);
      let id = u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
      if (u.pathname.startsWith("/embed/")) return url;
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (provider === "vimeo") {
      const u = new URL(url);
      if (u.pathname.startsWith("/video/")) return `https://player.vimeo.com${u.pathname}`;
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // geçersiz URL ise ham haliyle bırak
  }
  return url;
}

export async function addVideoAction(
  courseId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertCourseAccess(courseId);

  const parsed = videoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    provider: formData.get("provider") || "youtube",
    videoUrl: formData.get("videoUrl"),
    durationSeconds: formData.get("durationSeconds") || 0,
    isFreePreview: formData.get("isFreePreview") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  const existingVideos = await db
    .select({ id: videos.id })
    .from(videos)
    .where(eq(videos.courseId, courseId));

  await db.insert(videos).values({
    courseId,
    title: parsed.data.title,
    description: parsed.data.description,
    provider: parsed.data.provider,
    videoUrl: toEmbedUrl(parsed.data.provider, parsed.data.videoUrl),
    durationSeconds: parsed.data.durationSeconds,
    isFreePreview: parsed.data.isFreePreview,
    order: existingVideos.length,
  });

  revalidatePath(`/panel/ogretmen/kurslar/${courseId}`);
  revalidatePath(`/panel/yonetim/kurslar/${courseId}`);
  return { success: true };
}

export async function deleteVideoAction(courseId: string, videoId: string) {
  await assertCourseAccess(courseId);
  await db.delete(videos).where(and(eq(videos.id, videoId), eq(videos.courseId, courseId)));
  revalidatePath(`/panel/ogretmen/kurslar/${courseId}`);
  revalidatePath(`/panel/yonetim/kurslar/${courseId}`);
}

export async function getTeachersList() {
  return db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "TEACHER"));
}
