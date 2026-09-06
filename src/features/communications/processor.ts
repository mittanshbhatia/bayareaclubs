import "server-only";

import { render } from "@react-email/render";

import { ClubCommunicationEmail } from "../../../emails/club-communication";
import { createCommunicationDispatcher } from "@/lib/email/job-dispatcher";
import {
  getEmailFromAddress,
  getResendClient,
  isPermanentEmailFailure,
} from "@/lib/email/resend";
import { logger } from "@/lib/logging/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { KIND_LABELS } from "@/lib/validation/communications";
import type { Database } from "@/types/database.generated";

type Campaign = Database["public"]["Tables"]["email_campaigns"]["Row"];
type Recipient = Database["public"]["Tables"]["email_recipients"]["Row"];
type Job = Database["public"]["Tables"]["communication_jobs"]["Row"];

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function preferenceCategoryForKind(
  kind: Campaign["campaign_kind"],
): Database["public"]["Enums"]["email_preference_category"] {
  switch (kind) {
    case "newsletter":
      return "newsletter";
    case "event_promotion":
      return "event_promotion";
    case "highlight_digest":
      return "highlight_digest";
    case "announcement":
      return "announcement";
    default:
      return "transactional";
  }
}

async function loadClubName(clubId: string | null) {
  if (!clubId) return "BayAreaClubs";
  const admin = createAdminClient();
  const { data } = await admin.from("clubs").select("name, slug").eq("id", clubId).maybeSingle();
  return data?.name ?? "BayAreaClubs";
}

async function loadUserEmail(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

async function loadDisplayName(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  return data?.display_name ?? "there";
}

export async function prepareCampaignRecipients(campaignId: string) {
  const admin = createAdminClient();
  const { data: campaign, error } = await admin
    .from("email_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();
  if (error || !campaign || !campaign.club_id) {
    throw new Error(error?.message ?? "Campaign not found.");
  }

  const category = preferenceCategoryForKind(campaign.campaign_kind);
  const { data: audience, error: audienceError } = await admin.rpc(
    "resolve_email_audience_user_ids",
    {
      target_club_id: campaign.club_id,
      audience: campaign.audience_type,
      filter: campaign.audience_filter,
    },
  );
  if (audienceError) throw new Error(audienceError.message);

  const userIds = (audience ?? []).map((row) => row.user_id);
  let inserted = 0;

  for (const userId of userIds) {
    const { data: allowed } = await admin.rpc("user_allows_email_category", {
      target_user_id: userId,
      category,
    });
    if (!allowed) continue;

    const idempotencyKey = `recipient:${campaignId}:${userId}`;
    const { error: insertError } = await admin.from("email_recipients").upsert(
      {
        campaign_id: campaignId,
        recipient_user_id: userId,
        status: "pending",
        idempotency_key: idempotencyKey,
        next_attempt_at: new Date().toISOString(),
      },
      { onConflict: "campaign_id,recipient_user_id", ignoreDuplicates: true },
    );
    if (!insertError) inserted += 1;
  }

  const { count } = await admin
    .from("email_recipients")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId);

  await admin
    .from("email_campaigns")
    .update({
      recipient_count: count ?? inserted,
      status: "sending",
      started_sending_at: new Date().toISOString(),
      preference_category: category,
    })
    .eq("id", campaignId);

  const dispatcher = createCommunicationDispatcher(async (args) => {
    const result = await admin.rpc("enqueue_communication_job", args);
    return result;
  });

  await dispatcher.enqueue({
    jobType: "send_campaign_batch",
    idempotencyKey: `send-batch:${campaignId}:0`,
    campaignId,
    payload: { cursor: 0 },
  });

  return { recipientCount: count ?? inserted };
}

async function sendOneRecipient(campaign: Campaign, recipient: Recipient) {
  if (recipient.provider_message_id) {
    return { skipped: true as const };
  }

  const email = await loadUserEmail(recipient.recipient_user_id);
  if (!email) {
    return {
      permanent: true as const,
      error: "Recipient has no deliverable email address.",
    };
  }

  const displayName = await loadDisplayName(recipient.recipient_user_id);
  const clubName = await loadClubName(campaign.club_id);
  const kindLabel =
    KIND_LABELS[campaign.campaign_kind as keyof typeof KIND_LABELS] ??
    campaign.campaign_kind.replaceAll("_", " ");

  const html = await render(
    ClubCommunicationEmail({
      clubName,
      recipientName: displayName,
      previewText: campaign.preview_text ?? campaign.subject,
      messageBody: campaign.message_body,
      ctaLabel: campaign.cta_label,
      ctaUrl: campaign.cta_url,
      preferencesUrl: `${appUrl()}/dashboard/profile`,
      kindLabel,
    }),
  );

  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    to: email,
    subject: campaign.subject,
    html,
    headers: {
      "X-Entity-Ref-ID": recipient.id,
      "X-Campaign-ID": campaign.id,
    },
  });

  if (result.error) {
    const permanent = isPermanentEmailFailure(
      undefined,
      result.error.message,
    );
    return { permanent, error: result.error.message };
  }

  return { providerMessageId: result.data?.id ?? null };
}

export async function sendCampaignBatch(campaignId: string, batchSize = 40) {
  const admin = createAdminClient();
  const { data: campaign, error } = await admin
    .from("email_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();
  if (error || !campaign) throw new Error(error?.message ?? "Campaign missing.");

  const { data: recipients, error: claimError } = await admin.rpc(
    "claim_pending_email_recipients",
    {
      target_campaign_id: campaignId,
      batch_size: batchSize,
    },
  );
  if (claimError) throw new Error(claimError.message);

  let sent = 0;
  let failed = 0;

  for (const recipient of recipients ?? []) {
    try {
      const outcome = await sendOneRecipient(campaign, recipient);
      if ("skipped" in outcome && outcome.skipped) continue;

      if ("providerMessageId" in outcome) {
        await admin
          .from("email_recipients")
          .update({
            status: "sent",
            provider_message_id: outcome.providerMessageId,
            sent_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", recipient.id);
        sent += 1;
        continue;
      }

      if (outcome.permanent || recipient.attempt_count >= recipient.max_attempts) {
        await admin
          .from("email_recipients")
          .update({
            status: "failed",
            permanent_failure: true,
            failed_at: new Date().toISOString(),
            last_error: outcome.error,
          })
          .eq("id", recipient.id);
        failed += 1;
      } else {
        const delaySeconds = Math.min(3600, 2 ** recipient.attempt_count * 30);
        await admin
          .from("email_recipients")
          .update({
            status: "pending",
            last_error: outcome.error,
            next_attempt_at: new Date(Date.now() + delaySeconds * 1000).toISOString(),
          })
          .eq("id", recipient.id);
        failed += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "send failed";
      logger.error("communications.send_recipient_failed", {
        recipientId: recipient.id,
        message,
      });
      await admin
        .from("email_recipients")
        .update({
          status: "pending",
          last_error: message,
          next_attempt_at: new Date(Date.now() + 60_000).toISOString(),
        })
        .eq("id", recipient.id);
      failed += 1;
    }
  }

  const { count: pendingCount } = await admin
    .from("email_recipients")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId)
    .eq("status", "pending")
    .eq("permanent_failure", false);

  if ((pendingCount ?? 0) > 0) {
    const dispatcher = createCommunicationDispatcher(async (args) => {
      const result = await admin.rpc("enqueue_communication_job", args);
      return result;
    });
    await dispatcher.enqueue({
      jobType: "send_campaign_batch",
      idempotencyKey: `send-batch:${campaignId}:${Date.now()}`,
      campaignId,
      payload: { continue: true },
      runAfter: new Date(Date.now() + 5_000).toISOString(),
    });
  } else {
    await admin
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", campaignId);
  }

  return { sent, failed, pending: pendingCount ?? 0 };
}

export async function processCommunicationJobs(workerId: string, limit = 10) {
  const admin = createAdminClient();
  const { data: jobs, error } = await admin.rpc("claim_communication_jobs", {
    worker_id: workerId,
    batch_size: limit,
  });
  if (error) throw new Error(error.message);

  const results: Array<{ jobId: string; ok: boolean; detail?: string }> = [];

  for (const job of (jobs ?? []) as Job[]) {
    try {
      if (job.job_type === "prepare_campaign_recipients" && job.campaign_id) {
        const prepared = await prepareCampaignRecipients(job.campaign_id);
        await admin.rpc("complete_communication_job", {
          target_job_id: job.id,
          succeeded: true,
        });
        results.push({
          jobId: job.id,
          ok: true,
          detail: `prepared:${prepared.recipientCount}`,
        });
      } else if (job.job_type === "send_campaign_batch" && job.campaign_id) {
        const batch = await sendCampaignBatch(job.campaign_id);
        await admin.rpc("complete_communication_job", {
          target_job_id: job.id,
          succeeded: true,
        });
        results.push({
          jobId: job.id,
          ok: true,
          detail: `sent:${batch.sent},pending:${batch.pending}`,
        });
      } else {
        await admin.rpc("complete_communication_job", {
          target_job_id: job.id,
          succeeded: true,
        });
        results.push({ jobId: job.id, ok: true, detail: "noop" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "job failed";
      await admin.rpc("complete_communication_job", {
        target_job_id: job.id,
        succeeded: false,
        error_message: message,
      });
      results.push({ jobId: job.id, ok: false, detail: message });
    }
  }

  return results;
}

export async function sendTestCommunicationEmail(input: {
  toEmail: string;
  toName: string;
  clubName: string;
  subject: string;
  previewText: string;
  messageBody: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  kindLabel: string;
}) {
  const html = await render(
    ClubCommunicationEmail({
      clubName: input.clubName,
      recipientName: input.toName,
      previewText: input.previewText || input.subject,
      messageBody: input.messageBody,
      ctaLabel: input.ctaLabel,
      ctaUrl: input.ctaUrl,
      preferencesUrl: `${appUrl()}/dashboard/profile`,
      kindLabel: input.kindLabel,
    }),
  );

  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    to: input.toEmail,
    subject: `[Test] ${input.subject}`,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  return { providerMessageId: result.data?.id ?? null };
}
