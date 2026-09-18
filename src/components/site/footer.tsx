import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { SITE } from "@/lib/site-config";

const COLS = [
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/hizmetler", label: "Hizmetlerimiz" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "Eğitim",
    links: [
      { href: "/kurslar", label: "Tüm Kurslar" },
      { href: "/seviye-tespit-sinavi", label: "Seviye Tespit Sınavı" },
      { href: "/kayit", label: "Kayıt Ol" },
    ],
  },
  {
    title: "Hesap",
    links: [
      { href: "/giris", label: "Giriş Yap" },
      { href: "/panel/ogrenci", label: "Öğrenci Paneli" },
      { href: "/panel/ogretmen", label: "Eğitmen Paneli" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <GraduationCap size={22} />
              </span>
              <span className="font-display text-lg font-bold text-white">
                {SITE.shortName}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: InstagramIcon, href: SITE.social.instagram },
                { icon: YoutubeIcon, href: SITE.social.youtube },
                { icon: LinkedinIcon, href: SITE.social.linkedin },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ink-300 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-300 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-brand-400" />
            <span>{SITE.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-brand-400" />
            <span>{SITE.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-400" />
            <span>{SITE.address}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <p>{SITE.foundedYear} yılından beri güvenle eğitim veriyoruz.</p>
        </div>
      </div>
    </footer>
  );
}
