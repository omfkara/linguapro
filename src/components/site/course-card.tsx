import Link from "next/link";
import { BookOpen, User } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-50 text-green-700 ring-green-200",
  A2: "bg-green-50 text-green-700 ring-green-200",
  B1: "bg-blue-50 text-blue-700 ring-blue-200",
  B2: "bg-blue-50 text-blue-700 ring-blue-200",
  C1: "bg-purple-50 text-purple-700 ring-purple-200",
  C2: "bg-purple-50 text-purple-700 ring-purple-200",
};

export function CourseCard({
  slug,
  title,
  shortDescription,
  language,
  level,
  teacherName,
  price,
}: {
  slug: string;
  title: string;
  shortDescription?: string | null;
  language: string;
  level: string;
  teacherName?: string | null;
  price?: number | null;
}) {
  return (
    <Link
      href={`/kurslar/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10"
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-ink-950">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <BookOpen className="relative text-white/90 transition-transform group-hover:scale-110" size={40} />
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${LEVEL_COLORS[level] ?? "bg-ink-50 text-ink-700 ring-ink-200"} bg-white`}
        >
          {level}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-600">
          {language}
        </span>
        <h3 className="mt-1.5 font-display text-base font-bold text-ink-950 line-clamp-2">
          {title}
        </h3>
        {shortDescription && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-500">
            {shortDescription}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <User size={13} />
            {teacherName ?? "LinguaPro Eğitmeni"}
          </div>
          <span className="text-sm font-bold text-brand-700">
            {price && price > 0 ? `₺${price.toLocaleString("tr-TR")}` : "Ücretsiz"}
          </span>
        </div>
      </div>
    </Link>
  );
}
