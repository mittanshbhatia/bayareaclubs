import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listAdminCommunications } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminCommunicationsPage() {
  let campaigns;
  try {
    campaigns = await listAdminCommunications();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/communications");
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Communications
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Platform view of club email campaigns. Detailed composition stays in
            each club&apos;s Newsletter Studio.
          </p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="When clubs create email campaigns, they appear here for operational oversight."
        />
      ) : (
        <ul className="space-y-3">
          {campaigns.map((campaign) => {
            const club = campaign.clubs as {
              name: string;
              slug: string;
            } | null;
            return (
              <li
                key={campaign.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs"
              >
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {campaign.subject}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {club?.name ?? "Club"} · {campaign.campaign_kind} ·{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(campaign.created_at))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={
                      campaign.status === "sent"
                        ? "active"
                        : campaign.status === "draft"
                          ? "draft"
                          : "pending"
                    }
                  />
                  {club?.slug ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/clubs/${club.slug}/communications`}>
                        Open club
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
