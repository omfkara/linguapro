"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hizmetler", label: "Hizmetlerimiz" },
  { href: "/kurslar", label: "Kurslar" },
  { href: "/seviye-tespit-sinavi", label: "Seviye Tespit Sınavı" },
  { href: "/iletisim", label: "İletişim" },
];

export function NavbarClient({
  logoUrl,
  shortName,
}: {
  logoUrl: string;
  shortName: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Rota değiştiğinde mobil menüyü kapat (render sırasında state
  // senkronizasyonu — fazladan bir effect geçişi tetiklemeden).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-sm shadow-ink-900/5"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin
            // panelinden girilen keyfi harici URL'ler için next/image'ın
            // domain izin listesine ihtiyaç duymayan düz <img> tercih edildi.
            <img
              src={logoUrl}
              alt={shortName}
              className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-brand-600/30 transition-transform group-hover:scale-105"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 transition-transform group-hover:scale-105">
              <GraduationCap size={22} strokeWidth={2.2} />
            </span>
          )}
          <span className="font-display text-lg font-bold tracking-tight text-ink-950">
            {shortName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-brand-700"
                    : "text-ink-700 hover:text-brand-700"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-brand-50"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LinkButton href="/giris" variant="ghost" size="sm">
            Giriş Yap
          </LinkButton>
          <LinkButton href="/kayit" variant="primary" size="sm">
            Ücretsiz Başla <ChevronRight size={16} />
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-900 lg:hidden"
          aria-label="Menüyü aç/kapat"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-ink-100 pt-4">
                <LinkButton href="/giris" variant="outline" size="sm" className="flex-1">
                  Giriş Yap
                </LinkButton>
                <LinkButton href="/kayit" variant="primary" size="sm" className="flex-1">
                  Ücretsiz Başla
                </LinkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
