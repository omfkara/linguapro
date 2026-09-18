import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseForm } from "@/components/dashboard/course-form";
import { getTeachersList } from "@/lib/actions/course-actions";

export const metadata = { title: "Yeni Kurs" };

export default async function NewCoursePage() {
  const teachers = await getTeachersList();

  return (
    <div className="mx-auto max-w-2xl">
      <DashboardPageHeader
        title="Yeni Kurs Oluştur"
        description="Kurs bilgilerini girin. Kayıttan sonra video ve sınav ekleyebilirsiniz."
      />
      <CourseForm teachers={teachers} redirectTo="/panel/yonetim/kurslar" />
    </div>
  );
}
