import { notFound } from "next/navigation";

import { CharterEditor } from "@/features/charters/components/charter-editor";
import { getCharterWorkspace } from "@/features/charters/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubCharterPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/charter`);
    }
    throw error;
  }
  if (!context) notFound();

  const workspace = await getCharterWorkspace(context.club.id, clubSlug);

  return (
    <CharterEditor
      clubId={context.club.id}
      clubSlug={clubSlug}
      schoolYear={workspace.schoolYear}
      charterId={workspace.active?.id ?? null}
      status={workspace.active?.status ?? "draft"}
      draftStep={workspace.active?.draft_step ?? 1}
      definitions={workspace.definitions}
      initialSections={workspace.sections}
      feedback={workspace.feedback}
      versions={workspace.versions}
    />
  );
}
