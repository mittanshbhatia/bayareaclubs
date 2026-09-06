"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  Mail,
  Megaphone,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  MotionReveal,
  SceneLabel,
  useVisibleCycle,
} from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "members",
    label: "Members",
    icon: UsersRound,
    headline: "Three new members joined.",
    detail: "Roles and invitations update in one governed roster.",
    accent: "var(--home-violet)",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: Check,
    headline: "Meeting started. 34 checked in.",
    detail: "The attendance record connects directly to this meeting.",
    accent: "var(--home-cyan)",
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
    headline: "Workshop published. RSVPs are moving.",
    detail: "Capacity, logistics, and responses stay attached.",
    accent: "var(--home-coral)",
  },
  {
    id: "communications",
    label: "Comms",
    icon: Megaphone,
    headline: "The right announcement reached the club.",
    detail: "Audience selection follows membership and email preferences.",
    accent: "var(--home-lime)",
  },
  {
    id: "learning",
    label: "Learning",
    icon: BookOpen,
    headline: "A robotics pathway joined the weekly plan.",
    detail: "Resources become part of how the club operates.",
    accent: "var(--home-violet)",
  },
  {
    id: "highlights",
    label: "Highlights",
    icon: Sparkles,
    headline: "The finished event became a story.",
    detail: "Consent-aware media can flow into a highlight and newsletter.",
    accent: "var(--home-cyan)",
  },
] as const;

const downstream = [
  { label: "Event", icon: CalendarDays, mode: 2 },
  { label: "Attendance", icon: Check, mode: 1 },
  { label: "Highlight", icon: Sparkles, mode: 5 },
  { label: "Newsletter", icon: Mail, mode: 3 },
  { label: "Insights", icon: BarChart3, mode: 5 },
] as const;

export function CommandCenterSection() {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(modes.length, 2600);
  const mode = modes[active];
  const ActiveIcon = mode.icon;

  return (
    <section
      ref={ref}
      id="command-center"
      className={cn(styles.scene, styles.darkScene, "py-24 sm:py-32 lg:py-40")}
    >
      <PageContainer size="xl">
        <MotionReveal>
          <SceneLabel dark>02 · Club command center</SceneLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              Everything your club needs.{" "}
              <span className="text-white/42">Connected.</span>
            </h2>
            <p className="max-w-xl text-base leading-7 text-white/58 lg:pb-2 lg:text-lg">
              One action carries context into the next. Members become
              attendance, events become highlights, and activity becomes an
              explanation.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12} className="mt-14">
          <div className={styles.commandShell}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--home-indigo)]">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold">Robotics Builders</p>
                  <p className="font-mono text-[0.58rem] tracking-[0.12em] text-white/42 uppercase">
                    Demonstration workspace · not live club data
                  </p>
                </div>
              </div>
              <span className="hidden items-center gap-2 text-xs text-white/48 sm:flex">
                <span className="size-1.5 rounded-full bg-[var(--home-lime)] shadow-[0_0_12px_var(--home-lime)]" />
                Club active
              </span>
            </div>

            <div className="grid lg:grid-cols-[12rem_1fr]">
              <nav
                aria-label="Command center demonstration"
                className="flex scrollbar-none gap-1 overflow-x-auto border-b border-white/10 p-3 lg:flex-col lg:border-r lg:border-b-0 lg:p-4"
              >
                {modes.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setActive(index)}
                      className={cn(
                        "flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-left text-xs font-semibold transition-colors",
                        index === active
                          ? "bg-white/12 text-white"
                          : "text-white/46 hover:bg-white/7 hover:text-white",
                      )}
                      aria-current={index === active ? "page" : undefined}
                    >
                      <Icon className="size-3.5" aria-hidden />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div
                className={cn(styles.commandGrid, "min-w-0 p-4 sm:p-7 lg:p-9")}
              >
                <div className="grid gap-5 md:grid-cols-[1fr_16rem]">
                  <div className="min-h-[19rem] rounded-xl border border-white/10 bg-[#101733]/92 p-5 sm:p-7">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mode.id}
                        initial={
                          reduced
                            ? false
                            : { opacity: 0, y: 15, filter: "blur(5px)" }
                        }
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={
                          reduced
                            ? undefined
                            : { opacity: 0, y: -10, filter: "blur(4px)" }
                        }
                        transition={{ duration: reduced ? 0 : 0.4 }}
                      >
                        <span
                          className="flex size-11 items-center justify-center rounded-xl"
                          style={{
                            color: mode.accent,
                            background: `color-mix(in srgb, ${mode.accent} 14%, transparent)`,
                          }}
                        >
                          <ActiveIcon className="size-5" aria-hidden />
                        </span>
                        <p className="font-display mt-8 max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
                          {mode.headline}
                        </p>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/50 sm:text-base">
                          {mode.detail}
                        </p>

                        <div className="mt-8 flex items-center gap-2">
                          {[0, 1, 2, 3, 4].map((item) => (
                            <motion.span
                              key={item}
                              initial={false}
                              animate={{
                                width: item <= active ? 38 : 12,
                                opacity: item <= active ? 1 : 0.28,
                              }}
                              transition={{ duration: reduced ? 0 : 0.36 }}
                              className="h-1 rounded-full bg-[var(--home-cyan)]"
                            />
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["Members", active >= 0 ? "42" : "39"],
                      ["Attendance", active >= 1 ? "81%" : "—"],
                      ["Upcoming events", active >= 2 ? "3" : "2"],
                      ["Renewal", "Ready"],
                    ].map(([label, value], index) => (
                      <motion.div
                        key={label}
                        animate={{
                          borderColor:
                            index === Math.min(active, 3)
                              ? "rgba(86,217,255,.55)"
                              : "rgba(255,255,255,.1)",
                        }}
                        className="flex min-h-16 items-center justify-between rounded-xl border bg-white/5 px-4"
                      >
                        <span className="text-xs text-white/46">
                          {label} <span className="sr-only">(demo)</span>
                        </span>
                        <span className="font-mono text-lg font-bold">
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#0a1024] p-4">
                  <p className="mb-4 font-mono text-[0.58rem] tracking-[0.14em] text-white/38 uppercase">
                    Context moves downstream
                  </p>
                  <div className="flex min-w-[38rem] items-center">
                    {downstream.map((item, index) => {
                      const Icon = item.icon;
                      const reached = active >= Math.min(item.mode, 5);
                      return (
                        <div
                          key={item.label}
                          className="flex flex-1 items-center"
                        >
                          <button
                            type="button"
                            onClick={() => setActive(item.mode)}
                            className={cn(
                              "flex min-h-12 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors",
                              reached
                                ? "border-[var(--home-cyan)]/35 bg-[var(--home-cyan)]/8 text-white"
                                : "border-white/10 bg-white/4 text-white/40 hover:text-white",
                            )}
                          >
                            <Icon className="size-3.5" aria-hidden />
                            {item.label}
                          </button>
                          {index < downstream.length - 1 ? (
                            <span className="relative mx-2 h-px flex-1 overflow-hidden bg-white/10">
                              {reached ? (
                                <motion.span
                                  className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-[var(--home-cyan)] to-transparent"
                                  animate={
                                    reduced
                                      ? undefined
                                      : { x: ["-100%", "500%"] }
                                  }
                                  transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                              ) : null}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
