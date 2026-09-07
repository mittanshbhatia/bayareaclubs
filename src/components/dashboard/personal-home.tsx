import Link from "next/link";
import { Bell, UsersRound } from "lucide-react";

import { PersonalMyDay } from "@/components/dashboard/personal-my-day";
import { RoleBadge, type RoleKey } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import {
  isClubOfficerRole,
  type PersonalHomeModel,
} from "@/features/dashboard/personal";
import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CatalogSectionHeader } from "@/features/learn/components/catalog-section-header";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import {
  catalogCardProgressPercent,
  catalogInventory,
} from "@/features/learn/catalog-inventory";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/validation/notifications";

function formatRole(role: string) {
  return role.replaceAll("_", " ");
}

function isRoleKey(role: string): role is RoleKey {
  return [
    "platform_admin",
    "committee_reviewer",
    "school_admin",
    "school_advisor",
    "club_admin",
    "president",
    "vice_president",
    "secretary",
    "treasurer",
    "officer",
    "advisor",
    "member",
    "user",
  ].includes(role);
}

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function learnNamespaceFromHref(href: string) {
  const match = href.match(/\/dashboard\/learn\/ap\/([^/?#]+)/);
  return match?.[1] ?? null;
}

export function PersonalHome({ model }: { model: PersonalHomeModel }) {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome, {model.displayName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Access is derived from active platform, school, and club assignments.
        </p>
        <p className="mt-3 text-sm">
          <span className="text-muted-foreground">Current context: </span>
          <span className="font-medium">{model.contextLabel}</span>
        </p>
        {model.schools.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {model.schools.map((school) => (
              <li
                key={school.id}
                className="rounded-md border border-border bg-surface-muted/40 px-2.5 py-1 text-xs"
              >
                {school.dashboardHref ? (
                  <Link
                    href={school.dashboardHref}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {school.name}
                  </Link>
                ) : (
                  <span className="font-medium">{school.name}</span>
                )}
                <span className="text-muted-foreground">
                  {" "}
                  · {formatRole(school.role)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {model.quickActions.length ? (
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="font-semibold">
            Quick actions
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {model.quickActions.map((action) => (
              <li key={action.id}>
                <Button
                  asChild
                  size="sm"
                  variant={action.id === "start-idea" ? "default" : "outline"}
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PersonalMyDay items={model.myDay} />

      <section id="clubs" aria-labelledby="my-clubs-heading" className="border-t pt-6">
        <div className="flex items-center gap-2">
          <UsersRound aria-hidden className="size-4 text-primary" />
          <h2 id="my-clubs-heading" className="font-semibold">
            My Clubs
          </h2>
        </div>
        {model.clubs.length ? (
          <ul className="mt-4 space-y-3">
            {model.clubs.map((club) => (
              <li
                key={`${club.id}-${club.role}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <div>
                  {club.href ? (
                    <Link
                      href={club.href}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {club.name}
                    </Link>
                  ) : (
                    <p className="font-medium">{club.name}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isClubOfficerRole(club.role)
                      ? "Club workspace"
                      : "My attendance"}
                  </p>
                </div>
                {isRoleKey(club.role) ? (
                  <RoleBadge role={club.role} />
                ) : (
                  <span className="text-sm capitalize text-muted-foreground">
                    {formatRole(club.role)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-4"
            compact
            title="No active club membership"
            description="When you join or start a club, it appears here with a working link to the workspace or your attendance."
            actionLabel="Start a club idea"
            actionHref="/start-a-club"
          />
        )}
      </section>

      <section
        id="learning"
        aria-labelledby="learning-heading"
        className="border-t pt-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <CatalogSectionHeader
            headingId="learning-heading"
            title="Courses"
            category="Your catalog"
          />
          <div className="flex flex-wrap gap-2">
            {model.learningLinks.map((link) => (
              <Button key={link.href} asChild size="sm" variant="outline">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        {model.learning.length ? (
          <div className={`mt-4 ${CATALOG_GRID_CLASS}`}>
            {model.learning.slice(0, 4).map((item) => {
              const namespace = learnNamespaceFromHref(item.href);
              const registry = namespace ? getRegistryEntry(namespace) : null;
              const inventory = namespace
                ? catalogInventory(namespace)
                : { unitCount: 0, moduleCount: 0 };
              if (item.kind === "ap" && namespace) {
                return (
                  <ApCourseCard
                    key={item.subscriptionId}
                    title={item.title}
                    description={
                      registry?.description ??
                      (item.nextLessonTitle ?? "Original AP course")
                    }
                    namespace={namespace}
                    status="shipping"
                    href={item.href}
                    illustration={<CourseCardArt namespace={namespace} />}
                    unitCount={inventory.unitCount}
                    moduleCount={inventory.moduleCount}
                    progressPercent={catalogCardProgressPercent({
                      attemptCount: item.completedCount,
                      moduleCount: inventory.moduleCount,
                    })}
                  />
                );
              }
              return (
                <ApCourseCard
                  key={item.subscriptionId}
                  title={item.title}
                  description={
                    item.nextLessonTitle
                      ? `Next: ${item.nextLessonTitle}`
                      : `${item.completedCount} lessons complete`
                  }
                  namespace={item.subscriptionId}
                  status="shipping"
                  href={item.href}
                  progressPercent={catalogCardProgressPercent({
                    attemptCount: item.completedCount,
                    moduleCount: Math.max(item.completedCount, 1),
                  })}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            className="mt-4"
            compact
            title="No AP or STEM courses yet"
            description="STEM subscriptions and published AP courses appear here. Open the AP catalog to start, or browse STEM resources."
            actionLabel="Browse AP catalog"
            actionHref="/dashboard/learn"
          />
        )}
      </section>

      <section
        aria-labelledby="activity-heading"
        className="border-t pt-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell aria-hidden className="size-4 text-primary" />
            <h2 id="activity-heading" className="font-semibold">
              Activity
            </h2>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/notifications">All notifications</Link>
          </Button>
        </div>
        {model.unreadNotificationCount > 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {model.unreadNotificationCount} unread
          </p>
        ) : null}
        {model.notifications.length ? (
          <ul className="mt-4 space-y-3">
            {model.notifications.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {item.actionUrl ? (
                        <Link href={item.actionUrl} className="hover:underline">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type} ·{" "}
                      {formatWhen(item.createdAt)}
                      {item.readAt ? "" : " · Unread"}
                    </p>
                  </div>
                  {item.actionUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.actionUrl}>Open</Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-4"
            compact
            title="No recent activity"
            description="Club ideas, invites, events, and course recommendations appear here when they are sent to your account."
          />
        )}
      </section>
    </div>
  );
}
