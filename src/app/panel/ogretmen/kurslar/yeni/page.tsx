import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseForm } from "@/components/dashboard/course-form";

export const metadata = { title: "Yeni Kurs" };

export default function NewTeacherCoursePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <DashboardPageHeader
        title="Yeni Kurs Oluştur"
        description="Kurs bilgilerini girin. Kayıttan sonra video ve sınav ekleyebilirsiniz."
      />
      <CourseForm redirectTo="/panel/ogretmen/kurslar" />
    </div>
  );
}
