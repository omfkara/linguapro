import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CourseCard } from "@/components/site/course-card";
import { CtaSection } from "@/components/site/cta-section";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { getPublishedCourses } from "@/lib/queries/courses";
import { SITE } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/queries/settings";
import { BookX } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitles.kurslar || "Kurslar",
    description:
      settings.seoDescriptions.kurslar ||
      "İngilizce, Almanca, Fransızca ve daha fazla dilde seviyenize uygun online kursları keşfedin.",
    alternates: { canonical: "/kurslar" },
  };
}

// Build anında (ör. veritabanının erişilebilir olmadığı bir build
// ortamında) statik olarak dışa aktarılmaya çalışılırsa hataya yol
// açar; bu yüzden ISR (revalidate) yerine her istekte dinamik render
// zorunlu kılınıyor.
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courseList = await getPublishedCourses();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "Kurslar", url: `${SITE.url}/kurslar` },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Kurs Kataloğu"
          title="Seviyenize ve hedefinize uygun kursu bulun"
          description="Uzman eğitmenler tarafından hazırlanan, video derslerle desteklenen kapsamlı dil kurslarımızı keşfedin."
          breadcrumb="Kurslar"
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          {courseList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink-200 py-20 text-center">
              <BookX size={40} className="text-ink-300" />
              <p className="font-display text-lg font-bold text-ink-900">
                Şu anda yayında kurs bulunmuyor
              </p>
              <p className="max-w-sm text-sm text-ink-500">
                Eğitmenlerimiz yeni kurslar hazırlıyor. Çok yakında burada
                listelenecekler — takipte kalın!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courseList.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
