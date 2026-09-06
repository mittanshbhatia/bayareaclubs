"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  ArrowLeft,
  Check,
  CircleDot,
  FileText,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import { SceneLabel } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const scenes = [
  {
    label: "Draft",
    title: "Give the idea a shape.",
    copy: "A guided workspace captures the mission, school context, and intended community.",
    status: "Draft",
  },
  {
    label: "Details",
    title: "Context fills in around it.",
    copy: "Activities, meeting cadence, advisor, and proposed officers join the same living record.",
    status: "Draft complete",
  },
  {
    label: "Submit",
    title: "Move forward without losing context.",
    copy: "The application enters the school review path with a precise, time-stamped state.",
    status: "Submitted",
  },
  {
    label: "Review",
    title: "The right reviewer sees the right details.",
    copy: "Comments attach to the proposal while private reviewer notes remain protected.",
    status: "Under review",
  },
  {
    label: "Changes",
    title: "Feedback finds its way back.",
    copy: "Requested changes return to the student as a clear task—not an ambiguous rejection.",
    status: "Changes requested",
  },
  {
    label: "Revise",
    title: "The student improves one shared record.",
    copy: "The mission and activity plan update while earlier decisions remain auditable.",
    status: "Resubmitted",
  },
  {
    label: "Approve",
    title: "Approval becomes a real system event.",
    copy: "A recorded decision unlocks club creation. Nothing depends on a hidden spreadsheet.",
    status: "Approved",
  },
  {
    label: "Launch",
    title: "The application becomes a club.",
    copy: "The approved idea transforms into an operating space for members, meetings, and events.",
    status: "Club active",
  },
] as const;

export function LifecycleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced || window.matchMedia("(max-width: 1023px)").matches) return;
    setActive(
      Math.min(scenes.length - 1, Math.floor(progress * scenes.length)),
    );
  });

  const scene = scenes[active];
  const isClub = active === scenes.length - 1;

  return (
    <section
      ref={sectionRef}
      id="idea-story"
      className={cn(
        styles.scene,
        styles.paperScene,
        styles.storyTrack,
        "scroll-mt-20",
      )}
    >
      <div className={styles.storySticky}>
        <PageContainer
          size="xl"
          className="grid gap-10 py-20 lg:grid-cols-[0.74fr_1.26fr] lg:items-center lg:gap-16"
        >
          <div className="relative lg:pl-10">
            <div className="hidden lg:block">
              <div className={styles.storyRail} aria-hidden>
                <motion.div
                  className={styles.storyRailProgress}
                  style={{
                    height: "100%",
                    scaleY: reduced ? 1 : scrollYProgress,
                  }}
                />
              </div>
            </div>
            <SceneLabel>01 · Idea to club</SceneLabel>
            <h2 className={cn(styles.sectionDisplay, "mt-5 text-balance")}>
              An idea shouldn&apos;t get lost in a form.
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.label}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduced ? 0 : 0.34 }}
                className="mt-7"
              >
                <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {scene.title}
                </p>
                <p className="mt-3 max-w-lg leading-7 text-[var(--home-muted)]">
                  {scene.copy}
                </p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-8 flex scrollbar-none gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {scenes.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "min-h-10 border-b-2 px-1 text-xs font-semibold whitespace-nowrap transition-colors",
                      index === active
                        ? "border-[var(--home-indigo)] text-[var(--home-ink)]"
                        : "border-transparent text-[var(--home-muted)] hover:text-[var(--home-ink)]",
                    )}
                    aria-current={index === active ? "step" : undefined}
                  >
                    {String(index + 1).padStart(2, "0")} {item.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full bg-[var(--home-violet)]/10 blur-3xl"
            />
            <div
              className={cn(
                styles.lightSurface,
                "relative min-h-[34rem] overflow-hidden rounded-2xl",
              )}
            >
              <div className="flex items-center justify-between border-b border-[#202744]/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--home-indigo)] text-white">
                    {isClub ? (
                      <Sparkles className="size-4" aria-hidden />
                    ) : (
                      <FileText className="size-4" aria-hidden />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {isClub ? "Robotics Builders" : "Club application"}
                    </p>
                    <p className="text-xs text-[var(--home-muted)]">
                      Product workflow demonstration
                    </p>
                  </div>
                </div>
                <motion.span
                  key={scene.status}
                  initial={reduced ? false : { opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-[0.62rem] font-bold tracking-wide uppercase",
                    active >= 6
                      ? "bg-[#dff8ca] text-[#27530d]"
                      : active === 4
                        ? "bg-[#ffe4dc] text-[#873523]"
                        : "bg-[#eceaff] text-[#4338b8]",
                  )}
                >
                  {scene.status}
                </motion.span>
              </div>

              <div className="relative p-5 sm:p-7">
                <AnimatePresence mode="popLayout">
                  {!isClub ? (
                    <motion.div
                      key="application"
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        reduced
                          ? undefined
                          : { opacity: 0, scale: 0.94, filter: "blur(7px)" }
                      }
                      className="grid gap-5 sm:grid-cols-[1.15fr_0.85fr]"
                    >
                      <div className="space-y-4">
                        <DemoField
                          label="Club idea"
                          value="Robotics Builders"
                          complete
                        />
                        <DemoField
                          label="Mission"
                          value={
                            active >= 5
                              ? "Make hands-on robotics welcoming to every beginner."
                              : "Build robots together and learn engineering."
                          }
                          complete={active >= 1}
                          emphasized={active === 5}
                        />
                        <DemoField
                          label="Expected activities"
                          value="Build nights · workshops · community showcase"
                          complete={active >= 1}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <DemoField
                            label="Advisor"
                            value="Confirmed"
                            complete={active >= 1}
                          />
                          <DemoField
                            label="Cadence"
                            value="Weekly"
                            complete={active >= 1}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-[#202744]/10 bg-[#f3f3fa] p-4">
                          <p className="font-mono text-[0.62rem] font-bold tracking-[0.14em] text-[var(--home-muted)] uppercase">
                            Workflow
                          </p>
                          <ol className="mt-4 space-y-3">
                            {[
                              "Student",
                              "School review",
                              "Committee",
                              "Club",
                            ].map((label, index) => (
                              <li
                                key={label}
                                className="flex items-center gap-3 text-xs font-semibold"
                              >
                                <span
                                  className={cn(
                                    "flex size-6 items-center justify-center rounded-full border",
                                    index <= Math.min(active, 3)
                                      ? "border-[var(--home-indigo)] bg-[var(--home-indigo)] text-white"
                                      : "border-[#202744]/15 bg-white text-[var(--home-muted)]",
                                  )}
                                >
                                  {index < Math.min(active, 3) ? (
                                    <Check className="size-3" aria-hidden />
                                  ) : (
                                    index + 1
                                  )}
                                </span>
                                {label}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {active >= 3 ? (
                          <motion.div
                            initial={reduced ? false : { opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              "rounded-xl border p-4",
                              active === 4
                                ? "border-[var(--home-coral)]/40 bg-[#fff4ef]"
                                : "border-[var(--home-indigo)]/20 bg-[#f1efff]",
                            )}
                          >
                            <MessageSquareText
                              className="size-4 text-[var(--home-indigo)]"
                              aria-hidden
                            />
                            <p className="mt-3 text-xs font-semibold">
                              Reviewer feedback
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[var(--home-muted)]">
                              Add an accessible beginner pathway and clarify the
                              first semester activity plan.
                            </p>
                            {active === 4 ? (
                              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#873523]">
                                <ArrowLeft className="size-3" aria-hidden />
                                Returned with context
                              </span>
                            ) : null}
                          </motion.div>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="club"
                      initial={
                        reduced
                          ? false
                          : { opacity: 0, scale: 0.94, filter: "blur(7px)" }
                      }
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: reduced ? 0 : 0.62 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--home-indigo)] text-white shadow-lg">
                          <Sparkles className="size-5" aria-hidden />
                        </span>
                        <div>
                          <p className="font-display text-2xl font-semibold">
                            Robotics Builders
                          </p>
                          <p className="text-sm text-[var(--home-muted)]">
                            Approved idea · active club workspace
                          </p>
                        </div>
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          ["Members", "Invite"],
                          ["Meetings", "Plan"],
                          ["Events", "Create"],
                          ["Charter", "Ready"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="border-t border-[#202744]/12 pt-3"
                          >
                            <p className="text-xs text-[var(--home-muted)]">
                              {label}
                            </p>
                            <p className="mt-1 font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 flex items-center gap-3 rounded-xl bg-[#f0efff] p-4">
                        <CircleDot
                          className="size-5 text-[var(--home-indigo)]"
                          aria-hidden
                        />
                        <p className="text-sm">
                          The original application remains connected to every
                          downstream decision.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </section>
  );
}

function DemoField({
  label,
  value,
  complete,
  emphasized = false,
}: {
  label: string;
  value: string;
  complete: boolean;
  emphasized?: boolean;
}) {
  return (
    <motion.div
      animate={{
        borderColor: emphasized ? "var(--home-indigo)" : "rgba(32,39,68,.12)",
      }}
      className={cn(
        "rounded-lg border bg-white p-3.5",
        complete ? "text-[var(--home-ink)]" : "text-[var(--home-muted)]",
      )}
    >
      <p className="text-[0.65rem] font-semibold text-[var(--home-muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium">{complete ? value : "—"}</p>
    </motion.div>
  );
}
