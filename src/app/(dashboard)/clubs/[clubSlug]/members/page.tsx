import { notFound } from "next/navigation";

import { MembersPanel } from "@/features/clubs/components/members-panel";
import {
  listInviteCandidates,
  listOfficerTerms,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubMembersPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/members`);
    }
    throw error;
  }
  if (!context) notFound();

  const [candidates, terms] = await Promise.all([
    listInviteCandidates(context.club.id),
    listOfficerTerms(context.club.id),
  ]);

  return (
    <MembersPanel
      clubId={context.club.id}
      schoolYear={context.schoolYear}
      members={context.members.map((member) => ({
        ...member,
        profiles: member.profiles as { id: string; display_name: string } | null,
      }))}
      terms={terms}
      candidates={candidates}
    />
  );
}
