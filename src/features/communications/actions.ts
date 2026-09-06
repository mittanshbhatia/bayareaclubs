"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { sendTestCommunicationEmail } from "@/features/communications/processor";
import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  AUDIENCE_LABELS,
  KIND_LABELS,
  audienceCountSchema,
  campaignComposerSchema,
  enqueueCampaignSchema,
  sanitizePlainText,
  testEmailSchema,
} from "@/lib/validation/communications";
import type { ActionResult } from "@/types/action-result";
import type { Database } from "@/types/database.generated";
import type { Json } from "@/types/database.generated";

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

async function revalidateCommunications(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("clubs").select("slug").eq("id", clubId).maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}/communications`);
  }
}

function audienceFilter(input: {
  audienceType: string;
  segmentRoles: string[];
  eventId?: string | null;
}): Json {
  const filter: Record<string, unknown> = {};
  if (input.audienceType === "membership_segment") {
    filter.roles = input.segmentRoles;
  }
  if (
    input.audienceType === "event_attendees" ||
    input.audienceType === "event_registrants"
  ) {
    filter.event_id = input.eventId;
  }
  return filter as Json;
}

export async function previewAudienceCount(
  input: unknown,
): Promise<ActionResult<{ count: number; label: string }>> {
  try {
    await requireActiveUser();
    const parsed = audienceCountSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const category =
      parsed.data.campaignKind === "newsletter"
        ? "newsletter"
        : parsed.data.campaignKind === "event_promotion"
          ? "event_promotion"
          : parsed.data.campaignKind === "highlight_digest"
            ? "highlight_digest"
            : "announcement";

    const { data, error } = await supabase.rpc("count_email_audience", {
      target_club_id: parsed.data.clubId,
      audience: parsed.data.audienceType,
      filter: audienceFilter(parsed.data),
      category,
    });
    if (error) return failure("COUNT_FAILED", error.message);

    return {
      ok: true,
      data: {
        count: data ?? 0,
        label: AUDIENCE_LABELS[parsed.data.audienceType],
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not count recipients.");
  }
}

export async function saveOrQueueCampaign(
  input: unknown,
): Promise<ActionResult<{ campaignId: string; queued: boolean; recipientCount: number }>> {
  try {
    const user = await requireActiveUser();
    const parsed = campaignComposerSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("school_id, name, slug")
      .eq("id", parsed.data.clubId)
      .maybeSingle();
    if (!club) return failure("NOT_FOUND", "Club not found.");

    const subject = sanitizePlainText(parsed.data.subject);
    const messageBody = sanitizePlainText(parsed.data.messageBody);
    const previewText = sanitizePlainText(parsed.data.previewText || subject).slice(0, 180);
    const filter = audienceFilter(parsed.data);

    const category =
      parsed.data.campaignKind === "newsletter"
        ? "newsletter"
        : parsed.data.campaignKind === "event_promotion"
          ? "event_promotion"
          : parsed.data.campaignKind === "highlight_digest"
            ? "highlight_digest"
            : "announcement";

    const { data: count, error: countError } = await supabase.rpc("count_email_audience", {
      target_club_id: parsed.data.clubId,
      audience: parsed.data.audienceType,
      filter,
      category,
    });
    if (countError) return failure("COUNT_FAILED", countError.message);

    if (parsed.data.sendMode !== "draft" && (count ?? 0) < 1) {
      return failure("EMPTY_AUDIENCE", "No authorized recipients match this audience.");
    }

    const scheduledFor =
      parsed.data.sendMode === "schedule" && parsed.data.scheduledFor
        ? new Date(parsed.data.scheduledFor).toISOString()
        : null;

    const row = {
      school_id: club.school_id,
      club_id: parsed.data.clubId,
      created_by: user.id,
      name: sanitizePlainText(parsed.data.name),
      subject,
      preview_text: previewText,
      message_body: messageBody,
      campaign_kind: parsed.data.campaignKind as Database["public"]["Enums"]["email_campaign_kind"],
      audience_type: parsed.data.audienceType as Database["public"]["Enums"]["email_audience_type"],
      audience_filter: filter,
      preference_category: category as Database["public"]["Enums"]["email_preference_category"],
      cta_label: parsed.data.ctaLabel?.trim() || null,
      cta_url: parsed.data.ctaUrl?.trim() || null,
      recipient_count: count ?? 0,
      content_json: {
        source: "club_composer_v1",
        audience_label: AUDIENCE_LABELS[parsed.data.audienceType],
      } as Json,
      status: "draft" as const,
      scheduled_for: scheduledFor,
      idempotency_key: parsed.data.campaignId
        ? undefined
        : `campaign:${parsed.data.clubId}:${randomUUID()}`,
    };

    let campaignId = parsed.data.campaignId;

    if (campaignId) {
      const { data: existing } = await supabase
        .from("email_campaigns")
        .select("id, status")
        .eq("id", campaignId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!existing) return failure("NOT_FOUND", "Campaign not found.");
      if (existing.status !== "draft" && existing.status !== "scheduled") {
        return failure("INVALID_STATE", "Only draft or scheduled campaigns can be edited.");
      }
      const { error } = await supabase
        .from("email_campaigns")
        .update({
          name: row.name,
          subject: row.subject,
          preview_text: row.preview_text,
          message_body: row.message_body,
          campaign_kind: row.campaign_kind,
          audience_type: row.audience_type,
          audience_filter: row.audience_filter,
          preference_category: row.preference_category,
          cta_label: row.cta_label,
          cta_url: row.cta_url,
          recipient_count: row.recipient_count,
          content_json: row.content_json,
          scheduled_for: row.scheduled_for,
          status: "draft",
        })
        .eq("id", campaignId);
      if (error) return failure("SAVE_FAILED", error.message);
    } else {
      const { data: created, error } = await supabase
        .from("email_campaigns")
        .insert(row)
        .select("id")
        .single();
      if (error || !created) return failure("SAVE_FAILED", error?.message ?? "Create failed.");
      campaignId = created.id;
    }

    let queued = false;
    if (parsed.data.sendMode === "send_now" || parsed.data.sendMode === "schedule") {
      const { error: enqueueError } = await supabase.rpc("officer_enqueue_campaign_send", {
        target_campaign_id: campaignId,
        send_immediately: parsed.data.sendMode === "send_now",
      });
      if (enqueueError) return failure("ENQUEUE_FAILED", enqueueError.message);
      queued = true;

      await supabase.from("audit_logs").insert({
        actor_id: user.id,
        action: "email_campaign.composer_queue",
        entity_type: "email_campaigns",
        entity_id: campaignId,
        school_id: club.school_id,
        club_id: parsed.data.clubId,
        metadata: {
          send_mode: parsed.data.sendMode,
          recipient_count: count ?? 0,
          audience_type: parsed.data.audienceType,
        },
      });
    }

    await revalidateCommunications(parsed.data.clubId);
    return {
      ok: true,
      data: {
        campaignId,
        queued,
        recipientCount: count ?? 0,
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("communications.save_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not save the campaign.");
  }
}

export async function sendComposerTestEmail(
  input: unknown,
): Promise<ActionResult<{ providerMessageId: string | null }>> {
  try {
    const user = await requireActiveUser();
    const parsed = testEmailSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("name, school_id")
      .eq("id", parsed.data.clubId)
      .maybeSingle();
    if (!club) return failure("NOT_FOUND", "Club not found.");

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!user.email) {
      return failure("NO_EMAIL", "Your account does not have an email address for a test send.");
    }

    const result = await sendTestCommunicationEmail({
      toEmail: user.email,
      toName: profile?.display_name ?? "Officer",
      clubName: club.name,
      subject: sanitizePlainText(parsed.data.subject),
      previewText: sanitizePlainText(parsed.data.previewText || parsed.data.subject),
      messageBody: sanitizePlainText(parsed.data.messageBody),
      ctaLabel: parsed.data.ctaLabel?.trim() || null,
      ctaUrl: parsed.data.ctaUrl?.trim() || null,
      kindLabel: KIND_LABELS[parsed.data.campaignKind],
    });

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "email_campaign.test_send",
      entity_type: "email_campaigns",
      entity_id: null,
      school_id: club.school_id,
      club_id: parsed.data.clubId,
      metadata: {
        provider_message_id: result.providerMessageId,
        to_self: true,
      },
    });

    return { ok: true, data: result };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("communications.test_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "TEST_FAILED",
      error instanceof Error ? error.message : "Could not send test email.",
    );
  }
}

export async function enqueueExistingCampaign(
  input: unknown,
): Promise<ActionResult<{ jobQueued: boolean }>> {
  try {
    await requireActiveUser();
    const parsed = enqueueCampaignSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const supabase = await createClient();
    const { data: campaign } = await supabase
      .from("email_campaigns")
      .select("id, club_id")
      .eq("id", parsed.data.campaignId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!campaign) return failure("NOT_FOUND", "Campaign not found.");

    const { error } = await supabase.rpc("officer_enqueue_campaign_send", {
      target_campaign_id: parsed.data.campaignId,
      send_immediately: parsed.data.sendImmediately,
    });
    if (error) return failure("ENQUEUE_FAILED", error.message);

    await revalidateCommunications(parsed.data.clubId);
    return { ok: true, data: { jobQueued: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not queue the campaign.");
  }
}
