import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { db } from "@/db";
import { courses, enrollments, exams } from "@/db/schema";
import { eq, inArray, count } from "drizzle-orm";
import { BookOpen, Users, ClipboardList, CheckCircle } from "lucide-react";

export const metadata = { title: "Eğitmen Paneli" };

export default async function TeacherOverviewPage() {
  const session = await auth();
  const teacherId = session!.user.id;

  const myCourses = await db
    .select({ id: courses.id, published: courses.published })
    .from(courses)
    .where(eq(courses.teacherId, teacherId));

  const courseIds = myCourses.map((c) => c.id);
  const publishedCount = myCourses.filter((c) => c.published).length;

  let studentCount = 0;
  let examCount = 0;
  if (courseIds.length > 0) {
    const [{ value: enrollValue }] = await db
      .select({ value: count() })
      .from(enrollments)
      .where(inArray(enrollments.courseId, courseIds));
    studentCount = enrollValue;

    const [{ value: examValue }] = await db
      .select({ value: count() })
      .from(exams)
      .where(inArray(exams.courseId, courseIds));
    examCount = examValue;
  }

  return (
    <div>
      <DashboardPageHeader
        title={`Hoş geldiniz, ${session?.user.name?.split(" ")[0]}`}
        description="Kurslarınızın ve öğrencilerinizin genel durumu."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Toplam Kurs" value={myCourses.length} />
        <StatCard icon={CheckCircle} label="Yayındaki Kurs" value={publishedCount} />
        <StatCard icon={Users} label="Kayıtlı Öğrenci" value={studentCount} />
        <StatCard icon={ClipboardList} label="Toplam Sınav" value={examCount} />
      </div>
    </div>
  );
}
