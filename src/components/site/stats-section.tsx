import { AnimatedCounter } from "./animated-counter";

type Stat = { value: number; suffix: string; label: string };

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16">
      <div className="absolute inset-0 bg-dot-grid opacity-10" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <AnimatedCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
