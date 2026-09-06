"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  assignReviewerAction,
  decideIdeaAction,
  startReviewAction,
} from "@/features/ideas/actions";

type Reviewer = { id: string; display_name: string };
type Review = {
  id: string;
  reviewer_id: string;
  reviewed_at: string | null;
  decision: string | null;
};

type Props = {
  ideaId: string;
  status: string;
  currentUserId: string;
  reviewers: Reviewer[];
  reviews: Review[];
};

export function IdeaReviewActions({
  ideaId,
  status,
  currentUserId,
  reviewers,
  reviews,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reviewerId, setReviewerId] = useState(reviewers[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const myOpenReview = useMemo(
    () =>
      reviews.find(
        (review) => review.reviewer_id === currentUserId && !review.reviewed_at,
      ),
    [reviews, currentUserId],
  );

  function run(action: () => Promise<{ ok: boolean; error?: { message: string } }>) {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await action();
      if (!result.ok) {
        setError(result.error?.message ?? "Action failed");
        return;
      }
      setMessage("Updated");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h2 className="font-semibold">Review actions</h2>

      <div className="space-y-3">
        <Label htmlFor="assign-reviewer">Assign reviewer</Label>
        <div className="flex flex-wrap gap-2">
          <select
            id="assign-reviewer"
            className="min-h-11 min-w-[12rem] flex-1 rounded-md border border-border bg-surface px-3"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
          >
            {reviewers.map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.display_name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            disabled={pending || !reviewerId}
            onClick={() =>
              run(() => assignReviewerAction({ ideaId, reviewerId }))
            }
          >
            Assign Reviewer
          </Button>
        </div>
      </div>

      {["submitted", "resubmitted"].includes(status) ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() => run(() => startReviewAction({ ideaId }))}
        >
          Start Review
        </Button>
      ) : null}

      {status === "under_review" && myOpenReview ? (
        <div className="space-y-4 border-t border-border pt-4">
          <label className="block space-y-2">
            <Label htmlFor="applicant-feedback">
              Applicant feedback / decision reason
            </Label>
            <Textarea
              id="applicant-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Required for request changes and rejection"
            />
          </label>
          <label className="block space-y-2">
            <Label htmlFor="internal-notes">Internal notes (optional)</Label>
            <Textarea
              id="internal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() =>
                run(() =>
                  decideIdeaAction({
                    ideaId,
                    reviewId: myOpenReview.id,
                    decision: "changes_requested",
                    applicantFeedback: feedback,
                    internalNotes: notes || undefined,
                  }),
                )
              }
            >
              Request Changes
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={() =>
                run(() =>
                  decideIdeaAction({
                    ideaId,
                    reviewId: myOpenReview.id,
                    decision: "approved",
                    applicantFeedback: feedback || "Approved",
                    internalNotes: notes || undefined,
                  }),
                )
              }
            >
              Approve
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                run(() =>
                  decideIdeaAction({
                    ideaId,
                    reviewId: myOpenReview.id,
                    decision: "rejected",
                    applicantFeedback: feedback,
                    internalNotes: notes || undefined,
                  }),
                )
              }
            >
              Reject
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
    </div>
  );
}
