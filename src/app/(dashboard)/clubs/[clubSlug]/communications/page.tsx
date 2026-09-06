import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import {
  listCommunications,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

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

  const campaigns = await listCommunications(context.club.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Email campaigns only target allow-listed platform users. Arbitrary student
        PII export is not available.
      </p>
      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Draft and sent club communications will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {campaigns.map((campaign) => (
            <li
              key={campaign.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <div>
                <p className="font-medium">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">{campaign.subject}</p>
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
    </div>
  );
}
