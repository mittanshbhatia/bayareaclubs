import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listManagedEvents } from "@/features/events/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { EVENT_TYPE_LABELS } from "@/lib/validation/events";
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

  const events = await listManagedEvents(context.club.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Events
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage club meetings through large events, RSVPs, logistics, and
            post-event follow-through.
          </p>
        </div>
        <Button asChild>
          <Link href={`/clubs/${clubSlug}/events/new`}>Create event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create a draft for a club meeting or large event, then publish when logistics and capacity are ready."
          actionLabel="Create event"
          actionHref={`/clubs/${clubSlug}/events/new`}
        />
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/clubs/${clubSlug}/events/${event.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {EVENT_TYPE_LABELS[event.event_type]} ·{" "}
                    {new Date(event.starts_at).toLocaleString()} · {event.goingCount}
                    {event.capacity != null ? `/${event.capacity}` : ""} going
                    {event.waitlistedCount
                      ? ` · ${event.waitlistedCount} waitlisted`
                      : ""}
                  </p>
                </div>
                <StatusBadge
                  status={
                    event.status === "published"
                      ? "active"
                      : event.status === "cancelled"
                        ? "rejected"
                        : event.status === "completed"
                          ? "approved"
                          : "draft"
                  }
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
