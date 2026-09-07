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
}: ApCourseCardProps) {
  const Icon = (icon && ICONS[icon]) || BookOpen;
  const available = Boolean(href) && status !== "planned";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border bg-learning-surface p-5 shadow-xs",
        "border-(--course-border)",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-md"
          style={{
            background: "color-mix(in srgb, var(--course-accent) 14%, transparent)",
            color: "var(--course-accent)",
          }}
        >
          <Icon aria-hidden className="size-5" />
        </div>
        <StatusBadge
          status={
            status === "published" ? "approved" : status === "shipping" ? "pending" : "draft"
          }
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{title}</h3>
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
    </article>
  );
}
