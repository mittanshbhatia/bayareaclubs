"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import * as tus from "tus-js-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  abortMediaUpload,
  finalizeMediaUpload,
  markMediaUploadComplete,
  prepareMediaUpload,
} from "@/features/media/actions";
import { createClient } from "@/lib/supabase/client";
import {
  BUCKET_MIME_ALLOWLIST,
  BUCKET_SIZE_LIMITS,
  MEDIA_BUCKETS,
  MEDIA_VISIBILITY_OPTIONS,
  RESUMABLE_UPLOAD_THRESHOLD_BYTES,
  defaultBucketForMime,
  type MediaBucket,
} from "@/lib/validation/media";
import { cn } from "@/lib/utils";

type UploadState =
  | "idle"
  | "preparing"
  | "uploading"
  | "finalizing"
  | "success"
  | "error"
  | "cancelled";

type EventOption = { id: string; title: string };

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

function readVideoDuration(file: File): Promise<number | null> {
  if (!file.type.startsWith("video/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(Number.isFinite(video.duration) ? video.duration : null);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    video.src = url;
  });
}

export function MediaUploader({
  clubId,
  events,
}: {
  clubId: string;
  events: EventOption[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bucket, setBucket] = useState<MediaBucket>("club-media");
  const [visibility, setVisibility] = useState<"private" | "club" | "school">(
    "private",
  );
  const [consentRequired, setConsentRequired] = useState(false);
  const [relatedEventId, setRelatedEventId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const uploadRef = useRef<tus.Upload | null>(null);
  const [pending, startTransition] = useTransition();

  const accept = useMemo(
    () => BUCKET_MIME_ALLOWLIST[bucket].join(","),
    [bucket],
  );

  const resetUpload = useCallback(() => {
    uploadRef.current = null;
    setProgress(0);
    setSessionId(null);
  }, []);

  const cancelUpload = useCallback(async () => {
    uploadRef.current?.abort(true);
    uploadRef.current = null;
    setState("cancelled");
    setMessage("Upload cancelled.");
    if (sessionId) {
      await abortMediaUpload({ sessionId, clubId });
    }
  }, [clubId, sessionId]);

  const runFinalize = useCallback(
    async (activeSessionId: string, activeFile: File) => {
      setState("finalizing");
      setMessage("Verifying upload and creating media metadata…");
      await markMediaUploadComplete(activeSessionId, clubId);
      const [dimensions, duration] = await Promise.all([
        readImageDimensions(activeFile),
        readVideoDuration(activeFile),
      ]);
      const result = await finalizeMediaUpload({
        sessionId: activeSessionId,
        clubId,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        durationSeconds: duration,
        detectedMimeType: activeFile.type || null,
      });
      if (!result.ok) {
        setState("error");
        setMessage(result.error.message);
        return;
      }
      setState("success");
      setMessage("Upload complete. Media is in the library.");
      setFile(null);
      setTitle("");
      setDescription("");
      resetUpload();
    },
    [clubId, resetUpload],
  );

  const startResumable = useCallback(
    async (
      activeFile: File,
      prepared: {
        sessionId: string;
        bucket: MediaBucket;
        path: string;
        resumableEndpoint: string;
      },
    ) => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState("error");
        setMessage("Your session expired. Sign in again and retry.");
        return;
      }

      setState("uploading");
      setMessage(
        activeFile.size >= RESUMABLE_UPLOAD_THRESHOLD_BYTES
          ? "Uploading directly to Supabase Storage (resumable)…"
          : "Uploading directly to Supabase Storage…",
      );

      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(activeFile, {
          endpoint: prepared.resumableEndpoint,
          retryDelays: [0, 1000, 3000, 5000, 10000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
            "x-upsert": "false",
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: prepared.bucket,
            objectName: prepared.path,
            contentType: activeFile.type || "application/octet-stream",
            cacheControl: "3600",
          },
          chunkSize: 6 * 1024 * 1024,
          onError(error) {
            reject(error);
          },
          onProgress(bytesUploaded, bytesTotal) {
            const next = bytesTotal
              ? Math.round((bytesUploaded / bytesTotal) * 100)
              : 0;
            setProgress(next);
          },
          onSuccess() {
            resolve();
          },
        });
        uploadRef.current = upload;
        upload.findPreviousUploads().then((previous) => {
          if (previous.length > 0) {
            upload.resumeFromPreviousUpload(previous[0]);
          }
          upload.start();
        });
      });
    },
    [],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setState("error");
      setMessage("Choose a file to upload.");
      return;
    }
    if (!title.trim()) {
      setState("error");
      setMessage("Title is required.");
      return;
    }
    if (file.size > BUCKET_SIZE_LIMITS[bucket]) {
      setState("error");
      setMessage("File exceeds the size limit for this bucket.");
      return;
    }
    if (!BUCKET_MIME_ALLOWLIST[bucket].includes(file.type)) {
      setState("error");
      setMessage("This file type is not allowed for the selected bucket.");
      return;
    }

    startTransition(async () => {
      setState("preparing");
      setMessage("Preparing a secure upload session…");
      setProgress(0);

      const prepared = await prepareMediaUpload({
        clubId,
        bucket,
        title: title.trim(),
        description: description.trim(),
        mimeType: file.type,
        sizeBytes: file.size,
        visibility,
        consentRequired,
        relatedEventId: relatedEventId || null,
        fileName: file.name,
      });

      if (!prepared.ok) {
        setState("error");
        setMessage(prepared.error.message);
        return;
      }

      setSessionId(prepared.data.sessionId);

      try {
        await startResumable(file, prepared.data);
        await runFinalize(prepared.data.sessionId, file);
      } catch (error) {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Upload failed. You can retry without reloading.",
        );
      }
    });
  };

  const retry = () => {
    if (!file) return;
    onSubmit({ preventDefault() {} } as React.FormEvent);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-xs"
    >
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Upload media
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Large files upload directly to Supabase Storage with progress, cancel,
          and retry. Metadata is created only after verification.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="media-title">Title</Label>
          <Input
            id="media-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={160}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="media-description">Description</Label>
          <Input
            id="media-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-bucket">Bucket</Label>
          <select
            id="media-bucket"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={bucket}
            onChange={(e) => setBucket(e.target.value as MediaBucket)}
          >
            {MEDIA_BUCKETS.filter((item) => item !== "course-assets").map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ),
            )}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-visibility">Visibility</Label>
          <select
            id="media-visibility"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "private" | "club" | "school")
            }
          >
            {MEDIA_VISIBILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Public is never the default and requires separate approval.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-event">Related event</Label>
          <select
            id="media-event"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={relatedEventId}
            onChange={(e) => setRelatedEventId(e.target.value)}
          >
            <option value="">None</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            id="media-consent"
            type="checkbox"
            checked={consentRequired}
            onChange={(e) => setConsentRequired(e.target.checked)}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="media-consent" className="font-normal">
            Requires media consent (minors / identifiable students)
          </Label>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="media-file">File</Label>
          <Input
            id="media-file"
            type="file"
            accept={accept}
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              setState("idle");
              setMessage(null);
              if (next?.type) {
                setBucket(defaultBucketForMime(next.type));
                if (!title.trim()) {
                  setTitle(next.name.replace(/\.[^.]+$/, "").slice(0, 160));
                }
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Upload progress"
        >
          <div
            className={cn(
              "h-full bg-primary transition-[width] duration-300",
              state === "error" && "bg-destructive",
              state === "success" && "bg-emerald-600",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message ??
            (state === "idle"
              ? "Ready. Files never upload through the Next.js request body."
              : `State: ${state}`)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={pending || state === "uploading" || state === "preparing" || state === "finalizing"}
        >
          {state === "uploading" || state === "preparing" || state === "finalizing"
            ? "Working…"
            : "Upload"}
        </Button>
        {(state === "uploading" || state === "preparing") && (
          <Button type="button" variant="outline" onClick={() => void cancelUpload()}>
            Cancel
          </Button>
        )}
        {state === "error" && (
          <Button type="button" variant="secondary" onClick={retry}>
            Retry
          </Button>
        )}
      </div>
    </form>
  );
}
