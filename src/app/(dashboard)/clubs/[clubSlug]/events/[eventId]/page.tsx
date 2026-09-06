import { notFound } from "next/navigation";

import { EventDetailPanel } from "@/features/events/components/event-detail-panel";
import { getEventWorkspace } from "@/features/events/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubEventDetailPage({
  params,
}: {
  params: Promise<{ clubSlug: string; eventId: string }>;
}) {
  const { clubSlug, eventId } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}/events/${eventId}`);
    }
    throw error;
  }
  if (!context) notFound();

  const workspace = await getEventWorkspace(context.club.id, eventId);
  if (!workspace) notFound();

  const event = workspace.event;

  return (
    <EventDetailPanel
      clubId={context.club.id}
      clubSlug={clubSlug}
      eventId={event.id}
      status={event.status}
      capacity={event.capacity}
      goingCount={workspace.goingCount}
      waitlistedCount={workspace.waitlistedCount}
      maybeEnabled={event.maybe_rsvp_enabled}
      rsvps={workspace.rsvps}
      logistics={workspace.logistics as never}
      tasks={workspace.tasks as never}
      members={workspace.members}
      postEvent={workspace.postEvent}
      draft={{
        eventId: event.id,
        builderStep: event.builder_step,
        eventType: event.event_type,
        title: event.title,
        description: event.description,
        startsAtIso: event.starts_at,
        endsAtIso: event.ends_at,
        timezone: event.timezone,
        format: event.format,
        locationName: event.location_name,
        onlineUrl: event.online_url,
        capacity: event.capacity,
        waitlistEnabled: event.waitlist_enabled,
        rsvpDeadlineIso: event.rsvp_deadline,
        maybeRsvpEnabled: event.maybe_rsvp_enabled,
        audienceNotes: event.audience_notes,
        permissionsNotes: event.permissions_notes,
        visibility: event.visibility,
        approvalRequired: event.approval_required,
      }}
    />
  );
}
