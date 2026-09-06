import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { ActivityCreateForm } from "@/features/clubs/components/activity-create-form";
import {
  listClubActivities,
  listClubEvents,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubActivitiesPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/activities`);
    }
    throw error;
  }
  if (!context) notFound();

  const [activities, events] = await Promise.all([
    listClubActivities(context.club.id),
    listClubEvents(context.club.id),
  ]);

  return (
    <div className="space-y-8">
      <ActivityCreateForm
        clubId={context.club.id}
        members={context.members
          .filter((member) => member.status === "active")
          .map((member) => ({
            id: member.id,
            label:
              (member.profiles as { display_name?: string } | null)?.display_name ??
              "Member",
          }))}
        events={events.map((event) => ({ id: event.id, title: event.title }))}
      />

      <section>
        <h2 className="mb-3 font-semibold">Activity log</h2>
        {activities.length === 0 ? (
          <EmptyState
            title="No activities yet"
            description="Logged activities become inputs for highlights, newsletters, renewals, and insights."
          />
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => {
              const related = activity.events as { title: string } | null;
              return (
                <li
                  key={activity.id}
                  className="rounded-lg border border-border bg-surface p-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.activity_date} · {activity.category}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  {activity.outcomes ? (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Outcomes: </span>
                      {activity.outcomes}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {(activity.club_activity_participants ?? []).length}{" "}
                    participants ·{" "}
                    {(activity.club_activity_media ?? []).length} media links
                    {related ? ` · Related: ${related.title}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
