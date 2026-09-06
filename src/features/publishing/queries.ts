import "server-only";

import { requireClubManager } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";

export async function listClubHighlights(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_highlights")
    .select(
      `
      id, title, summary, body, source_type, occurred_on, visibility, status,
      cover_asset_id, related_activity_id, related_event_id, published_at, created_at
    `,
    )
    .eq("club_id", clubId)
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw error;
  return data ?? [];
}

export async function listHighlightRelatedOptions(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const [activities, events, media] = await Promise.all([
    supabase
      .from("club_activities")
      .select("id, title, activity_date")
      .eq("club_id", clubId)
      .order("activity_date", { ascending: false })
      .limit(40),
    supabase
      .from("events")
      .select("id, title, starts_at, status")
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(40),
    supabase
      .from("media_assets")
      .select("id, title, media_type")
      .eq("club_id", clubId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);
  if (activities.error) throw activities.error;
  if (events.error) throw events.error;
  if (media.error) throw media.error;
  return {
    activities: activities.data ?? [],
    events: events.data ?? [],
    media: media.data ?? [],
  };
}

export async function listClubNewsletters(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select(
      "id, title, issue_label, status, visibility, scheduled_for, published_at, archived_at, period_start, period_end, created_at",
    )
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export async function getNewsletterStudio(clubId: string, newsletterId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data: newsletter, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", newsletterId)
    .eq("club_id", clubId)
    .maybeSingle();
  if (error) throw error;
  if (!newsletter) return null;

  const { data: blocks, error: blocksError } = await supabase
    .from("newsletter_blocks")
    .select("id, position, block_type, content")
    .eq("newsletter_id", newsletterId)
    .order("position", { ascending: true });
  if (blocksError) throw blocksError;

  return { newsletter, blocks: blocks ?? [] };
}

export async function getClubMonthFacts(
  clubId: string,
  periodStart: string,
  periodEnd: string,
) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("club_month_facts", {
    target_club_id: clubId,
    range_start: periodStart,
    range_end: periodEnd,
  });
  if (error) throw error;
  return (data ?? {}) as Record<string, unknown>;
}

export async function listPublishedCoursesForStudio(): Promise<
  { id: string; title: string; provider_name: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("published_stem_courses")
    .select("id, title, discipline, provider_name")
    .order("title")
    .limit(30);
  if (error) throw error;
  return (data ?? []).flatMap((course) => {
    if (!course.id || !course.title) return [];
    return [
      {
        id: course.id,
        title: course.title,
        provider_name: course.provider_name ?? "Provider",
      },
    ];
  });
}

export async function getPublicNewsletter(newsletterId: string) {
  const supabase = await createClient();
  const { data: newsletter, error } = await supabase
    .from("published_newsletters")
    .select("*")
    .eq("id", newsletterId)
    .maybeSingle();
  if (error) throw error;
  if (!newsletter) return null;

  const { data: blocks, error: blocksError } = await supabase
    .from("published_newsletter_blocks")
    .select("id, position, block_type, content")
    .eq("newsletter_id", newsletterId)
    .order("position", { ascending: true });
  if (blocksError) throw blocksError;

  return {
    newsletter,
    blocks: blocks ?? [],
    clubName: newsletter.club_name ?? null,
    clubSlug: newsletter.club_slug ?? null,
  };
}

export type StudioBlock = {
  id: string;
  position: number;
  block_type: string;
  content: Json;
};
