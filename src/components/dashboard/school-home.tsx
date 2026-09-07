import Link from "next/link";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  ScrollText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { StatusBadge } from "@/components/ds/badges";
import { InsightCallout } from "@/components/ds/insight-callout";
import { MetricCard } from "@/components/ds/metric-card";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import {
  clubStatusToBadge,
  formatLabel,
  workflowStatusToBadge,
  type SchoolDashboardModel,
} from "@/features/dashboard/school";

function formatWhen(iso: string) {
  return format(new Date(iso), "MMM d, yyyy");
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: typeof Building2;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon aria-hidden="true" className="size-4 text-primary" />
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}

function LinkedTitle({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  if (!href) {
    return <p className="font-medium">{children}</p>;
  }
  return (
    <Link
      href={href}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}

export function SchoolHome({ dashboard }: { dashboard: SchoolDashboardModel }) {
  const { school } = dashboard;
  const activeClubs = dashboard.clubs.filter(
    (club) => club.status === "active",
  ).length;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-primary">School workspace</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {school.name}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {formatLabel(school.level)} · {school.city}. Access is limited to
          school administrators, advisors, staff, and platform administrators.
          Students cannot open this command center. Figures are school-level
          aggregates — no student emails, home addresses, or public ranking.
        </p>
        <p className="text-sm capitalize text-muted-foreground">
          Viewing as {formatLabel(dashboard.actorRole)}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Clubs visible"
          value={dashboard.clubs.length}
          hint={`${activeClubs} active`}
        />
        <MetricCard
          label="Ideas awaiting review"
          value={dashboard.ideas.length}
          hint={
            dashboard.ideas.length === 0
              ? "None in the current queue"
              : "Titles only — no applicant contact details"
          }
        />
        <MetricCard
          label="Upcoming events"
          value={dashboard.upcomingEvents.length}
          hint="Published or otherwise visible to your role"
        />
        <MetricCard
          label="Meetings held"
          value={dashboard.attendance.meetingsHeld}
          hint={
            dashboard.attendance.schoolWideRate == null
              ? "From clubs you can manage"
              : `${dashboard.attendance.schoolWideRate}% school-wide attendance`
          }
        />
      </section>

      {dashboard.actionItems.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading icon={ClipboardList} title="Action items" />
          <ul className="space-y-3">
            {dashboard.actionItems.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <LinkedTitle href={item.href}>{item.title}</LinkedTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <InsightCallout title="No deadlines need attention" tone="info">
          Open renewals, ideas awaiting review, and charters expiring within 14
          days appear here when that data exists.
        </InsightCallout>
      )}

      <section className="space-y-4">
        <SectionHeading icon={UsersRound} title="Clubs at this school" />
        {dashboard.clubs.length === 0 ? (
          <EmptyState
            compact
            title="No clubs are visible"
            description="Clubs appear here by name and status when your assignment can see them. Private rosters are not listed."
          />
        ) : (
          <ul className="space-y-3">
            {dashboard.clubs.map((club) => (
              <li
                key={club.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div>
                  <LinkedTitle href={club.href}>{club.name}</LinkedTitle>
                  <p className="text-sm text-muted-foreground">
                    {club.category}
                    {club.href ? "" : " · club command opens only if you manage this club"}
                  </p>
                </div>
                <StatusBadge status={clubStatusToBadge(club.status)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={Lightbulb} title="Applications and ideas" />
        {dashboard.ideas.length === 0 ? (
          <EmptyState
            compact
            title="No ideas awaiting review"
            description="Submitted applications for this school appear here when your role can view them. School advisors and staff do not receive applicant contact details."
          />
        ) : (
          <ul className="space-y-3">
            {dashboard.ideas.map((idea) => (
              <li
                key={idea.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div>
                  <LinkedTitle href={idea.href}>{idea.title}</LinkedTitle>
                  <p className="text-sm capitalize text-muted-foreground">
                    {formatLabel(idea.status)}
                    {idea.submittedAt
                      ? ` · submitted ${formatWhen(idea.submittedAt)}`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={workflowStatusToBadge(idea.status)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={ScrollText} title="Charters and renewals" />
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Open charters"
            value={dashboard.charterSummary.open}
          />
          <MetricCard
            label="Approved charters"
            value={dashboard.charterSummary.approved}
          />
          <MetricCard
            label="Open renewals"
            value={dashboard.renewalSummary.open}
          />
        </div>
        {dashboard.charters.length === 0 && dashboard.renewals.length === 0 ? (
          <EmptyState
            compact
            title="No charter or renewal records"
            description="Annual charters and open renewals for clubs at this school appear when they exist and your role can read them."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Charter status
              </h3>
              {dashboard.charters.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No charters visible for this school.
                </p>
              ) : (
                <ul className="space-y-3">
                  {dashboard.charters.slice(0, 8).map((charter) => (
                    <li
                      key={charter.id}
                      className="rounded-lg border border-border bg-surface p-4"
                    >
                      <LinkedTitle href={charter.href}>
                        {charter.clubName}
                      </LinkedTitle>
                      <p className="mt-1 text-sm capitalize text-muted-foreground">
                        {formatLabel(charter.status)} · {charter.schoolYear}
                        {charter.expiresAt
                          ? ` · expires ${formatWhen(charter.expiresAt)}`
                          : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Open renewals
              </h3>
              {dashboard.renewals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open renewals.
                </p>
              ) : (
                <ul className="space-y-3">
                  {dashboard.renewals.map((renewal) => (
                    <li
                      key={renewal.id}
                      className="rounded-lg border border-border bg-surface p-4"
                    >
                      <LinkedTitle href={renewal.href}>
                        {renewal.clubName}
                      </LinkedTitle>
                      <p className="mt-1 text-sm capitalize text-muted-foreground">
                        {formatLabel(renewal.status)} · {renewal.schoolYear}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={CalendarDays} title="Events" />
        {dashboard.upcomingEvents.length === 0 ? (
          <EmptyState
            compact
            title="No upcoming events"
            description="Upcoming titles appear when event visibility allows your assignment to see them."
          />
        ) : (
          <ul className="space-y-3">
            {dashboard.upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div>
                  <LinkedTitle href={event.href}>{event.title}</LinkedTitle>
                  <p className="text-sm text-muted-foreground">
                    {event.clubName} · {formatWhen(event.startsAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={ShieldCheck} title="Attendance" />
        {!dashboard.attendance.visible ||
        (dashboard.attendance.clubs.length === 0 &&
          dashboard.attendance.schoolWideRate == null) ? (
          <EmptyState
            compact
            title="No attendance aggregates yet"
            description="Club attendance rates appear for clubs you can manage. Individual student marks are not listed here."
          />
        ) : (
          <>
            {dashboard.attendance.schoolWideRate != null ? (
              <p className="text-sm text-muted-foreground">
                School-wide recorded attendance is{" "}
                {dashboard.attendance.schoolWideRate}% across authorized
                sessions. Counts only — no student names.
              </p>
            ) : null}
            {dashboard.attendance.clubs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No managed-club attendance sessions are visible under your
                current authorization.
              </p>
            ) : (
              <ul className="space-y-3">
                {dashboard.attendance.clubs.map((club) => (
                  <li
                    key={club.clubId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
                  >
                    <div>
                      <p className="font-medium">{club.clubName}</p>
                      <p className="text-sm text-muted-foreground">
                        {club.meetingsHeld} meetings ·{" "}
                        {club.attendanceRate == null
                          ? "no rate yet"
                          : `${club.attendanceRate}% rate`}{" "}
                        · {club.uniqueParticipants} unique participants
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/clubs/${club.clubSlug}/attendance`}>
                        Open attendance
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={GraduationCap} title="Learning usage" />
        {!dashboard.learning.visible ? (
          <EmptyState
            compact
            title="School learning totals are not available"
            description="Course subscription counts are school-wide aggregates for school administrators. Student course lists are not shown."
          />
        ) : dashboard.learning.subscriptionCount == null ? (
          <EmptyState
            compact
            title="No learning usage yet"
            description="School-wide STEM subscription totals appear after analytics refresh. Individual student enrollments stay private."
          />
        ) : (
          <MetricCard
            label="Resource subscriptions"
            value={dashboard.learning.subscriptionCount}
            hint={
              dashboard.learning.metricDate
                ? `School aggregate as of ${formatWhen(dashboard.learning.metricDate)}`
                : "School aggregate — not a student roster"
            }
          />
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={Building2} title="Routes you can open" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {dashboard.shortcuts.map((shortcut) => (
            <li key={shortcut.id}>
              <Link
                href={shortcut.href}
                className="block rounded-lg border border-border bg-surface p-4 hover:bg-surface-muted"
              >
                <p className="font-medium">{shortcut.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {shortcut.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
