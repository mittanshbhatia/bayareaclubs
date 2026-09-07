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
  description: string;
  namespace: string;
  icon?: ApCourseRegistryEntry["icon"];
  status?: "published" | "shipping" | "planned";
  minutes?: number | null;
  href?: string;
  className?: string;
  illustration?: ReactNode;
};

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
        "flex h-full flex-col overflow-hidden rounded-lg border bg-learning-surface shadow-xs",
        "border-(--course-border) motion-safe:transition-shadow motion-safe:duration-200",
        "hover:shadow-sm",
        className,
      )}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
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
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
          <StatusBadge
            status={
              status === "published" ? "approved" : status === "shipping" ? "pending" : "draft"
            }
          />
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--course-muted)" }}>
          {description}
        </p>
        <p className="mt-3 text-xs" style={{ color: "var(--course-muted)" }}>
          {namespace}
          {minutes ? ` · ${minutes} min` : ""}
        </p>
        <div className="mt-auto pt-5">
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
