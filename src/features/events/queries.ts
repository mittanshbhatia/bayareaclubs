import "server-only";

import { requireClubManager } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

export async function listManagedEvents(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id, title, event_type, status, starts_at, ends_at, format, location_name,
      capacity, waitlist_enabled, visibility,
      event_rsvps(id, status)
    `,
    )
    .eq("club_id", clubId)
    .order("starts_at", { ascending: false })
    .limit(50);
  if (error) throw error;

  return (data ?? []).map((event) => {
    const rsvps = event.event_rsvps ?? [];
    return {
      ...event,
      goingCount: rsvps.filter((r) => r.status === "going").length,
      waitlistedCount: rsvps.filter((r) => r.status === "waitlisted").length,
      rsvpCount: rsvps.filter((r) => r.status !== "cancelled").length,
    };
  });
}

export async function getEventWorkspace(clubId: string, eventId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();

  const [eventResult, logisticsResult, tasksResult, membersResult, related] =
    await Promise.all([
      supabase
        .from("events")
        .select(
          `
          *,
          event_rsvps(
            id, user_id, status, waitlisted_at, responded_at, override_note, overridden_at,
            profiles!event_rsvps_user_id_fkey(display_name)
          )
        `,
        )
        .eq("id", eventId)
        .eq("club_id", clubId)
        .maybeSingle(),
      supabase
        .from("event_logistics")
        .select("*")
        .eq("event_id", eventId)
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("event_tasks")
        .select("*")
        .eq("event_id", eventId)
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("club_memberships")
        .select(
          "id, user_id, role, status, profiles!club_memberships_user_id_fkey(display_name)",
        )
        .eq("club_id", clubId)
        .eq("status", "active")
        .order("role"),
      Promise.all([
        supabase
          .from("attendance_sessions")
          .select("id, starts_at, title")
          .eq("club_id", clubId)
          .eq("event_id", eventId)
          .limit(5),
        supabase
          .from("club_activities")
          .select("id, title, activity_date")
          .eq("club_id", clubId)
          .eq("related_event_id", eventId)
          .limit(5),
      ]),
    ]);

  if (eventResult.error) throw eventResult.error;
  if (!eventResult.data) return null;
  if (logisticsResult.error) throw logisticsResult.error;
  if (tasksResult.error) throw tasksResult.error;

  const event = eventResult.data;
  const rsvps = (event.event_rsvps ?? []).map((rsvp) => ({
    id: rsvp.id,
    userId: rsvp.user_id,
    status: rsvp.status,
    waitlistedAt: rsvp.waitlisted_at,
    respondedAt: rsvp.responded_at,
    overrideNote: rsvp.override_note,
    overriddenAt: rsvp.overridden_at,
    displayName:
      (rsvp.profiles as { display_name?: string } | null)?.display_name ??
      "Member",
  }));

  const goingCount = rsvps.filter((r) => r.status === "going").length;
  const waitlistedCount = rsvps.filter((r) => r.status === "waitlisted").length;

  return {
    event,
    rsvps,
    goingCount,
    waitlistedCount,
    logistics: logisticsResult.data ?? [],
    tasks: tasksResult.data ?? [],
    members: (membersResult.data ?? []).map((member) => ({
      membershipId: member.id,
      userId: member.user_id,
      role: member.role,
      displayName:
        (member.profiles as { display_name?: string } | null)?.display_name ??
        "Member",
    })),
    relatedAttendance: related[0].data ?? [],
    relatedActivities: related[1].data ?? [],
    postEvent: {
      needsAttendance: (related[0].data ?? []).length === 0,
      needsActivity: (related[1].data ?? []).length === 0,
      ended: new Date(event.ends_at).getTime() < Date.now(),
      completed: event.status === "completed",
    },
  };
}
