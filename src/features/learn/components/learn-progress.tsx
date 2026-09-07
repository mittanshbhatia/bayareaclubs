import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";

export function LearnProgressBar({
  value,
  max,
  className,
  label,
  layout = "stack",
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
  layout?: "stack" | "inline";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const track = (
    <div
      className={cn(
        "overflow-hidden rounded-full border",
        layout === "inline" ? "h-1.5 min-w-0 flex-1" : "h-1.5 w-full",
      )}
      style={{
        background: pct > 0 ? "var(--progress-track)" : "var(--learning-surface)",
        borderColor: "var(--progress-track-border)",
      }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Course progress"}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: pct > 0 ? "var(--progress-fill)" : "transparent",
        }}
      />
    </div>
  );

  if (layout === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {label ? (
          <p
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold"
            style={{ color: "var(--course-muted)" }}
          >
            <Zap aria-hidden className="size-3" />
            {label}
          </p>
        ) : null}
        {track}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <p className="text-xs font-semibold" style={{ color: "var(--course-muted)" }}>
          {label}
        </p>
      ) : null}
      {track}
    </div>
  );
}

export function LearnProgressChip({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center rounded-md border px-3 text-xs font-semibold",
        "border-(--course-border) bg-learning-surface",
        className,
      )}
      style={{ color: "var(--course-muted)" }}
    >
      {children}
    </span>
  );
}
