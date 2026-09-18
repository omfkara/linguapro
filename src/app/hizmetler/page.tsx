import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { SITE } from "@/lib/site-config";
import {
  Video,
  ClipboardCheck,
  Gauge,
  Users2,
  Building2,
  Headset,
  ArrowRight,
  Check,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Bireysel online dil eğitiminden kurumsal eğitim çözümlerine, video ders kütüphanesinden sertifikalı sınav sistemine kadar tüm hizmetlerimiz.",
  alternates: { canonical: "/hizmetler" },
};

const SERVICES = [
  {
    icon: Video,
    title: "Online Video Ders Eğitimi",
    description:
      "Uzman eğitmenlerimiz tarafından hazırlanan yapılandırılmış video ders serileriyle kendi hızınızda öğrenin.",
    items: [
      "Konuya göre bölümlenmiş ders videoları",
      "İstediğiniz zaman tekrar izleme",
      "İlerleme takibi ve otomatik kaldığın yerden devam",
    ],
  },
  {
    icon: Gauge,
    title: "Seviye Tespit & Yerleştirme",
    description:
      "CEFR standardına uygun sınavımızla gerçek seviyenizi belirleyip size özel kurs planı oluşturuyoruz.",
    items: [
      "A1-C2 arası kapsamlı değerlendirme",
      "Anlık sonuç ve detaylı analiz",
      "Kişiye özel kurs önerisi",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Online Sınav & Sertifikasyon",
    description:
      "Her kurs sonunda ölçme-değerlendirme sınavlarına girerek gelişiminizi somut olarak belgelendirin.",
    items: [
      "Çoktan seçmeli & doğru-yanlış sorular",
      "Anlık puanlama ve geri bildirim",
      "İndirilebilir başarı sertifikası",
    ],
  },
  {
    icon: Building2,
    title: "Kurumsal Dil Eğitimi",
    description:
      "Şirketinizin ihtiyaçlarına özel toplu kayıt, özel müfredat ve detaylı raporlama ile kurumsal çözümler sunuyoruz.",
    items: [
      "Toplu öğrenci kaydı ve yönetimi",
      "Departmana özel ilerleme raporları",
      "Özel fiyatlandırma seçenekleri",
    ],
  },
  {
    icon: Users2,
    title: "Eğitmen Yönetim Paneli",
    description:
      "Eğitmenlerimiz kendi sınıflarını, video içeriklerini ve sınavlarını bağımsız olarak yönetebildiği bir panele sahiptir.",
    items: [
      "Video ve sınav yükleme/yönetme",
      "Öğrenci performans takibi",
      "Sınıf bazlı raporlama",
    ],
  },
  {
    icon: Headset,
    title: "Öğrenci Danışmanlığı",
    description:
      "Kayıt öncesi ve sonrasında öğrencilerimize hedef odaklı danışmanlık hizmeti sunuyoruz.",
    items: [
      "Kişisel öğrenme hedefi belirleme",
      "Düzenli motivasyon takibi",
      "Kurs sonrası yönlendirme desteği",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "Hizmetlerimiz", url: `${SITE.url}/hizmetler` },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Neler Sunuyoruz"
          title="Uçtan uca profesyonel dil eğitimi hizmetleri"
          description="Bireysel öğrencilerden kurumsal müşterilere kadar, ihtiyacınıza özel kapsamlı çözümler sunuyoruz."
          breadcrumb="Hizmetlerimiz"
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="flex flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition hover:shadow-lg hover:shadow-brand-900/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25">
                  <service.icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink-950">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-ink-100 pt-5">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink-50/60 py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center lg:px-8">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
              Kurumsal İşbirlikleri
            </span>
            <h2 className="font-display text-3xl font-bold text-ink-950 text-balance">
              Şirketiniz için özel dil eğitimi çözümleri arıyor musunuz?
            </h2>
            <p className="max-w-2xl text-ink-500">
              Ekibinizin ihtiyaçlarına göre tasarlanmış müfredat, toplu kayıt
              ve detaylı raporlama seçenekleri için bizimle iletişime geçin.
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
            >
              Kurumsal Teklif Alın <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
