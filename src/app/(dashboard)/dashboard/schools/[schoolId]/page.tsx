import Link from "next/link";

import { AccessScope } from "@/components/dashboard/access-scope";
import { MetricCard } from "@/components/ds/metric-card";
import { Button } from "@/components/ui/button";
import { getSchoolAttendanceAggregate } from "@/features/attendance/queries";
import { requireSchoolAccess } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  try {
    await requireSchoolAccess(schoolId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/schools/${schoolId}`);
  }

  const aggregates = await getSchoolAttendanceAggregate(schoolId);
  const meetingsHeld = aggregates.reduce(
    (sum, club) => sum + club.meetingsHeld,
    0,
  );

  return (
    <div className="space-y-8">
      <AccessScope
        title="School workspace"
        description="This route requires an active membership in the requested school or platform administration. Attendance aggregates only include clubs you are authorized to manage."
      />

      <section className="space-y-4">
        <h2 className="font-semibold">Attendance (authorized clubs)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard label="Managed clubs with access" value={aggregates.length} />
          <MetricCard label="Meetings held" value={meetingsHeld} />
        </div>
        {aggregates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No club attendance is visible under your current authorization.
          </p>
        ) : (
          <ul className="space-y-3">
            {aggregates.map((club) => (
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
      </section>
    </div>
  );
}
