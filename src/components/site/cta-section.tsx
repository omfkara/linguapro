import { LinkButton } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-ink-950 px-8 py-16 text-center shadow-2xl shadow-brand-900/30 sm:px-16">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl animate-float-slower" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
            <Sparkles size={14} className="text-accent-400" />
            Hemen bugün başlayın
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-white text-balance sm:text-4xl">
            Dil öğrenme yolculuğunuz tek bir tıkla başlıyor
          </h2>
          <p className="mt-4 text-lg text-ink-100/80">
            Ücretsiz seviye tespit sınavına girin, size en uygun kursu
            keşfedin ve uzman eğitmenlerle çalışmaya bugün başlayın.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/kayit" variant="accent" size="lg">
              Ücretsiz Hesap Oluştur
            </LinkButton>
            <LinkButton
              href="/iletisim"
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:border-white/60"
            >
              Bize Ulaşın
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
