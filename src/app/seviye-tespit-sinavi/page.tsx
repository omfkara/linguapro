import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { SITE, CEFR_LEVELS } from "@/lib/site-config";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Clock, ListChecks, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Ücretsiz Seviye Tespit Sınavı",
  description:
    "CEFR standardına uygun ücretsiz seviye tespit sınavımızla A1'den C2'ye gerçek dil seviyenizi 15-20 dakikada öğrenin.",
  alternates: { canonical: "/seviye-tespit-sinavi" },
};

const LEVEL_INFO = [
  { level: "A1", title: "Başlangıç", desc: "Temel kelime ve ifadeler" },
  { level: "A2", title: "Temel", desc: "Günlük basit iletişim" },
  { level: "B1", title: "Orta", desc: "Tanıdık konularda akıcılık" },
  { level: "B2", title: "Orta-Üst", desc: "Karmaşık metinleri anlama" },
  { level: "C1", title: "İleri", desc: "Esnek, etkili ifade" },
  { level: "C2", title: "Uzman", desc: "Anadile yakın hakimiyet" },
];

export default async function LevelTestLandingPage() {
  const session = await auth();

  const [levelTest] = await db
    .select({ id: exams.id })
    .from(exams)
    .where(and(eq(exams.type, "LEVEL_TEST"), eq(exams.published, true)))
    .limit(1);

  let ctaHref = "/kayit";
  if (session?.user) {
    ctaHref = "/panel/ogrenci/seviye-testi";
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "Seviye Tespit Sınavı", url: `${SITE.url}/seviye-tespit-sinavi` },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Ücretsiz & Anında Sonuç"
          title="Gerçek dil seviyenizi 15-20 dakikada öğrenin"
          description="CEFR standardına uygun sınavımızla A1'den C2'ye tam olarak nerede olduğunuzu görün, size özel kurs önerisi alın."
          breadcrumb="Seviye Tespit Sınavı"
        />

        <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Clock, title: "15-20 Dakika", desc: "Kısa ve odaklı bir değerlendirme" },
              { icon: ListChecks, title: "30 Soru", desc: "Dilbilgisi, kelime ve anlama ölçümü" },
              { icon: Award, title: "Anında Sonuç", desc: "Sınav biter bitmez seviyenizi görün" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon size={22} />
                </div>
                <p className="mt-4 font-display text-base font-bold text-ink-950">{item.title}</p>
                <p className="mt-1 text-sm text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold text-ink-950">
              CEFR Seviye Skalası
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {LEVEL_INFO.map((l) => (
                <div
                  key={l.level}
                  className="rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm"
                >
                  <span className="font-display text-2xl font-bold text-brand-600">
                    {l.level}
                  </span>
                  <p className="mt-1 text-xs font-bold text-ink-900">{l.title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-500">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-3xl bg-gradient-to-br from-brand-600 to-ink-950 px-8 py-14 text-center shadow-2xl shadow-brand-900/20">
            <h2 className="font-display text-2xl font-bold text-white text-balance sm:text-3xl">
              {levelTest
                ? "Hazırsanız sınava başlayabilirsiniz"
                : "Sınavımız çok yakında yayında"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-100/80">
              {session?.user
                ? "Panelinizden sınava başlayın, sonucunuz hesabınıza kaydedilecek."
                : "Sınava başlamak için önce ücretsiz bir hesap oluşturmanız gerekiyor."}
            </p>
            {levelTest && (
              <Link
                href={ctaHref}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-accent-500/30 transition hover:bg-accent-400"
              >
                {session?.user ? "Sınava Başla" : "Ücretsiz Kayıt Ol ve Başla"}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
