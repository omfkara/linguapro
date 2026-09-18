import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ExamCreateForm } from "@/components/dashboard/exam-create-form";
import { db } from "@/db";
import { courses } from "@/db/schema";

export const metadata = { title: "Yeni Sınav" };

export default async function NewExamPage() {
  const courseList = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses);

  return (
    <div className="mx-auto max-w-2xl">
      <DashboardPageHeader
        title="Yeni Sınav Oluştur"
        description="Bir kursa bağlı değerlendirme sınavı oluşturun, ardından soru ekleyin."
      />
      <ExamCreateForm courses={courseList} redirectTo="/panel/yonetim/sinavlar" />
    </div>
  );
}
