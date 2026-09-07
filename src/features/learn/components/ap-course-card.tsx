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
  description?: string;
  namespace: string;
  icon?: ApCourseRegistryEntry["icon"];
  status?: "published" | "shipping" | "planned";
  minutes?: number | null;
  href?: string;
  className?: string;
  illustration?: ReactNode;
  actionLabel?: string;
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
  actionLabel,
}: ApCourseCardProps) {
  const Icon = (icon && ICONS[icon]) || BookOpen;
  const available = Boolean(href) && status !== "planned";
  const label =
    actionLabel ??
    (status === "planned"
      ? "Planned — not published"
      : status === "shipping"
        ? "Open course"
        : "Open course");

  return (
    <article
      className={cn(
        "flex h-full min-h-[21rem] w-full max-w-[18.75rem] flex-col overflow-hidden rounded-md border bg-learning-surface shadow-xs",
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
            <Icon aria-hidden className="size-8" style={{ color: "var(--course-accent)" }} />
          </div>
        )}
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
        {description ? (
          <p
            className="mt-1.5 line-clamp-2 text-xs font-semibold"
            style={{ color: "var(--course-muted)" }}
          >
            {description}
          </p>
        ) : (
          <p className="mt-1.5 text-xs font-semibold" style={{ color: "var(--course-muted)" }}>
            {minutes ? `${minutes} min · ${namespace}` : namespace}
          </p>
        )}
        <div className="mt-auto pt-3">
          {available && href ? (
            <Button asChild className="w-full">
              <Link href={href}>{label}</Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="w-full" disabled>
              {label}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
