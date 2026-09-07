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
  "grid gap-[var(--catalog-gap)] [grid-template-columns:repeat(auto-fill,minmax(var(--course-card-width),1fr))]";

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
        "flex h-full min-h-[var(--course-card-min-height)] w-full max-w-[var(--course-card-width)] flex-col overflow-hidden rounded-lg border bg-learning-surface shadow-xs",
        "border-(--course-border) motion-safe:transition-shadow motion-safe:duration-200",
        "hover:shadow-sm",
        className,
      )}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "var(--course-media-height)",
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
          <h3 className="text-xs font-semibold leading-5">{title}</h3>
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
        <div className="mt-auto pt-2">
          {available && href ? (
            <Button asChild size="sm" className="w-full">
              <Link href={href}>{label}</Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" size="sm" className="w-full" disabled>
              {label}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
