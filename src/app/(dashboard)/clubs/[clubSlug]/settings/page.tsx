import { notFound } from "next/navigation";

import { ClubSettingsForm } from "@/features/clubs/components/club-settings-form";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubSettingsPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/settings`);
    }
    throw error;
  }
  if (!context) notFound();

  const club = context.club;

  return (
    <div className="space-y-6">
      <ClubSettingsForm
        clubId={club.id}
        initial={{
          name: club.name,
          description: club.description,
          mission: club.mission,
          category: club.category,
          meetingCadence: club.meeting_cadence ?? "",
          publicSummary: club.public_summary ?? "",
          visibility: club.visibility,
        }}
      />
    </div>
  );
}
