"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import styles from "@/components/marketing/homepage.module.css";
import { useVisibleCycle } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

export type LearningModule = {
  title: string;
  href: string;
};

export function LearningPath({
  modules,
  usingPublishedCourses,
}: {
  modules: LearningModule[];
  usingPublishedCourses: boolean;
}) {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(modules.length, 2400);

  return (
    <div
      ref={ref}
      className="grid gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-center"
    >
      <div className="relative pl-3 sm:pl-7">
        <div
          aria-hidden
          className="absolute top-7 bottom-7 left-[1.7rem] w-px bg-[#252b4c]/10 sm:left-[2.7rem]"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={{ height: `${((active + 1) / modules.length) * 100}%` }}
          transition={{ duration: reduced ? 0 : 0.5 }}
          className={cn(
            styles.learningLine,
            "absolute top-7 left-[1.7rem] w-px sm:left-[2.7rem]",
          )}
        />
        <ol className="relative space-y-2">
          {modules.map((module, index) => (
            <li key={`${module.title}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "group grid w-full grid-cols-[2.9rem_1fr] items-center gap-3 rounded-xl p-3 text-left transition-colors sm:grid-cols-[3.4rem_1fr] sm:p-4",
                  index === active
                    ? "bg-white shadow-[0_18px_48px_rgb(50_45_100_/_10%)]"
                    : "hover:bg-white/60",
                )}
                aria-current={index === active ? "step" : undefined}
              >
                <motion.span
                  animate={{
                    scale: index === active && !reduced ? 1.08 : 1,
                  }}
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full border border-[#252b4c]/10 font-mono text-[0.65rem] font-bold",
                    index <= active
                      ? "bg-[var(--home-indigo-strong)] text-white"
                      : "bg-[var(--home-paper)] text-[var(--home-muted)]",
                  )}
                >
                  {index < active ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </motion.span>
                <span>
                  <span className="font-display block text-base font-semibold sm:text-lg">
                    {module.title}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--home-muted)]">
                    {index < active
                      ? "Complete"
                      : index === active
                        ? "In progress"
                        : "Recommended next"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <motion.div
        key={active}
        initial={reduced ? false : { opacity: 0, y: 18, rotateY: -4 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{
          duration: reduced ? 0 : 0.58,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className="rounded-2xl border border-[#252b4c]/10 bg-[#10152f] p-6 text-white shadow-[0_32px_80px_rgb(40_35_100_/_20%)] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--home-violet)]/14 text-[var(--home-violet)]">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.13em] text-white/42 uppercase">
            {usingPublishedCourses ? "Published catalog" : "Demonstration path"}
          </span>
        </div>
        <p className="mt-8 text-xs font-semibold text-[var(--home-cyan)]">
          AI CLUB STARTER PATH
        </p>
        <h3 className="font-display mt-3 text-3xl font-semibold tracking-tight">
          {modules[active]?.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-white/52">
          Progress can stay with the member while a club uses the same resource
          to structure a meeting and recommend what comes next.
        </p>
        <div className="mt-8">
          <div className="flex justify-between text-xs text-white/42">
            <span>Path progress</span>
            <span>{Math.round(((active + 1) / modules.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={false}
              animate={{ width: `${((active + 1) / modules.length) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--home-violet)] to-[var(--home-cyan)]"
            />
          </div>
        </div>
        <Link
          href={modules[active]?.href ?? "/resources"}
          className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white"
        >
          Explore this resource
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
        <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/46">
          <Sparkles className="size-4 text-[var(--home-lime)]" aria-hidden />
          Club recommendation updated from learning progress
        </div>
      </motion.div>
    </div>
  );
}
