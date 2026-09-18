import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { db } from "@/db";
import { exams, courses, enrollments, examAttempts } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { ClipboardList, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Sınavlarım" };

export default async function StudentExamsPage() {
  const session = await auth();
  const studentId = session!.user.id;

  const myCourseIds = (
    await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId))
  ).map((r) => r.courseId);

  const availableExams =
    myCourseIds.length > 0
      ? await db
          .select({
            id: exams.id,
            title: exams.title,
            durationMinutes: exams.durationMinutes,
            passingScore: exams.passingScore,
            courseTitle: courses.title,
          })
          .from(exams)
          .innerJoin(courses, eq(exams.courseId, courses.id))
          .where(
            and(
              eq(exams.type, "COURSE_EXAM"),
              eq(exams.published, true),
              inArray(exams.courseId, myCourseIds)
            )
          )
      : [];

  const attempts = await db
    .select({ examId: examAttempts.examId })
    .from(examAttempts)
    .where(eq(examAttempts.studentId, studentId));
  const attemptedExamIds = new Set(attempts.map((a) => a.examId));

  return (
    <div>
      <DashboardPageHeader
        title="Sınavlarım"
        description="Kayıtlı olduğunuz kurslara ait sınavlara buradan girebilirsiniz."
      />

      {availableExams.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Şu anda erişilebilir sınav yok"
          description="Bir kursa kayıt olduğunuzda ve eğitmeniniz sınav yayınladığında burada listelenecek."
        />
      ) : (
        <div className="space-y-3">
          {availableExams.map((e) => (
            <Link
              key={e.id}
              href={`/panel/ogrenci/sinavlar/${e.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <ClipboardList size={19} />
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{e.title}</p>
                  <p className="text-xs text-ink-500">
                    {e.courseTitle} · {e.durationMinutes} dk · Geçme notu %{e.passingScore}
                  </p>
                </div>
              </div>
              {attemptedExamIds.has(e.id) ? (
                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  <CheckCircle2 size={14} /> Tamamlandı
                </span>
              ) : (
                <ArrowRight size={18} className="text-ink-400" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
