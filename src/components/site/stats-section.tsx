import { AnimatedCounter } from "./animated-counter";

const STATS = [
  { value: 12400, suffix: "+", label: "Aktif Öğrenci" },
  { value: 180, suffix: "+", label: "Uzman Eğitmen" },
  { value: 940, suffix: "+", label: "Video Ders" },
  { value: 94, suffix: "%", label: "Memnuniyet Oranı" },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16">
      <div className="absolute inset-0 bg-dot-grid opacity-10" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <AnimatedCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
