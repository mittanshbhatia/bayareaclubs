import type { Metadata } from "next";

import { CommandCenterSection } from "@/components/marketing/command-center-section";
import { DiscoverySection } from "@/components/marketing/discovery-section";
import { EventsSection } from "@/components/marketing/events-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import styles from "@/components/marketing/homepage.module.css";
import { InsightsSection } from "@/components/marketing/insights-section";
import { LifecycleSection } from "@/components/marketing/lifecycle-section";
import { NetworkSection } from "@/components/marketing/network-section";
import { SchoolSystemSection } from "@/components/marketing/school-system-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { StemSection } from "@/components/marketing/stem-section";
import { TrustSection } from "@/components/marketing/trust-section";

export const metadata: Metadata = {
  title: "Start a club. Build a community.",
  description:
    "One place to launch and run student clubs—from approval and members to attendance, events, resources and yearly renewal.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Start a club. Build a community. Make it matter.",
    description:
      "BayAreaClubs gives student communities one connected place to launch, operate, learn, and grow.",
    url: "/",
    siteName: "BayAreaClubs",
  },
};

export default function HomePage() {
  return (
    <div className={styles.home}>
      <nav aria-label="Skip navigation">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[var(--home-ink)] focus:shadow-md"
        >
          Skip to content
        </a>
      </nav>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <LifecycleSection />
        <CommandCenterSection />
        <DiscoverySection />
        <EventsSection />
        <StemSection />
        <SchoolSystemSection />
        <InsightsSection />
        <NetworkSection />
        <TrustSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
