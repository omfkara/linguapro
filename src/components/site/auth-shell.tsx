import Link from "next/link";
import { GraduationCap, ShieldCheck, Video, Gauge } from "lucide-react";

const POINTS = [
  { icon: Video, text: "Sınırsız video ders erişimi" },
  { icon: Gauge, text: "Ücretsiz seviye tespit sınavı" },
  { icon: ShieldCheck, text: "Güvenli, şifreli oturum" },
];

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl animate-float-slower" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <GraduationCap size={22} />
          </span>
          <span className="font-display text-lg font-bold">LinguaPro</span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-balance">
            Dil öğrenme yolculuğunuza kaldığınız yerden devam edin
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <p.icon size={16} />
                </span>
                <span className="text-sm text-ink-100/85">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-100/60">
          © {new Date().getFullYear()} LinguaPro Dil Akademisi
        </p>
      </div>

      <div className="flex items-center justify-center bg-ink-50/40 px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <GraduationCap size={18} />
            </span>
            <span className="font-display text-base font-bold text-ink-950">
              LinguaPro
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink-950">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
