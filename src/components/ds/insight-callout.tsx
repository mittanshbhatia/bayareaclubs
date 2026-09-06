import {
  AlertTriangle,
  Info,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type InsightTone = "info" | "tip" | "warning";

const toneConfig: Record<
  InsightTone,
  { icon: LucideIcon; classes: string }
> = {
  info: {
    icon: Info,
    classes: "border-info/25 bg-info-muted text-info",
  },
  tip: {
    icon: Lightbulb,
    classes: "border-accent/25 bg-accent-muted text-accent",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-warning/25 bg-warning-muted text-warning",
  },
};

type InsightCalloutProps = {
  title: string;
  children: React.ReactNode;
  tone?: InsightTone;
  className?: string;
};

export function InsightCallout({
  title,
  children,
  tone = "info",
  className,
}: InsightCalloutProps) {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <aside
      data-slot="insight-callout"
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3",
        config.classes,
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <div className="text-sm text-foreground/80">{children}</div>
      </div>
    </aside>
  );
}
