import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { CommunicationsComposer } from "@/features/communications/components/communications-composer";
import {
  listClubCampaigns,
  listClubEventsForAudience,
} from "@/features/communications/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import {
  AUDIENCE_LABELS,
  KIND_LABELS,
} from "@/lib/validation/communications";

export const dynamic = "force-dynamic";

export default async function ClubCommunicationsPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/communications`);
    }
    throw error;
  }
  if (!context) notFound();

  const [campaigns, events] = await Promise.all([
    listClubCampaigns(context.club.id),
    listClubEventsForAudience(context.club.id),
  ]);

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Club email is sent server-side with Resend. Audiences are derived from
        memberships and events only. Delivery runs asynchronously so large sends
        never hold open a browser request.
      </p>

      <CommunicationsComposer
        clubId={context.club.id}
        events={events.map((event) => ({ id: event.id, title: event.title }))}
      />

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Campaigns
        </h2>
        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Draft or queue a message above."
          />
        ) : (
          <ul className="space-y-3">
            {campaigns.map((campaign) => (
              <li
                key={campaign.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {KIND_LABELS[
                      campaign.campaign_kind as keyof typeof KIND_LABELS
                    ] ?? campaign.campaign_kind}{" "}
                    ·{" "}
                    {AUDIENCE_LABELS[
                      campaign.audience_type as keyof typeof AUDIENCE_LABELS
                    ] ?? campaign.audience_type}{" "}
                    · {campaign.recipient_count} recipients
                  </p>
                </div>
                <StatusBadge
                  status={
                    campaign.status === "sent"
                      ? "approved"
                      : campaign.status === "draft"
                        ? "draft"
                        : "pending"
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
