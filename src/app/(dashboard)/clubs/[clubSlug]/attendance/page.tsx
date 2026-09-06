import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { MetricCard } from "@/components/ds/metric-card";
import {
  listAttendanceSessions,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
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

  const sessions = await listAttendanceSessions(context.club.id);
  const presentTotal = sessions.reduce((sum, session) => {
    return (
      sum +
      (session.attendance_records ?? []).filter((r) => r.status === "present")
        .length
    );
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Sessions" value={sessions.length} />
        <MetricCard label="Present marks" value={presentTotal} />
        <MetricCard
          label="Trend samples"
          value={context.attendanceTrend.length}
          hint="Recent sessions used for overview"
        />
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          title="No attendance sessions yet"
          description="Create attendance sessions from meetings or events. Recording tools will appear here once sessions exist."
        />
      ) : (
        <ul className="space-y-3">
          {sessions.map((session) => {
            const records = session.attendance_records ?? [];
            const present = records.filter((r) => r.status === "present").length;
            return (
              <li
                key={session.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <p className="font-medium">
                  {new Date(session.starts_at).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.location_name ?? "Location not set"} · {present}/
                  {records.length} present
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
