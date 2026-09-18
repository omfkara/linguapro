import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { enrollments, courses, videos } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { BookOpen, PlayCircle } from "lucide-react";

export const metadata = { title: "Kurslarım" };

export default async function StudentCoursesPage() {
  const session = await auth();

  const myCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      language: courses.language,
      level: courses.level,
      progressPercent: enrollments.progressPercent,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, session!.user.id))
    .orderBy(desc(enrollments.enrolledAt));

  const videoCounts = await db
    .select({ courseId: videos.courseId, value: count() })
    .from(videos)
    .groupBy(videos.courseId);
  const videoCountMap = new Map(videoCounts.map((v) => [v.courseId, v.value]));

  return (
    <div>
      <DashboardPageHeader title="Kurslarım" description="Kayıtlı olduğunuz kurslara buradan erişin." />

      {myCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Henüz bir kursa kayıtlı değilsiniz"
          description="Katalogdan size uygun bir kurs seçin ve öğrenmeye başlayın."
          action={
            <LinkButton href="/kurslar" size="sm">
              Kursları Keşfet
            </LinkButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((c) => (
            <Link
              key={c.id}
              href={`/panel/ogrenci/kurslar/${c.id}`}
              className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-xs font-bold uppercase text-brand-600">
                {c.language} · {c.level}
              </span>
              <h3 className="mt-1.5 font-display text-sm font-bold text-ink-950">{c.title}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
                <PlayCircle size={13} /> {videoCountMap.get(c.id) ?? 0} ders
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-ink-600">
                  %{c.progressPercent}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
