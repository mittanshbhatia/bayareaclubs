import { notFound } from "next/navigation";

import { RenewalWizard } from "@/features/charters/components/renewal-wizard";
import { getRenewalWorkspace } from "@/features/charters/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubRenewalPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/charter/renewal`);
    }
    throw error;
  }
  if (!context) notFound();

  const workspace = await getRenewalWorkspace(context.club.id, clubSlug);

  return (
    <RenewalWizard
      clubId={context.club.id}
      clubSlug={clubSlug}
      schoolYear={workspace.schoolYear}
      derived={workspace.derived}
      renewal={
        workspace.renewal
          ? {
              id: workspace.renewal.id,
              status: workspace.renewal.status,
              next_year_plan: workspace.renewal.next_year_plan,
              highlights_summary: workspace.renewal.highlights_summary,
              advisor_confirmed_at: workspace.renewal.advisor_confirmed_at,
              activity_summary: workspace.renewal.activity_summary,
            }
          : null
      }
      feedback={workspace.feedback}
      reminders={workspace.reminders}
    />
  );
}
