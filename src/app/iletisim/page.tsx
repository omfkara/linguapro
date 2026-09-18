import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { SITE } from "@/lib/site-config";
import { ContactForm } from "./contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Sorularınız için bize ulaşın. LinguaPro Dil Akademisi ekibi en kısa sürede size dönüş yapacaktır.",
  alternates: { canonical: "/iletisim" },
};

const CONTACT_ITEMS = [
  { icon: Phone, label: "Telefon", value: SITE.phone },
  { icon: Mail, label: "E-posta", value: SITE.email },
  { icon: MapPin, label: "Adres", value: SITE.address },
  { icon: Clock, label: "Çalışma Saatleri", value: "Hafta içi 09:00 – 19:00" },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: SITE.url },
          { name: "İletişim", url: `${SITE.url}/iletisim` },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Bize Ulaşın"
          title="Sorularınız için buradayız"
          description="Kayıt, kurumsal eğitim veya genel sorularınız için formu doldurun, ekibimiz size en kısa sürede dönüş yapsın."
          breadcrumb="İletişim"
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-950">
                İletişim Bilgilerimiz
              </h2>
              <p className="mt-3 text-ink-500">
                Aşağıdaki kanallardan bize doğrudan ulaşabilir ya da yandaki
                formu doldurarak talebinizi iletebilirsiniz.
              </p>

              <div className="mt-8 space-y-5">
                {CONTACT_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <item.icon size={19} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-ink-900">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
                <iframe
                  title="Konum haritası"
                  className="h-full w-full"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=28.98%2C41.06%2C29.02%2C41.09&layer=mapnik"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-lg shadow-ink-900/5">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
