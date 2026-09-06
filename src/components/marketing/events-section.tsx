"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarPlus,
  ClipboardList,
  ImagePlus,
  Ticket,
  UserCheck,
} from "lucide-react";

import { PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const eventSteps = [
  {
    id: "plan",
    label: "Plan event",
    icon: CalendarPlus,
    detail: "Set title, time, room, and purpose in one event record.",
  },
  {
    id: "logistics",
    label: "Assign logistics",
    icon: ClipboardList,
    detail: "Owners for setup, materials, and communication stay visible.",
  },
  {
    id: "rsvp",
    label: "Open RSVP",
    icon: Ticket,
    detail: "Members respond without a side spreadsheet.",
  },
  {
    id: "attendance",
    label: "Track attendance",
    icon: UserCheck,
    detail: "Session attendance links back to the same event.",
  },
  {
    id: "highlight",
    label: "Publish highlight",
    icon: ImagePlus,
    detail: "Share a highlight when media consent allows.",
  },
] as const;

export function EventsSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % eventSteps.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const step = eventSteps[active];
  const Icon = step.icon;

  return (
    <section id="events" className="scroll-mt-20 border-b border-border py-16 sm:py-24">
      <PageContainer>
        <Reveal>
          <SectionHeader
            title="Events that stay connected to the club."
            description="Plan, staff, RSVP, attend, and publish—without fracturing the story across tools."
          />
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex gap-2 overflow-x-auto border-b border-border p-3">
              {eventSteps.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    active === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-muted text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={active === index ? "step" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-border p-6 lg:border-r lg:border-b-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex size-11 items-center justify-center rounded-lg bg-accent-muted text-accent">
                      <Icon aria-hidden className="size-5" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      {step.label}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {step.detail}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative p-6">
                <div className="absolute top-1/2 left-6 right-6 h-px -translate-y-1/2 bg-border" aria-hidden />
                <ol className="relative flex justify-between gap-2">
                  {eventSteps.map((item, index) => {
                    const done = index <= active;
                    return (
                      <li key={item.id} className="flex flex-col items-center gap-2">
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full border text-[11px] font-bold",
                            done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-surface text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="hidden max-w-[4.5rem] text-center text-[10px] font-medium text-muted-foreground sm:block">
                          {item.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-10 rounded-lg border border-border bg-background p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    Event record
                  </p>
                  <p className="mt-2 font-semibold text-foreground">Maker Night</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fri · 5:30 PM · Room 214 · RSVP linked to attendance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
