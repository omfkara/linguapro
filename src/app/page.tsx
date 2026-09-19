import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HeroSlider } from "@/components/site/hero-slider";
import { LanguagesMarquee } from "@/components/site/languages-marquee";
import { StatsSection } from "@/components/site/stats-section";
import { FeaturesSection } from "@/components/site/features-section";
import { HowItWorks } from "@/components/site/how-it-works";
import { LevelTestTeaser } from "@/components/site/level-test-teaser";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { CtaSection } from "@/components/site/cta-section";
import { OrganizationJsonLd } from "@/components/site/json-ld";
import { getSiteSettings } from "@/lib/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitles.home || `${settings.siteName} | ${settings.tagline}`,
    description: settings.seoDescriptions.home || settings.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main>
        <HeroSlider slides={settings.heroSlides} />
        <LanguagesMarquee languages={settings.languages} />
        <FeaturesSection />
        <StatsSection stats={settings.stats} />
        <HowItWorks
          eyebrow={settings.howItWorksEyebrow}
          title={settings.howItWorksTitle}
          steps={settings.howItWorksSteps}
        />
        <LevelTestTeaser />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
