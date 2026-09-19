import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "./globals.css";
import { SITE } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/queries/settings";

// Bu layout artık veritabanından (site ayarları) okuyor; build anında
// statik olarak dışa aktarılmaya çalışılırsa (ör. veritabanının
// erişilebilir olmadığı bir build ortamında) hataya yol açar. Her
// istekte sunucu tarafında dinamik olarak render edilmesini zorunlu
// kılar. Layout tüm sayfalar tarafından paylaşıldığı için bu, tüm
// siteyi dinamik render'a zorunlu kılar.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings.siteName;
  const tagline = settings.tagline;
  const description = settings.description;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    keywords: SITE.keywords,
    authors: [{ name, url: SITE.url }],
    creator: name,
    publisher: name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: SITE.url,
      siteName: name,
      title: `${name} | ${tagline}`,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${tagline}`,
      description,
      images: ["/og-image.png"],
    },
    icons: {
      icon: settings.logoUrl || "/favicon.ico",
    },
    category: "education",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
