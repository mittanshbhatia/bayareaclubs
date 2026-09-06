import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

export type StatDeltaTone = "up" | "down" | "neutral";

type StatDeltaProps = {
  value: string;
  tone?: StatDeltaTone;
  label?: string;
  className?: string;
};

const toneStyles: Record<StatDeltaTone, string> = {
  up: "bg-success-muted text-success",
  down: "bg-danger-muted text-danger",
  neutral: "bg-surface-muted text-muted-foreground",
};

const icons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
} as const;

export function StatDelta({
  value,
  tone = "neutral",
  label,
  className,
}: StatDeltaProps) {
  const Icon = icons[tone];
  const accessible = label ?? `${tone === "up" ? "Up" : tone === "down" ? "Down" : "Unchanged"} ${value}`;

  return (
    <span
      data-slot="stat-delta"
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      <span aria-hidden>{value}</span>
      <span className="sr-only">{accessible}</span>
    </span>
  );
}
