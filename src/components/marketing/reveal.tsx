"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds; ignored when reduced motion is preferred. */
  delay?: number;
};

/**
 * Scroll-triggered fade/slide that collapses instantly under reduced-motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const visible = Boolean(reduceMotion) || revealed;

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        !reduceMotion &&
          "transition-[opacity,transform] duration-[var(--duration-slow)] ease-[var(--ease-standard)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      style={
        reduceMotion || !visible
          ? undefined
          : { transitionDelay: `${Math.max(0, delay) * 1000}ms` }
      }
    >
      {children}
    </div>
  );
}
