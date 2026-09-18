import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { db } from "@/db";
import { users, courses, exams, contactMessages, enrollments } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Users, BookOpen, ClipboardList, MessageSquare, GraduationCap, UserCog } from "lucide-react";

export const metadata = { title: "Yönetim Paneli" };

export default async function AdminOverviewPage() {
  const [
    [{ value: studentCount }],
    [{ value: teacherCount }],
    [{ value: courseCount }],
    [{ value: examCount }],
    [{ value: enrollmentCount }],
    [{ value: unreadMessages }],
  ] = await Promise.all([
    db.select({ value: count() }).from(users).where(eq(users.role, "STUDENT")),
    db.select({ value: count() }).from(users).where(eq(users.role, "TEACHER")),
    db.select({ value: count() }).from(courses),
    db.select({ value: count() }).from(exams),
    db.select({ value: count() }).from(enrollments),
    db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.isRead, false)),
  ]);

  return (
    <div>
      <DashboardPageHeader
        title="Genel Bakış"
        description="Platformunuzun anlık istatistiklerini buradan takip edin."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={GraduationCap} label="Öğrenci Sayısı" value={studentCount} />
        <StatCard icon={UserCog} label="Eğitmen Sayısı" value={teacherCount} />
        <StatCard icon={BookOpen} label="Toplam Kurs" value={courseCount} />
        <StatCard icon={ClipboardList} label="Toplam Sınav" value={examCount} />
        <StatCard icon={Users} label="Toplam Kayıt (Enrollment)" value={enrollmentCount} />
        <StatCard
          icon={MessageSquare}
          label="Okunmamış Mesaj"
          value={unreadMessages}
          hint={unreadMessages > 0 ? "Mesajlar sekmesinden inceleyin" : undefined}
        />
      </div>
    </div>
  );
}
