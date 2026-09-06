import { CalendarDays, GraduationCap, ImageIcon, Users } from "lucide-react";
import Link from "next/link";

import { StatusBadge, type StatusKey } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaCardProps = {
  title: string;
  meta?: string;
  aspect?: "video" | "square";
  className?: string;
};

export function MediaCard({
  title,
  meta,
  aspect = "video",
  className,
}: MediaCardProps) {
  return (
    <article
      data-slot="media-card"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface shadow-xs",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-surface-muted text-muted-foreground",
          aspect === "video" ? "aspect-video" : "aspect-square",
        )}
      >
        <ImageIcon aria-hidden className="size-8 opacity-60" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {meta ? (
          <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        ) : null}
      </div>
    </article>
  );
}

type CourseCardProps = {
  title: string;
  provider: string;
  duration: string;
  level: string;
  className?: string;
  href?: string;
  actionLabel?: string;
};

export function CourseCard({
  title,
  provider,
  duration,
  level,
  className,
  href,
  actionLabel = "View course",
}: CourseCardProps) {
  return (
    <article
      data-slot="course-card"
      className={cn(
        "flex flex-col rounded-lg border border-border bg-surface p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-accent-muted text-accent">
        <GraduationCap aria-hidden className="size-5" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{provider}</p>
      <dl className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div>
          <dt className="sr-only">Duration</dt>
          <dd>{duration}</dd>
        </div>
        <div>
          <dt className="sr-only">Level</dt>
          <dd>{level}</dd>
        </div>
      </dl>
      {href ? (
        <Button asChild className="mt-5 w-full" variant="outline">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : (
        <p className="mt-5 text-xs text-muted-foreground">
          Available after sign-in inside your club dashboard.
        </p>
      )}
    </article>
  );
}

type EventCardProps = {
  title: string;
  when: string;
  where: string;
  status?: StatusKey;
  className?: string;
  href?: string;
};

export function EventCard({
  title,
  when,
  where,
  status = "active",
  className,
  href,
}: EventCardProps) {
  return (
    <article
      data-slot="event-card"
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-primary-muted text-primary">
          <CalendarDays aria-hidden className="size-5" />
        </div>
        <StatusBadge status={status} />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{when}</p>
      <p className="mt-1 text-sm text-muted-foreground">{where}</p>
      {href ? (
        <Button asChild className="mt-5" size="sm">
          <Link href={href}>RSVP</Link>
        </Button>
      ) : null}
    </article>
  );
}

type ClubCardProps = {
  name: string;
  school: string;
  members: number;
  category: string;
  status?: StatusKey;
  className?: string;
  href?: string;
};

export function ClubCard({
  name,
  school,
  members,
  category,
  status = "active",
  className,
  href,
}: ClubCardProps) {
  return (
    <article
      data-slot="club-card"
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Users aria-hidden className="size-5" />
        </div>
        <StatusBadge status={status} />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{school}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{members} members</span>
        <span aria-hidden>·</span>
        <span>{category}</span>
      </div>
      {href ? (
        <Button asChild className="mt-5 w-full" variant="outline">
          <Link href={href}>Open club</Link>
        </Button>
      ) : null}
    </article>
  );
}
