"use client";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Kept for call-site compatibility; motion is CSS/reduced-motion friendly via layout. */
  delay?: number;
};

/** Static reveal wrapper — avoids SSR/client motion hydration mismatches. */
export function Reveal({ children, className }: RevealProps) {
  return <div className={cn(className)}>{children}</div>;
}
