"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  approveEventAction,
  completeEventAction,
  deleteEventTaskAction,
  deleteLogisticsItemAction,
  overrideRsvpAction,
  saveEventTaskAction,
  saveLogisticsItemAction,
  upsertRsvpAction,
} from "@/features/events/actions";
import { EventBuilder } from "@/features/events/components/event-builder";
import {
  EVENT_TYPE_LABELS,
  LOGISTICS_TYPE_LABELS,
  logisticsStatuses,
  logisticsTypes,
  rsvpStatuses,
  taskStatuses,
  type EventDraftInput,
} from "@/lib/validation/events";

type Member = { userId: string; displayName: string; role: string };
type Rsvp = {
  id: string;
  userId: string;
  status: string;
  displayName: string;
  waitlistedAt: string | null;
};
type LogisticsItem = {
  id: string;
  logistics_type: (typeof logisticsTypes)[number];
  title: string;
  notes: string;
  status: (typeof logisticsStatuses)[number];
  owner_id: string | null;
  due_at: string | null;
};
type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  status: (typeof taskStatuses)[number];
  assigned_to: string | null;
  due_at: string | null;
};

export function EventDetailPanel({
  clubId,
  clubSlug,
  draft,
  status,
  eventId,
  capacity,
  goingCount,
  waitlistedCount,
  maybeEnabled,
  rsvps,
  logistics,
  tasks,
  members,
  postEvent,
}: {
  clubId: string;
  clubSlug: string;
  draft: Partial<EventDraftInput> & {
    startsAtIso?: string | null;
    endsAtIso?: string | null;
    rsvpDeadlineIso?: string | null;
  };
  status: string;
  eventId: string;
  capacity: number | null;
  goingCount: number;
  waitlistedCount: number;
  maybeEnabled: boolean;
  rsvps: Rsvp[];
  logistics: LogisticsItem[];
  tasks: TaskItem[];
  members: Member[];
  postEvent: {
    needsAttendance: boolean;
    needsActivity: boolean;
    ended: boolean;
    completed: boolean;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [overrideNote, setOverrideNote] = useState("");
  const [selectedRsvp, setSelectedRsvp] = useState(rsvps[0]?.id ?? "");
  const [overrideStatus, setOverrideStatus] =
    useState<(typeof rsvpStatuses)[number]>("going");

  const [logisticsForm, setLogisticsForm] = useState({
    logisticsType: "venue" as (typeof logisticsTypes)[number],
    title: "",
    notes: "",
    status: "not_started" as (typeof logisticsStatuses)[number],
    ownerId: "",
    dueAt: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "open" as (typeof taskStatuses)[number],
    assignedTo: "",
    dueAt: "",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/clubs/${clubSlug}/events`}>Back to events</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={
              status === "published"
                ? "active"
                : status === "cancelled"
                  ? "rejected"
                  : status === "completed"
                    ? "approved"
                    : "draft"
            }
          />
          <p className="text-sm text-muted-foreground">
            {goingCount}
            {capacity != null ? `/${capacity}` : ""} going
            {waitlistedCount ? ` · ${waitlistedCount} waitlisted` : ""}
          </p>
        </div>
      </div>

      {(postEvent.ended || postEvent.completed) && (
        <section className="space-y-3 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <h2 className="font-semibold">After the event</h2>
          <p className="text-sm text-muted-foreground">
            Close the loop so attendance, activities, media, and highlights stay
            accurate for renewals and insights.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/clubs/${clubSlug}/attendance`}
              >
                {postEvent.needsAttendance
                  ? "Close attendance for this event"
                  : "Review attendance"}
              </Link>
            </li>
            <li>
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/clubs/${clubSlug}/activities`}
              >
                {postEvent.needsActivity
                  ? "Add an activity summary"
                  : "Review related activities"}
              </Link>
            </li>
            <li>
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/clubs/${clubSlug}/media`}
              >
                Upload approved media
              </Link>
            </li>
            <li>
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={`/clubs/${clubSlug}`}
              >
                Publish a club highlight
              </Link>
            </li>
          </ul>
          {!postEvent.completed ? (
            <Button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await completeEventAction({ clubId, eventId });
                  if (!result.ok) {
                    setError(result.error.message);
                    return;
                  }
                  setMessage("Event marked completed");
                  router.refresh();
                })
              }
            >
              Mark event completed
            </Button>
          ) : null}
        </section>
      )}

      <EventBuilder
        clubId={clubId}
        clubSlug={clubSlug}
        status={status}
        initial={{ ...draft, eventId }}
      />

      {status === "pending_approval" ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-muted-foreground">
            Awaiting school/admin approval. Authorized reviewers can publish.
          </p>
          <Button
            className="mt-3"
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await approveEventAction({ clubId, eventId });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setMessage("Event approved and published");
                router.refresh();
              })
            }
          >
            Approve & publish
          </Button>
        </div>
      ) : null}

      {status === "published" || status === "completed" ? (
        <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold">RSVP</h2>
          <div className="flex flex-wrap gap-2">
            {(["going", "maybe", "not_going"] as const)
              .filter((statusOption) => maybeEnabled || statusOption !== "maybe")
              .map((statusOption) => (
                <Button
                  key={statusOption}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await upsertRsvpAction({
                        eventId,
                        status: statusOption,
                      });
                      if (!result.ok) {
                        setError(result.error.message);
                        return;
                      }
                      setMessage(
                        statusOption === "not_going"
                          ? "Declined"
                          : `RSVP ${statusOption}`,
                      );
                      router.refresh();
                    })
                  }
                >
                  {statusOption === "not_going" ? "Declined" : statusOption}
                </Button>
              ))}
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {rsvps.map((rsvp) => (
              <li
                key={rsvp.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
              >
                <span>
                  {rsvp.displayName} ·{" "}
                  <span className="capitalize">
                    {rsvp.status === "not_going" ? "declined" : rsvp.status}
                  </span>
                </span>
                <button
                  type="button"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                  onClick={() => setSelectedRsvp(rsvp.id)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-border pt-3">
            <h3 className="text-sm font-semibold">Admin / officer override</h3>
            <p className="text-xs text-muted-foreground">
              Overrides are capacity-checked and written to the audit log.
            </p>
            <div className="flex flex-wrap gap-2">
              <select
                className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
                value={selectedRsvp}
                onChange={(e) => setSelectedRsvp(e.target.value)}
              >
                {rsvps.map((rsvp) => (
                  <option key={rsvp.id} value={rsvp.id}>
                    {rsvp.displayName}
                  </option>
                ))}
              </select>
              <select
                className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
                value={overrideStatus}
                onChange={(e) =>
                  setOverrideStatus(e.target.value as (typeof rsvpStatuses)[number])
                }
              >
                {rsvpStatuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption === "not_going" ? "declined" : statusOption}
                  </option>
                ))}
              </select>
            </div>
            <Input
              value={overrideNote}
              onChange={(e) => setOverrideNote(e.target.value)}
              placeholder="Override reason (required)"
            />
            <Button
              type="button"
              variant="outline"
              disabled={pending || !selectedRsvp || overrideNote.trim().length < 3}
              onClick={() =>
                startTransition(async () => {
                  const result = await overrideRsvpAction({
                    clubId,
                    rsvpId: selectedRsvp,
                    status: overrideStatus,
                    overrideNote,
                  });
                  if (!result.ok) {
                    setError(result.error.message);
                    return;
                  }
                  setMessage("RSVP override saved");
                  setOverrideNote("");
                  router.refresh();
                })
              }
            >
              Apply override
            </Button>
          </div>
        </section>
      ) : null}

      <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-semibold">Logistics</h2>
        <ul className="space-y-2 text-sm">
          {logistics.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="font-medium">
                  {LOGISTICS_TYPE_LABELS[item.logistics_type]} · {item.title}
                </p>
                <p className="text-muted-foreground capitalize">
                  {item.status.replaceAll("_", " ")}
                  {item.due_at
                    ? ` · due ${new Date(item.due_at).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteLogisticsItemAction({
                      clubId,
                      eventId,
                      itemId: item.id,
                    });
                    router.refresh();
                  })
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
            value={logisticsForm.logisticsType}
            onChange={(e) =>
              setLogisticsForm((prev) => ({
                ...prev,
                logisticsType: e.target.value as (typeof logisticsTypes)[number],
              }))
            }
          >
            {logisticsTypes.map((type) => (
              <option key={type} value={type}>
                {LOGISTICS_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <select
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
            value={logisticsForm.status}
            onChange={(e) =>
              setLogisticsForm((prev) => ({
                ...prev,
                status: e.target.value as (typeof logisticsStatuses)[number],
              }))
            }
          >
            {logisticsStatuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <Input
            placeholder="Title"
            value={logisticsForm.title}
            onChange={(e) =>
              setLogisticsForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            type="datetime-local"
            value={logisticsForm.dueAt}
            onChange={(e) =>
              setLogisticsForm((prev) => ({ ...prev, dueAt: e.target.value }))
            }
          />
          <select
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm sm:col-span-2"
            value={logisticsForm.ownerId}
            onChange={(e) =>
              setLogisticsForm((prev) => ({ ...prev, ownerId: e.target.value }))
            }
          >
            <option value="">Owner (optional)</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.displayName}
              </option>
            ))}
          </select>
          <Textarea
            className="sm:col-span-2"
            placeholder="Notes"
            value={logisticsForm.notes}
            onChange={(e) =>
              setLogisticsForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>
        <Button
          type="button"
          disabled={pending || !logisticsForm.title.trim()}
          onClick={() =>
            startTransition(async () => {
              const result = await saveLogisticsItemAction({
                clubId,
                eventId,
                logisticsType: logisticsForm.logisticsType,
                title: logisticsForm.title,
                notes: logisticsForm.notes,
                status: logisticsForm.status,
                ownerId: logisticsForm.ownerId || null,
                dueAt: logisticsForm.dueAt || null,
              });
              if (!result.ok) {
                setError(result.error.message);
                return;
              }
              setLogisticsForm({
                logisticsType: "venue",
                title: "",
                notes: "",
                status: "not_started",
                ownerId: "",
                dueAt: "",
              });
              router.refresh();
            })
          }
        >
          Add logistics item
        </Button>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-semibold">Tasks</h2>
        <ul className="space-y-2 text-sm">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="capitalize text-muted-foreground">
                  {task.status.replaceAll("_", " ")}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteEventTaskAction({
                      clubId,
                      eventId,
                      taskId: task.id,
                    });
                    router.refresh();
                  })
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <select
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
            value={taskForm.status}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                status: e.target.value as (typeof taskStatuses)[number],
              }))
            }
          >
            {taskStatuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption === "open"
                  ? "not started"
                  : statusOption === "completed"
                    ? "complete"
                    : statusOption.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <Input
            type="datetime-local"
            value={taskForm.dueAt}
            onChange={(e) =>
              setTaskForm((prev) => ({ ...prev, dueAt: e.target.value }))
            }
          />
          <select
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
            value={taskForm.assignedTo}
            onChange={(e) =>
              setTaskForm((prev) => ({ ...prev, assignedTo: e.target.value }))
            }
          >
            <option value="">Assignee (optional)</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.displayName}
              </option>
            ))}
          </select>
          <Textarea
            className="sm:col-span-2"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <Button
          type="button"
          disabled={pending || !taskForm.title.trim()}
          onClick={() =>
            startTransition(async () => {
              const result = await saveEventTaskAction({
                clubId,
                eventId,
                title: taskForm.title,
                description: taskForm.description || null,
                status: taskForm.status,
                assignedTo: taskForm.assignedTo || null,
                dueAt: taskForm.dueAt || null,
              });
              if (!result.ok) {
                setError(result.error.message);
                return;
              }
              setTaskForm({
                title: "",
                description: "",
                status: "open",
                assignedTo: "",
                dueAt: "",
              });
              router.refresh();
            })
          }
        >
          Add task
        </Button>
      </section>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
      <p className="text-xs text-muted-foreground">
        Type:{" "}
        {EVENT_TYPE_LABELS[
          (draft.eventType ?? "other") as keyof typeof EVENT_TYPE_LABELS
        ]}
      </p>
    </div>
  );
}
