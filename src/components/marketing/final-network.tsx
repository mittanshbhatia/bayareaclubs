"use client";

import { motion, useReducedMotion } from "motion/react";
import { Lightbulb, Sparkles, UsersRound } from "lucide-react";

export function FinalNetwork() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative mx-auto h-64 w-full max-w-3xl"
      aria-label="A new club idea joining the community network"
    >
      <svg
        aria-hidden
        viewBox="0 0 720 250"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.path
          d="M100 125 C230 125 260 78 360 78 S510 155 620 125"
          fill="none"
          stroke="rgba(125,214,255,.3)"
          strokeWidth="1.5"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1.3 }}
        />
        <motion.circle
          r="4"
          fill="var(--home-cyan)"
          style={{
            offsetPath:
              'path("M100 125 C230 125 260 78 360 78 S510 155 620 125")',
          }}
          animate={reduced ? undefined : { offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {[
        { left: "8%", top: "42%", label: "New idea", icon: Lightbulb },
        { left: "47%", top: "22%", label: "Club", icon: Sparkles },
        { left: "83%", top: "42%", label: "Community", icon: UsersRound },
      ].map((node, index) => (
        <motion.div
          key={node.label}
          initial={reduced ? false : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 230,
            damping: 20,
            delay: reduced ? 0 : 0.3 + index * 0.28,
          }}
          className="absolute -translate-x-1/2 text-center"
          style={{ left: node.left, top: node.top }}
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/16 bg-white/8 text-[var(--home-cyan)] shadow-[0_0_40px_rgb(102_92_255_/_25%)] backdrop-blur">
            <node.icon className="size-5" aria-hidden />
          </span>
          <span className="mt-3 block font-mono text-[0.58rem] tracking-[0.13em] text-white/46 uppercase">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
