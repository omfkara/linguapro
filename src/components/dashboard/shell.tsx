"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  Home,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Gauge,
  Award,
  UserCog,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/session-actions";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

// Sunucu bileşenlerinden istemci bileşenlerine fonksiyon (ikon) prop olarak
// geçirilemediği için (RSC serileştirme kısıtı), menü tanımları burada,
// istemci tarafında, role göre tutulur. Sunucudaki layout'lar yalnızca
// serileştirilebilir "role" değerini gönderir.
const NAV_BY_ROLE: Record<string, DashboardNavItem[]> = {
  admin: [
    { href: "/panel/yonetim", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
    { href: "/panel/yonetim/kullanicilar", label: "Kullanıcılar", icon: Users },
    { href: "/panel/yonetim/kurslar", label: "Kurslar", icon: BookOpen },
    { href: "/panel/yonetim/sinavlar", label: "Sınavlar", icon: ClipboardList },
    { href: "/panel/yonetim/seviye-testi", label: "Seviye Testi", icon: Gauge },
    { href: "/panel/yonetim/mesajlar", label: "Mesajlar", icon: MessageSquare },
    { href: "/panel/yonetim/site-ayarlari", label: "Site Ayarları", icon: Settings },
  ],
  teacher: [
    { href: "/panel/ogretmen", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
    { href: "/panel/ogretmen/kurslar", label: "Kurslarım", icon: BookOpen },
    { href: "/panel/ogretmen/sinavlar", label: "Sınavlarım", icon: ClipboardList },
    { href: "/panel/ogretmen/ogrenciler", label: "Öğrencilerim", icon: UserCog },
  ],
  student: [
    { href: "/panel/ogrenci", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
    { href: "/panel/ogrenci/kurslar", label: "Kurslarım", icon: BookOpen },
    { href: "/panel/ogrenci/sinavlar", label: "Sınavlarım", icon: ClipboardList },
    { href: "/panel/ogrenci/seviye-testi", label: "Seviye Testim", icon: Gauge },
    { href: "/panel/ogrenci/sonuclar", label: "Sonuçlarım", icon: Award },
  ],
};

export function DashboardShell({
  role,
  roleLabel,
  userName,
  userEmail,
  children,
}: {
  role: "admin" | "teacher" | "student";
  roleLabel: string;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const navItems = NAV_BY_ROLE[role];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const NavLinks = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                : "text-ink-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-50/60">
      {/* Masaüstü kenar çubuğu */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-950 lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <GraduationCap size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-white">LinguaPro</p>
            <p className="text-xs text-ink-400">{roleLabel}</p>
          </div>
        </div>
        {NavLinks}
        <div className="mt-auto space-y-3 border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-300 hover:bg-white/5 hover:text-white"
          >
            <Home size={18} /> Siteye Dön
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{userName}</p>
              <p className="truncate text-[11px] text-ink-400">{userEmail}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Çıkış yap"
                className="text-ink-400 hover:text-white"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobil üst bar + açılır menü */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <GraduationCap size={16} />
          </span>
          <span className="font-display text-sm font-bold text-ink-950">
            {roleLabel}
          </span>
        </div>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menü">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-64 flex-col bg-ink-950 pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            {NavLinks}
            <div className="mt-auto space-y-3 border-t border-white/10 p-4">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-300">
                <Home size={18} /> Siteye Dön
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-300"
                >
                  <LogOut size={18} /> Çıkış Yap
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
