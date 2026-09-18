"use client";

import { motion } from "framer-motion";
import { CEFR_LEVELS } from "@/lib/site-config";
import { LinkButton } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function LevelTestTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
            Ücretsiz & Anında Sonuç
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-950 text-balance sm:text-4xl">
            Seviyenizi bilmeden doğru kursu seçemezsiniz
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            CEFR standardına uygun, uzmanlarımız tarafından hazırlanmış seviye
            tespit sınavımızla gerçek seviyenizi öğrenin ve size özel kurs
            önerileriyle zaman kaybetmeden doğru yerden başlayın.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "15-20 dakikada tamamlanan kapsamlı değerlendirme",
              "Dilbilgisi, kelime bilgisi ve okuduğunu anlama ölçümü",
              "Sonuç sonrası size özel kurs önerisi",
              "Panelinize kaydedilir, istediğiniz zaman tekrar erişin",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={20} />
                <span className="text-ink-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <LinkButton href="/seviye-tespit-sinavi" variant="primary" size="lg">
              Şimdi Seviyeni Öğren
            </LinkButton>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 to-ink-950 p-8 shadow-2xl shadow-brand-900/30">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-semibold text-ink-100/80">
                CEFR Seviye Skalası
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                Canlı Önizleme
              </span>
            </div>

            <div className="mt-8 space-y-3">
              {CEFR_LEVELS.map((level, i) => (
                <motion.div
                  key={level}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-8 shrink-0 font-display text-sm font-bold text-white">
                    {level}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500"
                      style={{ width: `${((i + 1) / 6) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm text-ink-100/90 backdrop-blur">
              &ldquo;Sınav sonunda mevcut seviyenizi ve önerilen kursu anında
              görürsünüz.&rdquo;
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
