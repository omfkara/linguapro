"use client";

import { motion } from "framer-motion";
import {
  Video,
  ClipboardCheck,
  Gauge,
  Users,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

const FEATURES = [
  {
    icon: Video,
    title: "Video Eğitim Kütüphanesi",
    description:
      "Eğitmenler ders videolarını yükler, öğrenciler istedikleri an izler ve ilerlemesi otomatik kaydedilir.",
  },
  {
    icon: ClipboardCheck,
    title: "Online Sınav Sistemi",
    description:
      "Kurs sonu sınavları, anlık puanlama ve detaylı sonuç raporlarıyla gelişiminizi somut şekilde görün.",
  },
  {
    icon: Gauge,
    title: "Seviye Tespit Sınavı",
    description:
      "CEFR standardına uygun sınavla A1'den C2'ye seviyenizi belirleyin, size özel kurs önerileri alın.",
  },
  {
    icon: LayoutDashboard,
    title: "Kapsamlı Yönetim Paneli",
    description:
      "Yöneticiler kullanıcıları, kursları ve içerikleri tek panelden yönetir; anlık istatistikleri izler.",
  },
  {
    icon: Users,
    title: "Öğrenci & Eğitmen Girişi",
    description:
      "Herkese özel, rol bazlı paneller: öğrenciler derslerine, eğitmenler sınıflarına güvenle erişir.",
  },
  {
    icon: ShieldCheck,
    title: "Kurumsal Güvenlik",
    description:
      "Şifreli parola saklama, oturum güvenliği ve giriş denemesi koruması ile verileriniz güvende.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Platform Özellikleri
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink-950 text-balance sm:text-4xl">
          Bir dil kursunun ihtiyaç duyduğu her şey, tek platformda
        </h2>
        <p className="mt-4 text-lg text-ink-500">
          Kurumsal kimliğinizden öğrenci deneyimine, sınav sisteminden yönetim
          paneline kadar uçtan uca profesyonel bir çözüm.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-50 transition-transform group-hover:scale-150" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
              <f.icon size={22} />
            </div>
            <h3 className="relative mt-5 font-display text-lg font-bold text-ink-950">
              {f.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-500">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
