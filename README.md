# LinguaPro Dil Akademisi — Kurumsal Dil Kursu Platformu

Next.js 16 (App Router) üzerine inşa edilmiş, tam kapsamlı bir dil kursu
web sitesi ve öğrenme yönetim sistemi (LMS). Kurumsal tanıtım sitesi,
rol bazlı giriş (yönetici / eğitmen / öğrenci), video ders kütüphanesi,
online sınav sistemi ve CEFR standardında bir seviye tespit sınavı içerir.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Yerel Kurulum](#yerel-kurulum)
- [Demo Hesaplar](#demo-hesaplar)
- [Proje Yapısı](#proje-yapısı)
- [Markanızı Özelleştirme](#markanızı-özelleştirme)
- [Canlıya Alma (Deploy)](#canlıya-alma-deploy)
- [Güvenlik](#güvenlik)
- [SEO](#seo)
- [Bilinen Sınırlamalar / Sonraki Adımlar](#bilinen-sınırlamalar--sonraki-adımlar)

## Özellikler

**Kurumsal Site**
- Modern, animasyonlu ana sayfa (Framer Motion ile hero slider, sayaçlar, geçişler)
- Hakkımızda, Hizmetlerimiz, Kurslar, İletişim sayfaları
- İletişim formu (veritabanına kaydedilir, admin panelinden görüntülenir)

**Kimlik Doğrulama & Roller**
- E-posta/parola ile güvenli giriş (Auth.js / NextAuth v5)
- Üç rol: Yönetici (ADMIN), Eğitmen (TEACHER), Öğrenci (STUDENT)
- Rol bazlı korumalı rotalar (`proxy.ts` + her panelde ikinci kontrol katmanı)
- bcrypt ile şifrelenmiş parolalar, brute-force koruması (rate limiting)

**Yönetim Paneli (/panel/yonetim)**
- Kullanıcı yönetimi (oluşturma, aktif/pasif etme, silme)
- Tüm kursları görüntüleme/yayınlama/silme
- Sınav ve seviye tespit sınavı yönetimi
- İletişim mesajlarını görüntüleme

**Eğitmen Paneli (/panel/ogretmen)**
- Kendi kurslarını oluşturma ve yönetme
- Video ders ekleme (YouTube/Vimeo bağlantısı ile)
- Sınav ve soru oluşturma
- Kayıtlı öğrencileri ve ilerlemelerini görüntüleme

**Öğrenci Paneli (/panel/ogrenci)**
- Kayıtlı kursları görüntüleme, video izleme, ilerleme takibi
- Kurs sınavlarına girme
- **Ücretsiz seviye tespit sınavı** (CEFR A1–C2)
- Sınav sonuç geçmişi

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Animasyon | Framer Motion |
| Veritabanı | PostgreSQL |
| ORM | Drizzle ORM (`drizzle-kit` ile migration) |
| Kimlik Doğrulama | Auth.js (NextAuth) v5, Credentials Provider |
| Form Doğrulama | Zod + React Hook Form |
| İkonlar | lucide-react |
| Fontlar | Manrope + Sora (self-hosted, `@fontsource`) |

> **Not — Prisma yerine Drizzle:** Proje başlangıçta Prisma ile planlandı,
> ancak Prisma'nın motor ikili dosyalarını indirdiği sunucuya
> (`binaries.prisma.sh`) bu geliştirme ortamından erişim mümkün olmadığı
> için, native ikili dosya indirmesi gerektirmeyen **Drizzle ORM**'a
> geçildi. Drizzle, Next.js ile mükemmel uyumlu, hafif ve production'da
> yaygın kullanılan bir seçimdir; kendi ortamınızda Prisma'ya geçmek
> isterseniz şemayı `src/db/schema.ts`'den kolayca taşıyabilirsiniz.

## Yerel Kurulum

### Gereksinimler
- Node.js 20.9+ (önerilen: 22 LTS)
- PostgreSQL 14+ (yerel kurulum, Docker veya bulut: Neon, Supabase, Railway)

### Adımlar

```bash
# 1. Bağımlılıkları kurun
npm install

# 2. Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını kendi DATABASE_URL ve AUTH_SECRET değerlerinizle doldurun
# Güçlü bir AUTH_SECRET üretmek için:
openssl rand -base64 32

# 3. Veritabanı şemasını oluşturun
npm run db:migrate

# 4. (Opsiyonel ama önerilir) Örnek verilerle doldurun
npm run db:seed

# 5. Geliştirme sunucusunu başlatın
npm run dev
```

Site `http://localhost:3000` adresinde açılacaktır.

### Kullanılabilir Script'ler

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusunu başlat (önce `build` gerekir) |
| `npm run lint` | ESLint kontrolü |
| `npm run db:generate` | Şema değişikliklerinden yeni migration dosyası üretir |
| `npm run db:migrate` | Bekleyen migration'ları veritabanına uygular |
| `npm run db:seed` | Demo hesap ve içeriklerle veritabanını doldurur |
| `npm run db:studio` | Drizzle Studio (veritabanını tarayıcıda görüntüleme) |

## Demo Hesaplar

`npm run db:seed` çalıştırıldıktan sonra aşağıdaki hesaplarla giriş
yapabilirsiniz (canlıya almadan önce mutlaka şifreleri değiştirin veya
bu kullanıcıları silin):

| Rol | E-posta | Parola |
|---|---|---|
| Yönetici | `admin@linguapro.com.tr` | `Admin1234` |
| Eğitmen | `ayse.demir@linguapro.com.tr` | `Ogretmen1234` |
| Eğitmen | `kaan.yildirim@linguapro.com.tr` | `Ogretmen1234` |
| Öğrenci | `elif@example.com` | `Ogrenci1234` |
| Öğrenci | `mert@example.com` | `Ogrenci1234` |

## Proje Yapısı

```
src/
  app/                    → Sayfalar (App Router)
    (kurumsal sayfalar)   → /, /hakkimizda, /hizmetler, /kurslar, /iletisim
    giris/, kayit/        → Kimlik doğrulama sayfaları
    seviye-tespit-sinavi/ → Herkese açık seviye testi tanıtım sayfası
    panel/
      yonetim/            → Yönetici paneli
      ogretmen/           → Eğitmen paneli
      ogrenci/            → Öğrenci paneli
    api/auth/             → NextAuth API route'u
  components/
    site/                 → Kurumsal site bileşenleri (navbar, hero, vb.)
    dashboard/            → Panel bileşenleri (formlar, tablolar, sınav motoru)
    ui/                   → Genel UI bileşenleri (buton, rozet, ikonlar)
  db/
    schema.ts             → Drizzle veritabanı şeması
    migrate.ts, seed.ts   → Migration ve seed script'leri
  lib/
    actions/              → Server Actions (auth, kurs, sınav, admin, vb.)
    queries/               → Veritabanı sorgu yardımcıları
    site-config.ts        → Marka bilgileri, dil listesi, vb.
  auth.ts, auth.config.ts → Kimlik doğrulama yapılandırması
  proxy.ts                → Rota koruması (eski adıyla "middleware")
```

## Markanızı Özelleştirme

1. **Marka bilgileri:** `src/lib/site-config.ts` içindeki `SITE` nesnesini
   (isim, açıklama, telefon, adres, sosyal medya bağlantıları) kendi
   bilgilerinizle güncelleyin.
2. **Renkler:** `src/app/globals.css` içindeki `--brand-*` ve
   `--accent-*` CSS değişkenlerini değiştirerek marka renklerinizi
   uygulayın.
3. **Logo:** `src/components/site/navbar.tsx` ve `footer.tsx` içindeki
   `GraduationCap` ikonunu kendi logo görselinizle değiştirin.
4. **İçerik:** Kurslar, videolar ve sınavlar artık kod değil, veritabanı
   içeriğidir — yönetici/eğitmen panellerinden ekleyip
   düzenleyebilirsiniz.
5. **Open Graph görseli:** `public/og-image.png` dosyasını (1200×630px)
   kendi kapak görselinizle değiştirin; şu an bu dosya mevcut değil ve
   sosyal medya paylaşımlarında varsayılan görünecektir.

## Canlıya Alma (Deploy)

Bu proje herhangi bir Node.js destekleyen platformda (Vercel, Railway,
Render, kendi sunucunuz) çalışır.

### Vercel + Neon/Supabase (önerilen, hızlı başlangıç)

1. [Neon](https://neon.tech) veya [Supabase](https://supabase.com)'de
   ücretsiz bir PostgreSQL veritabanı oluşturun, bağlantı adresini alın.
2. Projeyi GitHub'a yükleyip Vercel'e bağlayın.
3. Vercel proje ayarlarında şu ortam değişkenlerini tanımlayın:
   - `DATABASE_URL`
   - `AUTH_SECRET` (openssl rand -base64 32)
   - `NEXTAUTH_URL` → yayındaki tam adresiniz (örn. `https://kursunuz.com`)
   - `NEXT_PUBLIC_SITE_URL` → aynı adres
   - `NEXT_PUBLIC_SITE_NAME`
4. Deploy sonrası bir kere `npm run db:migrate` ve `npm run db:seed`
   komutlarını (yerel makinenizden, `DATABASE_URL`'i canlı veritabanına
   göstererek) çalıştırın.

### Kendi Sunucunuzda (VPS / Docker)

```bash
npm run build
npm run start   # veya bir process manager (pm2, systemd) ile çalıştırın
```

Bir ters proxy (nginx, Caddy) arkasında çalıştırıyorsanız `X-Forwarded-*`
başlıklarının doğru iletildiğinden emin olun; `auth.config.ts` içindeki
`trustHost: true` ayarı bu senaryo için gereklidir.

## Güvenlik

- Parolalar **bcrypt** (12 round) ile hashlenir, hiçbir zaman düz metin
  saklanmaz.
- Giriş denemeleri hız sınırlıdır (aynı e-posta için 10 dakikada 8
  başarısız denemeden sonra geçici olarak engellenir).
- Tüm panel rotaları hem `proxy.ts` (kenar katman) hem de her sayfanın
  kendi sunucu tarafı oturum kontrolüyle **çift katmanlı** korunur.
- Güvenlik HTTP başlıkları (`next.config.ts`): `Content-Security-Policy`,
  `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy` vb.
- İletişim formunda bot koruması için honeypot alanı kullanılır.
- Server Actions içinde her zaman oturum/rol doğrulaması yapılır (form
  gizlenmiş olsa bile doğrudan istekle çağrılabileceği varsayılır).

**Production'a almadan önce mutlaka:**
- `.env` dosyasındaki `AUTH_SECRET`'i güçlü, benzersiz bir değerle değiştirin.
- Demo hesapların şifrelerini değiştirin veya hesapları silin.
- Veritabanı bağlantınızda SSL'i etkinleştirin (çoğu bulut sağlayıcı varsayılan sunar).

## SEO

- Her sayfa için özel `<title>`, `<meta description>` ve Open Graph etiketleri
- `sitemap.xml` ve `robots.txt` otomatik üretilir (`src/app/sitemap.ts`,
  `robots.ts`) — yayınlanan kurslar sitemap'e otomatik eklenir
- JSON-LD yapısal veri: Organizasyon, Breadcrumb, Kurs şemaları
  (`src/components/site/json-ld.tsx`)
- Next.js `next/image` ile otomatik görsel optimizasyonu (AVIF/WebP)
- Semantik HTML ve erişilebilir form etiketleri

## Bilinen Sınırlamalar / Sonraki Adımlar

- **Video barındırma:** Sistem YouTube/Vimeo gömme (embed) bağlantıları
  kullanır; kendi sunucunuza video yüklemek isterseniz bir depolama
  servisi (S3, Cloudflare R2, Mux) entegrasyonu eklemeniz gerekir.
- **Ödeme:** Kurs fiyatlandırma alanı mevcuttur ancak bir ödeme
  sağlayıcısı (iyzico, Stripe vb.) entegre edilmemiştir — şu an tüm
  kayıtlar ücretsiz olarak işlenir.
- **E-posta bildirimleri:** Kayıt/iletişim formu onay e-postaları henüz
  gönderilmiyor; bir e-posta servisi (Resend, SendGrid) eklenebilir.
- **Örnek video bağlantısı:** Seed verisindeki videolar örnek/placeholder
  bir YouTube bağlantısı kullanır; gerçek ders videolarınızı eğitmen
  panelinden ekleyin.
- **Prisma → Drizzle:** Yukarıda açıklandığı gibi, geliştirme ortamı
  kısıtı nedeniyle Drizzle kullanıldı; kendi ortamınızda tercih ederseniz
  Prisma'ya geçiş yapılabilir.
