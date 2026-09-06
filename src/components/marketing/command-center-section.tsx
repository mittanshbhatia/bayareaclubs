"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  MetricCard,
  PageContainer,
  SectionHeader,
  ActivityTimeline,
} from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";

function DemoCount({ to, label }: { to: number; label: string }) {
  return (
    <span aria-label={`${label}: ${to} (marketing demo)`}>{to}</span>
  );
}

export function CommandCenterSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="scroll-mt-20 border-b border-border py-16 sm:py-24">
      <PageContainer>
        <Reveal>
          <div className="mb-3">
            <Badge variant="warning">Marketing demo visualization</Badge>
          </div>
          <SectionHeader
            title="An officer command center that stays grounded."
            description="Illustrative metrics for storytelling only. They are isolated from authenticated analytics and are not live production data."
          />
        </Reveal>

        <Reveal>
          <div
            className="rounded-xl border border-dashed border-warning/40 bg-warning-muted/30 p-4 text-sm text-foreground sm:p-5"
            role="note"
          >
            Demo labels below are fictional sample values for the homepage
            narrative. Real club metrics appear only after sign-in inside your
            school and club scopes.
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Reveal delay={0.02}>
            <MetricCard
              label="Members (demo)"
              value={<DemoCount to={32} label="Members" />}
              hint="Sample roster size"
            />
          </Reveal>
          <Reveal delay={0.04}>
            <MetricCard
              label="Attendance (demo)"
              value={
                <>
                  <DemoCount to={91} label="Attendance percent" />%
                </>
              }
              hint="Last recorded session · sample"
            />
          </Reveal>
          <Reveal delay={0.06}>
            <MetricCard
              label="Upcoming events (demo)"
              value={<DemoCount to={3} label="Upcoming events" />}
              hint="Next: Maker Night"
            />
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={0.05}>
            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-foreground">
                  Member growth (demo series)
                </h3>
                <Badge variant="outline">Not live data</Badge>
              </div>
              <div className="flex h-40 items-end gap-2" aria-hidden>
                {[18, 22, 24, 27, 29, 32].map((height, index) => (
                  <motion.div
                    key={height}
                    className="flex-1 rounded-t-md bg-primary/80"
                    initial={false}
                    animate={{ height: `${height * 3}px` }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      delay: reduceMotion ? 0 : index * 0.04,
                    }}
                  />
                ))}
              </div>
              <p className="sr-only">
                Demo bar chart showing sample member growth over six periods.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
              <h3 className="mb-4 font-semibold text-foreground">
                Recent activity (demo)
              </h3>
              <ActivityTimeline
                items={[
                  {
                    id: "1",
                    title: "Attendance recorded",
                    description: "Sample session · 28 present",
                    timestamp: "Demo · Tue",
                    actor: "Secretary (sample)",
                  },
                  {
                    id: "2",
                    title: "Event RSVP opened",
                    description: "Maker Night logistics assigned",
                    timestamp: "Demo · Mon",
                    actor: "Officer (sample)",
                  },
                  {
                    id: "3",
                    title: "Charter marked current",
                    timestamp: "Demo · Sun",
                    actor: "Club admin (sample)",
                  },
                ]}
              />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
