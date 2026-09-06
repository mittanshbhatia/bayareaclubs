import "server-only";

import { requireClubManager } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

export async function listClubCampaigns(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select(
      `
      id,
      name,
      subject,
      status,
      campaign_kind,
      audience_type,
      recipient_count,
      scheduled_for,
      sent_at,
      created_at,
      preview_text
    `,
    )
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export async function getClubCampaign(clubId: string, campaignId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("club_id", clubId)
    .eq("id", campaignId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCampaignRecipientSummary(clubId: string, campaignId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("email_campaigns")
    .select("id")
    .eq("id", campaignId)
    .eq("club_id", clubId)
    .maybeSingle();
  if (!campaign) return { counts: {}, samples: [] as Array<{ displayName: string; status: string }> };

  const { data: recipients, error } = await supabase
    .from("email_recipients")
    .select(
      "status, recipient:profiles!email_recipients_recipient_user_id_fkey(display_name)",
    )
    .eq("campaign_id", campaignId)
    .limit(200);
  if (error) throw error;

  const counts: Record<string, number> = {};
  const samples: Array<{ displayName: string; status: string }> = [];
  for (const row of recipients ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
    if (samples.length < 8) {
      const profile = Array.isArray(row.recipient) ? row.recipient[0] : row.recipient;
      samples.push({
        displayName: profile?.display_name ?? "Member",
        status: row.status,
      });
    }
  }

  return { counts, samples };
}

export async function listClubEventsForAudience(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, starts_at, status")
    .eq("club_id", clubId)
    .order("starts_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}
