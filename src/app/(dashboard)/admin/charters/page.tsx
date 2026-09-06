import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { CharterReviewActions } from "@/features/charters/components/review-actions";
import { listSubmittedChartersForReview } from "@/features/charters/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminChartersPage() {
  let queue;
  try {
    queue = await listSubmittedChartersForReview();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/charters");
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Charter review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted charters for schools you are authorized to review.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/renewals">Renewal queue</Link>
        </Button>
      </div>

      {queue.charters.length === 0 ? (
        <EmptyState
          title="No submitted charters"
          description="When officers submit annual charters, they appear here for approve or changes-requested decisions."
        />
      ) : (
        <ul className="space-y-6">
          {queue.charters.map((charter) => (
            <li
              key={charter.id}
              className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs"
            >
              <div>
                <p className="font-semibold">{charter.clubName}</p>
                <p className="text-sm text-muted-foreground">
                  {charter.schoolYear} · version {charter.versionNumber}
                  {charter.submittedAt
                    ? ` · submitted ${new Date(charter.submittedAt).toLocaleString()}`
                    : ""}
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link href={`/clubs/${charter.clubSlug}/charter`}>
                    Open club charter
                  </Link>
                </Button>
              </div>
              <CharterReviewActions
                clubId={charter.clubId}
                charterId={charter.id}
                allowReject
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
