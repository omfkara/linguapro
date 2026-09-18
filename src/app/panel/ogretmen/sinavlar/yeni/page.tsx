import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ExamCreateForm } from "@/components/dashboard/exam-create-form";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = { title: "Yeni Sınav" };

export default async function NewTeacherExamPage() {
  const session = await auth();
  const myCourses = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .where(eq(courses.teacherId, session!.user.id));

  return (
    <div className="mx-auto max-w-2xl">
      <DashboardPageHeader
        title="Yeni Sınav Oluştur"
        description="Kurslarınızdan birine bağlı değerlendirme sınavı oluşturun."
      />
      <ExamCreateForm courses={myCourses} redirectTo="/panel/ogretmen/sinavlar" />
    </div>
  );
}
