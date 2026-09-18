import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/site/json-ld";
import { getCourseBySlug, isStudentEnrolled } from "@/lib/queries/courses";
import { enrollInCourseAction } from "@/lib/actions/enrollment-actions";
import { auth } from "@/auth";
import { SITE } from "@/lib/site-config";
import { Button, LinkButton } from "@/components/ui/button";
import {
  PlayCircle,
  Lock,
  Clock,
  User,
  BadgeCheck,
  Video as VideoIcon,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Kurs Bulunamadı" };

  return {
    title: course.title,
    description: course.shortDescription || course.description.slice(0, 155),
    alternates: { canonical: `/kurslar/${slug}` },
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { slug } = await params;
  const { hata } = await searchParams;
  const course = await getCourseBySlug(slug);

  if (!course || !course.published) notFound();

  const session = await auth();
  const enrolled =
    session?.user?.role === "STUDENT"
      ? await isStudentEnrolled(session.user.id, course.id)
      : false;

  const enrollAction = enrollInCourseAction.bind(null, course.id, slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "Kurslar", url: `${SITE.url}/kurslar` },
          { name: course.title, url: `${SITE.url}/kurslar/${slug}` },
        ]}
      />
      <CourseJsonLd
        name={course.title}
        description={course.shortDescription || course.description}
      />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 py-16">
          <div className="absolute inset-0 bg-dot-grid opacity-15" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                {course.language}
              </span>
              <span className="rounded-full bg-accent-500 px-3 py-1 text-ink-950">
                Seviye: {course.level}
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold text-white text-balance sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-ink-100/80">
              {course.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-ink-100/80">
              <span className="flex items-center gap-1.5">
                <User size={15} /> {course.teacherName ?? "LinguaPro Eğitmeni"}
              </span>
              <span className="flex items-center gap-1.5">
                <VideoIcon size={15} /> {course.videos.length} ders
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950">
                Kurs Hakkında
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">
                {course.description}
              </p>

              {course.teacherName && (
                <div className="mt-10 flex items-start gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-lg font-bold text-white">
                    {course.teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 font-display font-bold text-ink-950">
                      {course.teacherName}
                      <BadgeCheck size={16} className="text-brand-600" />
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      {course.teacherBio || "Alanında deneyimli LinguaPro eğitmeni."}
                    </p>
                  </div>
                </div>
              )}

              <h2 className="mt-12 font-display text-2xl font-bold text-ink-950">
                Ders İçeriği
              </h2>
              <div className="mt-5 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100">
                {course.videos.length === 0 && (
                  <p className="p-6 text-sm text-ink-500">
                    Bu kurs için ders içerikleri yakında eklenecek.
                  </p>
                )}
                {course.videos.map((video, i) => {
                  const canWatch = enrolled || video.isFreePreview;
                  return (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-4 transition hover:bg-ink-50/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        {canWatch ? <PlayCircle size={18} /> : <Lock size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink-900">
                          {i + 1}. {video.title}
                        </p>
                        {video.isFreePreview && (
                          <span className="text-xs font-bold text-brand-600">
                            Ücretsiz Önizleme
                          </span>
                        )}
                      </div>
                      {!!video.durationSeconds && (
                        <span className="flex items-center gap-1 text-xs text-ink-400">
                          <Clock size={13} />
                          {formatDuration(video.durationSeconds)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-ink-100 bg-white p-7 shadow-lg shadow-ink-900/5 lg:sticky lg:top-24">
              <div className="text-3xl font-bold text-ink-950">
                {course.price && course.price > 0
                  ? `₺${course.price.toLocaleString("tr-TR")}`
                  : "Ücretsiz"}
              </div>
              <p className="mt-1 text-sm text-ink-500">
                Kayıt olduktan sonra tüm derslere sınırsız erişim
              </p>

              {hata && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-100">
                  {hata === "sadece-ogrenci"
                    ? "Yalnızca öğrenci hesapları kurslara kayıt olabilir."
                    : "Bu kurs şu anda kayıt için uygun değil."}
                </p>
              )}
              {enrolled ? (
                <LinkButton
                  href={`/panel/ogrenci/kurslar/${course.id}`}
                  size="lg"
                  className="mt-6 w-full"
                >
                  Panelde Devam Et
                </LinkButton>
              ) : (
                <form action={enrollAction} className="mt-6">
                  <Button type="submit" size="lg" className="w-full">
                    Kursa Kayıt Ol
                  </Button>
                </form>
              )}

              <ul className="mt-6 space-y-3 border-t border-ink-100 pt-6 text-sm text-ink-600">
                <li className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-success" /> Ömür boyu erişim
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-success" /> Kurs sonu sertifikalı sınav
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-success" /> İlerleme takibi
                </li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
