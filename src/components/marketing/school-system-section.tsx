"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarCheck,
  Check,
  ClipboardList,
  FileCheck2,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  MotionReveal,
  SceneLabel,
  useVisibleCycle,
} from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const governanceModes = [
  {
    label: "Applications",
    title: "Robotics Builders",
    status: "Approved",
    explanation: "Advisor requirement satisfied",
  },
  {
    label: "Applications",
    title: "AI Society",
    status: "In review",
    explanation: "Committee reviewer assigned",
  },
  {
    label: "Charters",
    title: "Physics Society",
    status: "Changes requested",
    explanation: "Annual officer structure needs revision",
  },
  {
    label: "Events",
    title: "Community Service",
    status: "Awaiting approval",
    explanation: "Off-campus event policy applied",
  },
  {
    label: "Renewals",
    title: "Debate Club",
    status: "Ready",
    explanation: "Charter and advisor confirmation current",
  },
] as const;

const policyItems = [
  "Advisor required",
  "Application window",
  "Event approval",
  "Annual renewal",
] as const;

export function SchoolSystemSection() {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(
    governanceModes.length,
    2300,
  );
  const mode = governanceModes[active];

  return (
    <section
      ref={ref}
      id="schools"
      className={cn(
        styles.scene,
        styles.darkScene,
        "scroll-mt-20 py-24 sm:py-32 lg:py-40",
      )}
    >
      <PageContainer size="xl">
        <MotionReveal>
          <SceneLabel dark>06 · School operating system</SceneLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              One operating system for every club.
            </h2>
            <p className="max-w-xl text-base leading-7 text-white/56 sm:text-lg">
              Governance becomes a visible, configurable workflow instead of a
              patchwork of forms, inboxes, and disconnected deadlines.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12} className="mt-14">
          <div className="grid overflow-hidden rounded-2xl border border-white/12 bg-[#0c122a] shadow-[0_42px_120px_rgb(0_0_0_/_42%)] lg:grid-cols-[13rem_1fr_19rem]">
            <div className="border-b border-white/10 p-4 lg:border-r lg:border-b-0">
              <div className="flex items-center gap-2 px-2 py-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--home-indigo)] text-white">
                  <ShieldCheck className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold">School Console</p>
                  <p className="text-[0.58rem] text-white/38">Product demo</p>
                </div>
              </div>
              <nav
                aria-label="School console demonstration"
                className="mt-4 flex scrollbar-none gap-1 overflow-x-auto lg:flex-col"
              >
                {[
                  "Applications",
                  "Clubs",
                  "Charters",
                  "Events",
                  "Renewals",
                  "Insights",
                ].map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() =>
                      setActive(
                        governanceModes.findIndex(
                          (item) => item.label === label,
                        ) >= 0
                          ? governanceModes.findIndex(
                              (item) => item.label === label,
                            )
                          : index % governanceModes.length,
                      )
                    }
                    className={cn(
                      "min-h-10 shrink-0 rounded-lg px-3 text-left text-xs font-semibold transition-colors",
                      mode.label === label
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className={cn(styles.commandGrid, "min-w-0 p-5 sm:p-8")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] text-[var(--home-cyan)] uppercase">
                    Governance queue
                  </p>
                  <p className="font-display mt-2 text-2xl font-semibold">
                    Work that needs attention
                  </p>
                </div>
                <ClipboardList className="size-5 text-white/32" aria-hidden />
              </div>

              <div className="mt-8 space-y-2">
                {governanceModes.map((item, index) => (
                  <button
                    type="button"
                    key={`${item.title}-${item.status}`}
                    onClick={() => setActive(index)}
                    className={cn(
                      "grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-xl border px-4 py-4 text-left transition-colors",
                      index === active
                        ? "border-[var(--home-cyan)]/35 bg-[var(--home-cyan)]/8"
                        : "border-white/8 bg-[#0b1126]/74 hover:border-white/16",
                    )}
                    aria-current={index === active ? "true" : undefined}
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs text-white/38">
                        {item.label}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[0.62rem] font-bold",
                        item.status === "Approved" || item.status === "Ready"
                          ? "bg-[var(--home-lime)]/12 text-[var(--home-lime)]"
                          : item.status === "Changes requested"
                            ? "bg-[var(--home-coral)]/12 text-[var(--home-coral)]"
                            : "bg-[var(--home-violet)]/12 text-[#c8afff]",
                      )}
                    >
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode.explanation}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  className="mt-5 flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 text-xs text-white/58"
                >
                  <Check
                    className="size-4 text-[var(--home-lime)]"
                    aria-hidden
                  />
                  {mode.explanation}
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="border-t border-white/10 bg-[#090f23] p-5 lg:border-t-0 lg:border-l">
              <div className="flex items-center gap-2">
                <Settings2
                  className="size-4 text-[var(--home-violet)]"
                  aria-hidden
                />
                <p className="text-xs font-bold">School policies</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/38">
                Configuration changes how each workflow routes and what it
                requires.
              </p>
              <ul className="mt-7 space-y-5">
                {policyItems.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-xs text-white/58">{item}</span>
                    <motion.span
                      animate={{
                        backgroundColor:
                          index <= active
                            ? "var(--home-indigo)"
                            : "rgba(255,255,255,.08)",
                      }}
                      className="relative h-5 w-9 rounded-full"
                    >
                      <motion.span
                        animate={{ x: index <= active ? 17 : 2 }}
                        className="absolute top-0.5 size-4 rounded-full bg-white"
                      />
                    </motion.span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/8 pt-5 text-center">
                <div>
                  <CalendarCheck
                    className="mx-auto size-4 text-[var(--home-cyan)]"
                    aria-hidden
                  />
                  <p className="mt-2 text-[0.62rem] text-white/42">
                    Windows enforced
                  </p>
                </div>
                <div>
                  <FileCheck2
                    className="mx-auto size-4 text-[var(--home-lime)]"
                    aria-hidden
                  />
                  <p className="mt-2 text-[0.62rem] text-white/42">
                    Decisions audited
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
