"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Elif Aydın",
    role: "İngilizce B2 Öğrencisi",
    avatarColor: "from-brand-400 to-brand-600",
    initials: "EA",
    text: "Seviye tespit sınavı gerçekten çok isabetliydi. Video derslerin kalitesi ve öğretmenlerin ilgisi sayesinde 6 ayda B2 seviyesine ulaştım.",
  },
  {
    name: "Mert Kaya",
    role: "Almanca A2 Öğrencisi",
    avatarColor: "from-accent-400 to-accent-600",
    initials: "MK",
    text: "Panel üzerinden ilerlememi anlık takip edebilmek büyük motivasyon kaynağı oldu. Sınav sonuçlarımı görmek beni daha disiplinli çalıştırdı.",
  },
  {
    name: "Zeynep Şahin",
    role: "Kurumsal Eğitim Koordinatörü",
    avatarColor: "from-ink-700 to-ink-950",
    initials: "ZŞ",
    text: "Ekibimiz için toplu kayıt yaptırdık. Yönetim panelinin sunduğu raporlama detayı, kurumsal ihtiyaçlarımızı fazlasıyla karşıladı.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Öğrenci Yorumları
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
          Binlerce öğrencinin tercih ettiği platform
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
          >
            <Quote className="absolute right-6 top-6 text-brand-100" size={36} />
            <div className="flex gap-0.5 text-accent-500">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-ink-700">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-sm font-bold text-white`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-ink-950">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
