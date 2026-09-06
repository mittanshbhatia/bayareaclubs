import Link from "next/link";

import { DisplayHeading, Eyebrow, PageContainer } from "@/components/ds";
import { HeroWorkflow } from "@/components/marketing/hero-workflow";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_50%)]"
      />
      <PageContainer className="relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-24">
        <Reveal>
          <Eyebrow>Bay Area schools · colleges · clubs</Eyebrow>
          <DisplayHeading className="mt-4 max-w-xl">
            Start a club.
            <br />
            Build a community.
            <br />
            Make it matter.
          </DisplayHeading>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            One place to launch and run student clubs—from approval and members
            to attendance, events, resources and yearly renewal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">Start a Club</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#operate">Explore Clubs</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <HeroWorkflow />
        </Reveal>
      </PageContainer>
    </section>
  );
}
