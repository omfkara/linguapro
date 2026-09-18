export const SITE = {
  name: "LinguaPro Dil Akademisi",
  shortName: "LinguaPro",
  tagline: "Uzman Eğitmenlerle Online Yabancı Dil Eğitimi",
  description:
    "LinguaPro Dil Akademisi ile İngilizce, Almanca, Fransızca ve daha fazla dili uzman eğitmenlerden öğrenin. Canlı dersler, video eğitimler, online sınavlar ve ücretsiz seviye tespit sınavı ile hedeflerinize ulaşın.",
  keywords: [
    "dil kursu",
    "online dil eğitimi",
    "ingilizce kursu",
    "seviye tespit sınavı",
    "yabancı dil öğren",
    "online ingilizce dersi",
    "dil akademisi",
    "TOEFL IELTS hazırlık",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "info@linguapro.com.tr",
  phone: "+90 212 000 00 00",
  address: "Levent, Büyükdere Cd. No:1, 34394 Şişli/İstanbul",
  social: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
  foundedYear: 2016,
};

export const LANGUAGES = [
  { name: "İngilizce", flag: "🇬🇧", students: "3.200+" },
  { name: "Almanca", flag: "🇩🇪", students: "1.100+" },
  { name: "Fransızca", flag: "🇫🇷", students: "740+" },
  { name: "İspanyolca", flag: "🇪🇸", students: "890+" },
  { name: "İtalyanca", flag: "🇮🇹", students: "410+" },
  { name: "Rusça", flag: "🇷🇺", students: "260+" },
];

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
