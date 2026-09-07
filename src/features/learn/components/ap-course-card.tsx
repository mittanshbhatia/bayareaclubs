import {
  Atom,
  Binary,
  BookOpen,
  Brain,
  Calculator,
  Code2,
  FlaskConical,
  Leaf,
  Sigma,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { COURSE_CARD_MEASURE } from "@/features/learn/components/course-card-art";
import { LearnProgressChip } from "@/features/learn/components/learn-progress";
import type { ApCourseRegistryEntry } from "@/features/learn/courses/registry";
import { cn } from "@/lib/utils";

const ICONS = {
  binary: Binary,
  code: Code2,
  calculator: Calculator,
  sigma: Sigma,
  atom: Atom,
  flask: FlaskConical,
  leaf: Leaf,
  brain: Brain,
} as const;

type ApCourseCardProps = {
  title: string;
  description: string;
  namespace: string;
  icon?: ApCourseRegistryEntry["icon"];
  status?: "published" | "shipping" | "planned";
  minutes?: number | null;
  href?: string;
  className?: string;
  illustration?: ReactNode;
};

export const CATALOG_GRID_CLASS =
  "grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18.75rem,1fr))]";

export function ApCourseCard({
  title,
  description,
  namespace,
  icon,
  status = "planned",
  minutes,
  href,
  className,
  illustration,
}: ApCourseCardProps) {
  const Icon = (icon && ICONS[icon]) || BookOpen;
  const available = Boolean(href) && status !== "planned";

  return (
    <article
      className={cn(
        "flex h-full min-h-[21rem] flex-col overflow-hidden rounded-md border bg-learning-surface shadow-xs",
        "border-(--course-border) motion-safe:transition-shadow motion-safe:duration-200",
        "hover:shadow-sm",
        className,
      )}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: COURSE_CARD_MEASURE.mediaCssHeight,
          background: "color-mix(in srgb, var(--course-accent) 12%, var(--learning-surface))",
        }}
      >
        {illustration ?? (
          <div className="flex size-full items-center justify-center">
            <div
              className="flex size-12 items-center justify-center rounded-md"
              style={{
                background: "color-mix(in srgb, var(--course-accent) 18%, transparent)",
                color: "var(--course-accent)",
              }}
            >
              <Icon aria-hidden className="size-6" />
            </div>
          </div>
        )}
        <div className="absolute top-1 left-1 flex size-28 items-center justify-start p-2">
          <div
            className="flex size-16 items-center justify-center rounded-md bg-learning-surface shadow-xs"
            style={{ color: "var(--course-accent)" }}
          >
            <Icon aria-hidden className="size-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-extrabold tracking-tight">{title}</h3>
          <StatusBadge
            status={
              status === "published" ? "approved" : status === "shipping" ? "pending" : "draft"
            }
          />
        </div>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: "var(--course-muted)" }}>
          {description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LearnProgressChip>{namespace}</LearnProgressChip>
          {minutes ? <LearnProgressChip>{`${minutes} min`}</LearnProgressChip> : null}
        </div>
        <div className="mt-auto pt-3">
          {available && href ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href={href}>Open course</Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled>
              {status === "shipping" ? "Lessons arriving soon" : "Planned — not published"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
