import Link from "next/link";
import { CalendarDays, GraduationCap, Lightbulb } from "lucide-react";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import type { MyDayItem } from "@/features/dashboard/personal";

const kindIcon = {
  event: CalendarDays,
  idea: Lightbulb,
  learning: GraduationCap,
} as const;

export function PersonalMyDay({ items }: { items: MyDayItem[] }) {
  return (
    <section id="my-day" aria-labelledby="my-day-heading" className="border-t pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="my-day-heading" className="font-semibold">
            My Day
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Next items from your RSVPs, club events, ideas, and STEM progress.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          className="mt-4"
          compact
          title="Nothing next right now"
          description="Upcoming RSVPs, club events you can see, ideas that need a response, and your next STEM lesson appear here."
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const Icon = kindIcon[item.kind];
            return (
              <li key={item.id}>
                <article className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-muted text-primary">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                  {item.href ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={item.href}>Open</Link>
                    </Button>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
