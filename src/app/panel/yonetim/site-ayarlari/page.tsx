import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SiteSettingsForm } from "@/components/dashboard/site-settings-form";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <DashboardPageHeader
        title="Site Ayarları"
        description="Logo, iletişim bilgileri, ana sayfa içerikleri ve sayfa başlıklarını buradan yönetin. Değişiklikler kaydettiğiniz anda canlı sitede görünür."
      />
      <SiteSettingsForm initial={settings} />
    </div>
  );
}
