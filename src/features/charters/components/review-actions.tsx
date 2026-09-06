"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  decideCharterAction,
  decideRenewalAction,
} from "@/features/charters/actions";

export function CharterReviewActions({
  clubId,
  charterId,
  allowReject = false,
}: {
  clubId: string;
  charterId: string;
  allowReject?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function decide(decision: "approved" | "changes_requested" | "rejected") {
    startTransition(async () => {
      setError(null);
      const result = await decideCharterAction({
        clubId,
        charterId,
        decision,
        applicantFeedback: feedback,
        internalNotes: notes,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h3 className="font-semibold">Review charter</h3>
      <p className="text-sm text-muted-foreground">
        Charter policy has no rejected status — reject maps to changes requested with
        feedback.
      </p>
      <Label htmlFor="charter-feedback">Applicant feedback</Label>
      <Textarea
        id="charter-feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
      />
      <Label htmlFor="charter-notes">Internal notes</Label>
      <Textarea
        id="charter-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={pending} onClick={() => decide("approved")}>
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => decide("changes_requested")}
        >
          Request changes
        </Button>
        {allowReject ? (
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => decide("rejected")}
          >
            Reject (→ changes requested)
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RenewalReviewActions({
  clubId,
  renewalId,
}: {
  clubId: string;
  renewalId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function decide(decision: "approved" | "changes_requested" | "rejected") {
    startTransition(async () => {
      setError(null);
      const result = await decideRenewalAction({
        clubId,
        renewalId,
        decision,
        applicantFeedback: feedback,
        internalNotes: notes,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h3 className="font-semibold">Review renewal</h3>
      <Label htmlFor="renewal-feedback">Applicant feedback</Label>
      <Textarea
        id="renewal-feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
      />
      <Label htmlFor="renewal-notes">Internal notes</Label>
      <Textarea
        id="renewal-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={pending} onClick={() => decide("approved")}>
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => decide("changes_requested")}
        >
          Request changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={() => decide("rejected")}
        >
          Reject
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
