"use client";

import { motion, useReducedMotion } from "motion/react";

const bridgePath =
  "M0 42 H260 C330 42 330 74 400 74 H690 C750 74 750 26 820 26 H1110 C1180 26 1180 58 1245 58 H1440";

export function SceneBridge({
  from,
  to,
  accent,
  label,
  spacious = false,
}: {
  from: string;
  to: string;
  accent: string;
  label?: string;
  spacious?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={
        spacious
          ? "relative h-32 overflow-hidden sm:h-44"
          : "relative h-20 overflow-hidden sm:h-24"
      }
      style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={bridgePath}
          fill="none"
          stroke={accent}
          strokeOpacity=".13"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d={bridgePath}
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.72 }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{
            duration: reduced ? 0 : 1.15,
            ease: [0.2, 0.8, 0.2, 1],
          }}
        />
        {!reduced ? (
          <motion.circle
            r="3"
            fill={accent}
            style={{ offsetPath: `path("${bridgePath}")` }}
            initial={{ offsetDistance: "0%", opacity: 0 }}
            whileInView={{
              offsetDistance: "100%",
              opacity: [0, 1, 1, 0],
            }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
          />
        ) : null}
      </svg>
      {label ? (
        <motion.span
          initial={reduced ? false : { opacity: 0, y: 7 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{
            duration: reduced ? 0 : 0.6,
            delay: reduced ? 0 : 0.28,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/14 bg-black/25 px-3 py-1 font-mono text-[0.56rem] font-bold tracking-[0.13em] whitespace-nowrap text-white/78 uppercase backdrop-blur-md"
        >
          {label}
        </motion.span>
      ) : null}
    </div>
  );
}
