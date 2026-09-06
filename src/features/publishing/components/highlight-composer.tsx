"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveHighlight } from "@/features/publishing/actions";
import {
  HIGHLIGHT_SOURCE_LABELS,
  HIGHLIGHT_SOURCE_TYPES,
} from "@/lib/validation/publishing";

type Option = { id: string; title: string };

export function HighlightComposer({
  clubId,
  activities,
  events,
  media,
}: {
  clubId: string;
  activities: Option[];
  events: Option[];
  media: Option[];
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [sourceType, setSourceType] =
    useState<(typeof HIGHLIGHT_SOURCE_TYPES)[number]>("activity");
  const [occurredOn, setOccurredOn] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [visibility, setVisibility] = useState<"private" | "club" | "school" | "public">(
    "club",
  );
  const [relatedActivityId, setRelatedActivityId] = useState("");
  const [relatedEventId, setRelatedEventId] = useState("");
  const [coverAssetId, setCoverAssetId] = useState("");
  const [publish, setPublish] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await saveHighlight({
            clubId,
            title,
            summary,
            body,
            sourceType,
            occurredOn,
            visibility,
            relatedActivityId: relatedActivityId || null,
            relatedEventId: relatedEventId || null,
            coverAssetId: coverAssetId || null,
            publish,
          });
          setMessage(result.ok ? "Highlight saved." : result.error.message);
          if (result.ok) {
            setTitle("");
            setSummary("");
            setBody("");
          }
        });
      }}
    >
      <div>
        <h2 className="font-display text-lg font-semibold">New highlight</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture activities, events, media, and achievements for the club timeline.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hl-title">Title</Label>
          <Input id="hl-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hl-summary">Summary</Label>
          <Input
            id="hl-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hl-body">Details</Label>
          <textarea
            id="hl-body"
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-source">Source</Label>
          <select
            id="hl-source"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={sourceType}
            onChange={(e) =>
              setSourceType(e.target.value as (typeof HIGHLIGHT_SOURCE_TYPES)[number])
            }
          >
            {HIGHLIGHT_SOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {HIGHLIGHT_SOURCE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-date">Date</Label>
          <Input
            id="hl-date"
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-activity">Related activity</Label>
          <select
            id="hl-activity"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={relatedActivityId}
            onChange={(e) => setRelatedActivityId(e.target.value)}
          >
            <option value="">None</option>
            {activities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-event">Related event</Label>
          <select
            id="hl-event"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={relatedEventId}
            onChange={(e) => setRelatedEventId(e.target.value)}
          >
            <option value="">None</option>
            {events.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-media">Media</Label>
          <select
            id="hl-media"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={coverAssetId}
            onChange={(e) => setCoverAssetId(e.target.value)}
          >
            <option value="">None</option>
            {media.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-visibility">Visibility</Label>
          <select
            id="hl-visibility"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as typeof visibility)
            }
          >
            <option value="private">Private</option>
            <option value="club">Club members</option>
            <option value="school">School</option>
            <option value="public">Public</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          Publish to timeline now
        </label>
      </div>
      <Button type="submit" disabled={pending}>
        Save highlight
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
