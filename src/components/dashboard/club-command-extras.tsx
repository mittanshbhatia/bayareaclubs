import Link from "next/link";

import { ChartCard } from "@/components/ds/chart-card";
import { EmptyState } from "@/components/ds/states";
import { RoleBadge, StatusBadge, type StatusKey } from "@/components/ds/badges";
import { STEM_DISCIPLINE_LABELS } from "@/lib/validation/stem";

export type OverviewNextEvent = {
  id: string;
  title: string;
  startsAt: string;
  rsvpCount: number;
};

export type OverviewAttendanceSession = {
  id: string;
  startsAt: string;
  present: number;
  total: number;
};

export type OverviewJoin = {
  id: string;
  displayName: string;
  joinedAt: string;
  role: string;
};

export type OverviewLearningCollection = {
  id: string;
  title: string;
  description: string | null;
  itemCount: number;
};

export type OverviewRecommendation = {
  id: string;
  note: string | null;
  courseTitle: string;
  courseSlug: string | null;
  discipline: string | null;
};

export type OverviewCampaign = {
  id: string;
  name: string;
  subject: string | null;
  status: string;
  sentAt: string | null;
  scheduledFor: string | null;
};

type ClubCommandExtrasProps = {
  clubSlug: string;
  nextEvent: OverviewNextEvent | null;
  attendanceTrend: OverviewAttendanceSession[];
  recentJoins: OverviewJoin[];
  learningCollections: OverviewLearningCollection[];
  recommendations: OverviewRecommendation[];
  campaigns: OverviewCampaign[];
  /** Officer/manager tools. Members must not receive this as true. */
  showOfficerTools: boolean;
};

const ROLE_KEYS = [
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
  "member",
] as const;

type ClubRoleKey = (typeof ROLE_KEYS)[number];

export function selectRecentJoins(
  members: Array<{
    id: string;
    status: string;
    joined_at: string | null;
    role: string;
    profiles: { display_name: string } | null;
  }>,
  limit = 6,
): OverviewJoin[] {
  return members
    .filter((member) => member.status === "active" && member.joined_at)
    .sort((a, b) => (b.joined_at ?? "").localeCompare(a.joined_at ?? ""))
    .slice(0, limit)
    .map((member) => ({
      id: member.id,
      displayName: member.profiles?.display_name ?? "Member",
      joinedAt: member.joined_at as string,
      role: member.role,
    }));
}

export function attendanceRatePercent(
  present: number,
  total: number,
): number | null {
  if (total <= 0) return null;
  return Math.round((present / total) * 100);
}

export function chronologicalAttendanceTrend<T>(newestFirst: T[]): T[] {
  return [...newestFirst].reverse();
}

export function campaignStatusBadge(status: string): StatusKey {
  if (status === "sent") return "approved";
  if (status === "draft") return "draft";
  if (status === "cancelled") return "archived";
  if (status === "failed") return "rejected";
  return "pending";
}

function isClubRole(role: string): role is ClubRoleKey {
  return (ROLE_KEYS as readonly string[]).includes(role);
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function disciplineLabel(discipline: string | null) {
  if (!discipline) return null;
  return (
    STEM_DISCIPLINE_LABELS[discipline as keyof typeof STEM_DISCIPLINE_LABELS] ??
    discipline
  );
}

function SectionLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}

export function ClubCommandExtras({
  clubSlug,
  nextEvent,
  attendanceTrend,
  recentJoins,
  learningCollections,
  recommendations,
  campaigns,
  showOfficerTools,
}: ClubCommandExtrasProps) {
  const base = `/clubs/${clubSlug}`;
  const chartSessions = chronologicalAttendanceTrend(attendanceTrend);
  const chartPoints = chartSessions.map((session) => ({
    label: formatDate(session.startsAt),
    value: attendanceRatePercent(session.present, session.total) ?? 0,
    secondary: session.present,
  }));
  const chartSummary = chartSessions.length
    ? `Attendance for this club: ${chartSessions
        .map((session) => {
          const rate = attendanceRatePercent(session.present, session.total);
          return `${formatDate(session.startsAt)} ${
            rate == null ? "no records" : `${rate}% (${session.present}/${session.total})`
          }`;
        })
        .join("; ")}.`
    : "Attendance for this club: no sessions recorded yet.";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Next event</h3>
            <SectionLink href={`${base}/events`}>All events</SectionLink>
          </div>
          {nextEvent ? (
            <div className="rounded-lg border border-border bg-surface p-4 shadow-xs">
              <p className="font-medium">{nextEvent.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDateTime(nextEvent.startsAt)} · {nextEvent.rsvpCount} going
              </p>
              <p className="mt-3">
                <Link
                  href={`${base}/events/${nextEvent.id}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open event
                </Link>
              </p>
            </div>
          ) : (
            <EmptyState
              compact
              title="No upcoming published event"
              description="Create or publish the next meeting so members can RSVP."
              actionLabel={showOfficerTools ? "Create event" : undefined}
              actionHref={showOfficerTools ? `${base}/events/new` : undefined}
            />
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Membership activity</h3>
            <SectionLink href={`${base}/members`}>Members</SectionLink>
          </div>
          {recentJoins.length === 0 ? (
            <EmptyState
              compact
              title="No recent joins recorded"
              description="Active members with a join date appear here. Names only — no emails or other private contact details."
              actionLabel={showOfficerTools ? "Invite members" : undefined}
              actionHref={showOfficerTools ? `${base}/members` : undefined}
            />
          ) : (
            <ul className="space-y-2">
              {recentJoins.map((join) => (
                <li
                  key={join.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{join.displayName}</p>
                    <p className="text-muted-foreground">
                      Joined {formatDate(join.joinedAt)}
                    </p>
                  </div>
                  {isClubRole(join.role) ? <RoleBadge role={join.role} /> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-semibold">Attendance trend</h3>
          <SectionLink href={`${base}/attendance`}>Attendance</SectionLink>
        </div>
        {attendanceTrend.length === 0 ? (
          <EmptyState
            compact
            title="No attendance sessions yet"
            description="Record a meeting to see present counts for this club only."
            actionLabel={showOfficerTools ? "Record attendance" : undefined}
            actionHref={showOfficerTools ? `${base}/attendance` : undefined}
          />
        ) : (
          <div className="space-y-4">
            <ChartCard
              title="Recent sessions"
              description="Present rate for recorded sessions in this club. Empty sessions stay at 0%."
              data={chartPoints}
              valueLabel="Present %"
              secondaryLabel="Present count"
              summary={chartSummary}
            />
            <ul className="space-y-2">
              {attendanceTrend.map((session) => {
                const rate = attendanceRatePercent(session.present, session.total);
                return (
                  <li
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                  >
                    <span>{formatDateTime(session.startsAt)}</span>
                    <span className="font-mono text-muted-foreground">
                      {session.present}/{session.total || "—"} present
                      {rate == null ? "" : ` · ${rate}%`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Learning tracks</h3>
            <SectionLink href={`${base}/resources`}>Club resources</SectionLink>
          </div>
          {learningCollections.length === 0 && recommendations.length === 0 ? (
            <EmptyState
              compact
              title="No club learning tracks yet"
              description="Recommend published STEM resources or build a collection. Members are never auto-enrolled."
              actionLabel={showOfficerTools ? "Manage resources" : undefined}
              actionHref={showOfficerTools ? `${base}/resources` : undefined}
            />
          ) : (
            <div className="space-y-3">
              {learningCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <p className="font-medium">{collection.title}</p>
                  {collection.description ? (
                    <p className="mt-1 text-muted-foreground">
                      {collection.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {collection.itemCount} resource
                    {collection.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <p className="font-medium">{item.courseTitle}</p>
                  <p className="mt-1 text-muted-foreground">
                    {[disciplineLabel(item.discipline), item.note]
                      .filter(Boolean)
                      .join(" · ") || "Recommended for this club"}
                  </p>
                  {item.courseSlug ? (
                    <p className="mt-2">
                      <Link
                        href={`/resources/${item.courseSlug}`}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View resource
                      </Link>
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Resource is not currently published.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showOfficerTools ? (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold">Communications</h3>
              <SectionLink href={`${base}/communications`}>
                Open communications
              </SectionLink>
            </div>
            {campaigns.length === 0 ? (
              <EmptyState
                compact
                title="No campaigns yet"
                description="Draft or queue a club message. Audiences come from this club’s memberships and events only."
                actionLabel="Compose"
                actionHref={`${base}/communications`}
              />
            ) : (
              <ul className="space-y-2">
                {campaigns.slice(0, 5).map((campaign) => (
                  <li
                    key={campaign.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{campaign.name}</p>
                      {campaign.subject ? (
                        <p className="text-muted-foreground">{campaign.subject}</p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {campaign.sentAt
                          ? `Sent ${formatDate(campaign.sentAt)}`
                          : campaign.scheduledFor
                            ? `Scheduled ${formatDateTime(campaign.scheduledFor)}`
                            : "Not sent"}
                      </p>
                    </div>
                    <StatusBadge status={campaignStatusBadge(campaign.status)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <h3 className="mb-3 font-semibold">Communications</h3>
            <EmptyState
              compact
              title="Officer tools only"
              description="Club email campaigns are available to officers and managers of this club."
            />
          </div>
        )}
      </section>
    </div>
  );
}
