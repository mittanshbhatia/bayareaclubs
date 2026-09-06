import { z } from "zod";

export const MEDIA_BUCKETS = [
  "club-branding",
  "club-media",
  "club-documents",
  "course-assets",
] as const;

export type MediaBucket = (typeof MEDIA_BUCKETS)[number];

/** Product label "club_members" maps to DB enum value `club`. */
export const MEDIA_VISIBILITY_OPTIONS = [
  { value: "private", label: "Private" },
  { value: "club", label: "Club members" },
  { value: "school", label: "School" },
] as const;

export const MEDIA_TYPE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "document", label: "PDF / document" },
] as const;

/** Raster images only — SVG is rejected (scriptable markup). */
const IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"] as const;

const DOCUMENT_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
] as const;

export const BUCKET_MIME_ALLOWLIST: Record<MediaBucket, readonly string[]> = {
  "club-branding": IMAGE_MIME,
  "club-media": [...IMAGE_MIME, ...VIDEO_MIME, ...DOCUMENT_MIME],
  "club-documents": [
    ...DOCUMENT_MIME,
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  "course-assets": [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    ...VIDEO_MIME.filter((m) => m !== "video/quicktime"),
    "application/pdf",
    "application/zip",
    "text/plain",
  ],
};

export const BUCKET_SIZE_LIMITS: Record<MediaBucket, number> = {
  "club-branding": 5 * 1024 * 1024,
  "club-media": 500 * 1024 * 1024,
  "club-documents": 50 * 1024 * 1024,
  "course-assets": 500 * 1024 * 1024,
};

export const RESUMABLE_UPLOAD_THRESHOLD_BYTES = 6 * 1024 * 1024;

export function mediaTypeFromMime(mime: string): "image" | "video" | "document" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (
    mime === "application/pdf" ||
    mime.includes("document") ||
    mime.includes("sheet") ||
    mime === "text/plain" ||
    mime === "application/msword" ||
    mime === "application/zip"
  ) {
    return "document";
  }
  return "other";
}

export function defaultBucketForMime(mime: string): MediaBucket {
  const type = mediaTypeFromMime(mime);
  if (type === "document") return "club-documents";
  if (type === "image" || type === "video") return "club-media";
  return "club-media";
}

export function isMimeAllowedForBucket(bucket: MediaBucket, mime: string) {
  return BUCKET_MIME_ALLOWLIST[bucket].includes(mime);
}

export const prepareMediaUploadSchema = z
  .object({
    clubId: z.string().uuid(),
    bucket: z.enum(MEDIA_BUCKETS),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    mimeType: z.string().trim().min(3).max(127),
    sizeBytes: z.number().int().positive(),
    visibility: z.enum(["private", "club", "school"]).default("private"),
    consentRequired: z.boolean().default(false),
    relatedEventId: z.string().uuid().optional().nullable(),
    fileName: z.string().trim().min(1).max(200),
  })
  .superRefine((value, ctx) => {
    if (!isMimeAllowedForBucket(value.bucket, value.mimeType)) {
      ctx.addIssue({
        code: "custom",
        path: ["mimeType"],
        message: "This file type is not allowed for the selected bucket.",
      });
    }
    if (value.sizeBytes > BUCKET_SIZE_LIMITS[value.bucket]) {
      ctx.addIssue({
        code: "custom",
        path: ["sizeBytes"],
        message: "File exceeds the size limit for this bucket.",
      });
    }
    if (value.bucket === "club-branding" && !value.mimeType.startsWith("image/")) {
      ctx.addIssue({
        code: "custom",
        path: ["bucket"],
        message: "Club branding accepts images only.",
      });
    }
  });

export const finalizeMediaUploadSchema = z.object({
  sessionId: z.string().uuid(),
  clubId: z.string().uuid(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  durationSeconds: z.number().positive().optional().nullable(),
  detectedMimeType: z.string().trim().min(3).max(127).optional().nullable(),
});

export const abortMediaUploadSchema = z.object({
  sessionId: z.string().uuid(),
  clubId: z.string().uuid(),
});

export const deleteMediaAssetSchema = z.object({
  clubId: z.string().uuid(),
  mediaAssetId: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
});

export const mediaSignedUrlSchema = z.object({
  mediaAssetId: z.string().uuid(),
  clubId: z.string().uuid().optional(),
  transformWidth: z.number().int().positive().max(2000).optional(),
  expiresIn: z.number().int().min(30).max(3600).default(300),
});

export const attachMediaSchema = z.object({
  clubId: z.string().uuid(),
  mediaAssetId: z.string().uuid(),
  target: z.enum(["activity", "event", "highlight", "newsletter"]),
  targetId: z.string().uuid(),
});

export const detachMediaSchema = attachMediaSchema;

export const mediaLibraryFilterSchema = z.object({
  clubId: z.string().uuid(),
  q: z.string().trim().max(120).optional().or(z.literal("")),
  mediaType: z.enum(["image", "video", "document", "audio", "other", "all"]).default("all"),
  eventId: z.string().uuid().optional().nullable(),
  activityId: z.string().uuid().optional().nullable(),
  uploaderId: z.string().uuid().optional().nullable(),
  createdFrom: z.string().optional().nullable(),
  createdTo: z.string().optional().nullable(),
  visibility: z
    .enum(["private", "club", "school", "public", "all"])
    .default("all"),
});

export type PrepareMediaUploadInput = z.infer<typeof prepareMediaUploadSchema>;
export type FinalizeMediaUploadInput = z.infer<typeof finalizeMediaUploadSchema>;
export type MediaLibraryFilterInput = z.infer<typeof mediaLibraryFilterSchema>;
