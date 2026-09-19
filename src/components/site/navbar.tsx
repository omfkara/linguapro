import { getSiteSettings } from "@/lib/queries/settings";
import { NavbarClient } from "./navbar-client";

// İnce bir sunucu bileşeni sarmalayıcısı: ayarları (logo, kısa ad)
// veritabanından okuyup istemci bileşenine prop olarak geçirir. Böylece
// tüm sayfalar hâlâ tek satırla `<Navbar />` kullanmaya devam edebilir.
export async function Navbar() {
  const settings = await getSiteSettings();
  return <NavbarClient logoUrl={settings.logoUrl} shortName={settings.shortName} />;
}
