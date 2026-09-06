"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  previewAudienceCount,
  saveOrQueueCampaign,
  sendComposerTestEmail,
} from "@/features/communications/actions";
import {
  AUDIENCE_LABELS,
  CLUB_COMMUNICATION_KINDS,
  EMAIL_AUDIENCE_TYPES,
  KIND_LABELS,
  MEMBERSHIP_SEGMENT_ROLES,
} from "@/lib/validation/communications";

type EventOption = { id: string; title: string };

export function CommunicationsComposer({
  clubId,
  events,
}: {
  clubId: string;
  events: EventOption[];
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [campaignKind, setCampaignKind] =
    useState<(typeof CLUB_COMMUNICATION_KINDS)[number]>("announcement");
  const [audienceType, setAudienceType] =
    useState<(typeof EMAIL_AUDIENCE_TYPES)[number]>("all_members");
  const [segmentRoles, setSegmentRoles] = useState<string[]>(["member"]);
  const [eventId, setEventId] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sendMode, setSendMode] = useState<"draft" | "send_now" | "schedule">(
    "draft",
  );
  const [scheduledFor, setScheduledFor] = useState("");
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await previewAudienceCount({
        clubId,
        audienceType,
        campaignKind,
        segmentRoles,
        eventId: eventId || null,
      });
      if (result.ok) setRecipientCount(result.data.count);
      else setRecipientCount(null);
    });
  }, [audienceType, campaignKind, clubId, eventId, segmentRoles]);

  const payload = {
    clubId,
    name: name || subject || "Untitled campaign",
    subject,
    previewText,
    messageBody,
    campaignKind,
    audienceType,
    segmentRoles,
    eventId: eventId || null,
    ctaLabel,
    ctaUrl,
    sendMode,
    scheduledFor: scheduledFor || null,
  };

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await saveOrQueueCampaign(payload);
          if (!result.ok) {
            setMessage(result.error.message);
            return;
          }
          setMessage(
            result.data.queued
              ? `Queued for delivery to ${result.data.recipientCount} recipient${result.data.recipientCount === 1 ? "" : "s"}. Sending runs asynchronously.`
              : `Draft saved. Audience size: ${result.data.recipientCount}.`,
          );
          if (result.data.queued) {
            setName("");
            setSubject("");
            setPreviewText("");
            setMessageBody("");
          }
        });
      }}
    >
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Compose message
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recipients come only from membership and event data. There is no
          freeform bulk email field. Messages are sent individually.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="comm-name">Internal name</Label>
          <Input
            id="comm-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={160}
            placeholder="March announcement"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="comm-subject">Subject</Label>
          <Input
            id="comm-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={200}
            placeholder="Club update"
          />
          <p className="text-xs text-muted-foreground">
            Avoid private student details in subject lines.
          </p>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="comm-preview">Preview text</Label>
          <Input
            id="comm-preview"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            maxLength={180}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comm-kind">Email type</Label>
          <select
            id="comm-kind"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={campaignKind}
            onChange={(e) =>
              setCampaignKind(e.target.value as (typeof CLUB_COMMUNICATION_KINDS)[number])
            }
          >
            {CLUB_COMMUNICATION_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comm-audience">Audience</Label>
          <select
            id="comm-audience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={audienceType}
            onChange={(e) =>
              setAudienceType(e.target.value as (typeof EMAIL_AUDIENCE_TYPES)[number])
            }
          >
            {EMAIL_AUDIENCE_TYPES.map((audience) => (
              <option key={audience} value={audience}>
                {AUDIENCE_LABELS[audience]}
              </option>
            ))}
          </select>
        </div>

        {audienceType === "membership_segment" ? (
          <div className="space-y-2 sm:col-span-2">
            <Label>Membership segment</Label>
            <div className="flex flex-wrap gap-3">
              {MEMBERSHIP_SEGMENT_ROLES.map((role) => {
                const checked = segmentRoles.includes(role);
                return (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSegmentRoles((current) =>
                          e.target.checked
                            ? [...current, role]
                            : current.filter((item) => item !== role),
                        );
                      }}
                    />
                    {role.replaceAll("_", " ")}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {audienceType === "event_attendees" ||
        audienceType === "event_registrants" ? (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="comm-event">Event</Label>
            <select
              id="comm-event"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              required
            >
              <option value="">Select event…</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="comm-message">Message</Label>
          <textarea
            id="comm-message"
            className="min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
            maxLength={20000}
            placeholder="Write a clear message. HTML/scripts are not allowed."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comm-cta-label">CTA label (optional)</Label>
          <Input
            id="comm-cta-label"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comm-cta-url">CTA URL (https)</Label>
          <Input
            id="comm-cta-url"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comm-mode">Delivery</Label>
          <select
            id="comm-mode"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={sendMode}
            onChange={(e) =>
              setSendMode(e.target.value as "draft" | "send_now" | "schedule")
            }
          >
            <option value="draft">Save draft</option>
            <option value="send_now">Send now (async)</option>
            <option value="schedule">Schedule</option>
          </select>
        </div>
        {sendMode === "schedule" ? (
          <div className="space-y-1.5">
            <Label htmlFor="comm-schedule">Schedule for</Label>
            <Input
              id="comm-schedule"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
        Recipient count before send:{" "}
        <strong>
          {recipientCount == null ? "…" : recipientCount}
        </strong>{" "}
        ({AUDIENCE_LABELS[audienceType]}, preferences honored)
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {sendMode === "draft"
            ? "Save draft"
            : sendMode === "schedule"
              ? "Schedule send"
              : "Queue send"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending || !subject.trim() || !messageBody.trim()}
          onClick={() => {
            startTransition(async () => {
              const result = await sendComposerTestEmail({
                clubId,
                subject,
                previewText,
                messageBody,
                ctaLabel,
                ctaUrl,
                campaignKind,
              });
              setMessage(
                result.ok
                  ? "Test email sent to your account only."
                  : result.error.message,
              );
            });
          }}
        >
          Send test to me
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
