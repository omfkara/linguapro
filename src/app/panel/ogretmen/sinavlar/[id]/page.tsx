import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ExamQuestionManager } from "@/components/dashboard/exam-question-manager";

export const metadata = { title: "Sınav Soruları" };

export default async function TeacherExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <DashboardPageHeader title="Sınav Soruları" description="Sınav sorularını yönetin ve yayınlayın." />
      <ExamQuestionManager examId={id} />
    </div>
  );
}
