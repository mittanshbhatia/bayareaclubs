import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TakeAttendancePanel } from "@/features/attendance/components/take-attendance-panel";
import { getAttendanceSessionDetail } from "@/features/attendance/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function TakeAttendancePage({
  params,
}: {
  params: Promise<{ clubSlug: string; sessionId: string }>;
}) {
  const { clubSlug, sessionId } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(
        error,
        `/clubs/${clubSlug}/attendance/${sessionId}`,
      );
    }
    throw error;
  }
  if (!context) notFound();

  const detail = await getAttendanceSessionDetail(context.club.id, sessionId);
  if (!detail) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/clubs/${clubSlug}/attendance`}>Back to attendance</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          {new Date(detail.session.startsAt).toLocaleString()}
          {detail.session.locationName
            ? ` · ${detail.session.locationName}`
            : ""}
        </p>
      </div>

      <TakeAttendancePanel
        clubId={context.club.id}
        sessionId={detail.session.id}
        title={detail.session.title}
        checkInEnabled={detail.session.checkInEnabled}
        initialRecords={detail.session.records.map((record) => ({
          id: record.id,
          membershipId: record.membershipId,
          displayName: record.displayName,
          status: record.status,
          note: record.note,
        }))}
      />
    </div>
  );
}
