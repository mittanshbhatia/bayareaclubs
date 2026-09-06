"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  Code2,
  HeartHandshake,
  Microscope,
  Orbit,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  MotionReveal,
  SceneLabel,
  useVisibleCycle,
} from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const clubs = [
  {
    name: "Robotics Builders",
    topic: "robotics engineering",
    icon: Orbit,
    tone: "var(--home-cyan)",
    position: { left: "4%", top: "22%" },
    event: "Bay Area Student Robotics Workshop",
  },
  {
    name: "AI Research Club",
    topic: "artificial intelligence",
    icon: BrainCircuit,
    tone: "var(--home-violet)",
    position: { right: "7%", top: "8%" },
    event: "Model Lab",
  },
  {
    name: "Competitive Programming",
    topic: "coding algorithms",
    icon: Code2,
    tone: "var(--home-lime)",
    position: { right: "2%", top: "48%" },
    event: "Practice Sprint",
  },
  {
    name: "Physics Society",
    topic: "physics astronomy",
    icon: Atom,
    tone: "var(--home-coral)",
    position: { left: "31%", top: "3%" },
    event: "Physics Demo Night",
  },
  {
    name: "Biomedical Engineering",
    topic: "biology engineering",
    icon: Microscope,
    tone: "var(--home-violet)",
    position: { left: "35%", top: "61%" },
    event: "Design Studio",
  },
  {
    name: "Community Service",
    topic: "service community",
    icon: HeartHandshake,
    tone: "var(--home-coral)",
    position: { left: "3%", top: "62%" },
    event: "Community Build Day",
  },
] as const;

export function DiscoverySection() {
  const reduced = useReducedMotion();
  const [typingStep, , ref] = useVisibleCycle(15, 360);
  const [manualQuery, setManualQuery] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const demoQuery =
    typingStep < 10 ? "robotics".slice(0, typingStep) : "robotics";
  const query = manualQuery ?? (reduced ? "robotics" : demoQuery);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return clubs.map((_, index) => index);
    return clubs.flatMap((club, index) =>
      `${club.name} ${club.topic}`.toLowerCase().includes(normalized)
        ? [index]
        : [],
    );
  }, [query]);
  const selectedClub = clubs[selected];

  return (
    <section
      ref={ref}
      id="discover"
      className={cn(
        styles.scene,
        styles.blueScene,
        "scroll-mt-20 py-24 sm:py-32 lg:py-40",
      )}
    >
      <PageContainer size="xl">
        <MotionReveal>
          <SceneLabel dark>03 · Discovery network</SceneLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              Find your community.
            </h2>
            <div>
              <p className="max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                Search across interests, discover what is happening next, and
                understand a club before requesting to join.
              </p>
              <label className="relative mt-7 block max-w-xl">
                <span className="sr-only">Search demonstration clubs</span>
                <Search
                  aria-hidden
                  className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/48"
                />
                <input
                  value={query}
                  onChange={(event) => {
                    const nextQuery = event.target.value;
                    setManualQuery(nextQuery);
                    const matchIndex = clubs.findIndex((club) =>
                      `${club.name} ${club.topic}`
                        .toLowerCase()
                        .includes(nextQuery.toLowerCase()),
                    );
                    if (matchIndex >= 0) setSelected(matchIndex);
                  }}
                  placeholder="Search clubs and interests"
                  className="min-h-14 w-full rounded-xl border border-white/20 bg-white/10 pr-4 pl-11 text-base text-white shadow-xl backdrop-blur-md placeholder:text-white/42"
                />
                <span className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[0.58rem] tracking-[0.12em] text-white/42 uppercase">
                  Interactive demo
                </span>
              </label>
            </div>
          </div>
        </MotionReveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_19rem]">
          <div className={styles.discoveryUniverse}>
            <svg
              aria-hidden
              viewBox="0 0 920 620"
              className="absolute inset-0 hidden h-full w-full text-white/22 sm:block"
            >
              {[
                "M150 180 C310 130 400 90 500 120",
                "M500 120 C680 90 730 190 785 250",
                "M150 180 C250 330 330 405 470 450",
                "M470 450 C620 430 720 390 785 250",
                "M150 430 C260 410 330 430 470 450",
              ].map((path, index) => (
                <motion.path
                  key={path}
                  d={path}
                  className={styles.connector}
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduced ? 0 : 1.2,
                    delay: index * 0.12,
                  }}
                />
              ))}
            </svg>

            {clubs.map((club, index) => {
              const Icon = club.icon;
              const matched = matches.includes(index);
              const isSelected = selected === index;
              return (
                <motion.button
                  type="button"
                  key={club.name}
                  layout
                  onClick={() => setSelected(index)}
                  animate={{
                    opacity: matched ? 1 : 0.28,
                    scale: isSelected ? 1.07 : matched ? 1 : 0.94,
                    zIndex: isSelected ? 20 : 1,
                  }}
                  whileHover={reduced ? undefined : { y: -5, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={cn(
                    styles.clubNode,
                    "rounded-xl border p-4 text-left shadow-2xl backdrop-blur-md",
                    isSelected
                      ? "border-white/45 bg-white text-[var(--home-ink)]"
                      : "border-white/16 bg-[#171755]/72 text-white",
                  )}
                  style={club.position}
                  aria-pressed={isSelected}
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-lg"
                    style={{
                      color: club.tone,
                      background: `color-mix(in srgb, ${club.tone} 14%, transparent)`,
                    }}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-display mt-4 block text-base font-semibold">
                    {club.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-xs",
                      isSelected ? "text-[#656b7d]" : "text-white/48",
                    )}
                  >
                    Demonstration club
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.aside
              key={selectedClub.name}
              initial={reduced ? false : { opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -12 }}
              className="self-center rounded-2xl border border-white/18 bg-[#10133a]/88 p-5 shadow-2xl backdrop-blur-xl"
            >
              <p className="font-mono text-[0.6rem] tracking-[0.15em] text-[var(--home-cyan)] uppercase">
                Club in focus
              </p>
              <h3 className="font-display mt-4 text-2xl font-semibold">
                {selectedClub.name}
              </h3>
              <div className="mt-6 border-t border-white/12 pt-5">
                <p className="text-xs text-white/48">
                  Upcoming demonstration event
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {selectedClub.event}
                </p>
                <p className="mt-1 text-xs text-white/48">
                  Thursday · 4:15 PM · School maker lab
                </p>
              </div>
              <Link
                href="/sign-in?next=%2Fdashboard"
                className="group mt-7 flex min-h-11 w-full items-center justify-between rounded-lg bg-white px-4 text-sm font-semibold text-[var(--home-ink)]"
              >
                Sign in to request to join
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.aside>
          </AnimatePresence>
        </div>

        {matches.length === 0 ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-white/72">
            <Sparkles className="size-4" aria-hidden />
            No demonstration club matches yet. Try “robotics,” “physics,” or
            “service.”
          </p>
        ) : null}
      </PageContainer>
    </section>
  );
}
