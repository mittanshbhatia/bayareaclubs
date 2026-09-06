"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarCheck,
  Check,
  FileText,
  Lightbulb,
  Sparkles,
  UsersRound,
} from "lucide-react";

import styles from "@/components/marketing/homepage.module.css";
import { useVisibleCycle } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const stages = [
  {
    label: "Student idea",
    title: "Robotics Builders",
    detail: "Mission and activity plan captured",
    icon: Lightbulb,
  },
  {
    label: "School review",
    title: "Application routed",
    detail: "Advisor and reviewer assigned",
    icon: FileText,
  },
  {
    label: "Club launch",
    title: "Approved",
    detail: "Workspace and charter created",
    icon: Sparkles,
  },
  {
    label: "Community",
    title: "Members join",
    detail: "First meeting and event connected",
    icon: UsersRound,
  },
] as const;

const checklist = [
  "Mission reviewed",
  "Advisor confirmed",
  "Activities clarified",
  "School decision recorded",
] as const;

export function HeroWorkflow() {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(stages.length, 2400);
  const stage = stages[active];

  return (
    <div
      ref={ref}
      className="relative w-full"
      aria-label="Animated club idea to community workflow demonstration"
    >
      <div className="hidden min-h-[19rem] md:block">
        <svg
          aria-hidden
          className="absolute top-5 left-0 h-28 w-full overflow-visible text-[var(--home-indigo)]"
          viewBox="0 0 1200 112"
          preserveAspectRatio="none"
        >
          <path
            d="M0 28 H195 Q220 28 220 52 V72 Q220 88 245 88 H430 Q455 88 455 66 V50 Q455 36 480 36 H720 Q745 36 745 58 V73 Q745 88 770 88 H970 Q995 88 995 66 V42 Q995 28 1020 28 H1200"
            className={styles.connector}
            opacity=".25"
          />
          <motion.path
            d="M0 28 H195 Q220 28 220 52 V72 Q220 88 245 88 H430 Q455 88 455 66 V50 Q455 36 480 36 H720 Q745 36 745 58 V73 Q745 88 770 88 H970 Q995 88 995 66 V42 Q995 28 1020 28 H1200"
            className={styles.connector}
            stroke="var(--home-indigo)"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: (active + 1) / stages.length }}
            transition={{ duration: reduced ? 0 : 0.65, ease: "easeOut" }}
          />
          {!reduced ? (
            <motion.circle
              r="4"
              fill="var(--home-cyan)"
              className={styles.signal}
              style={{
                offsetPath:
                  'path("M0 28 H195 Q220 28 220 52 V72 Q220 88 245 88 H430 Q455 88 455 66 V50 Q455 36 480 36 H720 Q745 36 745 58 V73 Q745 88 770 88 H970 Q995 88 995 66 V42 Q995 28 1020 28 H1200")',
              }}
              animate={{
                offsetDistance: `${((active + 1) / stages.length) * 100}%`,
              }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />
          ) : null}
        </svg>

        <ol className="relative grid grid-cols-4 gap-7 pt-3">
          {stages.map((item, index) => {
            const Icon = item.icon;
            const reached = index <= active;
            return (
              <li key={item.label} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={index === active ? "step" : undefined}
                  className="group w-full text-left"
                >
                  <motion.span
                    initial={reduced ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : index * 0.13 }}
                    className={cn(
                      "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 font-mono text-[0.62rem] font-bold tracking-[0.11em] uppercase transition-colors",
                      reached
                        ? "border-[var(--home-indigo)]/35 bg-white text-[var(--home-indigo-strong)] shadow-sm"
                        : "border-[#17213a]/12 bg-[#f2f4f7] text-[#526074]",
                    )}
                  >
                    <Icon className="size-3" aria-hidden />
                    {item.label}
                  </motion.span>
                </button>

                <AnimatePresence mode="wait">
                  {index === 0 ? (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{
                        opacity: reduced || reached ? 1 : 0,
                        y: reduced || reached ? 0 : 16,
                        filter:
                          reduced || reached ? "blur(0px)" : "blur(7px)",
                      }}
                      transition={{ duration: reduced ? 0 : 0.55 }}
                      className="mt-11 rounded-xl border border-[#17213a]/10 bg-white p-4 text-[var(--home-ink)] shadow-[0_14px_35px_rgb(20_38_70_/_10%)]"
                    >
                      <p className="font-mono text-[0.58rem] text-[#657087] uppercase">
                        New club idea
                      </p>
                      <p className="font-display mt-3 text-base font-semibold">
                        Robotics Builders
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#657087]">
                        Hands-on engineering for every beginner.
                      </p>
                    </motion.div>
                  ) : index === 1 ? (
                    <motion.ul
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{
                        opacity: reduced || reached ? 1 : 0,
                        y: reduced || reached ? 0 : 16,
                        filter:
                          reduced || reached ? "blur(0px)" : "blur(7px)",
                      }}
                      transition={{ duration: reduced ? 0 : 0.55 }}
                      className="mt-9 space-y-2"
                    >
                      {checklist.map((entry, entryIndex) => (
                        <li
                          key={entry}
                          className="flex items-center gap-2 rounded-full border border-[#17213a]/10 bg-white/80 px-3 py-1.5 text-[0.65rem] text-[#364158]"
                        >
                          <Check
                            className={cn(
                              "size-3",
                              active > 0 && entryIndex <= active
                                ? "text-[var(--home-indigo)]"
                                : "text-[#8c97a8]",
                            )}
                            aria-hidden
                          />
                          {entry}
                        </li>
                      ))}
                    </motion.ul>
                  ) : index === 2 ? (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{
                        opacity: reduced || reached ? 1 : 0,
                        y: reduced || reached ? 0 : 16,
                        filter:
                          reduced || reached ? "blur(0px)" : "blur(7px)",
                      }}
                      transition={{ duration: reduced ? 0 : 0.55 }}
                      className="mt-11 border-l border-[var(--home-indigo)]/25 pl-4"
                    >
                      <p className="font-mono text-[0.58rem] text-[#657087] uppercase">
                        Decision state
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
                        <span className="size-1.5 rounded-full bg-[var(--home-lime)]" />
                        Approved for launch
                      </p>
                      <p className="mt-3 text-xs leading-5 text-[#657087]">
                        Application context becomes the club workspace.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{
                        opacity: reduced || reached ? 1 : 0,
                        y: reduced || reached ? 0 : 20,
                        scale: reduced || reached ? 1 : 0.94,
                        filter:
                          reduced || reached ? "blur(0px)" : "blur(9px)",
                      }}
                      transition={{ duration: reduced ? 0 : 0.6 }}
                      className="mt-9 rounded-xl bg-[#0b2545] p-4 text-white shadow-[0_16px_38px_rgb(2_29_61_/_20%)]"
                    >
                      <div className="flex items-center justify-between">
                        <UsersRound
                          className="size-4 text-[var(--home-cyan)]"
                          aria-hidden
                        />
                        <span className="text-[0.58rem] text-white/60">
                          DEMO
                        </span>
                      </div>
                      <p className="font-display mt-4 text-base font-semibold">
                        Community active
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-3 text-xs">
                        <span>Members</span>
                        <span className="font-mono font-bold">42</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="md:hidden">
        <div className="relative pl-5">
          <div
            aria-hidden
            className="absolute top-3 bottom-3 left-[0.7rem] w-px bg-[var(--home-indigo)]/20"
          />
          <motion.div
            aria-hidden
            animate={{ height: `${((active + 1) / stages.length) * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.45 }}
            className="absolute top-3 left-[0.7rem] w-px bg-[var(--home-indigo)]"
          />
          <ol className="space-y-2">
            {stages.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "relative flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 text-left text-[var(--home-ink)] transition-colors",
                      index === active
                        ? "border-[var(--home-indigo)]/35 bg-white shadow-md"
                        : "border-[#17213a]/10 bg-white/55",
                    )}
                    aria-current={index === active ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                        index <= active
                          ? "bg-[var(--home-indigo-strong)] text-white"
                          : "bg-[#e8edf3] text-[#657087]",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.58rem] font-bold tracking-[0.1em] text-[#657087] uppercase">
                        {item.label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold">
                        {item.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            className="mt-4 flex items-center justify-between rounded-lg bg-[#0b2545] px-4 py-3 text-white"
          >
            <span className="text-xs font-semibold">{stage.title}</span>
            <span className="max-w-36 text-right text-[0.65rem] text-white/70">
              {stage.detail}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 hidden items-center justify-end gap-2 md:flex">
        <CalendarCheck
          className="size-3.5 text-[var(--home-indigo)]"
          aria-hidden
        />
        <span className="font-mono text-[0.58rem] tracking-[0.12em] text-[#657087] uppercase">
          Original BayAreaClubs product demonstration
        </span>
      </div>
    </div>
  );
}
