import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/ds/activity-timeline";
import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { HighlightComposer } from "@/features/publishing/components/highlight-composer";
import {
  listClubHighlights,
  listHighlightRelatedOptions,
} from "@/features/publishing/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { HIGHLIGHT_SOURCE_LABELS } from "@/lib/validation/publishing";

export const dynamic = "force-dynamic";

export default async function ClubHighlightsPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/highlights`);
    }
    throw error;
  }
  if (!context) notFound();

  const [highlights, related] = await Promise.all([
    listClubHighlights(context.club.id),
    listHighlightRelatedOptions(context.club.id),
  ]);

  const timeline = highlights.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${HIGHLIGHT_SOURCE_LABELS[item.source_type as keyof typeof HIGHLIGHT_SOURCE_LABELS] ?? item.source_type} · ${item.summary}`,
    timestamp: item.occurred_on,
    actor: item.visibility,
  }));

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Highlights form an elegant club timeline from activities, events, media,
        and achievements. Public visibility only appears on public surfaces when
        published.
      </p>

      <HighlightComposer
        clubId={context.club.id}
        activities={related.activities.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
        events={related.events.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
        media={related.media.map((item) => ({
          id: item.id,
          title: item.title,
        }))}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Club timeline
          </h2>
        </div>
        {timeline.length === 0 ? (
          <EmptyState
            title="No highlights yet"
            description="Create the first highlight to start the timeline."
          />
        ) : (
          <div className="rounded-lg border border-border bg-surface p-5 shadow-xs">
            <ActivityTimeline items={timeline} />
            <ul className="mt-6 space-y-2 border-t border-border pt-4">
              {highlights.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <span className="text-muted-foreground">{item.title}</span>
                  <StatusBadge
                    status={
                      item.status === "published"
                        ? "approved"
                        : item.status === "draft"
                          ? "draft"
                          : "pending"
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
