import Link from "next/link";

import { MetricCard } from "@/components/ds/metric-card";
import { EmptyState } from "@/components/ds/states";
import { getAdminOverview } from "@/features/admin/queries";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { AuthorizationError } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

function formatWhen(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminOverviewPage() {
  let overview;
  try {
    overview = await getAdminOverview();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin");
    }
    throw error;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Overview
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pending work across applications, renewals, resources, and clubs that
          need attention.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Pending applications"
          value={overview.pendingApplications}
          hint="Submitted, under review, or changes requested"
        />
        <MetricCard
          label="Aging applications"
          value={overview.agingApplications.length}
          hint="Submitted more than 48 hours ago"
        />
        <MetricCard
          label="Renewals in flight"
          value={overview.renewalsDue.length}
          hint="Draft through changes requested"
        />
        <MetricCard
          label="Resource review queue"
          value={overview.resourceReviewQueue.length}
          hint="Draft or review STEM courses"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <QueueCard
          title="Applications aging"
          empty="No aging applications."
          href="/admin/ideas"
          items={overview.agingApplications.map((row) => ({
            id: row.id,
            primary: row.title,
            secondary: `${row.schoolName ?? "School"} · ${row.status}`,
            meta: formatWhen(row.submittedAt),
            href: `/admin/ideas/${row.id}`,
          }))}
        />
        <QueueCard
          title="Clubs needing attention"
          empty="No charter expirations in the next 14 days."
          href="/admin/clubs"
          items={overview.clubsNeedingAttention.map((row) => ({
            id: row.id,
            primary: row.clubName ?? "Club",
            secondary: "Charter expiring soon",
            meta: formatWhen(row.expiresAt),
            href: row.clubId ? `/admin/clubs/${row.clubId}` : "/admin/clubs",
          }))}
        />
        <QueueCard
          title="Renewals due"
          empty="No renewals awaiting action."
          href="/admin/renewals"
          items={overview.renewalsDue.map((row) => ({
            id: row.id,
            primary: row.clubName ?? "Club",
            secondary: `${row.schoolYear} · ${row.status}`,
            meta: null,
            href: "/admin/renewals",
          }))}
        />
        <QueueCard
          title="Upcoming major events"
          empty="No published events in the next 14 days."
          href="/admin/events"
          items={overview.upcomingEvents.map((row) => ({
            id: row.id,
            primary: row.title,
            secondary: `${row.clubName ?? "Club"} · ${row.eventType}`,
            meta: formatWhen(row.startsAt),
            href: "/admin/events",
          }))}
        />
        <QueueCard
          title="Resource review queue"
          empty="No STEM resources awaiting review."
          href="/admin/resources"
          items={overview.resourceReviewQueue.map((row) => ({
            id: row.id,
            primary: row.title,
            secondary: `${row.provider_name} · ${row.status}`,
            meta: formatWhen(row.updated_at),
            href: `/admin/resources/${row.id}`,
          }))}
        />
        <QueueCard
          title="Recent administrative actions"
          empty="No recent audit events visible."
          href="/admin/audit"
          items={overview.recentActions.map((row) => ({
            id: row.id,
            primary: row.action,
            secondary: row.entity_type,
            meta: formatWhen(row.created_at),
            href: "/admin/audit",
          }))}
        />
      </section>
    </div>
  );
}

function QueueCard({
  title,
  empty,
  href,
  items,
}: {
  title: string;
  empty: string;
  href: string;
  items: {
    id: string | number;
    primary: string;
    secondary: string;
    meta: string | null;
    href: string;
  }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={empty} className="py-6" compact />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link
                  href={item.href}
                  className="block truncate font-medium hover:underline"
                >
                  {item.primary}
                </Link>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {item.secondary}
                </p>
              </div>
              {item.meta ? (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.meta}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
