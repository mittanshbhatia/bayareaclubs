"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  archiveNewsletter,
  fetchMonthFacts,
  publishNewsletterWeb,
  saveNewsletterDraft,
  scheduleOrSendNewsletter,
  sendNewsletterTestEmail,
} from "@/features/publishing/actions";
import {
  BLOCK_TYPE_LABELS,
  NEWSLETTER_BLOCK_TYPES,
  type NewsletterBlockInput,
} from "@/lib/validation/publishing";
import { cn } from "@/lib/utils";

type CourseOption = { id: string; title: string; provider_name: string };

function defaultContent(type: (typeof NEWSLETTER_BLOCK_TYPES)[number]) {
  switch (type) {
    case "hero":
      return { title: "This month with our club", subtitle: "" };
    case "text":
      return { body: "" };
    case "highlight":
      return { title: "", summary: "", highlightId: "" };
    case "event_recap":
    case "upcoming_event":
      return { title: "", summary: "", eventId: "" };
    case "image":
      return { imageUrl: "", alt: "" };
    case "gallery":
      return { captions: [] as string[] };
    case "stats":
      return { summary: "" };
    case "course_recommendation":
      return { title: "", provider: "", courseId: "" };
    case "cta":
      return { label: "Learn more", url: "https://" };
    case "divider":
      return {};
    default:
      return {};
  }
}

export function NewsletterStudio({
  clubId,
  clubName,
  clubSlug,
  newsletterId,
  initial,
  courses,
}: {
  clubId: string;
  clubName: string;
  clubSlug: string;
  newsletterId?: string;
  initial?: {
    title: string;
    issueLabel: string;
    previewText: string;
    visibility: "private" | "club" | "school" | "public";
    periodStart: string;
    periodEnd: string;
    selectedFacts: Record<string, unknown>;
    blocks: NewsletterBlockInput[];
    status: string;
  };
  courses: CourseOption[];
}) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const [id, setId] = useState(newsletterId);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [issueLabel, setIssueLabel] = useState(initial?.issueLabel ?? "");
  const [previewText, setPreviewText] = useState(initial?.previewText ?? "");
  const [visibility, setVisibility] = useState(initial?.visibility ?? "club");
  const [periodStart, setPeriodStart] = useState(initial?.periodStart || monthStart);
  const [periodEnd, setPeriodEnd] = useState(initial?.periodEnd || monthEnd);
  const [facts, setFacts] = useState<Record<string, unknown> | null>(null);
  const [selected, setSelected] = useState({
    includeMeetings: Boolean(initial?.selectedFacts?.includeMeetings),
    includeEvents: Boolean(initial?.selectedFacts?.includeEvents),
    includeNewMembers: Boolean(initial?.selectedFacts?.includeNewMembers),
    includeAttendance: Boolean(initial?.selectedFacts?.includeAttendance),
    includeHighlights: Boolean(initial?.selectedFacts?.includeHighlights),
    includeUpcoming: Boolean(initial?.selectedFacts?.includeUpcoming),
    eventIds: (initial?.selectedFacts?.eventIds as string[]) ?? [],
    highlightIds: (initial?.selectedFacts?.highlightIds as string[]) ?? [],
    upcomingEventIds: (initial?.selectedFacts?.upcomingEventIds as string[]) ?? [],
    courseIds: (initial?.selectedFacts?.courseIds as string[]) ?? [],
  });
  const [blocks, setBlocks] = useState<NewsletterBlockInput[]>(
    initial?.blocks?.length
      ? initial.blocks
      : [{ blockType: "hero", content: defaultContent("hero") }],
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "email">(
    "desktop",
  );
  const [scheduledFor, setScheduledFor] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const draftPayload = useMemo(
    () => ({
      clubId,
      newsletterId: id,
      title,
      issueLabel,
      previewText,
      visibility,
      periodStart,
      periodEnd,
      selectedFacts: selected,
      blocks,
    }),
    [blocks, clubId, id, issueLabel, periodEnd, periodStart, previewText, selected, title, visibility],
  );

  function applySelectedFactsToBlocks(nextFacts: Record<string, unknown>) {
    const nextBlocks: NewsletterBlockInput[] = [
      { blockType: "hero", content: { title, subtitle: issueLabel || "Club newsletter" } },
    ];
    const attendance = (nextFacts.attendance ?? {}) as Record<string, number>;
    const events = (nextFacts.events as Array<Record<string, string>>) ?? [];
    const upcoming = (nextFacts.upcoming_events as Array<Record<string, string>>) ?? [];
    const highlights = (nextFacts.highlights as Array<Record<string, string>>) ?? [];

    if (selected.includeMeetings || selected.includeNewMembers || selected.includeAttendance) {
      const parts: string[] = [];
      if (selected.includeMeetings) {
        parts.push(`Meetings recorded: ${Number(nextFacts.meetings_count ?? 0)}`);
      }
      if (selected.includeNewMembers) {
        parts.push(`New members: ${Number(nextFacts.new_members_count ?? 0)}`);
      }
      if (selected.includeAttendance) {
        parts.push(
          `Attendance sessions: ${Number(attendance.sessions ?? 0)}; present/late marks: ${Number(attendance.present_or_late_marks ?? 0)}`,
        );
      }
      nextBlocks.push({
        blockType: "stats",
        content: { summary: parts.join(" · ") },
      });
    }

    if (selected.includeEvents) {
      for (const event of events) {
        if (selected.eventIds.length && !selected.eventIds.includes(event.id)) continue;
        nextBlocks.push({
          blockType: "event_recap",
          content: {
            title: event.title,
            summary: `${event.event_type} · ${new Date(event.starts_at).toLocaleString()}`,
            eventId: event.id,
          },
        });
      }
    }

    if (selected.includeHighlights) {
      for (const highlight of highlights) {
        if (selected.highlightIds.length && !selected.highlightIds.includes(highlight.id)) {
          continue;
        }
        nextBlocks.push({
          blockType: "highlight",
          content: {
            title: highlight.title,
            summary: highlight.summary,
            highlightId: highlight.id,
          },
        });
      }
    }

    if (selected.includeUpcoming) {
      for (const event of upcoming) {
        if (
          selected.upcomingEventIds.length &&
          !selected.upcomingEventIds.includes(event.id)
        ) {
          continue;
        }
        nextBlocks.push({
          blockType: "upcoming_event",
          content: {
            title: event.title,
            summary: new Date(event.starts_at).toLocaleString(),
            eventId: event.id,
          },
        });
      }
    }

    for (const courseId of selected.courseIds) {
      const course = courses.find((item) => item.id === courseId);
      if (!course) continue;
      nextBlocks.push({
        blockType: "course_recommendation",
        content: {
          title: course.title,
          provider: course.provider_name,
          courseId: course.id,
        },
      });
    }

    nextBlocks.push({ blockType: "divider", content: {} });
    setBlocks(nextBlocks);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
      <div className="space-y-4">
        <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
          <h2 className="font-display text-lg font-semibold">Newsletter details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="nl-title">Title</Label>
              <Input id="nl-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-issue">Issue label</Label>
              <Input id="nl-issue" value={issueLabel} onChange={(e) => setIssueLabel(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-visibility">Visibility</Label>
              <select
                id="nl-visibility"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as typeof visibility)}
              >
                <option value="private">Private</option>
                <option value="club">Club</option>
                <option value="school">School</option>
                <option value="public">Public web when published</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="nl-preview">Preview text</Label>
              <Input
                id="nl-preview"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-start">Period start</Label>
              <Input
                id="nl-start"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-end">Period end</Label>
              <Input
                id="nl-end"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">This month facts</h2>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  const result = await fetchMonthFacts({
                    clubId,
                    periodStart,
                    periodEnd,
                  });
                  if (!result.ok) {
                    setMessage(result.error.message);
                    return;
                  }
                  setFacts(result.data);
                  setMessage("Loaded recorded club facts. Nothing was invented.");
                });
              }}
            >
              Load facts
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose which recorded facts to include. Counts come only from the database.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["includeMeetings", "Meetings"],
                ["includeEvents", "Events"],
                ["includeNewMembers", "New members"],
                ["includeAttendance", "Attendance summary"],
                ["includeHighlights", "Highlights"],
                ["includeUpcoming", "Upcoming events"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected[key]}
                  onChange={(e) =>
                    setSelected((current) => ({ ...current, [key]: e.target.checked }))
                  }
                />
                {label}
                {facts ? (
                  <span className="text-muted-foreground">
                    {key === "includeMeetings"
                      ? `(${Number(facts.meetings_count ?? 0)})`
                      : key === "includeNewMembers"
                        ? `(${Number(facts.new_members_count ?? 0)})`
                        : key === "includeEvents"
                          ? `(${Array.isArray(facts.events) ? facts.events.length : 0})`
                          : key === "includeHighlights"
                            ? `(${Array.isArray(facts.highlights) ? facts.highlights.length : 0})`
                            : key === "includeUpcoming"
                              ? `(${Array.isArray(facts.upcoming_events) ? facts.upcoming_events.length : 0})`
                              : key === "includeAttendance"
                                ? `(${Number((facts.attendance as { sessions?: number } | undefined)?.sessions ?? 0)} sessions)`
                                : ""}
                  </span>
                ) : null}
              </label>
            ))}
          </div>
          {courses.length > 0 ? (
            <div className="space-y-2">
              <Label>Course recommendations</Label>
              <div className="flex flex-wrap gap-2">
                {courses.map((course) => {
                  const checked = selected.courseIds.includes(course.id);
                  return (
                    <label key={course.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelected((current) => ({
                            ...current,
                            courseIds: e.target.checked
                              ? [...current.courseIds, course.id]
                              : current.courseIds.filter((item) => item !== course.id),
                          }))
                        }
                      />
                      {course.title}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            disabled={!facts || pending}
            onClick={() => {
              if (!facts) return;
              applySelectedFactsToBlocks(facts);
              setMessage("Inserted selected facts into structured blocks.");
            }}
          >
            Insert selected facts as blocks
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">Blocks</h2>
            <select
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value as (typeof NEWSLETTER_BLOCK_TYPES)[number];
                if (!value) return;
                setBlocks((current) => [
                  ...current,
                  { blockType: value, content: defaultContent(value) },
                ]);
                e.target.value = "";
              }}
            >
              <option value="">Add block…</option>
              {NEWSLETTER_BLOCK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {BLOCK_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <ul className="space-y-3">
            {blocks.map((block, index) => (
              <li key={`${block.blockType}-${index}`} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{BLOCK_TYPE_LABELS[block.blockType]}</p>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() =>
                        setBlocks((current) => {
                          const next = [...current];
                          const [item] = next.splice(index, 1);
                          next.splice(index - 1, 0, item);
                          return next;
                        })
                      }
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === blocks.length - 1}
                      onClick={() =>
                        setBlocks((current) => {
                          const next = [...current];
                          const [item] = next.splice(index, 1);
                          next.splice(index + 1, 0, item);
                          return next;
                        })
                      }
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setBlocks((current) => current.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {block.blockType !== "divider" ? (
                  <textarea
                    className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={String(
                      block.content.body ??
                        block.content.summary ??
                        block.content.subtitle ??
                        block.content.title ??
                        "",
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBlocks((current) =>
                        current.map((item, i) => {
                          if (i !== index) return item;
                          if (item.blockType === "text") {
                            return { ...item, content: { ...item.content, body: value } };
                          }
                          if (item.blockType === "hero") {
                            return { ...item, content: { ...item.content, subtitle: value } };
                          }
                          if (item.blockType === "stats") {
                            return { ...item, content: { ...item.content, summary: value } };
                          }
                          if (item.blockType === "cta") {
                            return { ...item, content: { ...item.content, label: value } };
                          }
                          return {
                            ...item,
                            content: { ...item.content, title: value },
                          };
                        }),
                      );
                    }}
                    placeholder="Block content"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Divider</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={pending || !title.trim()}
            onClick={() => {
              startTransition(async () => {
                const result = await saveNewsletterDraft(draftPayload);
                if (!result.ok) {
                  setMessage(result.error.message);
                  return;
                }
                setId(result.data.newsletterId);
                setMessage("Draft saved.");
              });
            }}
          >
            Save draft
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending || !id}
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                await saveNewsletterDraft(draftPayload);
                const result = await sendNewsletterTestEmail({
                  clubId,
                  newsletterId: id,
                });
                setMessage(
                  result.ok
                    ? "Test email sent to you."
                    : result.error.message,
                );
              });
            }}
          >
            Test send
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending || !id}
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                await saveNewsletterDraft(draftPayload);
                const result = await publishNewsletterWeb({
                  clubId,
                  newsletterId: id,
                });
                setMessage(
                  result.ok
                    ? visibility === "public"
                      ? `Published. Public web: /p/${clubSlug}/newsletters/${id}`
                      : "Published for authorized club/school readers. Public web requires public visibility."
                    : result.error.message,
                );
              });
            }}
          >
            Publish web
          </Button>
          <div className="flex flex-wrap items-end gap-2">
            <Input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-auto"
            />
            <Button
              type="button"
              variant="outline"
              disabled={pending || !id || !scheduledFor}
              onClick={() => {
                if (!id) return;
                startTransition(async () => {
                  await saveNewsletterDraft(draftPayload);
                  const result = await scheduleOrSendNewsletter({
                    clubId,
                    newsletterId: id,
                    scheduledFor,
                    mode: "schedule",
                  });
                  setMessage(
                    result.ok
                      ? "Newsletter email scheduled (async)."
                      : result.error.message,
                  );
                });
              }}
            >
              Schedule email
            </Button>
          </div>
          <Button
            type="button"
            disabled={pending || !id}
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                await saveNewsletterDraft(draftPayload);
                const result = await scheduleOrSendNewsletter({
                  clubId,
                  newsletterId: id,
                  mode: "send",
                });
                setMessage(
                  result.ok
                    ? "Newsletter email queued for async send."
                    : result.error.message,
                );
              });
            }}
          >
            Send email
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending || !id}
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                const result = await archiveNewsletter({
                  clubId,
                  newsletterId: id,
                });
                setMessage(result.ok ? "Archived." : result.error.message);
              });
            }}
          >
            Archive
          </Button>
        </div>
        {message ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>

      <aside className="space-y-3">
        <div className="flex gap-1">
          {(["desktop", "mobile", "email"] as const).map((mode) => (
            <Button
              key={mode}
              type="button"
              size="sm"
              variant={previewMode === mode ? "default" : "outline"}
              onClick={() => setPreviewMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
        <div
          className={cn(
            "rounded-lg border border-border bg-surface p-4 shadow-xs",
            previewMode === "mobile" && "mx-auto max-w-[22rem]",
            previewMode === "email" && "bg-[#f7f8f6]",
          )}
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            {clubName}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold">
            {title || "Untitled newsletter"}
          </h3>
          {issueLabel ? (
            <p className="text-sm text-muted-foreground">{issueLabel}</p>
          ) : null}
          <div className="mt-4 space-y-3">
            {blocks.map((block, index) => (
              <div key={`${block.blockType}-${index}`}>
                {block.blockType === "divider" ? (
                  <hr className="border-border" />
                ) : (
                  <div className={cn(previewMode === "email" && "rounded-md bg-white p-3")}>
                    <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      {BLOCK_TYPE_LABELS[block.blockType]}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">
                      {String(
                        block.content.body ??
                          block.content.summary ??
                          block.content.subtitle ??
                          block.content.title ??
                          block.content.label ??
                          "",
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
