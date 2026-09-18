import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { exams, courses, questions } from "@/db/schema";
import { desc, eq, count, and } from "drizzle-orm";
import { deleteExamAction } from "@/lib/actions/exam-actions";
import { ClipboardList, Plus, Trash2, ListChecks } from "lucide-react";

export const metadata = { title: "Sınavlarım" };

export default async function TeacherExamsPage() {
  const session = await auth();

  const examList = await db
    .select({
      id: exams.id,
      title: exams.title,
      published: exams.published,
      courseTitle: courses.title,
      durationMinutes: exams.durationMinutes,
    })
    .from(exams)
    .innerJoin(courses, eq(exams.courseId, courses.id))
    .where(
      and(eq(exams.type, "COURSE_EXAM"), eq(courses.teacherId, session!.user.id))
    )
    .orderBy(desc(exams.createdAt));

  const questionCounts = await db
    .select({ examId: questions.examId, value: count() })
    .from(questions)
    .groupBy(questions.examId);
  const countMap = new Map(questionCounts.map((q) => [q.examId, q.value]));

  return (
    <div>
      <DashboardPageHeader
        title="Sınavlarım"
        description="Kurslarınıza ait değerlendirme sınavlarını yönetin."
        action={
          <LinkButton href="/panel/ogretmen/sinavlar/yeni" size="sm">
            <Plus size={16} /> Yeni Sınav
          </LinkButton>
        }
      />

      {examList.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Henüz sınav oluşturmadınız"
          description="Kurslarınıza sınav ekleyerek öğrencilerinizin gelişimini ölçün."
          action={
            <LinkButton href="/panel/ogretmen/sinavlar/yeni" size="sm">
              Sınav Oluştur
            </LinkButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examList.map((e) => (
            <div key={e.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-sm font-bold text-ink-950">{e.title}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                    e.published ? "bg-green-50 text-green-700" : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {e.published ? "Yayında" : "Taslak"}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink-500">
                Kurs: {e.courseTitle} · {countMap.get(e.id) ?? 0} soru · {e.durationMinutes} dk
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4">
                <Link
                  href={`/panel/ogretmen/sinavlar/${e.id}`}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                >
                  <ListChecks size={14} /> Soruları Yönet
                </Link>
                <form action={deleteExamAction.bind(null, e.id)} className="ml-auto">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
