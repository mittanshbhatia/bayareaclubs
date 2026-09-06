import "server-only";

import {
  requireClubManager,
  requireClubMember,
  requireSchoolAccess,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import { currentSchoolYear } from "@/features/clubs/school-year";
import {
  computeAttendanceMetrics,
  type AttendanceStatus,
} from "@/features/attendance/metrics";

export async function getAttendanceWorkspace(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();

  const [sessionsResult, membersResult, eventsResult] = await Promise.all([
    supabase
      .from("attendance_sessions")
      .select(
        `
        id, title, starts_at, ends_at, location_name, event_id, check_in_enabled, created_at,
        attendance_records(
          id, membership_id, status, note, recorded_at, previous_status, corrected_at, correction_note,
          club_memberships!attendance_records_membership_id_fkey(
            id, user_id, profiles!club_memberships_user_id_fkey(display_name)
          )
        )
      `,
      )
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(40),
    supabase
      .from("club_memberships")
      .select(
        "id, user_id, role, status, profiles!club_memberships_user_id_fkey(display_name)",
      )
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .eq("status", "active")
      .order("role"),
    supabase
      .from("events")
      .select("id, title, starts_at")
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(30),
  ]);

  if (sessionsResult.error) throw sessionsResult.error;
  if (membersResult.error) throw membersResult.error;
  if (eventsResult.error) throw eventsResult.error;

  const sessions = (sessionsResult.data ?? []).map((session) => ({
    id: session.id,
    title: session.title,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    locationName: session.location_name,
    eventId: session.event_id,
    checkInEnabled: session.check_in_enabled,
    records: (session.attendance_records ?? []).map((record) => {
      const membership = record.club_memberships as {
        id: string;
        user_id: string;
        profiles: { display_name: string } | null;
      } | null;
      return {
        id: record.id,
        membershipId: record.membership_id,
        status: record.status as AttendanceStatus,
        note: record.note,
        recordedAt: record.recorded_at,
        previousStatus: record.previous_status as AttendanceStatus | null,
        correctedAt: record.corrected_at,
        correctionNote: record.correction_note,
        displayName: membership?.profiles?.display_name ?? "Member",
        userId: membership?.user_id ?? null,
      };
    }),
  }));

  const metrics = computeAttendanceMetrics({ sessions });

  return {
    schoolYear,
    sessions,
    metrics,
    eligibleMembers: (membersResult.data ?? []).map((member) => ({
      id: member.id,
      userId: member.user_id,
      role: member.role,
      displayName:
        (member.profiles as { display_name?: string } | null)?.display_name ??
        "Member",
    })),
    events: eventsResult.data ?? [],
  };
}

export async function getAttendanceSessionDetail(
  clubId: string,
  sessionId: string,
) {
  await requireClubManager(clubId);
  const workspace = await getAttendanceWorkspace(clubId);
  const session = workspace.sessions.find((item) => item.id === sessionId);
  if (!session) return null;
  return {
    session,
    eligibleMembers: workspace.eligibleMembers,
    events: workspace.events,
  };
}

export async function getMyAttendance(clubId: string) {
  const user = await requireClubMember(clubId);
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("club_memberships")
    .select("id")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return { records: [] as const, summary: { recorded: 0, presentLike: 0, rate: null as number | null } };
  }

  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      id, status, note, recorded_at,
      attendance_sessions!inner(id, title, starts_at, location_name, club_id)
    `,
    )
    .eq("membership_id", membership.id)
    .eq("attendance_sessions.club_id", clubId)
    .order("recorded_at", { ascending: false });

  if (error) throw error;

  const records = (data ?? []).map((row) => {
    const session = row.attendance_sessions as {
      id: string;
      title: string;
      starts_at: string;
      location_name: string | null;
    };
    return {
      id: row.id,
      status: row.status as AttendanceStatus,
      note: row.note,
      recordedAt: row.recorded_at,
      sessionId: session.id,
      sessionTitle: session.title,
      startsAt: session.starts_at,
      locationName: session.location_name,
    };
  });

  const presentLike = records.filter((record) =>
    record.status === "present" || record.status === "late",
  ).length;

  return {
    records,
    summary: {
      recorded: records.length,
      presentLike,
      rate:
        records.length === 0
          ? null
          : Math.round((presentLike / records.length) * 100),
    },
  };
}

export async function getSchoolAttendanceAggregate(schoolId: string) {
  await requireSchoolAccess(schoolId);
  const supabase = await createClient();
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("id, name, slug")
    .eq("school_id", schoolId)
    .order("name");
  if (error) throw error;

  const summaries = [];
  for (const club of clubs ?? []) {
    const { data: canManage } = await supabase.rpc("can_manage_club", {
      target_club_id: club.id,
    });
    if (!canManage) continue;

    const workspace = await getAttendanceWorkspace(club.id);
    summaries.push({
      clubId: club.id,
      clubName: club.name,
      clubSlug: club.slug,
      attendanceRate: workspace.metrics.attendanceRate,
      meetingsHeld: workspace.metrics.meetingsHeld,
      uniqueParticipants: workspace.metrics.uniqueParticipants,
    });
  }

  return summaries;
}
