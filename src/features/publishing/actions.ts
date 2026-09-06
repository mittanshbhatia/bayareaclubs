"use server";

import { revalidatePath } from "next/cache";

import { render } from "@react-email/render";

import { NewsletterEmail } from "../../../emails/newsletter";
import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { getEmailFromAddress, getResendClient } from "@/lib/email/resend";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  highlightFormSchema,
  monthFactsSchema,
  newsletterActionSchema,
  newsletterDraftSchema,
} from "@/lib/validation/publishing";
import type { ActionResult } from "@/types/action-result";
import type { Database, Json } from "@/types/database.generated";

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

async function clubSlug(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("clubs").select("slug, name, school_id").eq("id", clubId).maybeSingle();
  return data;
}

async function revalidatePublishing(clubId: string, newsletterId?: string) {
  const club = await clubSlug(clubId);
  if (!club?.slug) return;
  revalidatePath(`/clubs/${club.slug}/highlights`);
  revalidatePath(`/clubs/${club.slug}/newsletter`);
  revalidatePath(`/clubs/${club.slug}`);
  if (newsletterId) {
    revalidatePath(`/clubs/${club.slug}/newsletter/${newsletterId}`);
    revalidatePath(`/p/${club.slug}/newsletters/${newsletterId}`);
  }
}

export async function saveHighlight(
  input: unknown,
): Promise<ActionResult<{ highlightId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = highlightFormSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    if (parsed.data.visibility === "public" && parsed.data.publish) {
      // public requires explicit publish + later approval path stays officer-controlled for v1
    }

    const row = {
      club_id: parsed.data.clubId,
      title: parsed.data.title,
      summary: parsed.data.summary,
      body: parsed.data.body || parsed.data.summary,
      source_type: parsed.data.sourceType as Database["public"]["Enums"]["highlight_source_type"],
      occurred_on: parsed.data.occurredOn,
      cover_asset_id: parsed.data.coverAssetId || null,
      related_activity_id: parsed.data.relatedActivityId || null,
      related_event_id: parsed.data.relatedEventId || null,
      visibility: (
        parsed.data.visibility === "public" && !parsed.data.publish
          ? "club"
          : parsed.data.visibility
      ) as Database["public"]["Enums"]["visibility_level"],
      created_by: user.id,
      status: (parsed.data.publish ? "published" : "draft") as Database["public"]["Enums"]["publication_status"],
      published_at: parsed.data.publish ? new Date().toISOString() : null,
    };

    let highlightId = parsed.data.highlightId;
    if (highlightId) {
      const { error } = await supabase
        .from("club_highlights")
        .update({
          title: row.title,
          summary: row.summary,
          body: row.body,
          source_type: row.source_type,
          occurred_on: row.occurred_on,
          cover_asset_id: row.cover_asset_id,
          related_activity_id: row.related_activity_id,
          related_event_id: row.related_event_id,
          visibility: row.visibility,
          status: row.status,
          published_at: row.published_at,
        })
        .eq("id", highlightId)
        .eq("club_id", parsed.data.clubId);
      if (error) return failure("SAVE_FAILED", error.message);
    } else {
      const { data, error } = await supabase
        .from("club_highlights")
        .insert(row)
        .select("id")
        .single();
      if (error || !data) return failure("SAVE_FAILED", error?.message ?? "Create failed");
      highlightId = data.id;
    }

    await revalidatePublishing(parsed.data.clubId);
    return { ok: true, data: { highlightId: highlightId! } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not save highlight.");
  }
}

export async function fetchMonthFacts(
  input: unknown,
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    await requireActiveUser();
    const parsed = monthFactsSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("club_month_facts", {
      target_club_id: parsed.data.clubId,
      range_start: parsed.data.periodStart,
      range_end: parsed.data.periodEnd,
    });
    if (error) return failure("FACTS_FAILED", error.message);
    return { ok: true, data: (data as Record<string, unknown>) ?? {} };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not load month facts.");
  }
}

export async function saveNewsletterDraft(
  input: unknown,
): Promise<ActionResult<{ newsletterId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = newsletterDraftSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const club = await clubSlug(parsed.data.clubId);
    if (!club) return failure("NOT_FOUND", "Club not found.");
    const supabase = await createClient();

    const newsletterRow = {
      school_id: club.school_id,
      club_id: parsed.data.clubId,
      created_by: user.id,
      title: parsed.data.title,
      issue_label: parsed.data.issueLabel || null,
      preview_text: parsed.data.previewText || null,
      visibility: parsed.data.visibility as Database["public"]["Enums"]["visibility_level"],
      period_start: parsed.data.periodStart || null,
      period_end: parsed.data.periodEnd || null,
      selected_facts: parsed.data.selectedFacts as unknown as Json,
      status: "draft" as const,
    };

    let newsletterId = parsed.data.newsletterId;
    if (newsletterId) {
      const { data: existing } = await supabase
        .from("newsletters")
        .select("id, status")
        .eq("id", newsletterId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!existing) return failure("NOT_FOUND", "Newsletter not found.");
      if (existing.status === "archived") {
        return failure("INVALID_STATE", "Archived newsletters cannot be edited.");
      }
      const { error } = await supabase
        .from("newsletters")
        .update({
          title: newsletterRow.title,
          issue_label: newsletterRow.issue_label,
          preview_text: newsletterRow.preview_text,
          visibility: newsletterRow.visibility,
          period_start: newsletterRow.period_start,
          period_end: newsletterRow.period_end,
          selected_facts: newsletterRow.selected_facts,
        })
        .eq("id", newsletterId);
      if (error) return failure("SAVE_FAILED", error.message);
    } else {
      const { data, error } = await supabase
        .from("newsletters")
        .insert(newsletterRow)
        .select("id")
        .single();
      if (error || !data) return failure("SAVE_FAILED", error?.message ?? "Create failed");
      newsletterId = data.id;
    }

    await supabase.from("newsletter_blocks").delete().eq("newsletter_id", newsletterId);

    if (parsed.data.blocks.length > 0) {
      const rows = parsed.data.blocks.map((block, index) => ({
        newsletter_id: newsletterId!,
        position: index,
        block_type: block.blockType as Database["public"]["Enums"]["newsletter_block_type"],
        content: block.content as Json,
      }));
      const { error: blocksError } = await supabase.from("newsletter_blocks").insert(rows);
      if (blocksError) return failure("BLOCKS_FAILED", blocksError.message);
    }

    await revalidatePublishing(parsed.data.clubId, newsletterId);
    return { ok: true, data: { newsletterId: newsletterId! } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("publishing.newsletter_save_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not save newsletter.");
  }
}

export async function publishNewsletterWeb(
  input: unknown,
): Promise<ActionResult<{ newsletterId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = newsletterActionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: newsletter } = await supabase
      .from("newsletters")
      .select("id, visibility, status")
      .eq("id", parsed.data.newsletterId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!newsletter) return failure("NOT_FOUND", "Newsletter not found.");

    const { error } = await supabase
      .from("newsletters")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        archived_at: null,
      })
      .eq("id", parsed.data.newsletterId);
    if (error) return failure("PUBLISH_FAILED", error.message);

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "newsletter.publish_web",
      entity_type: "newsletters",
      entity_id: parsed.data.newsletterId,
      club_id: parsed.data.clubId,
      metadata: { visibility: newsletter.visibility },
    });

    await revalidatePublishing(parsed.data.clubId, parsed.data.newsletterId);
    return { ok: true, data: { newsletterId: parsed.data.newsletterId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not publish newsletter.");
  }
}

export async function scheduleOrSendNewsletter(
  input: unknown,
): Promise<ActionResult<{ campaignId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = newsletterActionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);

    const mode = parsed.data.mode === "schedule" ? "schedule" : "send";
    const club = await clubSlug(parsed.data.clubId);
    if (!club) return failure("NOT_FOUND", "Club not found.");
    const supabase = await createClient();

    const { data: newsletter } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", parsed.data.newsletterId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!newsletter) return failure("NOT_FOUND", "Newsletter not found.");

    const { data: blocks } = await supabase
      .from("newsletter_blocks")
      .select("block_type, content, position")
      .eq("newsletter_id", parsed.data.newsletterId)
      .order("position");

    const messageParts = (blocks ?? [])
      .filter((block) => block.block_type === "text" || block.block_type === "hero")
      .map((block) => {
        const content = block.content as Record<string, unknown>;
        return String(content.body ?? content.subtitle ?? content.title ?? "");
      })
      .filter(Boolean);

    const scheduledFor =
      mode === "schedule" && parsed.data.scheduledFor
        ? new Date(parsed.data.scheduledFor).toISOString()
        : null;

    if (mode === "schedule") {
      if (!scheduledFor || new Date(scheduledFor).getTime() <= Date.now()) {
        return failure("VALIDATION_ERROR", "Schedule time must be in the future.");
      }
      await supabase
        .from("newsletters")
        .update({ status: "scheduled", scheduled_for: scheduledFor })
        .eq("id", parsed.data.newsletterId);
    }

    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .insert({
        school_id: club.school_id,
        club_id: parsed.data.clubId,
        created_by: user.id,
        name: `Newsletter: ${newsletter.title}`.slice(0, 160),
        subject: newsletter.title.slice(0, 200),
        preview_text: newsletter.preview_text,
        message_body:
          messageParts.join("\n\n").slice(0, 20000) ||
          newsletter.preview_text ||
          newsletter.title,
        campaign_kind: "newsletter",
        audience_type: "all_members",
        preference_category: "newsletter",
        status: "draft",
        scheduled_for: scheduledFor,
        content_json: {
          newsletter_id: newsletter.id,
          blocks: blocks ?? [],
        } as Json,
      })
      .select("id")
      .single();

    if (campaignError || !campaign) {
      return failure("CAMPAIGN_FAILED", campaignError?.message ?? "Could not create campaign.");
    }

    await supabase
      .from("newsletters")
      .update({ email_campaign_id: campaign.id })
      .eq("id", parsed.data.newsletterId);

    const { error: enqueueError } = await supabase.rpc("officer_enqueue_campaign_send", {
      target_campaign_id: campaign.id,
      send_immediately: mode === "send",
    });
    if (enqueueError) return failure("ENQUEUE_FAILED", enqueueError.message);

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: mode === "send" ? "newsletter.send" : "newsletter.schedule",
      entity_type: "newsletters",
      entity_id: parsed.data.newsletterId,
      school_id: club.school_id,
      club_id: parsed.data.clubId,
      metadata: { campaign_id: campaign.id, scheduled_for: scheduledFor },
    });

    await revalidatePublishing(parsed.data.clubId, parsed.data.newsletterId);
    return { ok: true, data: { campaignId: campaign.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not queue newsletter email.");
  }
}

export async function archiveNewsletter(
  input: unknown,
): Promise<ActionResult<{ newsletterId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = newsletterActionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletters")
      .update({
        status: "archived",
        archived_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.newsletterId)
      .eq("club_id", parsed.data.clubId);
    if (error) return failure("ARCHIVE_FAILED", error.message);

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "newsletter.archive",
      entity_type: "newsletters",
      entity_id: parsed.data.newsletterId,
      club_id: parsed.data.clubId,
      metadata: {},
    });

    await revalidatePublishing(parsed.data.clubId, parsed.data.newsletterId);
    return { ok: true, data: { newsletterId: parsed.data.newsletterId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not archive newsletter.");
  }
}

export async function sendNewsletterTestEmail(
  input: unknown,
): Promise<ActionResult<{ providerMessageId: string | null }>> {
  try {
    const user = await requireActiveUser();
    const parsed = newsletterActionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    if (!user.email) return failure("NO_EMAIL", "Your account has no email for test send.");

    const club = await clubSlug(parsed.data.clubId);
    if (!club) return failure("NOT_FOUND", "Club not found.");
    const supabase = await createClient();
    const { data: newsletter } = await supabase
      .from("newsletters")
      .select("title, preview_text, issue_label")
      .eq("id", parsed.data.newsletterId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!newsletter) return failure("NOT_FOUND", "Newsletter not found.");

    const { data: blocks } = await supabase
      .from("newsletter_blocks")
      .select("block_type, content, position")
      .eq("newsletter_id", parsed.data.newsletterId)
      .order("position");

    const html = await render(
      NewsletterEmail({
        clubName: club.name,
        title: newsletter.title,
        previewText: newsletter.preview_text ?? newsletter.title,
        issueLabel: newsletter.issue_label,
        blocks: (blocks ?? []).map((block) => ({
          blockType: block.block_type,
          content: (block.content ?? {}) as Record<string, unknown>,
        })),
      }),
    );

    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getEmailFromAddress(),
      to: user.email,
      subject: `[Test] ${newsletter.title}`,
      html,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }

    return { ok: true, data: { providerMessageId: result.data?.id ?? null } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure(
      "TEST_FAILED",
      error instanceof Error ? error.message : "Could not send test email.",
    );
  }
}
