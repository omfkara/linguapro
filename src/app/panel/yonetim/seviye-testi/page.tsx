import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ExamQuestionManager } from "@/components/dashboard/exam-question-manager";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LevelTestCreateForm } from "./create-form";

export const metadata = { title: "Seviye Tespit Sınavı" };

export default async function AdminLevelTestPage() {
  const [levelTest] = await db
    .select()
    .from(exams)
    .where(eq(exams.type, "LEVEL_TEST"))
    .limit(1);

  return (
    <div>
      <DashboardPageHeader
        title="Seviye Tespit Sınavı"
        description="Sitede herkese açık ücretsiz seviye tespit sınavının sorularını yönetin."
      />
      {levelTest ? (
        <ExamQuestionManager examId={levelTest.id} />
      ) : (
        <LevelTestCreateForm />
      )}
    </div>
  );
}
