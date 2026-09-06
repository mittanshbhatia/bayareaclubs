import { notFound } from "next/navigation";

import { EventBuilder } from "@/features/events/components/event-builder";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function NewClubEventPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/events/new`);
    }
    throw error;
  }
  if (!context) notFound();

  return (
    <EventBuilder clubId={context.club.id} clubSlug={clubSlug} status="draft" />
  );
}
