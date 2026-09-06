"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  Image,
  MapPin,
  QrCode,
  Send,
  UsersRound,
} from "lucide-react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  MotionReveal,
  SceneLabel,
  useVisibleCycle,
} from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const eventStages = [
  { label: "Create", icon: CalendarDays, status: "Draft created" },
  { label: "Details", icon: MapPin, status: "Date + location set" },
  { label: "Logistics", icon: ClipboardCheck, status: "Tasks assigned" },
  { label: "RSVPs", icon: Send, status: "36 responses" },
  { label: "Check-in", icon: QrCode, status: "Check-in open" },
  { label: "Attendance", icon: UsersRound, status: "32 present" },
  { label: "Highlight", icon: Image, status: "Story drafted" },
  { label: "Newsletter", icon: Send, status: "Ready to publish" },
] as const;

export function EventsSection() {
  const reduced = useReducedMotion();
  const [active, setActive, ref] = useVisibleCycle(eventStages.length, 1800);
  const stage = eventStages[active];
  const StageIcon = stage.icon;

  return (
    <section
      ref={ref}
      id="events"
      className={cn(
        styles.scene,
        "scroll-mt-20 overflow-hidden bg-[#071629] py-24 text-white sm:py-32 lg:py-40",
      )}
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgb(86_217_255_/_15%),transparent_62%)]"
      />
      <PageContainer size="xl" className="relative">
        <MotionReveal>
          <SceneLabel dark>04 · Events</SceneLabel>
          <div className="mt-5 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              From idea to unforgettable event.
            </h2>
            <p className="max-w-xl text-base leading-7 text-white/58 sm:text-lg">
              One event record carries the calendar, logistics, responses,
              check-in, attendance, and story afterward.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-[#8ddfff]/15 bg-[#0a2038]/88 shadow-[0_40px_110px_rgb(0_0_0_/_45%)]">
            <div className="border-b border-white/10 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="font-display text-lg font-semibold">
                  Bay Area Student Robotics Workshop
                </p>
                <p className="mt-1 font-mono text-[0.58rem] tracking-[0.12em] text-white/40 uppercase">
                  Demonstration event · synthetic details
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--home-cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--home-cyan)] sm:mt-0">
                <span className="size-1.5 rounded-full bg-current" />
                {stage.status}
              </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_0.72fr]">
              <div className="border-b border-white/10 p-5 sm:p-8 lg:border-r lg:border-b-0">
                <div
                  className={cn(
                    styles.eventTrack,
                    "grid grid-cols-4 gap-y-6 sm:grid-cols-8",
                  )}
                >
                  {eventStages.map((item, index) => {
                    const Icon = item.icon;
                    const reached = index <= active;
                    return (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => setActive(index)}
                        className="relative z-10 flex min-w-0 flex-col items-center gap-2 text-center"
                        aria-label={item.label}
                        aria-current={index === active ? "step" : undefined}
                      >
                        <motion.span
                          animate={{
                            scale: index === active && !reduced ? 1.14 : 1,
                            backgroundColor: reached
                              ? "var(--home-cyan)"
                              : "rgba(255,255,255,.08)",
                            color: reached
                              ? "#071629"
                              : "rgba(255,255,255,.48)",
                          }}
                          className="flex size-11 items-center justify-center rounded-full border border-white/10"
                        >
                          <Icon className="size-4" aria-hidden />
                        </motion.span>
                        <span className="hidden text-[0.62rem] font-semibold text-white/50 sm:block">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.label}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                    className="mt-10 min-h-[18rem] rounded-xl border border-white/10 bg-[#07192c] p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--home-cyan)]/10 text-[var(--home-cyan)]">
                        <StageIcon className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] text-white/36 uppercase">
                        Step {active + 1} / {eventStages.length}
                      </span>
                    </div>

                    {active < 3 ? (
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <EventDetail
                          icon={CalendarDays}
                          label="Date"
                          value={active >= 1 ? "October 18" : "Add date"}
                          ready={active >= 1}
                        />
                        <EventDetail
                          icon={Clock3}
                          label="Time"
                          value={active >= 1 ? "10:00 AM–2:30 PM" : "Add time"}
                          ready={active >= 1}
                        />
                        <EventDetail
                          icon={MapPin}
                          label="Location"
                          value={
                            active >= 1 ? "School maker lab" : "Add location"
                          }
                          ready={active >= 1}
                        />
                        <EventDetail
                          icon={ClipboardCheck}
                          label="Logistics"
                          value={
                            active >= 2 ? "6 of 6 assigned" : "Assign owners"
                          }
                          ready={active >= 2}
                        />
                      </div>
                    ) : active < 5 ? (
                      <div className="mt-7 grid gap-5 sm:grid-cols-[1fr_11rem] sm:items-center">
                        <div>
                          <p className="text-sm text-white/48">RSVP response</p>
                          <p className="font-display mt-2 text-5xl font-semibold">
                            {active === 3 ? "36" : "41"}
                          </p>
                          <p className="mt-2 text-sm text-white/48">
                            Capacity 60 · waitlist enabled
                          </p>
                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                            <motion.div
                              initial={false}
                              animate={{ width: active === 3 ? "60%" : "68%" }}
                              className="h-full rounded-full bg-[var(--home-cyan)]"
                            />
                          </div>
                        </div>
                        <div
                          className={cn(
                            styles.qr,
                            "aspect-square rounded-xl bg-white p-4 text-[#071629]",
                          )}
                          aria-label="Demonstration check-in code"
                        />
                      </div>
                    ) : (
                      <div className="mt-7">
                        <p className="text-sm text-white/48">
                          Event context after check-in
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          {["32 present", "4 excused", "Media reviewed"].map(
                            (item, index) => (
                              <motion.span
                                key={item}
                                initial={reduced ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: reduced ? 0 : index * 0.08,
                                }}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
                              >
                                {item}
                              </motion.span>
                            ),
                          )}
                        </div>
                        <p className="font-display mt-7 max-w-lg text-2xl font-semibold">
                          {active === 5
                            ? "Attendance is already connected."
                            : active === 6
                              ? "A consent-aware highlight is ready."
                              : "The story can move into the next newsletter."}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] text-white/38 uppercase">
                    Logistics pulse
                  </p>
                  <ul className="mt-5 space-y-4">
                    {[
                      "Venue approved",
                      "Equipment assigned",
                      "Accessibility reviewed",
                      "Volunteer briefing ready",
                    ].map((item, index) => (
                      <li
                        key={item}
                        className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 text-sm"
                      >
                        <span
                          className={
                            index <= active ? "text-white" : "text-white/38"
                          }
                        >
                          {item}
                        </span>
                        <motion.span
                          animate={{
                            scale: index <= active ? 1 : 0.7,
                            opacity: index <= active ? 1 : 0.2,
                          }}
                          className="flex size-6 items-center justify-center rounded-full bg-[var(--home-lime)] text-[#102000]"
                        >
                          <Check className="size-3" aria-hidden />
                        </motion.span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-10 text-sm leading-6 text-white/46">
                  The interface shown here is a product demonstration. It uses
                  no real student identities or event records.
                </p>
              </div>
            </div>
          </div>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}

function EventDetail({
  icon: Icon,
  label,
  value,
  ready,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <motion.div
      animate={{
        borderColor: ready
          ? "rgba(86,217,255,.28)"
          : "rgba(255,255,255,.12)",
      }}
      className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/4 p-3"
    >
      <Icon className="size-4 text-[var(--home-cyan)]" aria-hidden />
      <div>
        <p className="text-[0.62rem] text-white/38">{label}</p>
        <p className="mt-0.5 text-xs font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
