import { cn } from "@/lib/utils";

export function LearnProgressBar({
  value,
  max,
  className,
  label,
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <p className="text-xs font-semibold" style={{ color: "var(--course-muted)" }}>
          {label}
        </p>
      ) : null}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
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
