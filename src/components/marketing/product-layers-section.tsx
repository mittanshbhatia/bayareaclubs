"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ClipboardCheck,
  CalendarDays,
  LineChart,
  Users,
} from "lucide-react";

import { PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const layers = [
  {
    id: "launch",
    title: "LAUNCH",
    summary: "From proposal to charter without losing context.",
    items: ["Club proposals", "Approvals", "Charter", "Officers"],
    icon: ClipboardCheck,
    preview: {
      heading: "Proposal workspace",
      rows: [
        { label: "Status", value: "Awaiting review" },
        { label: "Advisor", value: "Linked" },
        { label: "Charter draft", value: "Ready" },
      ],
    },
  },
  {
    id: "operate",
    title: "OPERATE",
    summary: "Keep membership, attendance, and events moving together.",
    items: ["Members", "Attendance", "Activities", "Events"],
    icon: Users,
    preview: {
      heading: "Weekly operations",
      rows: [
        { label: "Roster", value: "32 active" },
        { label: "Last session", value: "28 present" },
        { label: "Next event", value: "Maker Night" },
      ],
    },
  },
  {
    id: "grow",
    title: "GROW",
    summary: "Turn meetings into learning and share what the club builds.",
    items: ["STEM resources", "Highlights", "Newsletters", "Insights"],
    icon: LineChart,
    preview: {
      heading: "Growth toolkit",
      rows: [
        { label: "Course seats", value: "Subscribed" },
        { label: "Highlight", value: "Draft ready" },
        { label: "Newsletter", value: "Scheduled" },
      ],
    },
  },
] as const;

export function ProductLayersSection() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const layer = layers[active];
  const Icon = layer.icon;

  return (
    <section id="operate" className="scroll-mt-20 border-b border-border bg-surface-muted/40 py-16 sm:py-24">
      <PageContainer>
        <Reveal>
          <SectionHeader
            title="Everything your club needs to keep moving."
            description="Three product layers—launch, operate, and grow—built as one accountable system."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {layers.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "h-full w-full rounded-xl border p-5 text-left shadow-xs transition-colors",
                  active === index
                    ? "border-primary bg-surface"
                    : "border-border bg-surface/70 hover:bg-surface",
                )}
                aria-pressed={active === index}
              >
                <item.icon
                  aria-hidden
                  className={cn(
                    "mb-4 size-5",
                    active === index ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {item.items.map((entry) => (
                    <li
                      key={entry}
                      className="text-sm font-medium text-foreground"
                    >
                      · {entry}
                    </li>
                  ))}
                </ul>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <motion.div
            key={layer.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Icon aria-hidden className="size-5 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {layer.preview.heading}
                </p>
                <p className="text-xs text-muted-foreground">
                  Original product preview · not a live club
                </p>
              </div>
              <CalendarDays
                aria-hidden
                className="ml-auto size-4 text-muted-foreground"
              />
            </div>
            <dl className="grid gap-0 sm:grid-cols-3">
              {layer.preview.rows.map((row) => (
                <div
                  key={row.label}
                  className="border-b border-border px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                >
                  <dt className="text-xs font-medium text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
