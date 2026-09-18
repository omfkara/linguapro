"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    eyebrow: "Canlı & Kayıtlı Dersler",
    title: "Dünyayla konuşacak",
    highlight: "özgüveni",
    titleEnd: "kazanın",
    description:
      "Alanında uzman eğitmenlerle birebir ilerleyin, video kütüphanemizden istediğiniz an tekrar izleyin.",
    stat: { value: "12.000+", label: "aktif öğrenci" },
    gradient: "from-brand-600 via-brand-700 to-ink-950",
  },
  {
    eyebrow: "Seviye Tespit Sınavı",
    title: "Seviyenizi",
    highlight: "2 dakikada",
    titleEnd: "öğrenin",
    description:
      "Ücretsiz seviye tespit sınavımızla A1'den C2'ye tam olarak nerede olduğunuzu anında görün.",
    stat: { value: "A1 – C2", label: "CEFR standardı" },
    gradient: "from-accent-600 via-accent-500 to-brand-700",
  },
  {
    eyebrow: "Ölçme & Değerlendirme",
    title: "Online sınavlarla",
    highlight: "ilerlemenizi",
    titleEnd: "kanıtlayın",
    description:
      "Her kurs sonunda sertifikalı sınavlara girin, gelişiminizi somut verilerle takip edin.",
    stat: { value: "%94", label: "başarı oranı" },
    gradient: "from-ink-950 via-brand-800 to-brand-600",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Animasyonlu arka plan katmanı */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90 animate-gradient",
          slide.gradient
        )}
      />
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

      {/* Yüzen dekoratif şekiller */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl animate-float-slower" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
              <Sparkles size={14} className="text-accent-400" />
              {slide.eyebrow}
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-white text-balance sm:text-5xl lg:text-6xl">
              {slide.title}{" "}
              <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                {slide.highlight}
              </span>{" "}
              {slide.titleEnd}
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-100/85">
              {slide.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LinkButton href="/seviye-tespit-sinavi" variant="accent" size="lg">
                Ücretsiz Seviye Testine Başla
              </LinkButton>
              <LinkButton
                href="/kurslar"
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:border-white/60 hover:text-white"
              >
                <Play size={18} /> Kursları Keşfet
              </LinkButton>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-white">
                {slide.stat.value}
              </span>
              <span className="text-sm text-ink-100/70">
                {slide.stat.label}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Sağ taraf: özel illüstrasyon kompozisyonu */}
        <div className="relative hidden h-[420px] lg:block">
          <HeroIllustration slideIndex={index} />
        </div>
      </div>

      {/* Slider kontrolleri */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-4 px-5 pb-10 lg:px-8">
        <button
          onClick={() => go(index - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
          aria-label="Önceki"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slayt ${i + 1}`}
              className="group relative h-1.5 w-10 overflow-hidden rounded-full bg-white/20"
            >
              {i === index && (
                <motion.span
                  layoutId="slide-progress"
                  className="absolute inset-y-0 left-0 bg-accent-400"
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? "100%" : "100%" }}
                  transition={{ duration: paused ? 0 : 6, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => go(index + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
          aria-label="Sonraki"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function HeroIllustration({ slideIndex }: { slideIndex: number }) {
  return (
    <div className="relative h-full w-full">
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-8 top-4 w-[380px] rounded-2xl bg-white/95 p-5 shadow-2xl shadow-black/30 backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-lg">
            🇬🇧
          </div>
          <div className="flex-1">
            <div className="h-2.5 w-32 rounded-full bg-ink-100" />
            <div className="mt-1.5 h-2 w-20 rounded-full bg-ink-100" />
          </div>
          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-bold text-success">
            B2
          </span>
        </div>
        <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100" />
        <div className="mt-3 flex gap-2">
          <div className="h-2 flex-1 rounded-full bg-ink-100" />
          <div className="h-2 w-8 rounded-full bg-brand-400" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-4 top-36 w-64 rounded-2xl bg-white/95 p-4 shadow-2xl shadow-black/25"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink-500">
            Video Ders İlerlemesi
          </span>
          <span className="text-xs font-bold text-brand-600">78%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white">
            <Play size={12} fill="currentColor" />
          </div>
          <div className="h-2 flex-1 rounded-full bg-ink-100" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-4 right-20 flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 shadow-2xl shadow-black/25"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white font-bold">
          A+
        </div>
        <div>
          <p className="text-xs font-bold text-ink-900">Sınav Sonucu</p>
          <p className="text-xs text-ink-500">92 / 100 puan</p>
        </div>
      </motion.div>

      <div
        key={slideIndex}
        className="absolute inset-0 -z-10 rounded-[2.5rem] border border-white/10"
      />
    </div>
  );
}
