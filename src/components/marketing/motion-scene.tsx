"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";

export function MotionReveal({
  children,
  className,
  delay = 0,
  distance = 22,
  ...props
}: HTMLMotionProps<"div"> & {
  delay?: number;
  distance?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced ? false : { opacity: 0, y: distance, filter: "blur(5px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: reduced ? 0 : 0.88,
        delay: reduced ? 0 : delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : 0.11,
            delayChildren: reduced ? 0 : 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: reduced ? 0 : 0.72,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function useVisibleCycle(
  length: number,
  intervalMs: number,
): [number, (index: number) => void, RefObject<HTMLDivElement | null>] {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible || length < 2) return;
    const tick = () => {
      if (!document.hidden) {
        setActive((current) => (current + 1) % length);
      }
    };
    const timer = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, length, reduced, visible]);

  const choose = useCallback(
    (index: number) => setActive(Math.max(0, Math.min(index, length - 1))),
    [length],
  );

  return [active, choose, ref];
}

export function SceneLabel({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.17em] uppercase",
        dark ? "text-white" : "text-[var(--home-indigo)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          dark ? "bg-[var(--home-cyan)]" : "bg-[var(--home-indigo)]",
        )}
      />
      {children}
    </span>
  );
}
