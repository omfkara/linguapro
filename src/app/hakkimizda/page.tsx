import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { SITE } from "@/lib/site-config";
import { Target, Eye, Heart, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "2016'dan bu yana LinguaPro Dil Akademisi; deneyimli eğitmenleri, teknolojik altyapısı ve öğrenci odaklı yaklaşımıyla binlerce kişiye dil öğretiyor.",
  alternates: { canonical: "/hakkimizda" },
};

const VALUES = [
  {
    icon: Target,
    title: "Misyonumuz",
    text: "Her seviyeden öğrenciye, kanıtlanmış yöntemlerle ve teknolojinin gücüyle erişilebilir, kaliteli dil eğitimi sunmak.",
  },
  {
    icon: Eye,
    title: "Vizyonumuz",
    text: "Türkiye'nin en güvenilir online dil eğitimi platformu olarak, öğrenme deneyimini sürekli yeniden tasarlamak.",
  },
  {
    icon: Heart,
    title: "Değerlerimiz",
    text: "Şeffaflık, öğrenci memnuniyeti, sürekli gelişim ve eğitimde fırsat eşitliği önceliklerimizin başında gelir.",
  },
  {
    icon: Award,
    title: "Kalite Güvencesi",
    text: "Tüm eğitmenlerimiz alan uzmanı ve sertifikalıdır; içeriklerimiz düzenli olarak güncellenir ve denetlenir.",
  },
];

const TEAM = [
  { name: "Dr. Ayşe Demir", role: "Kurucu & Akademik Direktör", initials: "AD" },
  { name: "Kaan Yıldırım", role: "Eğitim Teknolojileri Direktörü", initials: "KY" },
  { name: "Selin Öztürk", role: "Kurumsal Eğitimler Koordinatörü", initials: "SÖ" },
  { name: "Burak Acar", role: "Öğrenci Deneyimi Yöneticisi", initials: "BA" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "Hakkımızda", url: `${SITE.url}/hakkimizda` },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Kurumsal Kimliğimiz"
          title="Dil öğrenmeyi herkes için erişilebilir kılıyoruz"
          description={`${SITE.foundedYear} yılından bu yana binlerce öğrenciye eşlik ediyor, uzman kadromuz ve teknolojik altyapımızla fark yaratıyoruz.`}
          breadcrumb="Hakkımızda"
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
                Hikayemiz
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink-950 text-balance">
                Sınıftan dijitale: {SITE.foundedYear}&apos;dan bugüne
              </h2>
              <div className="mt-5 space-y-4 text-ink-600 leading-relaxed">
                <p>
                  LinguaPro Dil Akademisi, {SITE.foundedYear} yılında küçük bir
                  sınıfta başladığı yolculuğuna bugün binlerce öğrenciye ulaşan
                  kapsamlı bir online eğitim platformu olarak devam ediyor.
                </p>
                <p>
                  Deneyimli eğitmen kadromuz, güncel müfredatımız ve
                  öğrencilerimizin ilerlemesini adım adım takip eden
                  teknolojik altyapımızla, geleneksel dil kursu deneyimini
                  dijital çağa taşıyoruz.
                </p>
                <p>
                  Bugün İngilizce&apos;den Almanca&apos;ya, Fransızca&apos;dan
                  İspanyolca&apos;ya kadar altı farklı dilde, video
                  derslerden canlı seanslara, seviye tespit sınavından
                  sertifikalı değerlendirmelere kadar uçtan uca bir eğitim
                  deneyimi sunuyoruz.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <v.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-ink-950">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {v.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink-50/60 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
                Ekibimiz
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink-950">
                Alanında uzman, deneyimli kadromuzla tanışın
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-xl font-bold text-white shadow-lg shadow-brand-900/20">
                    {member.initials}
                  </div>
                  <p className="mt-4 font-display text-sm font-bold text-ink-950">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
