import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ClubCommandExtras,
  selectRecentJoins,
} from "@/components/dashboard/club-command-extras";
import { InsightCallout } from "@/components/ds/insight-callout";
import { MetricCard } from "@/components/ds/metric-card";
import { EmptyState } from "@/components/ds/states";
import { StatusBadge, RoleBadge } from "@/components/ds/badges";
import {
  getClubCommandOverviewExtras,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubOverviewPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}`);
    }
    throw error;
  }
  if (!context) notFound();

  const {
    club,
    officers,
    members,
    memberCount,
    nextEvent,
    recentActivities,
    charter,
    renewal,
    highlights,
    attendanceTrend,
    recommendedActions,
  } = context;

  const extras = await getClubCommandOverviewExtras(club.id);
  const recentJoins = selectRecentJoins(members);
  const latestAttendance = attendanceTrend[0];
  const priorAttendance = attendanceTrend[1];
  const attendanceHint =
    latestAttendance && priorAttendance
      ? `Latest session ${latestAttendance.present}/${latestAttendance.total || "—"} present`
      : latestAttendance
        ? `Latest session ${latestAttendance.present}/${latestAttendance.total || "—"} present`
        : "No attendance sessions yet";
  const base = `/clubs/${club.slug}`;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-sm text-muted-foreground">
            {club.schools?.name ?? "School"} · {club.category}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {club.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {club.public_summary || club.description}
          </p>
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">Mission: </span>
            {club.mission}
          </p>
          {club.meeting_cadence ? (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Meeting cadence: </span>
              {club.meeting_cadence}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
          <h3 className="font-semibold">Officers</h3>
          <ul className="mt-3 space-y-2">
            {officers.length === 0 ? (
              <li className="text-sm text-muted-foreground">No officers listed.</li>
            ) : (
              officers.map((officer) => (
                <li
                  key={officer.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>
                    {officer.profiles?.display_name ?? "Officer"}
                  </span>
                  <RoleBadge
                    role={
                      officer.role as
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
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active members" value={memberCount} />
        <MetricCard
          label="Next event"
          value={nextEvent ? nextEvent.rsvpCount : "—"}
          hint={
            nextEvent
              ? `${nextEvent.title} · ${new Date(nextEvent.startsAt).toLocaleString()}`
              : "No upcoming published event"
          }
        />
        <MetricCard label="Attendance" value={latestAttendance?.present ?? "—"} hint={attendanceHint} />
        <MetricCard
          label="Charter"
          value={charter?.status?.replaceAll("_", " ") ?? "None"}
          hint={
            renewal
              ? `Renewal ${renewal.status.replaceAll("_", " ")}`
              : "No renewal record this year"
          }
        />
      </section>

      <section>
        <h3 className="mb-3 font-semibold">Action required</h3>
        {recommendedActions.length === 0 ? (
          <EmptyState
            title="You're caught up"
            description="No deterministic follow-ups from current membership, charter, attendance, or event data."
          />
        ) : (
          <ul className="space-y-3">
            {recommendedActions.map((action) => (
              <li key={action.id}>
                <InsightCallout title={action.title} tone={action.tone}>
                  <p>{action.detail}</p>
                  {action.href ? (
                    <p className="mt-2">
                      <Link
                        href={action.href}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Open section
                      </Link>
                    </p>
                  ) : null}
                </InsightCallout>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ClubCommandExtras
        clubSlug={club.slug}
        nextEvent={nextEvent}
        attendanceTrend={attendanceTrend}
        recentJoins={recentJoins}
        learningCollections={extras.learningCollections.map((collection) => ({
          id: collection.id,
          title: collection.title,
          description: collection.description,
          itemCount: collection.items.length,
        }))}
        recommendations={extras.recommendations.map((item) => ({
          id: item.id,
          note: item.note,
          courseTitle: item.course?.title ?? "Recommended resource",
          courseSlug: item.course?.slug ?? null,
          discipline: item.course?.discipline ?? null,
        }))}
        campaigns={extras.campaigns.slice(0, 5).map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          status: campaign.status,
          sentAt: campaign.sent_at,
          scheduledFor: campaign.scheduled_for,
        }))}
        showOfficerTools
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Recent activities</h3>
            <Link
              href={`${base}/activities`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Activities
            </Link>
          </div>
          {recentActivities.length === 0 ? (
            <EmptyState
              title="No activities logged"
              description="Activities feed highlights, newsletters, and renewal summaries."
              actionLabel="Log an activity"
              actionHref={`${base}/activities`}
            />
          ) : (
            <ul className="space-y-2">
              {recentActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-muted-foreground">
                    {activity.activity_date} · {activity.category}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Recent highlights</h3>
            <Link
              href={`${base}/highlights`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Highlights
            </Link>
          </div>
          {highlights.length === 0 ? (
            <EmptyState
              title="No highlights yet"
              description="Publish highlights from activities when you have outcomes to share."
              actionLabel="Open highlights"
              actionHref={`${base}/highlights`}
            />
          ) : (
            <ul className="space-y-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{highlight.title}</p>
                    {highlight.published_at ? (
                      <StatusBadge status="approved" />
                    ) : (
                      <StatusBadge status="draft" />
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">{highlight.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
