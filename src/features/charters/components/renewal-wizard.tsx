"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  refreshRenewalDerivedAction,
  saveRenewalDraftAction,
  submitRenewalAction,
} from "@/features/charters/actions";
import type { RenewalDerivedSnapshot } from "@/features/charters/queries";

type RenewalRow = {
  id: string;
  status: string;
  next_year_plan: string;
  highlights_summary: string;
  advisor_confirmed_at: string | null;
  activity_summary: string;
};

type Feedback = {
  decision: string | null;
  applicant_feedback: string | null;
  reviewed_at: string | null;
};

type Reminder = {
  id: string;
  reminder_kind: string;
  due_on: string;
  scheduled_for: string;
  sent_at: string | null;
};

export function RenewalWizard({
  clubId,
  clubSlug,
  schoolYear,
  derived,
  renewal,
  feedback,
  reminders,
}: {
  clubId: string;
  clubSlug: string;
  schoolYear: string;
  derived: RenewalDerivedSnapshot;
  renewal: RenewalRow | null;
  feedback: Feedback[];
  reminders: Reminder[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [renewalId, setRenewalId] = useState<string | null>(renewal?.id ?? null);
  const [nextYearPlan, setNextYearPlan] = useState(renewal?.next_year_plan ?? "");
  const [highlightsSummary, setHighlightsSummary] = useState(
    renewal?.highlights_summary ?? "",
  );
  const [advisorConfirmed, setAdvisorConfirmed] = useState(
    Boolean(renewal?.advisor_confirmed_at),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const status = renewal?.status ?? "draft";
  const editable = ["draft", "changes_requested"].includes(status) || !renewal;

  function save(extra?: { submit?: boolean }) {
    startTransition(async () => {
      setError(null);
      const result = await saveRenewalDraftAction({
        clubId,
        renewalId: renewalId ?? undefined,
        schoolYear,
        nextYearPlan,
        highlightsSummary,
        advisorConfirmed,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setRenewalId(result.data.renewalId);
      if (extra?.submit) {
        const submitted = await submitRenewalAction({
          clubId,
          renewalId: result.data.renewalId,
        });
        if (!submitted.ok) {
          setError(submitted.error.message);
          return;
        }
        setMessage("Renewal submitted");
      } else {
        setMessage("Renewal draft saved");
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">School year {schoolYear}</p>
          <h2 className="text-xl font-semibold">Annual renewal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Operational data is pulled automatically from this year’s club activity.
            Correct inaccurate numbers at their source pages — do not override them
            here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={
              status === "approved"
                ? "approved"
                : status === "rejected"
                  ? "rejected"
                  : status === "submitted" ||
                      status === "under_review" ||
                      status === "changes_requested"
                    ? "pending"
                    : "draft"
            }
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/clubs/${clubSlug}/charter`}>Back to charter</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 p-4">
        <p className="text-sm font-medium">
          Pulled automatically from this year&apos;s club activity.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Last derived{" "}
          {derived.generatedAt
            ? new Date(derived.generatedAt).toLocaleString()
            : "just now"}
          . Refresh after fixing source records.
        </p>
        {renewalId && editable ? (
          <Button
            type="button"
            className="mt-3"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await refreshRenewalDerivedAction({
                  clubId,
                  renewalId,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setMessage("Derived snapshot refreshed");
                router.refresh();
              })
            }
          >
            Refresh from club data
          </Button>
        ) : null}
      </div>

      <DerivedPanel derived={derived} />

      {feedback.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
          <h3 className="font-semibold">Review feedback</h3>
          {feedback.map((item, index) => (
            <div key={`${item.reviewed_at}-${index}`} className="text-sm">
              <p className="capitalize text-muted-foreground">
                {(item.decision ?? "review").replaceAll("_", " ")}
              </p>
              <p className="mt-1">{item.applicant_feedback}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs">
        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights narrative (optional)</Label>
          <Textarea
            id="highlights"
            value={highlightsSummary}
            onChange={(e) => setHighlightsSummary(e.target.value)}
            disabled={!editable || pending}
            rows={4}
            placeholder="Add context about the auto-listed highlights if needed."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next-year">Next-year plan</Label>
          <Textarea
            id="next-year"
            value={nextYearPlan}
            onChange={(e) => setNextYearPlan(e.target.value)}
            disabled={!editable || pending}
            rows={5}
            placeholder="What will the club focus on next school year?"
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={advisorConfirmed}
            disabled={!editable || pending}
            onChange={(e) => setAdvisorConfirmed(e.target.checked)}
          />
          <span>
            Advisor confirmation: leadership and activity summary accurately reflect
            this year’s club (correct source data first if anything looks wrong).
          </span>
        </label>

        {renewal?.activity_summary ? (
          <p className="text-sm text-muted-foreground">
            Activity summary on file: {renewal.activity_summary}
          </p>
        ) : null}

        {editable ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled={pending} onClick={() => save()}>
              Save draft
            </Button>
            <Button
              type="button"
              disabled={pending || !nextYearPlan.trim() || !advisorConfirmed}
              onClick={() => save({ submit: true })}
            >
              Submit renewal
            </Button>
          </div>
        ) : null}
      </div>

      {reminders.length > 0 ? (
        <section className="space-y-2">
          <h3 className="font-semibold">Renewal reminders</h3>
          <ul className="space-y-2 text-sm">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-lg border border-border bg-surface px-4 py-3"
              >
                <span className="capitalize">
                  {reminder.reminder_kind.replaceAll("_", " ")}
                </span>{" "}
                · due {reminder.due_on} · scheduled{" "}
                {new Date(reminder.scheduled_for).toLocaleDateString()}
                {reminder.sent_at
                  ? ` · sent ${new Date(reminder.sent_at).toLocaleString()}`
                  : " · pending"}
              </li>
            ))}
          </ul>
        </section>
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

function DerivedPanel({ derived }: { derived: RenewalDerivedSnapshot }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <InfoCard
        title="Current charter"
        href={derived.sourceLinks.charter}
        lines={[
          derived.charter
            ? `v${derived.charter.versionNumber} · ${derived.charter.status}`
            : "No charter yet",
          derived.charter?.expiresAt
            ? `Expires ${new Date(derived.charter.expiresAt).toLocaleDateString()}`
            : "Expiration not set",
        ]}
      />
      <InfoCard
        title="Leadership & advisor"
        href={derived.sourceLinks.members}
        lines={[
          ...derived.leadership.map(
            (officer) =>
              `${officer.displayName} · ${officer.role.replaceAll("_", " ")}`,
          ),
          derived.advisor
            ? `Advisor: ${derived.advisor.displayName}`
            : "No advisor on roster — update Members",
        ]}
      />
      <InfoCard
        title="Membership & meetings"
        href={derived.sourceLinks.attendance}
        lines={[
          `${derived.memberCount} active members`,
          `${derived.meetingsHeld} meetings held`,
          derived.attendance.rate == null
            ? "Attendance rate unavailable"
            : `${derived.attendance.rate}% attendance · ${derived.attendance.uniqueParticipants} unique participants`,
        ]}
      />
      <InfoCard
        title="Events"
        href={derived.sourceLinks.events}
        lines={
          derived.events.length
            ? derived.events.slice(0, 5).map((event) => event.title)
            : ["No events yet — add them under Events"]
        }
      />
      <InfoCard
        title="Major activities"
        href={derived.sourceLinks.activities}
        lines={
          derived.activities.length
            ? derived.activities
                .slice(0, 5)
                .map((activity) => `${activity.title} (${activity.activityDate})`)
            : ["No activities logged — add them under Activities"]
        }
      />
      <InfoCard
        title="Highlights"
        href={derived.sourceLinks.activities}
        lines={
          derived.highlights.length
            ? derived.highlights.map((item) => item.title)
            : ["No highlights yet"]
        }
      />
    </div>
  );
}

function InfoCard({
  title,
  href,
  lines,
}: {
  title: string;
  href: string;
  lines: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <Button asChild size="sm" variant="ghost">
          <Link href={href}>Correct at source</Link>
        </Button>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
