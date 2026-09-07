import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";

import { PageContainer } from "@/components/ds";
import { HeroWorkflow } from "@/components/marketing/hero-workflow";
import styles from "@/components/marketing/homepage.module.css";
import { MotionReveal } from "@/components/marketing/motion-scene";
import { Button } from "@/components/ui/button";
import { listPublicSchoolParticipants } from "@/features/marketing/school-participants";
import { cn } from "@/lib/utils";

export async function HeroSection() {
  const schoolParticipants = await listPublicSchoolParticipants();

  return (
    <section className={cn(styles.scene, styles.hero)}>
      <div
        aria-hidden
        className={cn(styles.ambientOrb, "-top-32 right-[8%] opacity-70")}
      />
      <PageContainer
        size="xl"
        className="relative z-10 pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32"
      >
        <HeroWorkflow schoolParticipants={schoolParticipants} />

        <div className="mt-2 grid gap-7 border-t border-white/10 pt-10 lg:mt-3 lg:grid-cols-[1.18fr_0.82fr] lg:items-end lg:gap-14 lg:pt-12">
          <MotionReveal delay={0.08} distance={16}>
            <p className={cn(styles.eyebrow, "text-[var(--home-cyan)]")}>
              The operating system for student communities
            </p>
            <h1 className={cn(styles.display, "mt-5 text-balance text-white")}>
              Start a club.
              <span className="block text-white/68">Build a community.</span>
              <span className="block text-[var(--home-cyan)]">
                Make it matter.
              </span>
            </h1>
          </MotionReveal>

          <MotionReveal delay={0.42} distance={14} className="lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
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
      </PageContainer>
    </section>
  );
}
