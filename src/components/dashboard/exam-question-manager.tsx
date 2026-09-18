import { db } from "@/db";
import { exams, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddQuestionForm } from "./add-question-form";
import { deleteQuestionAction, togglePublishExamAction } from "@/lib/actions/exam-actions";
import { Trash2, Eye, EyeOff } from "lucide-react";

export async function ExamQuestionManager({ examId }: { examId: string }) {
  const [exam] = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  if (!exam) notFound();

  const examQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId))
    .orderBy(questions.order);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-5">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-950">{exam.title}</h2>
          <p className="text-sm text-ink-500">
            {examQuestions.length} soru · Geçme notu: %{exam.passingScore} · Süre: {exam.durationMinutes} dk
          </p>
        </div>
        <form action={togglePublishExamAction.bind(null, examId)}>
          <button
            type="submit"
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold ${
              exam.published
                ? "bg-ink-100 text-ink-600"
                : "bg-brand-600 text-white"
            }`}
          >
            {exam.published ? <EyeOff size={14} /> : <Eye size={14} />}
            {exam.published ? "Yayından Kaldır" : "Sınavı Yayınla"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {examQuestions.length === 0 && (
            <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
              Henüz soru eklenmedi. Sınavı yayınlamadan önce en az bir soru ekleyin.
            </p>
          )}
          {examQuestions.map((q, i) => (
            <div key={q.id} className="rounded-xl border border-ink-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-ink-900">
                  {i + 1}. {q.text}
                </p>
                <form action={deleteQuestionAction.bind(null, examId, q.id)}>
                  <button
                    type="submit"
                    className="shrink-0 text-ink-400 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
              <ul className="mt-2.5 space-y-1">
                {(q.options as string[]).map((opt, oi) => (
                  <li
                    key={oi}
                    className={`rounded-lg px-3 py-1.5 text-xs ${
                      oi === q.correctAnswerIndex
                        ? "bg-green-50 font-semibold text-green-700"
                        : "text-ink-500"
                    }`}
                  >
                    {String.fromCharCode(65 + oi)}) {opt}
                  </li>
                ))}
              </ul>
              {q.targetLevel && (
                <span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                  {q.targetLevel}
                </span>
              )}
            </div>
          ))}
        </div>

        <AddQuestionForm examId={examId} isLevelTest={exam.type === "LEVEL_TEST"} />
      </div>
    </div>
  );
}
