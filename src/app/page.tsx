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
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main>
        <HeroSlider />
        <LanguagesMarquee />
        <FeaturesSection />
        <StatsSection />
        <HowItWorks />
        <LevelTestTeaser />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
