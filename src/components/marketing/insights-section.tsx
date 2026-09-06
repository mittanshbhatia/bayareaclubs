"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  MotionReveal,
  SceneLabel,
  useVisibleCycle,
} from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const insights = [
  {
    label: "Attendance",
    value: "81%",
    delta: "+6 pts",
    reason: "Meeting participation increased across the last three sessions.",
    action: "View meetings",
  },
  {
    label: "Member growth",
    value: "+8",
    delta: "This term",
    reason:
      "The robotics workshop brought four returning visitors into the club.",
    action: "View membership",
  },
  {
    label: "Event participation",
    value: "74%",
    delta: "+11 pts",
    reason: "Earlier reminders improved RSVP follow-through before check-in.",
    action: "View events",
  },
  {
    label: "Renewal readiness",
    value: "Ready",
    delta: "4 of 4",
    reason:
      "Charter, advisor confirmation, officers, and activity summary are current.",
    action: "View renewal",
  },
] as const;

const charts = [
  "M10 142 C80 135 105 132 150 112 S245 118 300 82 S390 72 470 32",
  "M10 150 C75 147 118 123 165 126 S248 82 300 91 S395 44 470 38",
  "M10 145 C76 118 120 138 170 102 S255 114 310 74 S395 82 470 30",
  "M10 135 C90 136 122 115 180 101 S268 74 332 57 S418 43 470 28",
] as const;

export function InsightsSection() {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(insights.length, 2800);
  const insight = insights[active];

  return (
    <section
      ref={ref}
      id="insights"
      className={cn(
        styles.scene,
        "overflow-hidden bg-[#5548dd] py-24 text-white sm:py-32 lg:py-40",
      )}
    >
      <div
        aria-hidden
        className="absolute -top-52 -left-52 size-[40rem] rounded-full bg-[var(--home-cyan)]/14 blur-[100px]"
      />
      <PageContainer size="xl" className="relative">
        <MotionReveal>
          <SceneLabel dark>07 · Explainable insights</SceneLabel>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              Know what changed. Know what to do next.
            </h2>
            <p className="max-w-xl text-base leading-7 text-white sm:text-lg">
              Useful analytics connect a number to the club activity that
              changed it—without turning student participation into a grade.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12} className="mt-14">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/12 shadow-[0_42px_120px_rgb(24_15_100_/_38%)] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="bg-[#211a76]/90 p-6 sm:p-9">
              <p className="font-mono text-[0.6rem] tracking-[0.14em] text-white/42 uppercase">
                Club Momentum · demonstration
              </p>
              <nav
                aria-label="Insight demonstration"
                className="mt-8 space-y-1"
              >
                {insights.map((item, index) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setActive(index)}
                    className={cn(
                      "flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition-colors",
                      index === active
                        ? "bg-white text-[#211a76]"
                        : "text-white/54 hover:bg-white/8 hover:text-white",
                    )}
                    aria-current={index === active ? "true" : undefined}
                  >
                    {item.label}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </button>
                ))}
              </nav>
              <div className="mt-10 flex items-start gap-3 border-t border-white/10 pt-5">
                <Sparkles
                  className="mt-0.5 size-4 text-[var(--home-cyan)]"
                  aria-hidden
                />
                <p className="text-xs leading-5 text-white/44">
                  Derived from transactional activity. No invented platform-wide
                  statistics.
                </p>
              </div>
            </div>

            <div
              className={cn(
                styles.insightBars,
                "bg-[#f7f7fb] p-6 text-[var(--home-ink)] sm:p-9 lg:p-12",
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={insight.label}
                  initial={reduced ? false : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                >
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-[var(--home-muted)]">
                        {insight.label}
                      </p>
                      <p className="font-display mt-2 text-6xl font-semibold tracking-[-0.06em] sm:text-8xl">
                        {insight.value}
                      </p>
                    </div>
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#e6f7d5] px-3 py-1.5 text-xs font-bold text-[#315d16]">
                      <TrendingUp className="size-3.5" aria-hidden />
                      {insight.delta}
                    </span>
                  </div>

                  <svg
                    role="img"
                    aria-label={`${insight.label} demonstration trend rises over six periods`}
                    viewBox="0 0 480 170"
                    className="mt-10 h-44 w-full overflow-visible"
                  >
                    {[34, 74, 114, 154].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="480"
                        y1={y}
                        y2={y}
                        stroke="rgba(32,39,68,.1)"
                      />
                    ))}
                    <motion.path
                      key={charts[active]}
                      d={charts[active]}
                      fill="none"
                      stroke="var(--home-indigo)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: reduced ? 0 : 1.05 }}
                    />
                    <motion.circle
                      cx="470"
                      cy={
                        active === 0
                          ? 32
                          : active === 1
                            ? 38
                            : active === 2
                              ? 30
                              : 28
                      }
                      r="6"
                      fill="var(--home-indigo)"
                      initial={reduced ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: reduced ? 0 : 0.8 }}
                    />
                  </svg>

                  <div className="mt-7 grid gap-4 border-t border-[#202744]/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="text-xs font-bold text-[var(--home-indigo)]">
                        Why?
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--home-muted)]">
                        {insight.reason}
                      </p>
                    </div>
                    <Link
                      href="/sign-in?next=%2Fdashboard%2Finsights"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--home-indigo)]"
                    >
                      {insight.action}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
