"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

const stages = [
  {
    id: "idea",
    label: "IDEA",
    title: "Robotics for Everyone",
    detail: "Student proposal submitted",
  },
  {
    id: "review",
    label: "COMMITTEE REVIEW",
    title: "In committee queue",
    detail: "Advisor + reviewer assigned",
  },
  {
    id: "approved",
    label: "APPROVED",
    title: "Ready to charter",
    detail: "Conditions cleared",
  },
  {
    id: "created",
    label: "CLUB CREATED",
    title: "Peninsula Robotics",
    detail: "Officers invited",
  },
  {
    id: "members",
    label: "32 MEMBERS",
    title: "Roster growing",
    detail: "Invites accepted this week",
  },
  {
    id: "event",
    label: "FIRST EVENT",
    title: "Maker Night",
    detail: "RSVP open · Room 214",
  },
] as const;

export function HeroWorkflow() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const stage = stages[active];

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-md"
      aria-label="Animated club launch workflow preview"
    >
      <div className="border-b border-border bg-surface-muted/70 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Club launch workflow
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-muted px-2 py-1 text-[11px] font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            Live preview
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <ol className="space-y-0 border-b border-border p-4 lg:border-r lg:border-b-0">
          {stages.map((item, index) => {
            const isActive = index === active;
            const isDone = index < active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-primary-muted text-primary"
                      : "hover:bg-surface-muted",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                      isDone &&
                        "border-primary bg-primary text-primary-foreground",
                      isActive &&
                        !isDone &&
                        "border-accent bg-accent-muted text-accent",
                      !isActive &&
                        !isDone &&
                        "border-border bg-surface text-muted-foreground",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 aria-hidden className="size-3.5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-sm",
                        isActive ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
                {index < stages.length - 1 ? (
                  <div className="ml-6 h-3 border-l border-dashed border-border" aria-hidden />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="relative flex min-h-[18rem] flex-col justify-between p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              className="space-y-4"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                {stage.label}
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {stage.title}
              </h3>
              <p className="text-sm text-muted-foreground">{stage.detail}</p>

              <div className="rounded-lg border border-border bg-background p-4 shadow-xs">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Proposal card
                  </span>
                  <span className="rounded-md bg-surface-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    demo UI
                  </span>
                </div>
                <p className="font-semibold text-foreground">
                  Robotics for Everyone
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mission High · STEM · After-school builds for all grades
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-primary-muted px-2 py-1 text-xs font-semibold text-primary">
                    Charter ready
                  </span>
                  <span className="rounded-md bg-accent-muted px-2 py-1 text-xs font-semibold text-accent">
                    Advisor linked
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight aria-hidden className="size-4 text-primary" />
            Connected stages, not floating decoration
          </div>
        </div>
      </div>
    </div>
  );
}
