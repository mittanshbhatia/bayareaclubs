import type { Metadata } from "next";

import { CommandCenterSection } from "@/components/marketing/command-center-section";
import { EventsSection } from "@/components/marketing/events-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { LifecycleSection } from "@/components/marketing/lifecycle-section";
import { NetworkSection } from "@/components/marketing/network-section";
import { ProductLayersSection } from "@/components/marketing/product-layers-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { StemSection } from "@/components/marketing/stem-section";

export const metadata: Metadata = {
  title: "Start a club. Build a community.",
  description:
    "One place to launch and run student clubs—from approval and members to attendance, events, resources and yearly renewal.",
};

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <LifecycleSection />
        <ProductLayersSection />
        <CommandCenterSection />
        <StemSection />
        <EventsSection />
        <NetworkSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
