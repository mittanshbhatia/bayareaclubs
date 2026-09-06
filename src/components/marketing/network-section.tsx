"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  Lightbulb,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useRef } from "react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import { MotionReveal, SceneLabel } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const nodes = [
  { label: "School", icon: Building2, x: 400, y: 235, primary: true },
  { label: "Clubs", icon: UsersRound, x: 220, y: 135, primary: false },
  { label: "Students", icon: UsersRound, x: 610, y: 110, primary: false },
  { label: "Events", icon: CalendarDays, x: 705, y: 320, primary: false },
  { label: "Learning", icon: BookOpen, x: 480, y: 410, primary: false },
  { label: "Highlights", icon: Sparkles, x: 160, y: 365, primary: false },
  { label: "New ideas", icon: Lightbulb, x: 75, y: 205, primary: false },
] as const;

const connections = [
  [400, 235, 220, 135],
  [400, 235, 610, 110],
  [400, 235, 705, 320],
  [400, 235, 480, 410],
  [220, 135, 75, 205],
  [220, 135, 160, 365],
  [160, 365, 480, 410],
  [480, 410, 705, 320],
] as const;

export function NetworkSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="network"
      className={cn(
        styles.scene,
        styles.networkGrid,
        "py-24 text-white sm:py-32 lg:py-40",
      )}
    >
      <PageContainer size="xl" className="relative">
        <MotionReveal className="mx-auto max-w-4xl text-center">
          <SceneLabel dark>08 · Community network</SceneLabel>
          <h2
            className={cn(styles.sectionDisplay, "mx-auto mt-5 text-balance")}
          >
            Every club makes the community more useful.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/56 sm:text-lg">
            Schools, clubs, events, learning, and new ideas become a connected
            context—not a public directory of students.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.1} className="relative mx-auto mt-10 max-w-5xl">
          <svg
            viewBox="0 0 800 500"
            className="w-full overflow-visible"
            role="img"
            aria-label="Conceptual network connecting a school to clubs, events, learning, highlights, and new ideas"
          >
            <defs>
              <radialGradient id="nodeGlow">
                <stop offset="0%" stopColor="rgba(102,92,255,.45)" />
                <stop offset="100%" stopColor="rgba(102,92,255,0)" />
              </radialGradient>
            </defs>
            <circle
              cx="400"
              cy="250"
              r="210"
              fill="url(#nodeGlow)"
              opacity=".4"
            />
            {connections.map(([x1, y1, x2, y2], index) => {
              const path = `M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
              return (
                <g key={path}>
                  <motion.path
                    d={path}
                    className={styles.connector}
                    stroke="rgba(132,205,255,.32)"
                    initial={reduced ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: reduced ? 0 : 1.2,
                      delay: index * 0.1,
                    }}
                  />
                  {!reduced ? (
                    <motion.circle
                      r="3.5"
                      fill="var(--home-cyan)"
                      className={styles.signal}
                      style={{ offsetPath: `path("${path}")` }}
                      animate={
                        inView
                          ? { offsetDistance: ["0%", "100%"] }
                          : { offsetDistance: "0%" }
                      }
                      transition={{
                        duration: 2.4 + index * 0.12,
                        repeat: inView ? Infinity : 0,
                        ease: "linear",
                        delay: index * 0.2,
                      }}
                    />
                  ) : null}
                </g>
              );
            })}
            {nodes.map((node, index) => (
              <motion.g
                key={node.label}
                initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 230,
                  damping: 20,
                  delay: reduced ? 0 : 0.25 + index * 0.09,
                }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.primary ? 47 : 34}
                  fill={node.primary ? "#665cff" : "#121a38"}
                  stroke={node.primary ? "#9de8ff" : "rgba(255,255,255,.18)"}
                  strokeWidth="1.5"
                />
                <foreignObject
                  x={node.x - 14}
                  y={node.y - 14}
                  width="28"
                  height="28"
                >
                  <node.icon
                    aria-hidden
                    className="size-7 text-white"
                    strokeWidth={1.5}
                  />
                </foreignObject>
                <text
                  x={node.x}
                  y={node.y + (node.primary ? 70 : 55)}
                  textAnchor="middle"
                  fill="rgba(255,255,255,.62)"
                  fontSize="13"
                  fontFamily="var(--font-plus-jakarta)"
                  fontWeight="600"
                >
                  {node.label}
                </text>
              </motion.g>
            ))}
          </svg>
          <ul className="sr-only">
            {nodes.map((node) => (
              <li key={node.label}>{node.label}</li>
            ))}
          </ul>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
