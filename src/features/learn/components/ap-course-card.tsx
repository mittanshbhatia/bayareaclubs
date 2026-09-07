import { BookOpen, GraduationCap, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { LearnProgressBar } from "@/features/learn/components/learn-progress";
import type { ApCourseRegistryEntry } from "@/features/learn/courses/registry";
import { cn } from "@/lib/utils";

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
  unitCount?: number;
  moduleCount?: number;
  progressPercent?: number;
  statusChip?: "beta" | "preview" | null;
};

export const CATALOG_GRID_CLASS =
  "grid grid-cols-1 gap-[var(--catalog-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function StatusChip({ chip }: { chip: "beta" | "preview" }) {
  return (
    <span
      className={cn(
        "absolute top-2 right-2 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase",
        chip === "beta" ? "bg-success" : "bg-warning",
      )}
    >
      {chip}
    </span>
  );
}

function InventoryPills({
  unitCount,
  moduleCount,
}: {
  unitCount: number;
  moduleCount: number;
}) {
  if (unitCount <= 0 && moduleCount <= 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {unitCount > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
          <BookOpen aria-hidden className="size-3" />
          {unitCount} units
        </span>
      ) : null}
      {moduleCount > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
          <Pencil aria-hidden className="size-3" />
          {moduleCount} modules
        </span>
      ) : null}
    </div>
  );
}

export function ApCourseCard({
  title,
  description,
  namespace,
  status = "planned",
  minutes,
  href,
  className,
  illustration,
  unitCount = 0,
  moduleCount = 0,
  progressPercent = 0,
  statusChip = null,
}: ApCourseCardProps) {
  const available = Boolean(href) && status !== "planned";
  const body = (
    <>
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "var(--course-media-height)",
          background:
            "color-mix(in srgb, var(--course-accent) 12%, var(--learning-surface))",
        }}
      >
        {illustration ?? (
          <div className="flex size-full items-center justify-center">
            <GraduationCap
              aria-hidden
              className="size-8"
              style={{ color: "var(--course-accent)" }}
            />
          </div>
        )}
        {statusChip ? <StatusChip chip={statusChip} /> : null}
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="flex items-start gap-2 text-sm font-semibold leading-5">
          <GraduationCap aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span className="line-clamp-1">{title}</span>
        </h3>
        {description ? (
          <p
            className="mt-1.5 line-clamp-2 text-sm"
            style={{ color: "var(--course-muted)" }}
          >
            {description}
          </p>
        ) : (
          <p
            className="mt-1.5 line-clamp-2 text-sm"
            style={{ color: "var(--course-muted)" }}
          >
            {minutes ? `${minutes} min · ${namespace}` : namespace}
          </p>
        )}
        <InventoryPills unitCount={unitCount} moduleCount={moduleCount} />
        <div className="mt-auto pt-3">
          <LearnProgressBar
            layout="inline"
            value={progressPercent}
            max={100}
            label={`${progressPercent}% Progress`}
          />
        </div>
      </div>
    </>
  );

  const cardClass = cn(
    "flex h-full min-h-[var(--course-card-min-height)] w-full flex-col overflow-hidden rounded-lg border bg-learning-surface shadow-sm",
    "border-(--course-border) motion-safe:transition-shadow motion-safe:duration-[var(--duration-fast)]",
    "hover:shadow-md motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
    className,
  );

  if (available && href) {
    return (
      <article data-slot="ap-course-card" className="h-full">
        <Link href={href} className={cardClass}>
          {body}
        </Link>
      </article>
    );
  }

  return (
    <article data-slot="ap-course-card" className={cn(cardClass, "opacity-90")}>
      {body}
      <p className="sr-only">Planned — not published</p>
    </article>
  );
}
