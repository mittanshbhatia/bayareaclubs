import "server-only";

import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database.generated";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export type InAppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl: string | null;
  clubId: string | null;
  schoolId: string | null;
  entityType: string | null;
  entityId: string | null;
  readAt: string | null;
  createdAt: string;
  payload: Record<string, unknown>;
};

function mapNotification(row: NotificationRow): InAppNotification {
  const payload =
    row.payload && typeof row.payload === "object" && !Array.isArray(row.payload)
      ? (row.payload as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    type: row.notification_type,
    title: row.title,
    body: row.body,
    actionUrl: row.action_url,
    clubId: row.club_id,
    schoolId: row.school_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    readAt: row.read_at,
    createdAt: row.created_at,
    payload,
  };
}

export async function listMyNotifications(limit = 40): Promise<{
  notifications: InAppNotification[];
  unreadCount: number;
}> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("notifications")
      .select(
        "id, notification_type, title, body, action_url, club_id, school_id, entity_type, entity_id, read_at, created_at, payload",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null),
  ]);
  if (error) throw error;
  return {
    notifications: (data ?? []).map((row) => mapNotification(row as NotificationRow)),
    unreadCount: count ?? 0,
  };
}

export async function getMyNotificationPreferences() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_notification_preferences")
    .select("category, in_app_enabled")
    .eq("user_id", user.id);
  if (error) throw error;

  const map: Record<string, boolean> = {
    events: true,
    communications: true,
    resources: true,
  };
  for (const row of data ?? []) {
    map[row.category] = row.in_app_enabled;
  }
  return map;
}

export async function emitNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  clubId?: string | null;
  schoolId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  payload?: Record<string, unknown>;
}): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("emit_in_app_notification", {
    p_user_id: input.userId,
    p_type: input.type,
    p_title: input.title,
    p_body: input.body,
    p_action_url: input.actionUrl ?? undefined,
    p_club_id: input.clubId ?? undefined,
    p_school_id: input.schoolId ?? undefined,
    p_entity_type: input.entityType ?? undefined,
    p_entity_id: input.entityId ?? undefined,
    p_payload: (input.payload ?? {}) as Json,
  });
  if (error) throw error;
  return data;
}

export async function emitNotificationToClubMembers(input: {
  clubId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  payload?: Record<string, unknown>;
  roles?: Database["public"]["Enums"]["club_role"][] | null;
  excludeUserId?: string | null;
}): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "emit_in_app_notifications_to_club_members",
    {
      p_club_id: input.clubId,
      p_type: input.type,
      p_title: input.title,
      p_body: input.body,
      p_action_url: input.actionUrl ?? undefined,
      p_entity_type: input.entityType ?? undefined,
      p_entity_id: input.entityId ?? undefined,
      p_payload: (input.payload ?? {}) as Json,
      p_roles: input.roles ?? undefined,
      p_exclude_user_id: input.excludeUserId ?? undefined,
    },
  );
  if (error) throw error;
  return data ?? 0;
}
