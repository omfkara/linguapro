import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseContentManager } from "@/components/dashboard/course-content-manager";

export const metadata = { title: "Kurs İçeriği" };

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <DashboardPageHeader
        title="Kurs İçeriği Yönetimi"
        description="Video derslerini ekleyin, sıralayın veya kaldırın."
      />
      <CourseContentManager courseId={id} />
    </div>
  );
}
