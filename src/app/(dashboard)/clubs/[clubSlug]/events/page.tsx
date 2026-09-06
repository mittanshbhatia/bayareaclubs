import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import {
  listClubEvents,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubEventsPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/events`);
    }
    throw error;
  }
  if (!context) notFound();

  const events = await listClubEvents(context.club.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Event creation and RSVP management will expand here. Current published and
        draft events from the database are listed below.
      </p>
      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="When you publish events, RSVP counts and logistics will appear in Overview recommendations."
        />
      ) : (
        <ul className="space-y-3">
          {events.map((event) => {
            const going = (event.event_rsvps ?? []).filter(
              (rsvp) => rsvp.status === "going",
            ).length;
            return (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.starts_at).toLocaleString()} · {going} going
                  </p>
                </div>
                <StatusBadge
                  status={
                    event.status === "published"
                      ? "active"
                      : event.status === "cancelled"
                        ? "rejected"
                        : "draft"
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
