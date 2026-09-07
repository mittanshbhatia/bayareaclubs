"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  CalendarCheck,
  Check,
  Circle,
  FileText,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "@/components/marketing/homepage.module.css";
import { SchoolParticipantsMarquee } from "@/components/marketing/school-participants-marquee";
import type { PublicSchoolParticipant } from "@/features/marketing/school-participants";
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

const stops = [11.5, 39.5, 63, 86.5] as const;
const traversalDuration = 8800;
const desktopPath =
  "M0 20 H205 C236 20 236 28 236 48 C236 68 236 76 267 76 H1200";

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export function HeroWorkflow({
  schoolParticipants,
}: {
  schoolParticipants: PublicSchoolParticipant[];
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [reached, setReached] = useState(-1);
  const [reviewStep, setReviewStep] = useState(-1);
  const [signalPosition, setSignalPosition] = useState(0);
  const [signalVisible, setSignalVisible] = useState(false);

  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;

    async function runTimeline() {
      while (!cancelled) {
        setSignalVisible(false);
        setSignalPosition(0);
        setReached(-1);
        setReviewStep(-1);
        await wait(700);
        if (cancelled) return;

        setSignalVisible(true);
        await wait(80);
        setSignalPosition(100);
        await wait((stops[0] / 100) * traversalDuration);
        if (cancelled) return;
        setReached(0);

        await wait(((stops[1] - stops[0]) / 100) * traversalDuration);
        if (cancelled) return;
        setReached(1);
        setReviewStep(0);

        void (async () => {
          for (let step = 1; step <= checklist.length; step += 1) {
            await wait(470);
            if (cancelled) return;
            setReviewStep(step);
          }
        })();

        await wait(((stops[2] - stops[1]) / 100) * traversalDuration);
        if (cancelled) return;
        setReached(2);

        await wait(((stops[3] - stops[2]) / 100) * traversalDuration);
        if (cancelled) return;
        setReached(3);

        await wait(((100 - stops[3]) / 100) * traversalDuration);
        if (cancelled) return;
        setReached(-1);
        setReviewStep(-1);
        await wait(650);
      }
    }

    void runTimeline();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced]);

  const visibleReached = reduced ? stages.length - 1 : reached;
  const visibleReviewStep = reduced ? checklist.length : reviewStep;
  const currentStage = stages[Math.max(visibleReached, 0)];

  return (
    <div
      ref={ref}
      className="relative w-full"
      aria-label="Animated club idea to community workflow demonstration"
    >
      <div className="hidden min-h-[19rem] lg:block">
        <svg
          aria-hidden
          className="absolute top-0 left-0 h-[6.25rem] w-full overflow-visible"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            d={desktopPath}
            className={styles.connector}
            stroke="rgba(203, 211, 226, 0.2)"
            strokeWidth="3"
          />
          <path
            d={desktopPath}
            className={styles.connector}
            stroke="rgba(203, 211, 226, 0.62)"
            strokeWidth="1"
          />
          {!reduced ? (
            <motion.circle
              r="4.5"
              fill="var(--home-cyan)"
              className={styles.signal}
              style={{ offsetPath: `path("${desktopPath}")` }}
              initial={false}
              animate={{
                offsetDistance: `${signalPosition}%`,
                opacity: signalVisible ? 1 : 0,
              }}
              transition={{
                offsetDistance: {
                  duration:
                    signalVisible && signalPosition > 0
                      ? traversalDuration / 1000
                      : 0,
                  ease: "linear",
                },
                opacity: { duration: 0.22 },
              }}
            />
          ) : null}
        </svg>

        <ol className="relative grid grid-cols-4 pt-1">
          {stages.map((item, index) => {
            const Icon = item.icon;
            const isReached = index <= visibleReached;

            return (
              <li key={item.label} className="min-w-0 px-3">
                <div
                  className={cn(
                    "flex h-10 justify-center",
                    index > 0 && "mt-14",
                  )}
                >
                  <motion.div
                    layout
                    animate={{ width: isReached ? "auto" : 32 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                    className={cn(
                      "flex h-8 items-center justify-center overflow-hidden rounded-full border",
                      isReached
                        ? "border-[var(--home-indigo)]/35 bg-white text-[var(--home-indigo-strong)] shadow-[0_8px_24px_rgb(0_0_0_/_16%)]"
                        : "border-white/22 bg-[#10172c] text-white/64",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <AnimatePresence initial={false}>
                      {isReached ? (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.38, ease: "easeOut" }}
                          className="pr-3 font-mono text-[0.62rem] font-bold tracking-[0.11em] whitespace-nowrap uppercase"
                        >
                          {item.label}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isReached ? (
                    <motion.div
                      key={`${item.label}-content`}
                      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                      transition={{
                        duration: 0.58,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                    >
                      <DesktopStageContent
                        index={index}
                        reviewStep={visibleReviewStep}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="lg:hidden">
        <div className="relative pl-5">
          <div
            aria-hidden
            className="absolute top-4 bottom-4 left-12 w-px bg-white/30"
          />
          {!reduced ? (
            <motion.span
              aria-hidden
              initial={false}
              animate={{
                top: `${signalPosition}%`,
                opacity: signalVisible ? 1 : 0,
              }}
              transition={{
                top: {
                  duration:
                    signalVisible && signalPosition > 0
                      ? traversalDuration / 1000
                      : 0,
                  ease: "linear",
                },
                opacity: { duration: 0.22 },
              }}
              className="absolute left-[2.75rem] z-20 size-2 rounded-full bg-[var(--home-cyan)] shadow-[0_0_12px_var(--home-cyan)]"
            />
          ) : null}
          <ol className="space-y-2">
            {stages.map((item, index) => {
              const Icon = item.icon;
              const isReached = index <= visibleReached;
              return (
                <li key={item.label} className="h-14">
                  <motion.div
                    layout
                    className={cn(
                      "relative flex h-14 items-center gap-3 overflow-hidden rounded-xl border px-3 text-left transition-colors",
                      isReached
                        ? "border-[var(--home-indigo)]/35 bg-white text-[var(--home-ink)] shadow-md"
                        : "w-14 border-white/20 bg-[#10172c] text-white/64",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                        isReached
                          ? "bg-[var(--home-indigo-strong)] text-white"
                          : "bg-white/8 text-white/64",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <AnimatePresence initial={false}>
                      {isReached ? (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="min-w-0"
                        >
                          <span className="block font-mono text-[0.58rem] font-bold tracking-[0.1em] text-[#657087] uppercase">
                            {item.label}
                          </span>
                          <span className="mt-1 block truncate text-sm font-semibold">
                            {item.title}
                          </span>
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

        <AnimatePresence mode="wait">
          {visibleReached >= 0 ? (
            <motion.div
              key={currentStage.label}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              className="mt-4 flex items-center justify-between rounded-lg bg-[#0b2545] px-4 py-3 text-white"
            >
              <span className="text-xs font-semibold">
                {currentStage.title}
              </span>
              <span className="max-w-36 text-right text-[0.65rem] text-white/70">
                {currentStage.detail}
              </span>
            </motion.div>
          ) : (
            <div className="mt-4 h-11" />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <div className="hidden items-center justify-end gap-2 lg:flex">
          <CalendarCheck
            className="size-3.5 text-[var(--home-indigo)]"
            aria-hidden
          />
          <span className="font-mono text-[0.58rem] tracking-[0.12em] text-[#8290a8] uppercase">
            Original BayAreaClubs product demonstration
          </span>
        </div>
        {schoolParticipants.length > 0 ? (
          <div className="mt-2">
            <SchoolParticipantsMarquee participants={schoolParticipants} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DesktopStageContent({
  index,
  reviewStep,
}: {
  index: number;
  reviewStep: number;
}) {
  if (index === 0) {
    return (
      <div className="mt-14 rounded-xl border border-[#17213a]/10 bg-white p-4 text-[var(--home-ink)] shadow-[0_14px_35px_rgb(20_38_70_/_13%)]">
        <p className="font-mono text-[0.58rem] text-[#657087] uppercase">
          New club idea
        </p>
        <p className="font-display mt-3 text-base font-semibold">
          Robotics Builders
        </p>
        <p className="mt-2 text-xs leading-5 text-[#657087]">
          Hands-on engineering for every beginner.
        </p>
      </div>
    );
  }

  if (index === 1) {
    return (
      <ul className="mt-6 space-y-2">
        {checklist.map((entry, entryIndex) => {
          const complete = entryIndex < reviewStep;
          const processing = entryIndex === reviewStep;
          return (
            <motion.li
              key={entry}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: entryIndex * 0.18 }}
              className="flex items-center gap-2 rounded-full border border-[#17213a]/10 bg-white px-3 py-1.5 text-[0.65rem] text-[#364158] shadow-sm"
            >
              <span className="flex size-4 items-center justify-center">
                {complete ? (
                  <motion.span
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex size-4 items-center justify-center rounded-full bg-[var(--home-indigo)] text-white"
                  >
                    <Check className="size-2.5" aria-hidden />
                  </motion.span>
                ) : processing ? (
                  <LoaderCircle
                    className="size-3.5 animate-spin text-[var(--home-indigo)]"
                    aria-hidden
                  />
                ) : (
                  <Circle className="size-3 text-[#a8b1c0]" aria-hidden />
                )}
              </span>
              {entry}
            </motion.li>
          );
        })}
      </ul>
    );
  }

  if (index === 2) {
    return (
      <div className="mt-8 border-l border-[var(--home-indigo)]/35 pl-4 text-white">
        <p className="font-mono text-[0.58rem] text-white/58 uppercase">
          Decision state
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="size-1.5 rounded-full bg-[var(--home-lime)]"
          />
          Approved for launch
        </p>
        <p className="mt-3 text-xs leading-5 text-white/58">
          Application context becomes the club workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl bg-[#0b2545] p-4 text-white shadow-[0_16px_38px_rgb(2_29_61_/_28%)]">
      <div className="flex items-center justify-between">
        <UsersRound className="size-4 text-[var(--home-cyan)]" aria-hidden />
        <span className="text-[0.58rem] text-white/60">DEMO</span>
      </div>
      <p className="font-display mt-4 text-base font-semibold">
        Community active
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-3 text-xs">
        <span>Members</span>
        <span className="font-mono font-bold">42</span>
      </div>
    </div>
  );
}
