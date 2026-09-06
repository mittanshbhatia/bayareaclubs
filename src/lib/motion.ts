"use client";

import { motionDurations, motionEasings } from "@/lib/design-tokens";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Motion transition that collapses to zero duration when reduced-motion is on. */
export function dsTransition(
  duration: keyof typeof motionDurations = "base",
  ease: keyof typeof motionEasings = "standard",
) {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  return {
    duration: motionDurations[duration] / 1000,
    ease: motionEasings[ease],
  };
}

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};
