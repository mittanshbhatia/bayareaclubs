import Link from "next/link";

import { DisplayHeading, PageContainer } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_60%)]"
      />
      <PageContainer className="relative text-center">
        <Reveal>
          <DisplayHeading as="h2" className="mx-auto max-w-3xl">
            Your next club starts with an idea.
          </DisplayHeading>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Launch with a clear approval path, then run membership, events, and
            learning in one place designed for Bay Area schools.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">Start a Club</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#stem">Explore Resources</Link>
            </Button>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
