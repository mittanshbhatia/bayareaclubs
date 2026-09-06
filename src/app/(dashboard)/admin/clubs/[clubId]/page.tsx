import Link from "next/link";
import { notFound } from "next/navigation";

import { MetricCard } from "@/components/ds/metric-card";
import { RoleBadge, StatusBadge } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { getAdminClubDetail } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

function formatWhen(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  let detail;
  try {
    detail = await getAdminClubDetail(clubId);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/admin/clubs/${clubId}`);
    }
    throw error;
  }
  if (!detail) notFound();

  const { club, leadership, membershipAggregates, events, charters, renewals, activities, audit } =
    detail;
  const school = club.schools as {
    name: string;
    city: string | null;
    level: string;
  } | null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
            <Link href="/admin/clubs">← Clubs</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            {school?.name ?? "School"} · {club.category}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {club.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {club.public_summary || club.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={
              club.status === "active"
                ? "active"
                : club.status === "archived"
                  ? "archived"
                  : "pending"
            }
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/clubs/${club.slug}`}>Open club dashboard</Link>
          </Button>
        </div>
      </div>

      <section>
        <h3 className="font-semibold">Overview</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active members" value={membershipAggregates.active} />
          <MetricCard label="Officers" value={membershipAggregates.officers} />
          <MetricCard label="Advisors" value={membershipAggregates.advisors} />
          <MetricCard label="Members" value={membershipAggregates.members} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel title="Leadership">
          {leadership.length === 0 ? (
            <EmptyState title="No leadership listed" className="py-8" />
          ) : (
            <ul className="divide-y divide-border">
              {leadership.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-2 py-2 text-sm"
                >
                  <span>
                    {
                      (
                        row.profiles as unknown as {
                          display_name: string;
                        } | null
                      )?.display_name ?? "Member"
                    }
                  </span>
                  <RoleBadge
                    role={
                      row.role as
                        | "club_admin"
                        | "president"
                        | "vice_president"
                        | "secretary"
                        | "treasurer"
                        | "officer"
                        | "advisor"
                        | "member"
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Charter">
          {charters.length === 0 ? (
            <EmptyState title="No charters" className="py-8" />
          ) : (
            <ul className="space-y-2 text-sm">
              {charters.map((row) => (
                <li key={row.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{row.school_year}</p>
                  <p className="text-muted-foreground">
                    {row.status}
                    {row.expires_at ? ` · expires ${formatWhen(row.expires_at)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Renewal">
          {renewals.length === 0 ? (
            <EmptyState title="No renewals" className="py-8" />
          ) : (
            <ul className="space-y-2 text-sm">
              {renewals.map((row) => (
                <li key={row.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{row.school_year}</p>
                  <p className="text-muted-foreground">{row.status}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Events">
          {events.length === 0 ? (
            <EmptyState title="No events" className="py-8" />
          ) : (
            <ul className="space-y-2 text-sm">
              {events.map((row) => (
                <li key={row.id} className="flex justify-between gap-2">
                  <span className="truncate">{row.title}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatWhen(row.starts_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Activity">
          {activities.length === 0 ? (
            <EmptyState title="No logged activities" className="py-8" />
          ) : (
            <ul className="space-y-2 text-sm">
              {activities.map((row) => (
                <li key={row.id} className="flex justify-between gap-2">
                  <span className="truncate">{row.title}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {row.activity_date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Audit history">
          {audit.length === 0 ? (
            <EmptyState title="No club audit events" className="py-8" />
          ) : (
            <ul className="space-y-2 text-sm">
              {audit.map((row) => (
                <li key={row.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{row.action}</p>
                  <p className="text-muted-foreground">
                    {row.entity_type} · {formatWhen(row.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
