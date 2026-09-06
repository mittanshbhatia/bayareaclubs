"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";

type CycleToken = symbol;

const cycleVisibility = new Map<CycleToken, number>();
const cycleSubscribers = new Set<() => void>();
let directedCycle: CycleToken | null = null;

function notifyCycleSubscribers() {
  cycleSubscribers.forEach((subscriber) => subscriber());
}

function selectDirectedCycle() {
  let next: CycleToken | null = null;
  let nextRatio = 0;

  cycleVisibility.forEach((ratio, token) => {
    if (ratio > nextRatio) {
      next = token;
      nextRatio = ratio;
    }
  });

  if (nextRatio < 0.18) next = null;
  if (next !== directedCycle) {
    directedCycle = next;
    notifyCycleSubscribers();
  }
}

function subscribeToDirectedCycle(subscriber: () => void) {
  cycleSubscribers.add(subscriber);
  return () => cycleSubscribers.delete(subscriber);
}

function getDirectedCycle() {
  return directedCycle;
}

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
      initial={reduced ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
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
  options: { loop?: boolean } = {},
): [number, (index: number) => void, RefObject<HTMLDivElement | null>] {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [token] = useState<CycleToken>(() => Symbol("home-cycle"));
  const activeToken = useSyncExternalStore(
    subscribeToDirectedCycle,
    getDirectedCycle,
    () => null,
  );
  const isDirected = activeToken === token;
  const loop = options.loop ?? true;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        cycleVisibility.set(
          token,
          entry?.isIntersecting ? entry.intersectionRatio : 0,
        );
        selectDirectedCycle();
      },
      { threshold: [0, 0.18, 0.35, 0.5, 0.7, 0.9, 1] },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cycleVisibility.delete(token);
      selectDirectedCycle();
    };
  }, [token]);

  useEffect(() => {
    if (reduced || !isDirected || length < 2) return;
    const remainingPause = pausedUntil - Date.now();
    if (remainingPause > 0) {
      const resumeTimer = window.setTimeout(
        () => setPausedUntil(0),
        remainingPause,
      );
      return () => window.clearTimeout(resumeTimer);
    }
    const tick = () => {
      if (!document.hidden) {
        setActive((current) =>
          loop ? (current + 1) % length : Math.min(current + 1, length - 1),
        );
      }
    };
    const timer = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isDirected, length, loop, pausedUntil, reduced]);

  const choose = useCallback(
    (index: number) => {
      setActive(Math.max(0, Math.min(index, length - 1)));
      setPausedUntil(Date.now() + 6500);
    },
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
