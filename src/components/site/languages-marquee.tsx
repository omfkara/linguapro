import { LANGUAGES } from "@/lib/site-config";

export function LanguagesMarquee() {
  const items = [...LANGUAGES, ...LANGUAGES];
  return (
    <div className="border-y border-ink-100 bg-ink-50/60 py-6">
      <div className="mx-auto max-w-7xl overflow-hidden px-5 lg:px-8">
        <div className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-ink-500">
          Sunduğumuz Diller
        </div>
        <div className="scrollbar-hide flex overflow-hidden">
          <div className="flex animate-marquee gap-10 whitespace-nowrap">
            {items.map((lang, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-ink-100"
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-semibold text-ink-900">{lang.name}</span>
                <span className="text-xs text-ink-500">{lang.students} öğrenci</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
