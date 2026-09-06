import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { MetricCard } from "@/components/ds/metric-card";
import { Button } from "@/components/ui/button";
import { CreateAttendanceSessionForm } from "@/features/attendance/components/create-session-form";
import { getAttendanceWorkspace } from "@/features/attendance/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubAttendancePage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/attendance`);
    }
    throw error;
  }
  if (!context) notFound();

  const workspace = await getAttendanceWorkspace(context.club.id);
  const { metrics } = workspace;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Club attendance is private. Members only see their own records.
          Check-in tokens stay off unless you enable them per session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Attendance rate"
          value={metrics.attendanceRate == null ? "—" : `${metrics.attendanceRate}%`}
          hint="Present + late over recorded marks"
        />
        <MetricCard label="Meetings held" value={metrics.meetingsHeld} />
        <MetricCard
          label="Unique participants"
          value={metrics.uniqueParticipants}
          hint="Members marked present or late at least once"
        />
        <MetricCard
          label="Trend samples"
          value={metrics.trend.length}
          hint="Recent sessions in this workspace"
        />
      </div>

      {metrics.trend.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-semibold">Attendance trend</h2>
          <ul className="space-y-2">
            {metrics.trend.map((point) => (
              <li
                key={point.sessionId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="font-medium">{point.label}</span>
                <span className="text-muted-foreground">
                  {point.presentLike}/{point.recorded} present-like
                  {point.presentRate == null ? "" : ` · ${point.presentRate}%`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {metrics.participation.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-semibold">Member participation</h2>
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
            {metrics.participation.map((member) => (
              <li
                key={member.membershipId}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="font-medium">{member.displayName}</span>
                <span className="text-muted-foreground">
                  {member.sessionsAttended}/{member.sessionsRecorded}
                  {member.rate == null ? "" : ` · ${member.rate}%`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CreateAttendanceSessionForm
        clubId={context.club.id}
        clubSlug={clubSlug}
        members={workspace.eligibleMembers}
        events={workspace.events}
      />

      <section className="space-y-3">
        <h2 className="font-semibold">Sessions</h2>
        {workspace.sessions.length === 0 ? (
          <EmptyState
            title="No attendance sessions yet"
            description="Create a session, select eligible members, then take attendance."
          />
        ) : (
          <ul className="space-y-3">
            {workspace.sessions.map((session) => {
              const presentLike = session.records.filter(
                (record) =>
                  record.status === "present" || record.status === "late",
              ).length;
              return (
                <li
                  key={session.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
                >
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.startsAt).toLocaleString()}
                      {session.locationName
                        ? ` · ${session.locationName}`
                        : ""}{" "}
                      · {presentLike}/{session.records.length} present-like
                      {session.checkInEnabled ? " · check-in on" : ""}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/clubs/${clubSlug}/attendance/${session.id}`}>
                      Take attendance
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
