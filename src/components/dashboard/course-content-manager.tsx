import { db } from "@/db";
import { courses, videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddVideoForm } from "./add-video-form";
import { deleteVideoAction } from "@/lib/actions/course-actions";
import { formatDuration } from "@/lib/utils";
import { PlayCircle, Trash2, Star } from "lucide-react";

export async function CourseContentManager({ courseId }: { courseId: string }) {
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const courseVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.courseId, courseId))
    .orderBy(videos.order);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="font-display text-lg font-bold text-ink-950">
          {course.title} — Video Dersler
        </h2>
        <div className="mt-4 space-y-3">
          {courseVideos.length === 0 && (
            <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
              Henüz video eklenmedi.
            </p>
          )}
          {courseVideos.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <PlayCircle size={17} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">
                  {i + 1}. {v.title}
                </p>
                <p className="text-xs text-ink-400">
                  {v.provider} · {formatDuration(v.durationSeconds ?? 0)}
                  {v.isFreePreview && (
                    <span className="ml-2 inline-flex items-center gap-0.5 font-bold text-accent-600">
                      <Star size={11} fill="currentColor" /> Ücretsiz
                    </span>
                  )}
                </p>
              </div>
              <form action={deleteVideoAction.bind(null, courseId, v.id)}>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <AddVideoForm courseId={courseId} />
    </div>
  );
}
