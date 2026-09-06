import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageContainer } from "@/components/ds";
import { FinalNetwork } from "@/components/marketing/final-network";
import styles from "@/components/marketing/homepage.module.css";
import { MotionReveal } from "@/components/marketing/motion-scene";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
    <section
      className={cn(
        styles.scene,
        styles.finalScene,
        "overflow-hidden py-24 sm:py-32",
      )}
    >
      <PageContainer size="xl" className="relative text-center">
        <MotionReveal>
          <p
            className={cn(
              styles.eyebrow,
              "justify-center text-[var(--home-cyan)]",
            )}
          >
            One idea can change a school
          </p>
          <h2
            className={cn(
              styles.sectionDisplay,
              "mx-auto mt-6 max-w-[12ch] text-balance",
            )}
          >
            Your next community starts with an idea.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/56 sm:text-lg">
            Give that idea a real path—from first draft to a community that can
            learn, gather, and keep growing.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group bg-white text-[var(--home-ink)] hover:bg-white"
            >
              <Link href="/start-a-club">
                Start a Club
                <ArrowUpRight
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/18 bg-white/6 text-white hover:bg-white/12"
            >
              <a href="#discover">Discover Clubs</a>
            </Button>
          </div>
        </MotionReveal>
        <FinalNetwork />
      </PageContainer>
    </section>
  );
}
