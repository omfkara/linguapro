import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 py-20">
      <div className="absolute inset-0 bg-dot-grid opacity-15" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl animate-float-slower" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-ink-100/70">
          <Link href="/" className="hover:text-white">
            Ana Sayfa
          </Link>
          <ChevronRight size={12} />
          <span className="text-white">{breadcrumb}</span>
        </div>
        <span className="mt-6 inline-block text-sm font-bold uppercase tracking-widest text-accent-400">
          {eyebrow}
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold text-white text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-100/80">
          {description}
        </p>
      </div>
    </section>
  );
}
