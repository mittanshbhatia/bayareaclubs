"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "submit",
    label: "Submit",
    title: "Capture the idea clearly",
    copy: "Students draft purpose, advisors, and school context in a guided proposal—not a lost inbox form.",
  },
  {
    id: "review",
    label: "Review",
    title: "Route to the right people",
    copy: "Committee reviewers see only the workflow data they need, with accountability at every step.",
  },
  {
    id: "improve",
    label: "Improve",
    title: "Request changes with context",
    copy: "Feedback stays attached to the idea so revisions are focused and traceable.",
  },
  {
    id: "approve",
    label: "Approve",
    title: "Decide with a clear record",
    copy: "Approvals create an audit trail before a club is ever spun up.",
  },
  {
    id: "launch",
    label: "Launch",
    title: "Convert idea into a club",
    copy: "Charter, officers, and membership start from the approved proposal—ready to operate.",
  },
] as const;

export function LifecycleSection() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = steps[active];

  return (
    <section id="lifecycle" className="scroll-mt-20 border-b border-border py-16 sm:py-24">
      <PageContainer>
        <Reveal>
          <SectionHeader
            title="An idea shouldn't get lost in a form."
            description="Follow the full lifecycle from first draft to a living club—transparent for students, advisors, and reviewers."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {steps.map((item, index) => (
                <li key={item.id} className="min-w-[8.5rem] flex-1 lg:min-w-0">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                      active === index
                        ? "border-primary bg-primary-muted"
                        : "border-border bg-surface hover:bg-surface-muted",
                    )}
                    aria-current={active === index ? "step" : undefined}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="relative min-h-[16rem] overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
              <div
                aria-hidden
                className="mb-6 h-1 overflow-hidden rounded-full bg-surface-muted"
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{
                    width: `${((active + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                />
              </div>
              <motion.div
                key={step.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.28 }}
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                  {step.label}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {step.copy}
                </p>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
