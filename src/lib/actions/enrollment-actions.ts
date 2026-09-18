"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { enrollments, courses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function enrollInCourseAction(
  courseId: string,
  slug: string
): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    redirect(`/giris?callbackUrl=/kurslar/${slug}`);
  }

  if (session.user.role !== "STUDENT") {
    redirect(`/kurslar/${slug}?hata=sadece-ogrenci`);
  }

  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, session.user.id),
        eq(enrollments.courseId, courseId)
      )
    )
    .limit(1);

  if (existing) {
    redirect(`/panel/ogrenci/kurslar/${courseId}`);
  }

  const [course] = await db
    .select({ id: courses.id, published: courses.published })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course || !course.published) {
    redirect(`/kurslar/${slug}?hata=uygun-degil`);
  }

  await db.insert(enrollments).values({
    studentId: session.user.id,
    courseId,
  });

  revalidatePath(`/kurslar/${slug}`);
  redirect(`/panel/ogrenci/kurslar/${courseId}`);
}
