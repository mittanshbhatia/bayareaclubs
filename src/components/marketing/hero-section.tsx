import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";

import { PageContainer } from "@/components/ds";
import { HeroWorkflow } from "@/components/marketing/hero-workflow";
import styles from "@/components/marketing/homepage.module.css";
import { MotionReveal } from "@/components/marketing/motion-scene";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className={cn(styles.scene, styles.hero)}>
      <div
        aria-hidden
        className={cn(styles.ambientOrb, "-top-32 right-[8%] opacity-70")}
      />
      <PageContainer
        size="xl"
        className="relative z-10 grid min-h-[52rem] items-center gap-14 pt-24 pb-32 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 lg:pt-20 lg:pb-36"
      >
        <div className="relative">
          <p className={cn(styles.eyebrow, "text-[var(--home-cyan)]")}>
            The operating system for student communities
          </p>
          <h1 className={cn(styles.display, "mt-7 text-balance")}>
            Start a club.
            <span className="block text-white/68">Build a community.</span>
            <span className="block bg-gradient-to-r from-[var(--home-cyan)] via-white to-[var(--home-violet)] bg-clip-text text-transparent">
              Make it matter.
            </span>
          </h1>
          <MotionReveal delay={0.08} distance={16}>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              From the first idea to approval, members, events, learning and
              yearly renewal — BayAreaClubs gives student communities one place
              to grow.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="group w-full bg-white text-[var(--home-ink)] shadow-[0_12px_35px_rgb(86_217_255_/_18%)] transition-transform hover:-translate-y-0.5 hover:bg-white sm:w-auto"
              >
                <Link href="/start-a-club">
                  Start a Club
                  <ArrowUpRight
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/7 text-white shadow-none hover:bg-white/12 sm:w-auto"
              >
                <a href="#idea-story">
                  <Play aria-hidden className="fill-current" />
                  See It in Action
                </a>
              </Button>
            </div>
            <a
              href="#discover"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/64 transition-colors hover:text-white"
            >
              Discover Clubs
              <ArrowDown aria-hidden className="size-3.5" />
            </a>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.48} distance={42} className="relative lg:-mr-10">
          <HeroWorkflow />
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
