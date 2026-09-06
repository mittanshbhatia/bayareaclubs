import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { RenewalReviewActions } from "@/features/charters/components/review-actions";
import { listSubmittedRenewalsForReview } from "@/features/charters/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminRenewalsPage() {
  let queue;
  try {
    queue = await listSubmittedRenewalsForReview();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/renewals");
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Renewal review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve, request changes, or reject renewals where policy permits.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/charters">Charter queue</Link>
        </Button>
      </div>

      {queue.renewals.length === 0 ? (
        <EmptyState
          title="No renewals awaiting review"
          description="Submitted and under-review renewals for your schools appear here."
        />
      ) : (
        <ul className="space-y-6">
          {queue.renewals.map((renewal) => (
            <li
              key={renewal.id}
              className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs"
            >
              <div>
                <p className="font-semibold">{renewal.clubName}</p>
                <p className="text-sm capitalize text-muted-foreground">
                  {renewal.schoolYear} · {renewal.status.replaceAll("_", " ")}
                  {renewal.submittedAt
                    ? ` · submitted ${new Date(renewal.submittedAt).toLocaleString()}`
                    : ""}
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link href={`/clubs/${renewal.clubSlug}/charter/renewal`}>
                    Open renewal
                  </Link>
                </Button>
              </div>
              <RenewalReviewActions clubId={renewal.clubId} renewalId={renewal.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
