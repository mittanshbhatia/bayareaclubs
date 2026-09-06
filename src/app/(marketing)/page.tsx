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
import { SceneBridge } from "@/components/marketing/scene-bridge";
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
        <SceneBridge
          from="#f7f7fb"
          to="#070916"
          accent="#665cff"
          label="Approval becomes operations"
        />
        <CommandCenterSection />
        <SceneBridge from="#070916" to="#0878d1" accent="#56d9ff" />
        <DiscoverySection />
        <SceneBridge from="#07529a" to="#071629" accent="#56d9ff" />
        <EventsSection />
        <SceneBridge
          from="#071629"
          to="#fbf8f2"
          accent="#56d9ff"
          label="Participation becomes learning"
          spacious
        />
        <StemSection />
        <SceneBridge
          from="#fbf8f2"
          to="#070916"
          accent="#665cff"
          label="Learning meets governance"
        />
        <SchoolSystemSection />
        <SceneBridge
          from="#070916"
          to="#5548dd"
          accent="#9b6cff"
          label="Activity becomes insight"
        />
        <InsightsSection />
        <SceneBridge from="#5548dd" to="#070916" accent="#56d9ff" />
        <NetworkSection />
        <SceneBridge from="#070916" to="#fbf8f2" accent="#665cff" spacious />
        <TrustSection />
        <SceneBridge
          from="#fbf8f2"
          to="#080b1a"
          accent="#56d9ff"
          label="Every system starts with an idea"
        />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
