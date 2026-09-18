import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, questions, examAttempts } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExamTaker } from "@/components/dashboard/exam-taker";
import { Button } from "@/components/ui/button";
import { Gauge, TrendingUp } from "lucide-react";
import { LEVEL_DESCRIPTIONS } from "@/lib/exam-scoring";

export const metadata = { title: "Seviye Tespit Sınavı" };

export default async function StudentLevelTestPage({
  searchParams,
}: {
  searchParams: Promise<{ tekrar?: string }>;
}) {
  const { tekrar } = await searchParams;
  const session = await auth();

  const [levelTest] = await db
    .select()
    .from(exams)
    .where(and(eq(exams.type, "LEVEL_TEST"), eq(exams.published, true)))
    .limit(1);

  if (!levelTest) {
    return (
      <div>
        <DashboardPageHeader title="Seviye Tespit Sınavı" />
        <EmptyState
          icon={Gauge}
          title="Sınav henüz hazır değil"
          description="Seviye tespit sınavımız çok yakında yayında olacak."
        />
      </div>
    );
  }

  const [lastAttempt] = await db
    .select()
    .from(examAttempts)
    .where(
      and(eq(examAttempts.studentId, session!.user.id), eq(examAttempts.examId, levelTest.id))
    )
    .orderBy(desc(examAttempts.completedAt))
    .limit(1);

  if (lastAttempt && tekrar !== "1") {
    const level = lastAttempt.resultLevel as keyof typeof LEVEL_DESCRIPTIONS | null;
    return (
      <div>
        <DashboardPageHeader title="Seviye Tespit Sınavı" />
        <div className="mx-auto max-w-lg rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <TrendingUp size={28} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-ink-950">
            Daha önce bu sınava girdiniz
          </h2>
          {level && (
            <>
              <p className="mt-3 font-display text-5xl font-bold text-brand-600">{level}</p>
              <p className="mt-3 text-sm text-ink-600">{LEVEL_DESCRIPTIONS[level]}</p>
            </>
          )}
          <Link href="/panel/ogrenci/seviye-testi?tekrar=1">
            <Button variant="outline" className="mt-6 w-full">
              Sınavı Tekrar Çöz
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const examQuestions = await db
    .select({ id: questions.id, text: questions.text, options: questions.options })
    .from(questions)
    .where(eq(questions.examId, levelTest.id))
    .orderBy(questions.order);

  if (examQuestions.length === 0) {
    return (
      <div>
        <DashboardPageHeader title="Seviye Tespit Sınavı" />
        <EmptyState
          icon={Gauge}
          title="Sınav henüz hazır değil"
          description="Sorular hazırlanıyor, çok yakında burada olacak."
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        title="Seviye Tespit Sınavı"
        description="Sınav süresince sayfadan ayrılmayın, süre dolduğunda otomatik olarak tamamlanır."
      />
      <ExamTaker
        examId={levelTest.id}
        title={levelTest.title}
        durationMinutes={levelTest.durationMinutes}
        questions={examQuestions.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options as string[],
        }))}
        isLevelTest
        resultRedirect="/panel/ogrenci"
      />
    </div>
  );
}
