import { EmptyState } from "@/components/ds/states";
import { MetricCard } from "@/components/ds/metric-card";
import { getMyAttendance } from "@/features/attendance/queries";
import {
  AuthorizationError,
  requireClubMember,
} from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MyClubAttendancePage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  try {
    await requireClubMember(clubId);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/dashboard/clubs/${clubId}/attendance`);
    }
    throw error;
  }

  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq("id", clubId)
    .maybeSingle();

  if (!club) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <EmptyState
          title="Club not found"
          description="This club is unavailable or you no longer have access."
        />
      </div>
    );
  }

  const mine = await getMyAttendance(clubId);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <p className="text-sm font-medium text-primary">{club.name}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          My attendance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only your personal attendance for this club is shown here. Club-wide
          metrics stay with officers and authorized administrators.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Sessions recorded" value={mine.summary.recorded} />
        <MetricCard
          label="Present or late"
          value={mine.summary.presentLike}
        />
        <MetricCard
          label="Your rate"
          value={
            mine.summary.rate == null ? "—" : `${mine.summary.rate}%`
          }
        />
      </div>

      {mine.records.length === 0 ? (
        <EmptyState
          title="No attendance recorded yet"
          description="When officers take attendance for a meeting that includes you, your marks appear here."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {mine.records.map((record) => (
            <li
              key={record.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{record.sessionTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.startsAt).toLocaleString()}
                  {record.locationName ? ` · ${record.locationName}` : ""}
                </p>
              </div>
              <p className="text-sm capitalize font-medium">{record.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
