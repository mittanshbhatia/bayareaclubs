"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAttendanceSessionAction } from "@/features/attendance/actions";
import { attendanceStatuses } from "@/lib/validation/attendance";

type Member = { id: string; displayName: string; role: string };
type EventOption = { id: string; title: string; starts_at: string };

export function CreateAttendanceSessionForm({
  clubId,
  clubSlug,
  members,
  events,
}: {
  clubId: string;
  clubSlug: string;
  members: Member[];
  events: EventOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("Meeting");
  const [startsAt, setStartsAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [locationName, setLocationName] = useState("");
  const [eventId, setEventId] = useState("");
  const [defaultStatus, setDefaultStatus] =
    useState<(typeof attendanceStatuses)[number]>("absent");
  const [checkInEnabled, setCheckInEnabled] = useState(false);
  const [selected, setSelected] = useState<string[]>(() =>
    members.map((member) => member.id),
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) =>
      member.displayName.toLowerCase().includes(q),
    );
  }, [members, query]);

  return (
    <form
      className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setError(null);
          const result = await createAttendanceSessionAction({
            clubId,
            title,
            startsAt,
            locationName: locationName || null,
            eventId: eventId || null,
            membershipIds: selected,
            defaultStatus,
            checkInEnabled,
          });
          if (!result.ok) {
            setError(result.error.message);
            return;
          }
          router.push(
            `/clubs/${clubSlug}/attendance/${result.data.sessionId}`,
          );
          router.refresh();
        });
      }}
    >
      <h2 className="font-semibold">Create attendance session</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <Label htmlFor="session-title">Title</Label>
          <Input
            id="session-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="session-start">Starts</Label>
          <Input
            id="session-start"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="session-location">Location</Label>
          <Input
            id="session-location"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="session-event">Related event</Label>
          <select
            id="session-event"
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">None</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="default-status">Default mark</Label>
          <select
            id="default-status"
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
            value={defaultStatus}
            onChange={(e) =>
              setDefaultStatus(
                e.target.value as (typeof attendanceStatuses)[number],
              )
            }
          >
            {attendanceStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={checkInEnabled}
            onChange={(e) => setCheckInEnabled(e.target.checked)}
          />
          <span>
            Enable authenticated check-in tokens (off by default; not a public QR
            open door)
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="member-search">Eligible members</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSelected(members.map((member) => member.id))}
            >
              Select all
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSelected([])}
            >
              Clear
            </Button>
          </div>
        </div>
        <Input
          id="member-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members"
        />
        <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-2">
          {filtered.map((member) => (
            <li key={member.id}>
              <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-muted">
                <input
                  type="checkbox"
                  checked={selected.includes(member.id)}
                  onChange={(e) => {
                    setSelected((prev) =>
                      e.target.checked
                        ? [...prev, member.id]
                        : prev.filter((id) => id !== member.id),
                    );
                  }}
                />
                <span>{member.displayName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {member.role.replaceAll("_", " ")}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          {selected.length} selected
        </p>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || selected.length === 0}>
        Create session and take attendance
      </Button>
    </form>
  );
}
