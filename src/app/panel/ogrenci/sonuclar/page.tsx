import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { db } from "@/db";
import { examAttempts, exams } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Sonuçlarım" };

export default async function StudentResultsPage() {
  const session = await auth();

  const results = await db
    .select({
      id: examAttempts.id,
      scorePercent: examAttempts.scorePercent,
      resultLevel: examAttempts.resultLevel,
      passed: examAttempts.passed,
      completedAt: examAttempts.completedAt,
      examTitle: exams.title,
      examType: exams.type,
    })
    .from(examAttempts)
    .innerJoin(exams, eq(examAttempts.examId, exams.id))
    .where(eq(examAttempts.studentId, session!.user.id))
    .orderBy(desc(examAttempts.completedAt));

  return (
    <div>
      <DashboardPageHeader title="Sonuçlarım" description="Girdiğiniz tüm sınavların geçmişi." />

      {results.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Henüz sınav sonucunuz yok"
          description="Bir sınava girdiğinizde sonuçlarınız burada listelenecek."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3">Sınav</th>
                <th className="px-5 py-3">Sonuç</th>
                <th className="px-5 py-3">Puan</th>
                <th className="px-5 py-3">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5 font-semibold text-ink-900">{r.examTitle}</td>
                  <td className="px-5 py-3.5">
                    {r.examType === "LEVEL_TEST" ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        Seviye: {r.resultLevel}
                      </span>
                    ) : r.passed ? (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                        <CheckCircle2 size={12} /> Başarılı
                      </span>
                    ) : (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                        <XCircle size={12} /> Başarısız
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-ink-900">
                    %{r.scorePercent?.toFixed(0)}
                  </td>
                  <td className="px-5 py-3.5 text-ink-500">
                    {r.completedAt ? formatDate(r.completedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
