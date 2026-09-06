import "server-only";

import { requireClubManager, requireActiveUser } from "@/lib/auth/authorization";
import { postgrestIlikeOr } from "@/lib/supabase/postgrest-filter";
import { createClient } from "@/lib/supabase/server";
import type { MediaLibraryFilterInput } from "@/lib/validation/media";

export async function listClubMediaLibrary(
  filters: MediaLibraryFilterInput,
) {
  await requireClubManager(filters.clubId);
  const supabase = await createClient();

  let query = supabase
    .from("media_assets")
    .select(
      `
      id,
      title,
      description,
      media_type,
      mime_type,
      size_bytes,
      storage_bucket,
      storage_path,
      visibility,
      consent_required,
      consent_state,
      width,
      height,
      duration_seconds,
      related_event_id,
      uploader_id,
      created_at,
      uploader:profiles!media_assets_uploader_id_fkey(id, display_name)
    `,
    )
    .eq("club_id", filters.clubId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.q) {
    const orFilter = postgrestIlikeOr(["title", "description"], filters.q);
    if (orFilter) query = query.or(orFilter);
  }
  if (filters.mediaType && filters.mediaType !== "all") {
    query = query.eq("media_type", filters.mediaType);
  }
  if (filters.visibility && filters.visibility !== "all") {
    query = query.eq("visibility", filters.visibility);
  }
  if (filters.uploaderId) {
    query = query.eq("uploader_id", filters.uploaderId);
  }
  if (filters.eventId) {
    query = query.eq("related_event_id", filters.eventId);
  }
  if (filters.createdFrom) {
    query = query.gte("created_at", filters.createdFrom);
  }
  if (filters.createdTo) {
    query = query.lte("created_at", filters.createdTo);
  }

  const { data, error } = await query;
  if (error) throw error;

  let assets = data ?? [];

  if (filters.activityId) {
    const { data: links, error: linkError } = await supabase
      .from("club_activity_media")
      .select("media_asset_id")
      .eq("activity_id", filters.activityId);
    if (linkError) throw linkError;
    const ids = new Set((links ?? []).map((row) => row.media_asset_id));
    assets = assets.filter((asset) => ids.has(asset.id));
  }

  return assets;
}

export async function listClubMediaAttachTargets(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();

  const [activities, events, highlights, newsletters] = await Promise.all([
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
      .from("club_highlights")
      .select("id, title, status")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("newsletters")
      .select("id, title, status")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  if (activities.error) throw activities.error;
  if (events.error) throw events.error;
  if (highlights.error) throw highlights.error;
  if (newsletters.error) throw newsletters.error;

  const activityIds = (activities.data ?? []).map((row) => row.id);
  const activityMediaIds: Record<string, string[]> = {};
  if (activityIds.length > 0) {
    const { data: activityLinks, error: activityLinkError } = await supabase
      .from("club_activity_media")
      .select("activity_id, media_asset_id")
      .in("activity_id", activityIds);
    if (activityLinkError) throw activityLinkError;
    for (const row of activityLinks ?? []) {
      const list = activityMediaIds[row.activity_id] ?? [];
      list.push(row.media_asset_id);
      activityMediaIds[row.activity_id] = list;
    }
  }

  return {
    activities: activities.data ?? [],
    events: events.data ?? [],
    highlights: highlights.data ?? [],
    newsletters: newsletters.data ?? [],
    activityMediaIds,
  };
}

export async function listClubMediaUploaders(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("uploader_id, uploader:profiles!media_assets_uploader_id_fkey(display_name)")
    .eq("club_id", clubId)
    .is("deleted_at", null)
    .limit(200);
  if (error) throw error;

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const profile = Array.isArray(row.uploader) ? row.uploader[0] : row.uploader;
    if (row.uploader_id && profile?.display_name) {
      map.set(row.uploader_id, profile.display_name);
    }
  }
  return [...map.entries()].map(([id, displayName]) => ({ id, displayName }));
}

export async function getMediaAssetForClub(clubId: string, mediaAssetId: string) {
  await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", mediaAssetId)
    .eq("club_id", clubId)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data;
}
