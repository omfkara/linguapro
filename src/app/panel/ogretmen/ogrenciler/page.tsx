import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { db } from "@/db";
import { courses, enrollments, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Users, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Öğrencilerim" };

export default async function TeacherStudentsPage() {
  const session = await auth();
  const myCourses = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .where(eq(courses.teacherId, session!.user.id));

  const courseIds = myCourses.map((c) => c.id);
  const courseTitleMap = new Map(myCourses.map((c) => [c.id, c.title]));

  const rows =
    courseIds.length > 0
      ? await db
          .select({
            id: enrollments.id,
            courseId: enrollments.courseId,
            progressPercent: enrollments.progressPercent,
            enrolledAt: enrollments.enrolledAt,
            studentName: users.name,
            studentEmail: users.email,
          })
          .from(enrollments)
          .innerJoin(users, eq(enrollments.studentId, users.id))
          .where(inArray(enrollments.courseId, courseIds))
      : [];

  return (
    <div>
      <DashboardPageHeader
        title="Öğrencilerim"
        description="Kurslarınıza kayıtlı öğrencileri ve ilerlemelerini görüntüleyin."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Henüz kayıtlı öğrenci yok"
          description="Kurslarınız yayınlandıkça öğrenci kayıtları burada listelenecek."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3">Öğrenci</th>
                <th className="px-5 py-3">Kurs</th>
                <th className="px-5 py-3">İlerleme</th>
                <th className="px-5 py-3">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink-900">{r.studentName}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-500">
                      <Mail size={11} /> {r.studentEmail}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">
                    {courseTitleMap.get(r.courseId)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${r.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-ink-600">
                        %{r.progressPercent}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-500">{formatDate(r.enrolledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
