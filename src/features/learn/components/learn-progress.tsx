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
        "overflow-hidden rounded-full",
        layout === "inline" ? "h-1 min-w-0 flex-1" : "h-1.5 w-full",
      )}
      style={{ background: "var(--progress-track)" }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Course progress"}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: "var(--progress-fill)" }}
      />
    </div>
  );

  if (layout === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {label ? (
          <p
            className="shrink-0 text-xs font-medium"
            style={{ color: "var(--course-muted)" }}
          >
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
