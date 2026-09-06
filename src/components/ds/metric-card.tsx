import { cn } from "@/lib/utils";
import { StatDelta, type StatDeltaTone } from "@/components/ds/stat-delta";

type MetricCardProps = React.ComponentProps<"div"> & {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delta?: { value: string; tone?: StatDeltaTone; label?: string };
};

export function MetricCard({
  label,
  value,
  hint,
  delta,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      data-slot="metric-card"
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-xs",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {delta ? (
          <StatDelta value={delta.value} tone={delta.tone} label={delta.label} />
        ) : null}
      </div>
      {hint ? (
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
