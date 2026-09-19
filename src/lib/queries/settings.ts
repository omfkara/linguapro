import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

// Kod içindeki varsayılanlar — veritabanında bir alan boş/null ise
// (ör. hiç düzenleme yapılmamışsa) buradaki değerler kullanılır. Bu
// sayede admin paneli tüm alanları doldurmadan da site bozulmaz.
export const SETTINGS_DEFAULTS = {
  logoUrl: "",
  siteName: "LinguaPro Dil Akademisi",
  shortName: "LinguaPro",
  tagline: "Uzman Eğitmenlerle Online Yabancı Dil Eğitimi",
  description:
    "LinguaPro Dil Akademisi ile İngilizce, Almanca, Fransızca ve daha fazla dili uzman eğitmenlerden öğrenin. Canlı dersler, video eğitimler, online sınavlar ve ücretsiz seviye tespit sınavı ile hedeflerinize ulaşın.",

  phone: "+90 212 000 00 00",
  email: "info@linguapro.com.tr",
  address: "Levent, Büyükdere Cd. No:1, 34394 Şişli/İstanbul",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  linkedinUrl: "https://linkedin.com",

  languages: [
    { name: "İngilizce", flag: "🇬🇧", students: "3.200+" },
    { name: "Almanca", flag: "🇩🇪", students: "1.100+" },
    { name: "Fransızca", flag: "🇫🇷", students: "740+" },
    { name: "İspanyolca", flag: "🇪🇸", students: "890+" },
    { name: "İtalyanca", flag: "🇮🇹", students: "410+" },
    { name: "Rusça", flag: "🇷🇺", students: "260+" },
  ],

  heroSlides: [
    {
      eyebrow: "Canlı & Kayıtlı Dersler",
      title: "Dünyayla konuşacak",
      highlight: "özgüveni",
      titleEnd: "kazanın",
      description:
        "Alanında uzman eğitmenlerle birebir ilerleyin, video kütüphanemizden istediğiniz an tekrar izleyin.",
      statValue: "12.000+",
      statLabel: "aktif öğrenci",
    },
    {
      eyebrow: "Seviye Tespit Sınavı",
      title: "Seviyenizi",
      highlight: "2 dakikada",
      titleEnd: "öğrenin",
      description:
        "Ücretsiz seviye tespit sınavımızla A1'den C2'ye tam olarak nerede olduğunuzu anında görün.",
      statValue: "A1 – C2",
      statLabel: "CEFR standardı",
    },
    {
      eyebrow: "Ölçme & Değerlendirme",
      title: "Online sınavlarla",
      highlight: "ilerlemenizi",
      titleEnd: "kanıtlayın",
      description:
        "Her kurs sonunda sertifikalı sınavlara girin, gelişiminizi somut verilerle takip edin.",
      statValue: "%94",
      statLabel: "başarı oranı",
    },
  ],

  stats: [
    { value: 12400, suffix: "+", label: "Aktif Öğrenci" },
    { value: 180, suffix: "+", label: "Uzman Eğitmen" },
    { value: 940, suffix: "+", label: "Video Ders" },
    { value: 94, suffix: "%", label: "Memnuniyet Oranı" },
  ],

  howItWorksEyebrow: "Nasıl Çalışır",
  howItWorksTitle: "Dört adımda hedefinize ulaşın",
  howItWorksSteps: [
    {
      title: "Ücretsiz Kayıt Ol",
      description: "Saniyeler içinde hesabını oluştur, öğrenci paneline eriş.",
    },
    {
      title: "Seviyeni Öğren",
      description:
        "Ücretsiz seviye tespit sınavıyla tam olarak nerede olduğunu gör.",
    },
    {
      title: "Eğitime Başla",
      description: "Sana uygun kursa katıl, video derslerini izle, alıştırma yap.",
    },
    {
      title: "Sınava Gir, Sertifikanı Al",
      description: "Kurs sonu sınavında başarılı ol, gelişimini belgeyle kanıtla.",
    },
  ],

  levelTestEyebrow: "Ücretsiz & Anında Sonuç",
  levelTestTitle: "Gerçek dil seviyenizi 15-20 dakikada öğrenin",
  levelTestDescription:
    "CEFR standardına uygun sınavımızla A1'den C2'ye tam olarak nerede olduğunuzu görün, size özel kurs önerisi alın.",
  levelTestReadyTitle: "Hazırsanız sınava başlayabilirsiniz",
  levelTestNotReadyTitle: "Sınavımız çok yakında yayında",
  levelTestLoggedInText:
    "Panelinizden sınava başlayın, sonucunuz hesabınıza kaydedilecek.",
  levelTestGuestText: "Sınava başlamak için önce ücretsiz bir hesap oluşturmanız gerekiyor.",

  seoTitles: {
    home: "LinguaPro Dil Akademisi | Uzman Eğitmenlerle Online Yabancı Dil Eğitimi",
    kurslar: "Kurslar",
    hakkimizda: "Hakkımızda",
    hizmetler: "Hizmetlerimiz",
    iletisim: "İletişim",
    seviyeTespitSinavi: "Ücretsiz Seviye Tespit Sınavı",
  } as Record<string, string>,
  seoDescriptions: {
    home: "LinguaPro Dil Akademisi ile İngilizce, Almanca, Fransızca ve daha fazla dili uzman eğitmenlerden öğrenin.",
    kurslar:
      "İngilizce, Almanca, Fransızca ve daha fazla dilde seviyenize uygun online kursları keşfedin.",
    hakkimizda: "LinguaPro Dil Akademisi'nin hikayesi, misyonu ve eğitmen kadrosu.",
    hizmetler: "LinguaPro Dil Akademisi'nin sunduğu tüm eğitim hizmetleri.",
    iletisim: "LinguaPro Dil Akademisi ile iletişime geçin.",
    seviyeTespitSinavi:
      "CEFR standardına uygun ücretsiz seviye tespit sınavımızla A1'den C2'ye gerçek dil seviyenizi 15-20 dakikada öğrenin.",
  } as Record<string, string>,
};

export type SiteSettings = typeof SETTINGS_DEFAULTS;

/**
 * Veritabanındaki tek satırlık ayar kaydını okur ve eksik/null alanları
 * varsayılanlarla doldurarak döndürür. Kayıt hiç yoksa tamamen
 * varsayılanları döner — site hiçbir zaman bozulmaz.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

  if (!row) return SETTINGS_DEFAULTS;

  return {
    logoUrl: row.logoUrl || SETTINGS_DEFAULTS.logoUrl,
    siteName: row.siteName || SETTINGS_DEFAULTS.siteName,
    shortName: row.shortName || SETTINGS_DEFAULTS.shortName,
    tagline: row.tagline || SETTINGS_DEFAULTS.tagline,
    description: row.description || SETTINGS_DEFAULTS.description,

    phone: row.phone || SETTINGS_DEFAULTS.phone,
    email: row.email || SETTINGS_DEFAULTS.email,
    address: row.address || SETTINGS_DEFAULTS.address,
    instagramUrl: row.instagramUrl || SETTINGS_DEFAULTS.instagramUrl,
    youtubeUrl: row.youtubeUrl || SETTINGS_DEFAULTS.youtubeUrl,
    linkedinUrl: row.linkedinUrl || SETTINGS_DEFAULTS.linkedinUrl,

    languages:
      row.languages && row.languages.length > 0
        ? row.languages
        : SETTINGS_DEFAULTS.languages,

    heroSlides:
      row.heroSlides && row.heroSlides.length > 0
        ? row.heroSlides
        : SETTINGS_DEFAULTS.heroSlides,

    stats: row.stats && row.stats.length > 0 ? row.stats : SETTINGS_DEFAULTS.stats,

    howItWorksEyebrow: row.howItWorksEyebrow || SETTINGS_DEFAULTS.howItWorksEyebrow,
    howItWorksTitle: row.howItWorksTitle || SETTINGS_DEFAULTS.howItWorksTitle,
    howItWorksSteps:
      row.howItWorksSteps && row.howItWorksSteps.length > 0
        ? row.howItWorksSteps
        : SETTINGS_DEFAULTS.howItWorksSteps,

    levelTestEyebrow: row.levelTestEyebrow || SETTINGS_DEFAULTS.levelTestEyebrow,
    levelTestTitle: row.levelTestTitle || SETTINGS_DEFAULTS.levelTestTitle,
    levelTestDescription:
      row.levelTestDescription || SETTINGS_DEFAULTS.levelTestDescription,
    levelTestReadyTitle:
      row.levelTestReadyTitle || SETTINGS_DEFAULTS.levelTestReadyTitle,
    levelTestNotReadyTitle:
      row.levelTestNotReadyTitle || SETTINGS_DEFAULTS.levelTestNotReadyTitle,
    levelTestLoggedInText:
      row.levelTestLoggedInText || SETTINGS_DEFAULTS.levelTestLoggedInText,
    levelTestGuestText: row.levelTestGuestText || SETTINGS_DEFAULTS.levelTestGuestText,

    seoTitles: { ...SETTINGS_DEFAULTS.seoTitles, ...(row.seoTitles || {}) },
    seoDescriptions: {
      ...SETTINGS_DEFAULTS.seoDescriptions,
      ...(row.seoDescriptions || {}),
    },
  };
}
