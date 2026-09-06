"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import { FilterBar } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attachMediaToTarget,
  createMediaSignedUrl,
  deleteMediaAsset,
} from "@/features/media/actions";
import { cn } from "@/lib/utils";

export type MediaLibraryItem = {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  mime_type: string;
  size_bytes: number;
  storage_bucket: string;
  visibility: string;
  consent_required: boolean;
  consent_state: string;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  related_event_id: string | null;
  uploader_id: string;
  created_at: string;
  uploader?: { id: string; display_name: string } | { id: string; display_name: string }[] | null;
};

type AttachTargets = {
  activities: { id: string; title: string; activity_date: string }[];
  events: { id: string; title: string; starts_at: string; status: string }[];
  highlights: { id: string; title: string; status: string }[];
  newsletters: { id: string; title: string; status: string }[];
  activityMediaIds?: Record<string, string[]>;
};

type UploaderOption = { id: string; displayName: string };

function uploaderName(item: MediaLibraryItem) {
  const profile = Array.isArray(item.uploader) ? item.uploader[0] : item.uploader;
  return profile?.display_name ?? "Unknown";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaThumb({
  asset,
  clubId,
}: {
  asset: MediaLibraryItem;
  clubId: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void createMediaSignedUrl({
      mediaAssetId: asset.id,
      clubId,
      transformWidth: asset.media_type === "image" ? 640 : undefined,
      expiresIn: 600,
    }).then((result) => {
      if (!cancelled && result.ok) setUrl(result.data.signedUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [asset.id, asset.media_type, clubId]);

  if (asset.media_type === "image" && url) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={url}
          alt={asset.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
    );
  }

  if (asset.media_type === "video" && url) {
    return (
      <div className="aspect-[4/3] bg-muted">
        <video
          className="size-full object-cover"
          controls
          preload="none"
          playsInline
          src={url}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground">
      {asset.media_type === "document" ? "Document" : asset.media_type}
      {!url ? " · loading preview…" : null}
    </div>
  );
}

export function MediaLibraryPanel({
  clubId,
  initialItems,
  uploaders,
  attachTargets,
}: {
  clubId: string;
  initialItems: MediaLibraryItem[];
  uploaders: UploaderOption[];
  attachTargets: AttachTargets;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [eventId, setEventId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [uploaderId, setUploaderId] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attachTarget, setAttachTarget] = useState<
    "activity" | "event" | "highlight" | "newsletter"
  >("event");
  const [attachTargetId, setAttachTargetId] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return initialItems.filter((item) => {
      if (mediaType !== "all" && item.media_type !== mediaType) return false;
      if (uploaderId && item.uploader_id !== uploaderId) return false;
      if (eventId && item.related_event_id !== eventId) return false;
      if (activityId) {
        const ids = attachTargets.activityMediaIds?.[activityId] ?? [];
        if (!ids.includes(item.id)) return false;
      }
      if (createdFrom && item.created_at < createdFrom) return false;
      if (createdTo && item.created_at > `${createdTo}T23:59:59.999Z`) return false;
      if (q) {
        const hay = `${item.title} ${item.description ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [
    activityId,
    attachTargets.activityMediaIds,
    createdFrom,
    createdTo,
    eventId,
    initialItems,
    mediaType,
    q,
    uploaderId,
  ]);

  const selected = filtered.find((item) => item.id === selectedId) ?? null;

  const targetOptions =
    attachTarget === "activity"
      ? attachTargets.activities.map((row) => ({
          id: row.id,
          label: `${row.title} (${row.activity_date})`,
        }))
      : attachTarget === "event"
        ? attachTargets.events.map((row) => ({
            id: row.id,
            label: row.title,
          }))
        : attachTarget === "highlight"
          ? attachTargets.highlights.map((row) => ({
              id: row.id,
              label: row.title,
            }))
          : attachTargets.newsletters.map((row) => ({
              id: row.id,
              label: row.title,
            }));

  return (
    <div className="space-y-4">
      <FilterBar
        leading={
          <>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or description"
              aria-label="Search media"
              className="min-w-[12rem] flex-1"
            />
            <select
              aria-label="Type filter"
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            <select
              aria-label="Event filter"
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value="">All events</option>
              {attachTargets.events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <select
              aria-label="Activity filter"
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
            >
              <option value="">All activities</option>
              {attachTargets.activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>
            <select
              aria-label="Uploader filter"
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={uploaderId}
              onChange={(e) => setUploaderId(e.target.value)}
            >
              <option value="">All uploaders</option>
              {uploaders.map((uploader) => (
                <option key={uploader.id} value={uploader.id}>
                  {uploader.displayName}
                </option>
              ))}
            </select>
            <Input
              type="date"
              aria-label="From date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
            />
            <Input
              type="date"
              aria-label="To date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
            />
          </>
        }
        trailing={
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              Grid
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching media"
          description="Try clearing filters or upload a new file."
        />
      ) : view === "grid" ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => setSelectedId(asset.id)}
                className={cn(
                  "w-full overflow-hidden rounded-lg border border-border bg-surface text-left shadow-xs transition",
                  selectedId === asset.id && "ring-2 ring-primary",
                )}
              >
                <MediaThumb asset={asset} clubId={clubId} />
                <div className="space-y-1 p-3">
                  <p className="font-medium">{asset.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.media_type} · {asset.visibility} ·{" "}
                    {formatBytes(asset.size_bytes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Consent: {asset.consent_state} · {uploaderName(asset)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface shadow-xs">
          {filtered.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => setSelectedId(asset.id)}
                className={cn(
                  "flex w-full flex-col gap-1 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between",
                  selectedId === asset.id && "bg-muted/40",
                )}
              >
                <div>
                  <p className="font-medium">{asset.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.mime_type} · {uploaderName(asset)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(asset.created_at).toLocaleDateString()} ·{" "}
                  {asset.visibility}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <div className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-xs">
          <div>
            <h3 className="font-display text-lg font-semibold">{selected.title}</h3>
            <p className="text-sm text-muted-foreground">
              {selected.description || "No description"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="attach-kind">Attach to</Label>
              <select
                id="attach-kind"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={attachTarget}
                onChange={(e) => {
                  setAttachTarget(
                    e.target.value as
                      | "activity"
                      | "event"
                      | "highlight"
                      | "newsletter",
                  );
                  setAttachTargetId("");
                }}
              >
                <option value="activity">Activity</option>
                <option value="event">Event</option>
                <option value="highlight">Highlight</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="attach-target">Target</Label>
              <select
                id="attach-target"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={attachTargetId}
                onChange={(e) => setAttachTargetId(e.target.value)}
              >
                <option value="">Select…</option>
                {targetOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={pending || !attachTargetId}
              onClick={() => {
                startTransition(async () => {
                  const result = await attachMediaToTarget({
                    clubId,
                    mediaAssetId: selected.id,
                    target: attachTarget,
                    targetId: attachTargetId,
                  });
                  setMessage(
                    result.ok
                      ? "Media attached."
                      : result.error.message,
                  );
                });
              }}
            >
              Attach
            </Button>
          </div>

          <div className="space-y-1.5 border-t border-border pt-4">
            <Label htmlFor="delete-reason">Delete reason (audited)</Label>
            <Input
              id="delete-reason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Why is this asset being removed?"
              minLength={3}
            />
            <Button
              type="button"
              variant="destructive"
              disabled={pending || deleteReason.trim().length < 3}
              onClick={() => {
                startTransition(async () => {
                  const result = await deleteMediaAsset({
                    clubId,
                    mediaAssetId: selected.id,
                    reason: deleteReason.trim(),
                  });
                  setMessage(
                    result.ok
                      ? "Media deleted and audited."
                      : result.error.message,
                  );
                  if (result.ok) {
                    setSelectedId(null);
                    setDeleteReason("");
                  }
                });
              }}
            >
              Delete media
            </Button>
          </div>

          {message ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
