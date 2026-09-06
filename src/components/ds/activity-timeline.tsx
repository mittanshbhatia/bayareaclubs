import { cn } from "@/lib/utils";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
};

type ActivityTimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <ol
      data-slot="activity-timeline"
      className={cn("relative space-y-0", className)}
    >
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < items.length - 1 ? (
            <span
              aria-hidden
              className="absolute top-3 left-[0.6875rem] h-[calc(100%-0.5rem)] w-px bg-border"
            />
          ) : null}
          <span
            aria-hidden
            className="relative z-[1] mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary bg-surface"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-foreground">{item.title}</p>
              <time className="font-mono text-xs text-muted-foreground">
                {item.timestamp}
              </time>
            </div>
            {item.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.actor ? (
              <p className="mt-1 text-xs text-muted-foreground">
                by {item.actor}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
