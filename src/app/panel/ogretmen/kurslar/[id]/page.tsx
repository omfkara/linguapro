import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CourseContentManager } from "@/components/dashboard/course-content-manager";

export const metadata = { title: "Kurs İçeriği" };

export default async function TeacherCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course || (session!.user.role === "TEACHER" && course.teacherId !== session!.user.id)) {
    redirect("/panel/ogretmen/kurslar");
  }

  return (
    <div>
      <DashboardPageHeader
        title="Kurs İçeriği Yönetimi"
        description="Video derslerini ekleyin veya kaldırın."
      />
      <CourseContentManager courseId={id} />
    </div>
  );
}
