"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  publishEventAction,
  saveEventDraftAction,
} from "@/features/events/actions";
import {
  EVENT_BUILDER_STEPS,
  EVENT_TYPE_LABELS,
  eventFormats,
  eventTypes,
  type EventDraftInput,
} from "@/lib/validation/events";
import { cn } from "@/lib/utils";

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventBuilder({
  clubId,
  clubSlug,
  initial,
  status = "draft",
}: {
  clubId: string;
  clubSlug: string;
  initial?: Partial<EventDraftInput> & {
    startsAtIso?: string | null;
    endsAtIso?: string | null;
    rsvpDeadlineIso?: string | null;
  };
  status?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<EventDraftInput>({
    clubId,
    eventId: initial?.eventId,
    builderStep: initial?.builderStep ?? 1,
    eventType: initial?.eventType ?? "club_meeting",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    startsAt:
      initial?.startsAt ??
      (toLocalInput(initial?.startsAtIso) || undefined),
    endsAt:
      initial?.endsAt ?? (toLocalInput(initial?.endsAtIso) || undefined),
    timezone: initial?.timezone ?? "America/Los_Angeles",
    format: initial?.format ?? "in_person",
    locationName: initial?.locationName ?? "",
    onlineUrl: initial?.onlineUrl ?? "",
    capacity: initial?.capacity ?? null,
    waitlistEnabled: initial?.waitlistEnabled ?? false,
    rsvpDeadline:
      initial?.rsvpDeadline ??
      (toLocalInput(initial?.rsvpDeadlineIso) || null),
    maybeRsvpEnabled: initial?.maybeRsvpEnabled ?? true,
    audienceNotes: initial?.audienceNotes ?? "",
    permissionsNotes: initial?.permissionsNotes ?? "",
    visibility: initial?.visibility ?? "club",
    approvalRequired: initial?.approvalRequired ?? false,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editable = ["draft", "pending_approval", "published"].includes(status);
  const step = form.builderStep;

  const completion = useMemo(() => {
    const checks = [
      form.title.trim().length > 0,
      form.description.trim().length > 10,
      Boolean(form.startsAt && form.endsAt),
      form.format === "online"
        ? Boolean(form.onlineUrl?.trim())
        : form.format === "hybrid"
          ? Boolean(form.locationName?.trim() && form.onlineUrl?.trim())
          : Boolean(form.locationName?.trim()),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  useEffect(() => {
    if (!editable) return;
    const handle = window.setTimeout(() => {
      startTransition(async () => {
        const result = await saveEventDraftAction(form);
        if (result.ok) {
          setMessage("Draft saved");
          if (!form.eventId) {
            setForm((prev) => ({ ...prev, eventId: result.data.eventId }));
            router.replace(`/clubs/${clubSlug}/events/${result.data.eventId}`);
          }
        }
      });
    }, 900);
    return () => window.clearTimeout(handle);
  }, [form, editable, clubSlug, router]);

  function update<K extends keyof EventDraftInput>(key: K, value: EventDraftInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            {form.eventId ? "Edit event" : "New event"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Builder sections cover small meetings through large club events. Autosave
            is on while drafting.
          </p>
        </div>
        <p className="font-mono text-sm">{completion}% ready</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EVENT_BUILDER_STEPS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              step === item.id
                ? "border-primary bg-primary/10"
                : "border-border bg-surface text-muted-foreground",
            )}
            onClick={() => update("builderStep", item.id)}
          >
            {item.id}. {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs">
        {step === 1 ? (
          <>
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                disabled={!editable}
              />
            </Field>
            <Field label="Event type">
              <select
                className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
                value={form.eventType}
                disabled={!editable}
                onChange={(e) =>
                  update("eventType", e.target.value as EventDraftInput["eventType"])
                }
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <Textarea
                rows={6}
                value={form.description}
                disabled={!editable}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts">
              <Input
                type="datetime-local"
                value={form.startsAt ?? ""}
                disabled={!editable}
                onChange={(e) => update("startsAt", e.target.value)}
              />
            </Field>
            <Field label="Ends">
              <Input
                type="datetime-local"
                value={form.endsAt ?? ""}
                disabled={!editable}
                onChange={(e) => update("endsAt", e.target.value)}
              />
            </Field>
            <Field label="Timezone">
              <Input
                value={form.timezone}
                disabled={!editable}
                onChange={(e) => update("timezone", e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <>
            <Field label="Location mode">
              <select
                className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
                value={form.format}
                disabled={!editable}
                onChange={(e) =>
                  update("format", e.target.value as EventDraftInput["format"])
                }
              >
                {eventFormats.map((format) => (
                  <option key={format} value={format}>
                    {format.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            {form.format !== "online" ? (
              <Field label="Location">
                <Input
                  value={form.locationName ?? ""}
                  disabled={!editable}
                  onChange={(e) => update("locationName", e.target.value)}
                />
              </Field>
            ) : null}
            {form.format !== "in_person" ? (
              <Field label="Online URL">
                <Input
                  value={form.onlineUrl ?? ""}
                  disabled={!editable}
                  onChange={(e) => update("onlineUrl", e.target.value)}
                />
              </Field>
            ) : null}
          </>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Capacity (optional)">
              <Input
                type="number"
                min={1}
                value={form.capacity ?? ""}
                disabled={!editable}
                onChange={(e) =>
                  update(
                    "capacity",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={form.waitlistEnabled}
                disabled={!editable}
                onChange={(e) => update("waitlistEnabled", e.target.checked)}
              />
              Enable waitlist when full
            </label>
          </div>
        ) : null}

        {step === 5 ? (
          <Field label="Audience notes">
            <Textarea
              rows={5}
              value={form.audienceNotes}
              disabled={!editable}
              onChange={(e) => update("audienceNotes", e.target.value)}
              placeholder="Who should attend? Grade bands, members only, open to school…"
            />
          </Field>
        ) : null}

        {step === 6 ? (
          <div className="space-y-4">
            <Field label="Registration deadline">
              <Input
                type="datetime-local"
                value={form.rsvpDeadline ?? ""}
                disabled={!editable}
                onChange={(e) => update("rsvpDeadline", e.target.value || null)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.maybeRsvpEnabled}
                disabled={!editable}
                onChange={(e) => update("maybeRsvpEnabled", e.target.checked)}
              />
              Allow “maybe” RSVPs
            </label>
            <p className="text-sm text-muted-foreground">
              Going / declined / waitlisted are always available. Capacity overbooking is
              blocked in the database; waitlist promotion is FIFO.
            </p>
          </div>
        ) : null}

        {step === 7 || step === 8 ? (
          <p className="text-sm text-muted-foreground">
            Save this draft, then manage {step === 7 ? "logistics" : "tasks"} on the event
            detail page after the event exists.
          </p>
        ) : null}

        {step === 9 ? (
          <div className="space-y-4">
            <Field label="Permissions notes">
              <Textarea
                rows={4}
                value={form.permissionsNotes}
                disabled={!editable}
                onChange={(e) => update("permissionsNotes", e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.approvalRequired}
                disabled={!editable}
                onChange={(e) => update("approvalRequired", e.target.checked)}
              />
              Require school/admin approval before publish
            </label>
            <Field label="Visibility">
              <select
                className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
                value={form.visibility}
                disabled={!editable}
                onChange={(e) =>
                  update(
                    "visibility",
                    e.target.value as EventDraftInput["visibility"],
                  )
                }
              >
                <option value="club">Club</option>
                <option value="school">School</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </Field>
          </div>
        ) : null}

        {step === 10 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Publishing validates location rules and opens RSVPs when status becomes
              published.
            </p>
            <Button
              type="button"
              disabled={pending || !form.eventId || status === "published"}
              onClick={() => {
                if (!form.eventId) return;
                startTransition(async () => {
                  setError(null);
                  const saved = await saveEventDraftAction(form);
                  if (!saved.ok) {
                    setError(saved.error.message);
                    return;
                  }
                  const result = await publishEventAction({
                    clubId,
                    eventId: form.eventId!,
                  });
                  if (!result.ok) {
                    setError(result.error.message);
                    return;
                  }
                  setMessage(
                    result.data.status === "pending_approval"
                      ? "Submitted for approval"
                      : "Published",
                  );
                  router.refresh();
                });
              }}
            >
              {form.approvalRequired ? "Submit for approval" : "Publish event"}
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={step <= 1}
            onClick={() => update("builderStep", Math.max(1, step - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={step >= EVENT_BUILDER_STEPS.length}
            onClick={() =>
              update("builderStep", Math.min(EVENT_BUILDER_STEPS.length, step + 1))
            }
          >
            Next
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
