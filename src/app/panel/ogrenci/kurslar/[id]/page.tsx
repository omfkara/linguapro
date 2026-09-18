import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { courses, videos, videoProgress, enrollments, exams } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { VideoPlayerPanel } from "@/components/dashboard/video-player-panel";
import { ClipboardList, ArrowRight } from "lucide-react";

export const metadata = { title: "Kurs" };

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [enrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, session!.user.id), eq(enrollments.courseId, id)))
    .limit(1);

  if (!enrollment) redirect("/panel/ogrenci/kurslar");

  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) redirect("/panel/ogrenci/kurslar");

  const courseVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.courseId, id))
    .orderBy(videos.order);

  const progressRows = await db
    .select({ videoId: videoProgress.videoId, completed: videoProgress.completed })
    .from(videoProgress)
    .where(eq(videoProgress.studentId, session!.user.id));
  const completedSet = new Set(progressRows.filter((p) => p.completed).map((p) => p.videoId));

  const courseExams = await db
    .select()
    .from(exams)
    .where(and(eq(exams.courseId, id), eq(exams.published, true)));

  return (
    <div>
      <DashboardPageHeader title={course.title} description={course.shortDescription ?? undefined} />

      <VideoPlayerPanel
        courseId={id}
        videos={courseVideos.map((v) => ({
          id: v.id,
          title: v.title,
          videoUrl: v.videoUrl,
          durationSeconds: v.durationSeconds,
          completed: completedSet.has(v.id),
        }))}
      />

      {courseExams.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-ink-950">Kurs Sınavları</h2>
          <div className="mt-4 space-y-3">
            {courseExams.map((e) => (
              <Link
                key={e.id}
                href={`/panel/ogrenci/sinavlar/${e.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 bg-white p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <ClipboardList size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{e.title}</p>
                    <p className="text-xs text-ink-500">
                      {e.durationMinutes} dakika · Geçme notu %{e.passingScore}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-ink-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
