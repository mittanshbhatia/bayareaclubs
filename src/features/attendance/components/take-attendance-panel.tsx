"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  correctAttendanceRecordAction,
  issueCheckInTokenAction,
  saveAttendanceRecordsAction,
} from "@/features/attendance/actions";
import {
  attendanceStatuses,
  type AttendanceStatus,
} from "@/lib/validation/attendance";
import { cn } from "@/lib/utils";

type RecordRow = {
  id: string;
  membershipId: string;
  displayName: string;
  status: AttendanceStatus;
  note: string | null;
};

const STATUS_KEYS: Record<string, AttendanceStatus> = {
  "1": "present",
  "2": "late",
  "3": "excused",
  "4": "absent",
  p: "present",
  l: "late",
  e: "excused",
  a: "absent",
};

export function TakeAttendancePanel({
  clubId,
  sessionId,
  title,
  checkInEnabled,
  initialRecords,
}: {
  clubId: string;
  sessionId: string;
  title: string;
  checkInEnabled: boolean;
  initialRecords: RecordRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    () =>
      Object.fromEntries(
        initialRecords.map((record) => [record.membershipId, record.status]),
      ),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<string | null>(null);
  const [correctionNote, setCorrectionNote] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialRecords;
    return initialRecords.filter((record) =>
      record.displayName.toLowerCase().includes(q),
    );
  }, [initialRecords, query]);

  const safeFocusIndex =
    filtered.length === 0
      ? 0
      : Math.min(focusIndex, filtered.length - 1);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-attendance-index="${safeFocusIndex}"]`,
    );
    node?.focus();
  }, [safeFocusIndex, filtered.length]);

  function setStatus(membershipId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({ ...prev, [membershipId]: status }));
    setMessage(null);
    setError(null);
  }

  function markAllPresent() {
    setStatuses((prev) => {
      const next = { ...prev };
      for (const record of filtered) {
        next[record.membershipId] = "present";
      }
      return next;
    });
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusIndex(Math.min(index + 1, filtered.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusIndex(Math.max(index - 1, 0));
      return;
    }
    if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      searchRef.current?.focus();
      return;
    }
    const mapped = STATUS_KEYS[event.key.toLowerCase()];
    if (mapped) {
      event.preventDefault();
      const row = filtered[index];
      if (row) setStatus(row.membershipId, mapped);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Search, arrow keys to move, 1/P present · 2/L late · 3/E excused ·
            4/A absent. Mark all present, then adjust exceptions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={markAllPresent}>
            Mark all present
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await saveAttendanceRecordsAction({
                  clubId,
                  sessionId,
                  records: initialRecords.map((record) => ({
                    membershipId: record.membershipId,
                    status: statuses[record.membershipId] ?? record.status,
                    note: record.note,
                  })),
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setMessage(`Saved ${result.data.saved} records`);
                router.refresh();
              })
            }
          >
            Save attendance
          </Button>
        </div>
      </div>

      <Input
        ref={searchRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setFocusIndex(0);
        }}
        placeholder="Search member (/ to focus)"
        aria-label="Search members"
      />

      <ul ref={listRef} className="divide-y divide-border rounded-xl border border-border bg-surface">
        {filtered.map((record, index) => {
          const status = statuses[record.membershipId] ?? record.status;
          return (
            <li
              key={record.membershipId}
              data-attendance-index={index}
              tabIndex={0}
              onKeyDown={(event) => onKeyDown(event, index)}
              onFocus={() => setFocusIndex(index)}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 px-4 py-3 outline-none focus-visible:bg-surface-muted",
                safeFocusIndex === index ? "bg-surface-muted" : null,
              )}
            >
              <div>
                <p className="font-medium">{record.displayName}</p>
                <p className="text-xs capitalize text-muted-foreground">{status}</p>
              </div>
              <div className="flex flex-wrap gap-1" role="group" aria-label={`Status for ${record.displayName}`}>
                {attendanceStatuses.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    size="sm"
                    variant={status === option ? "default" : "outline"}
                    onClick={() => setStatus(record.membershipId, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
        <h3 className="font-semibold">Officer correction</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Corrections update the record and write an audit log entry.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
            placeholder="Correction reason (required)"
            className="min-w-[16rem] flex-1"
          />
          <Button
            type="button"
            variant="outline"
            disabled={
              pending ||
              correctionNote.trim().length < 3 ||
              !filtered[safeFocusIndex]
            }
            onClick={() => {
              const row = filtered[safeFocusIndex];
              if (!row) return;
              startTransition(async () => {
                setError(null);
                const result = await correctAttendanceRecordAction({
                  clubId,
                  recordId: row.id,
                  status: statuses[row.membershipId] ?? row.status,
                  correctionNote,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setMessage("Correction saved");
                setCorrectionNote("");
                router.refresh();
              });
            }}
          >
            Correct focused member
          </Button>
        </div>
      </div>

      {checkInEnabled ? (
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <h3 className="font-semibold">Authenticated check-in token</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Short-lived, one-time, requires sign-in. Not an open public QR
            attendance door.
          </p>
          <Button
            type="button"
            className="mt-3"
            variant="outline"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await issueCheckInTokenAction({
                  clubId,
                  sessionId,
                  ttlSeconds: 120,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                const path = `/attendance/check-in?token=${encodeURIComponent(result.data.token)}`;
                setTokenInfo(
                  `Token ready (${result.data.expiresInSeconds}s). Share path ${path} only with authenticated members.`,
                );
              })
            }
          >
            Issue 2-minute check-in token
          </Button>
          {tokenInfo ? (
            <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
              {tokenInfo}
            </p>
          ) : null}
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
