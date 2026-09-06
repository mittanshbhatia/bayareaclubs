"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";

import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import {
  normalizeOfficeZipMime,
  sniffMimeFromBytes,
} from "@/lib/media/mime-sniff";
import { storageS3Configured } from "@/lib/media/s3-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  abortMediaUploadSchema,
  attachMediaSchema,
  deleteMediaAssetSchema,
  detachMediaSchema,
  finalizeMediaUploadSchema,
  isMimeAllowedForBucket,
  mediaSignedUrlSchema,
  mediaTypeFromMime,
  prepareMediaUploadSchema,
  type MediaBucket,
} from "@/lib/validation/media";
import type { ActionResult } from "@/types/action-result";

function validationFailure(
  fieldErrors: Record<string, string[] | undefined>,
): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    },
  };
}

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "upload.bin";
}

async function revalidateMedia(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}/media`);
    revalidatePath(`/clubs/${data.slug}`);
  }
}

async function loadClubSchoolId(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("school_id")
    .eq("id", clubId)
    .maybeSingle();
  return data?.school_id ?? null;
}

export async function prepareMediaUpload(
  input: unknown,
): Promise<
  ActionResult<{
    sessionId: string;
    bucket: MediaBucket;
    path: string;
    resumableEndpoint: string;
    supabaseUrl: string;
  }>
> {
  try {
    const user = await requireActiveUser();
    const parsed = prepareMediaUploadSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }

    await requireClubManager(parsed.data.clubId);
    const schoolId = await loadClubSchoolId(parsed.data.clubId);
    if (!schoolId) return failure("NOT_FOUND", "Club not found.");

    if (parsed.data.relatedEventId) {
      const supabaseCheck = await createClient();
      const { data: event } = await supabaseCheck
        .from("events")
        .select("id")
        .eq("id", parsed.data.relatedEventId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!event) {
        return failure("VALIDATION_ERROR", "Related event was not found for this club.");
      }
    }

    const sessionId = randomUUID();
    const path = [
      user.id,
      parsed.data.clubId,
      sessionId,
      sanitizeFileName(parsed.data.fileName),
    ].join("/");

    const supabase = await createClient();
    const { error } = await supabase.from("media_upload_sessions").insert({
      id: sessionId,
      school_id: schoolId,
      club_id: parsed.data.clubId,
      uploader_id: user.id,
      storage_bucket: parsed.data.bucket,
      storage_path: path,
      declared_mime_type: parsed.data.mimeType,
      declared_size_bytes: parsed.data.sizeBytes,
      media_type: mediaTypeFromMime(parsed.data.mimeType),
      title: parsed.data.title,
      description: parsed.data.description || null,
      visibility: parsed.data.visibility,
      consent_required: parsed.data.consentRequired,
      related_event_id: parsed.data.relatedEventId ?? null,
      status: "pending",
    });

    if (error) {
      logger.error("media.prepare_failed", { error: error.message });
      return failure("UPLOAD_PREPARE_FAILED", "Could not prepare the upload.");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return failure("CONFIG_ERROR", "Supabase URL is not configured.");
    }

    return {
      ok: true,
      data: {
        sessionId,
        bucket: parsed.data.bucket,
        path,
        resumableEndpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        supabaseUrl,
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("media.prepare_unexpected", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not prepare the upload.");
  }
}

export async function markMediaUploadComplete(
  sessionId: string,
  clubId: string,
): Promise<ActionResult<{ sessionId: string }>> {
  try {
    const user = await requireActiveUser();
    await requireClubManager(clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("media_upload_sessions")
      .update({
        status: "uploaded",
        uploaded_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("club_id", clubId)
      .eq("uploader_id", user.id)
      .in("status", ["pending", "uploaded"]);
    if (error) {
      return failure("UPLOAD_MARK_FAILED", "Could not mark upload complete.");
    }
    return { ok: true, data: { sessionId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not update upload state.");
  }
}

export async function finalizeMediaUpload(
  input: unknown,
): Promise<ActionResult<{ mediaAssetId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = finalizeMediaUploadSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }

    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: session, error: sessionError } = await supabase
      .from("media_upload_sessions")
      .select("*")
      .eq("id", parsed.data.sessionId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();

    if (sessionError || !session) {
      return failure("NOT_FOUND", "Upload session not found.");
    }
    if (session.uploader_id !== user.id) {
      return failure("FORBIDDEN", "Only the uploader can finalize this session.");
    }
    if (session.status === "finalized" && session.media_asset_id) {
      return { ok: true, data: { mediaAssetId: session.media_asset_id } };
    }
    if (!["pending", "uploaded"].includes(session.status)) {
      return failure("INVALID_STATE", "This upload session cannot be finalized.");
    }
    if (new Date(session.expires_at).getTime() < Date.now()) {
      return failure("EXPIRED", "This upload session has expired.");
    }

    // Prefer admin metadata + ranged byte sniff so large binaries never transit
    // this Next.js function. Never expose admin / S3 credentials to the browser.
    let objectMeta: {
      size?: number | null;
      mimetype?: string | null;
    } | null = null;
    let headBytes: Uint8Array | null = null;

    try {
      const admin = createAdminClient();
      const folder = session.storage_path.split("/").slice(0, -1).join("/");
      const fileName = session.storage_path.split("/").at(-1) ?? "";
      const { data: listed, error: listError } = await admin.storage
        .from(session.storage_bucket)
        .list(folder, {
          search: fileName,
          limit: 20,
        });
      if (listError) {
        logger.error("media.finalize_list_failed", { error: listError.message });
      }
      const match = (listed ?? []).find((item) => item.name === fileName);
      objectMeta = match
        ? {
            size:
              typeof match.metadata?.size === "number"
                ? match.metadata.size
                : Number(match.metadata?.size ?? 0) || null,
            mimetype: (match.metadata?.mimetype as string | undefined) ?? null,
          }
        : null;

      const { data: signed, error: signError } = await admin.storage
        .from(session.storage_bucket)
        .createSignedUrl(session.storage_path, 60);
      if (!signError && signed?.signedUrl) {
        const ranged = await fetch(signed.signedUrl, {
          headers: { Range: "bytes=0-63" },
        });
        if (ranged.ok || ranged.status === 206) {
          headBytes = new Uint8Array(await ranged.arrayBuffer());
          const contentRange = ranged.headers.get("content-range");
          const totalFromRange = contentRange?.split("/")[1];
          if (!objectMeta?.size && totalFromRange && totalFromRange !== "*") {
            objectMeta = {
              size: Number(totalFromRange),
              mimetype:
                objectMeta?.mimetype ??
                ranged.headers.get("content-type")?.split(";")[0] ??
                null,
            };
          }
          if (!objectMeta?.mimetype) {
            objectMeta = {
              size: objectMeta?.size ?? null,
              mimetype: ranged.headers.get("content-type")?.split(";")[0] ?? null,
            };
          }
        }
      }
    } catch (error) {
      logger.error("media.finalize_admin_unavailable", {
        error: error instanceof Error ? error.message : "unknown",
        s3Configured: storageS3Configured(),
      });
      return failure(
        "STORAGE_VERIFY_FAILED",
        "Could not verify the uploaded object. Try again shortly.",
      );
    }

    if (!objectMeta?.size || objectMeta.size <= 0) {
      return failure(
        "OBJECT_MISSING",
        "Upload not found in storage yet. Wait for the upload to finish, then retry.",
      );
    }

    if (objectMeta.size > session.declared_size_bytes * 1.05 + 1024) {
      return failure("SIZE_MISMATCH", "Uploaded file size does not match the declared size.");
    }

    const sniffed = normalizeOfficeZipMime(
      headBytes ? sniffMimeFromBytes(headBytes) : null,
      session.declared_mime_type,
    );
    const storageMime = objectMeta.mimetype?.split(";")[0]?.trim() || null;
    const clientDetected = parsed.data.detectedMimeType?.split(";")[0]?.trim() || null;

    const candidateMimes = [sniffed, storageMime, clientDetected, session.declared_mime_type]
      .filter((value): value is string => Boolean(value));

    const resolvedMime =
      candidateMimes.find((mime) =>
        isMimeAllowedForBucket(session.storage_bucket as MediaBucket, mime),
      ) ?? null;

    if (!resolvedMime) {
      return failure(
        "MIME_REJECTED",
        "The uploaded file type could not be validated against the allowlist.",
      );
    }

    // Prefer sniffed MIME when available and allowed.
    const finalMime =
      sniffed && isMimeAllowedForBucket(session.storage_bucket as MediaBucket, sniffed)
        ? sniffed === "application/zip"
          ? resolvedMime
          : sniffed
        : resolvedMime;

    if (
      sniffed &&
      sniffed !== "application/zip" &&
      sniffed !== session.declared_mime_type &&
      !session.declared_mime_type.startsWith(sniffed.split("/")[0] ?? "")
    ) {
      // Hard reject clear spoofing for sniffable formats.
      if (!isMimeAllowedForBucket(session.storage_bucket as MediaBucket, sniffed)) {
        return failure("MIME_SPOOFED", "File contents do not match an allowed type.");
      }
    }

    const mediaType = mediaTypeFromMime(finalMime);
    const consentState = session.consent_required ? "pending" : "not_required";

    const { data: asset, error: insertError } = await supabase
      .from("media_assets")
      .insert({
        school_id: session.school_id,
        club_id: session.club_id,
        uploader_id: user.id,
        storage_bucket: session.storage_bucket,
        storage_path: session.storage_path,
        media_type: mediaType === "other" ? "document" : mediaType,
        size_bytes: objectMeta.size,
        mime_type: finalMime,
        title: session.title,
        description: session.description,
        visibility: session.visibility,
        consent_required: session.consent_required,
        consent_state: consentState,
        width: parsed.data.width ?? null,
        height: parsed.data.height ?? null,
        duration_seconds: parsed.data.durationSeconds ?? null,
        related_event_id: session.related_event_id,
        upload_session_id: session.id,
      })
      .select("id")
      .single();

    if (insertError || !asset) {
      logger.error("media.finalize_insert_failed", {
        error: insertError?.message ?? "missing asset",
      });
      return failure("FINALIZE_FAILED", "Could not create media metadata.");
    }

    await supabase
      .from("media_upload_sessions")
      .update({
        status: "finalized",
        media_asset_id: asset.id,
        detected_mime_type: finalMime,
        finalized_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (session.related_event_id) {
      await supabase.from("event_media").upsert(
        {
          event_id: session.related_event_id,
          media_asset_id: asset.id,
          created_by: user.id,
        },
        { onConflict: "event_id,media_asset_id" },
      );
    }

    await revalidateMedia(parsed.data.clubId);
    return { ok: true, data: { mediaAssetId: asset.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("media.finalize_unexpected", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not finalize the upload.");
  }
}

export async function abortMediaUpload(
  input: unknown,
): Promise<ActionResult<{ sessionId: string }>> {
  try {
    await requireActiveUser();
    const parsed = abortMediaUploadSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const { data: session } = await supabase
      .from("media_upload_sessions")
      .select("storage_bucket, storage_path, status")
      .eq("id", parsed.data.sessionId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();

    const { error } = await supabase.rpc("abort_media_upload_session", {
      target_session_id: parsed.data.sessionId,
    });
    if (error) {
      return failure("ABORT_FAILED", error.message);
    }

    if (session && session.status !== "finalized") {
      try {
        const admin = createAdminClient();
        await admin.storage
          .from(session.storage_bucket)
          .remove([session.storage_path]);
      } catch {
        // Best-effort cleanup.
      }
    }

    return { ok: true, data: { sessionId: parsed.data.sessionId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not cancel the upload.");
  }
}

export async function deleteMediaAsset(
  input: unknown,
): Promise<ActionResult<{ mediaAssetId: string }>> {
  try {
    await requireActiveUser();
    const parsed = deleteMediaAssetSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const { data: asset } = await supabase
      .from("media_assets")
      .select("id, storage_bucket, storage_path")
      .eq("id", parsed.data.mediaAssetId)
      .eq("club_id", parsed.data.clubId)
      .is("deleted_at", null)
      .maybeSingle();

    if (!asset) return failure("NOT_FOUND", "Media asset not found.");

    const { error } = await supabase.rpc("soft_delete_media_asset", {
      target_asset_id: parsed.data.mediaAssetId,
      reason: parsed.data.reason,
    });
    if (error) {
      return failure("DELETE_FAILED", error.message);
    }

    try {
      const admin = createAdminClient();
      await admin.storage.from(asset.storage_bucket).remove([asset.storage_path]);
    } catch (error) {
      logger.error("media.delete_storage_failed", {
        error: error instanceof Error ? error.message : "unknown",
      });
    }

    await revalidateMedia(parsed.data.clubId);
    return { ok: true, data: { mediaAssetId: parsed.data.mediaAssetId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not delete media.");
  }
}

export async function createMediaSignedUrl(
  input: unknown,
): Promise<ActionResult<{ signedUrl: string; expiresIn: number }>> {
  try {
    await requireActiveUser();
    const parsed = mediaSignedUrlSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }

    const supabase = await createClient();
    let query = supabase
      .from("media_assets")
      .select("id, storage_bucket, storage_path, media_type, club_id")
      .eq("id", parsed.data.mediaAssetId)
      .is("deleted_at", null);

    if (parsed.data.clubId) {
      query = query.eq("club_id", parsed.data.clubId);
    }

    const { data: asset, error } = await query.maybeSingle();
    if (error || !asset) {
      return failure("FORBIDDEN", "You cannot access this media asset.");
    }

    const options =
      asset.media_type === "image" && parsed.data.transformWidth
        ? {
            transform: {
              width: parsed.data.transformWidth,
              resize: "contain" as const,
            },
          }
        : undefined;

    const { data, error: signError } = await supabase.storage
      .from(asset.storage_bucket)
      .createSignedUrl(asset.storage_path, parsed.data.expiresIn, options);

    if (signError || !data?.signedUrl) {
      return failure("SIGN_FAILED", "Could not create a signed URL.");
    }

    return {
      ok: true,
      data: { signedUrl: data.signedUrl, expiresIn: parsed.data.expiresIn },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not create a signed URL.");
  }
}

export async function attachMediaToTarget(
  input: unknown,
): Promise<ActionResult<{ mediaAssetId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = attachMediaSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: asset } = await supabase
      .from("media_assets")
      .select("id")
      .eq("id", parsed.data.mediaAssetId)
      .eq("club_id", parsed.data.clubId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!asset) return failure("NOT_FOUND", "Media asset not found.");

    if (parsed.data.target === "activity") {
      const { data: activity } = await supabase
        .from("club_activities")
        .select("id")
        .eq("id", parsed.data.targetId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!activity) return failure("NOT_FOUND", "Activity not found.");
      const { error } = await supabase.from("club_activity_media").upsert(
        {
          activity_id: parsed.data.targetId,
          media_asset_id: parsed.data.mediaAssetId,
        },
        { onConflict: "activity_id,media_asset_id" },
      );
      if (error) return failure("ATTACH_FAILED", error.message);
    } else if (parsed.data.target === "event") {
      const { data: event } = await supabase
        .from("events")
        .select("id")
        .eq("id", parsed.data.targetId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!event) return failure("NOT_FOUND", "Event not found.");
      const { error } = await supabase.from("event_media").upsert(
        {
          event_id: parsed.data.targetId,
          media_asset_id: parsed.data.mediaAssetId,
          created_by: user.id,
        },
        { onConflict: "event_id,media_asset_id" },
      );
      if (error) return failure("ATTACH_FAILED", error.message);
      await supabase
        .from("media_assets")
        .update({ related_event_id: parsed.data.targetId })
        .eq("id", parsed.data.mediaAssetId);
    } else if (parsed.data.target === "highlight") {
      const { data: highlight } = await supabase
        .from("club_highlights")
        .select("id")
        .eq("id", parsed.data.targetId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!highlight) return failure("NOT_FOUND", "Highlight not found.");
      const { error } = await supabase
        .from("club_highlights")
        .update({ cover_asset_id: parsed.data.mediaAssetId })
        .eq("id", parsed.data.targetId);
      if (error) return failure("ATTACH_FAILED", error.message);
    } else {
      const { data: newsletter } = await supabase
        .from("newsletters")
        .select("id")
        .eq("id", parsed.data.targetId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!newsletter) return failure("NOT_FOUND", "Newsletter not found.");

      const { data: section } = await supabase
        .from("newsletter_sections")
        .select("id, position")
        .eq("newsletter_id", parsed.data.targetId)
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (section) {
        const { error } = await supabase
          .from("newsletter_sections")
          .update({ media_asset_id: parsed.data.mediaAssetId })
          .eq("id", section.id);
        if (error) return failure("ATTACH_FAILED", error.message);
      } else {
        const { error } = await supabase.from("newsletter_sections").insert({
          newsletter_id: parsed.data.targetId,
          position: 0,
          heading: "Featured media",
          body: "Attached from the club media library.",
          media_asset_id: parsed.data.mediaAssetId,
        });
        if (error) return failure("ATTACH_FAILED", error.message);
      }
    }

    await revalidateMedia(parsed.data.clubId);
    return { ok: true, data: { mediaAssetId: parsed.data.mediaAssetId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not attach media.");
  }
}

export async function detachMediaFromTarget(
  input: unknown,
): Promise<ActionResult<{ mediaAssetId: string }>> {
  try {
    await requireActiveUser();
    const parsed = detachMediaSchema.safeParse(input);
    if (!parsed.success) {
      return validationFailure(parsed.error.flatten().fieldErrors);
    }
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    if (parsed.data.target === "activity") {
      const { error } = await supabase
        .from("club_activity_media")
        .delete()
        .eq("activity_id", parsed.data.targetId)
        .eq("media_asset_id", parsed.data.mediaAssetId);
      if (error) return failure("DETACH_FAILED", error.message);
    } else if (parsed.data.target === "event") {
      const { error } = await supabase
        .from("event_media")
        .delete()
        .eq("event_id", parsed.data.targetId)
        .eq("media_asset_id", parsed.data.mediaAssetId);
      if (error) return failure("DETACH_FAILED", error.message);
    } else if (parsed.data.target === "highlight") {
      const { error } = await supabase
        .from("club_highlights")
        .update({ cover_asset_id: null })
        .eq("id", parsed.data.targetId)
        .eq("club_id", parsed.data.clubId)
        .eq("cover_asset_id", parsed.data.mediaAssetId);
      if (error) return failure("DETACH_FAILED", error.message);
    } else {
      const { error } = await supabase
        .from("newsletter_sections")
        .update({ media_asset_id: null })
        .eq("newsletter_id", parsed.data.targetId)
        .eq("media_asset_id", parsed.data.mediaAssetId);
      if (error) return failure("DETACH_FAILED", error.message);
    }

    await revalidateMedia(parsed.data.clubId);
    return { ok: true, data: { mediaAssetId: parsed.data.mediaAssetId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not detach media.");
  }
}
