import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LinkButton } from "@/components/ui/button";
import { db } from "@/db";
import { courses, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { togglePublishAction, deleteCourseAction } from "@/lib/actions/course-actions";
import { BookOpen, Plus, Eye, EyeOff, Trash2, Video } from "lucide-react";

export const metadata = { title: "Kurslar" };

export default async function AdminCoursesPage() {
  const allCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      level: courses.level,
      language: courses.language,
      published: courses.published,
      teacherName: users.name,
    })
    .from(courses)
    .leftJoin(users, eq(courses.teacherId, users.id))
    .orderBy(desc(courses.createdAt));

  return (
    <div>
      <DashboardPageHeader
        title="Kurslar"
        description="Platformdaki tüm kursları görüntüleyin ve yönetin."
        action={
          <LinkButton href="/panel/yonetim/kurslar/yeni" size="sm">
            <Plus size={16} /> Yeni Kurs
          </LinkButton>
        }
      />

      {allCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Henüz kurs eklenmemiş"
          description="İlk kursunuzu oluşturarak başlayın."
          action={
            <LinkButton href="/panel/yonetim/kurslar/yeni" size="sm">
              Kurs Oluştur
            </LinkButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600">
                    {c.language} · {c.level}
                  </span>
                  <h3 className="mt-1 font-display text-sm font-bold text-ink-950">
                    {c.title}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                    c.published
                      ? "bg-green-50 text-green-700"
                      : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {c.published ? "Yayında" : "Taslak"}
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-500">
                Eğitmen: {c.teacherName ?? "Atanmadı"}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4">
                <Link
                  href={`/panel/yonetim/kurslar/${c.id}`}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                >
                  <Video size={14} /> İçerik
                </Link>
                <form action={togglePublishAction.bind(null, c.id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                  >
                    {c.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    {c.published ? "Yayından Kaldır" : "Yayınla"}
                  </button>
                </form>
                <form action={deleteCourseAction.bind(null, c.id)} className="ml-auto">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
