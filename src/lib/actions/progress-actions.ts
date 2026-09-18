"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { videoProgress, videos, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markVideoCompletedAction(
  videoId: string,
  courseId: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return;

  const [existing] = await db
    .select({ id: videoProgress.id })
    .from(videoProgress)
    .where(
      and(
        eq(videoProgress.studentId, session.user.id),
        eq(videoProgress.videoId, videoId)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(videoProgress)
      .set({ completed: true, updatedAt: new Date() })
      .where(eq(videoProgress.id, existing.id));
  } else {
    await db.insert(videoProgress).values({
      studentId: session.user.id,
      videoId,
      completed: true,
    });
  }

  // Kurs ilerleme yüzdesini tamamlanan videolara göre yeniden hesapla.
  const courseVideos = await db
    .select({ id: videos.id })
    .from(videos)
    .where(eq(videos.courseId, courseId));

  const completedRows = await db
    .select({ videoId: videoProgress.videoId })
    .from(videoProgress)
    .where(
      and(
        eq(videoProgress.studentId, session.user.id),
        eq(videoProgress.completed, true)
      )
    );

  const courseVideoIds = new Set(courseVideos.map((v) => v.id));
  const completedInCourse = completedRows.filter((r) => courseVideoIds.has(r.videoId)).length;
  const progressPercent =
    courseVideos.length > 0
      ? Math.round((completedInCourse / courseVideos.length) * 100)
      : 0;

  await db
    .update(enrollments)
    .set({ progressPercent })
    .where(
      and(
        eq(enrollments.studentId, session.user.id),
        eq(enrollments.courseId, courseId)
      )
    );

  revalidatePath(`/panel/ogrenci/kurslar/${courseId}`);
  revalidatePath("/panel/ogrenci");
}
