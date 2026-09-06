"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  Check,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  UsersRound,
} from "lucide-react";

import styles from "@/components/marketing/homepage.module.css";
import { useVisibleCycle } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const stages = [
  {
    id: "idea",
    label: "Idea captured",
    detail: "Robotics Builders",
    node: 0,
  },
  {
    id: "submitted",
    label: "Submitted",
    detail: "Proposal routed",
    node: 1,
  },
  {
    id: "reviewing",
    label: "Reviewing",
    detail: "Advisor confirmed",
    node: 1,
  },
  {
    id: "approved",
    label: "Approved",
    detail: "Decision recorded",
    node: 2,
  },
  {
    id: "club",
    label: "Club created",
    detail: "Command center online",
    node: 2,
  },
  {
    id: "members",
    label: "Members joining",
    detail: "42 members · demo",
    node: 3,
  },
  {
    id: "meeting",
    label: "First meeting",
    detail: "Attendance ready",
    node: 3,
  },
  {
    id: "event",
    label: "Event launched",
    detail: "Robotics workshop",
    node: 4,
  },
  {
    id: "highlight",
    label: "Impact shared",
    detail: "Highlight published",
    node: 5,
  },
] as const;

const nodes = [
  { label: "Idea", icon: Lightbulb, x: "8%", y: "52%" },
  { label: "Review", icon: MessageSquareText, x: "31%", y: "21%" },
  { label: "Club", icon: Sparkles, x: "55%", y: "49%" },
  { label: "People", icon: UsersRound, x: "72%", y: "18%" },
  { label: "Event", icon: CalendarDays, x: "82%", y: "64%" },
  { label: "Impact", icon: Check, x: "55%", y: "79%" },
] as const;

const paths = [
  "M92 282 C160 282 163 130 263 130",
  "M305 130 C390 130 374 264 470 264",
  "M512 264 C570 264 572 116 630 116",
  "M670 116 C742 116 697 346 755 346",
  "M745 375 C660 428 580 433 500 427",
] as const;

export function HeroWorkflow() {
  const reduced = useReducedMotion();
  const [active, chooseActive, ref] = useVisibleCycle(stages.length, 1120);
  const stage = stages[active];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[45rem]">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 34, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.9,
          delay: reduced ? 0 : 0.9,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className={cn(
          styles.productSurface,
          "relative aspect-[1.14] overflow-hidden rounded-[1.15rem] p-4 sm:p-6",
        )}
        aria-label="Animated BayAreaClubs lifecycle product demonstration"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--home-coral)]" />
            <span className="size-2 rounded-full bg-[var(--home-lime)]" />
            <span className="size-2 rounded-full bg-[var(--home-cyan)]" />
          </div>
          <span className="font-mono text-[0.62rem] tracking-[0.16em] text-white/45 uppercase">
            Product story · demonstration
          </span>
        </div>

        <svg
          aria-hidden
          className="absolute inset-x-4 top-12 h-[calc(100%-4rem)] w-[calc(100%-2rem)] overflow-visible text-[var(--home-indigo)] sm:inset-x-6 sm:w-[calc(100%-3rem)]"
          viewBox="0 0 840 520"
          preserveAspectRatio="none"
        >
          {paths.map((path, index) => (
            <g key={path}>
              <path
                d={path}
                className={styles.connector}
                opacity={index < stage.node ? 0.85 : 0.18}
              />
              {index < stage.node ? (
                <motion.circle
                  r="4"
                  fill="var(--home-cyan)"
                  className={styles.signal}
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: reduced ? 0 : 1.2,
                    repeat: reduced ? 0 : Infinity,
                    ease: "linear",
                    delay: index * 0.13,
                  }}
                  style={{ offsetPath: `path("${path}")` }}
                />
              ) : null}
            </g>
          ))}
        </svg>

        {nodes.map((node, index) => {
          const Icon = node.icon;
          const reached = index <= stage.node;
          const current = index === stage.node;
          return (
            <motion.button
              type="button"
              key={node.label}
              onClick={() => {
                const stageIndex = stages.findIndex(
                  (item) => item.node === index,
                );
                chooseActive(stageIndex < 0 ? 0 : stageIndex);
              }}
              animate={{
                opacity: reached ? 1 : 0.38,
                scale: current && !reduced ? 1.08 : 1,
              }}
              whileHover={reduced ? undefined : { scale: 1.06 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: node.x, top: node.y }}
              aria-label={`Show ${node.label} stage`}
              aria-current={current ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl border transition-colors sm:size-14",
                  reached
                    ? "border-white/24 bg-white/12 text-white shadow-[0_0_30px_rgb(102_92_255_/_28%)]"
                    : "border-white/10 bg-white/5 text-white/50",
                )}
              >
                <Icon className="size-4 sm:size-5" aria-hidden />
              </span>
              <span className="mt-2 block font-mono text-[0.58rem] tracking-[0.12em] text-white/55 uppercase sm:text-[0.65rem]">
                {node.label}
              </span>
            </motion.button>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.34 }}
            className="absolute right-4 bottom-4 left-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-white/14 bg-[#0c1126]/92 px-4 py-3 shadow-2xl backdrop-blur-md sm:right-6 sm:bottom-6 sm:left-6 sm:px-5"
          >
            <div>
              <p className="font-mono text-[0.6rem] tracking-[0.14em] text-[var(--home-cyan)] uppercase">
                {String(active + 1).padStart(2, "0")} / {stages.length}
              </p>
              <p className="font-display mt-1 text-base font-semibold text-white sm:text-lg">
                {stage.label}
              </p>
            </div>
            <p className="max-w-36 text-right text-xs text-white/60 sm:text-sm">
              {stage.detail}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        aria-hidden
        animate={reduced ? undefined : { y: [0, -9, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-3 hidden rounded-lg border border-white/14 bg-[#171d3b]/90 px-3 py-2 shadow-xl backdrop-blur sm:block"
      >
        <p className="font-mono text-[0.58rem] text-white/45 uppercase">
          Community signal
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          New member joined
        </p>
      </motion.div>
    </div>
  );
}
