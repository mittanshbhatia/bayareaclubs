import Link from "next/link";

import { DisplayHeading, PageContainer } from "@/components/ds";
import { HeroWorkflow } from "@/components/marketing/hero-workflow";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_50%)]"
      />
      <PageContainer className="relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-24">
        <Reveal>
          <DisplayHeading className="max-w-xl">BayAreaClubs</DisplayHeading>
          <p className="mt-4 max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Start a club. Build a community. Make it matter.
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            One place to launch and run student clubs—from approval and members
            to attendance, events, resources and yearly renewal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/start-a-club">Start a Club</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="#lifecycle">See how it works</Link>
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
