import "server-only";

import { requireClubManager } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.generated";
import { currentSchoolYear } from "@/features/clubs/school-year";
import {
  buildRecommendedActions,
  type RecommendedAction,
} from "@/features/clubs/recommended-actions";

export type ClubRow = Database["public"]["Tables"]["clubs"]["Row"] & {
  schools: { id: string; name: string; slug: string } | null;
};

export type { RecommendedAction };

const OFFICER_ROLES = [
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
] as const;

export async function resolveClubBySlugForOfficer(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, role, clubs!inner(id, slug, status)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", [...OFFICER_ROLES]);

  const match = (memberships ?? []).find((row) => {
    const club = row.clubs as { id: string; slug: string; status: string } | null;
    return club?.slug === slug && club.status === "active";
  });

  if (!match) {
    const { data: managed } = await supabase
      .from("clubs")
      .select("id, slug")
      .eq("slug", slug)
      .eq("status", "active")
      .limit(5);
    for (const club of managed ?? []) {
      const { data: canManage } = await supabase.rpc("can_manage_club", {
        target_club_id: club.id,
      });
      if (canManage) {
        return getClubCommandContext(club.id);
      }
    }
    return null;
  }

  return getClubCommandContext(match.club_id);
}

export async function getClubCommandContext(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();

  const [
    clubResult,
    membersResult,
    termsResult,
    nextEventResult,
    activitiesResult,
    charterResult,
    renewalResult,
    highlightsResult,
    analyticsResult,
    attendanceTrendResult,
  ] = await Promise.all([
    supabase
      .from("clubs")
      .select("*, schools(id, name, slug)")
      .eq("id", clubId)
      .single(),
    supabase
      .from("club_memberships")
      .select(
        "id, user_id, role, status, school_year, invited_at, joined_at, exited_at, profiles!club_memberships_user_id_fkey(id, display_name)",
      )
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .order("created_at", { ascending: true }),
    supabase
      .from("club_officer_terms")
      .select(
        "id, membership_id, role, school_year, starts_on, ends_on, ended_reason, appointed_by, created_at",
      )
      .eq("club_id", clubId)
      .order("starts_on", { ascending: false }),
    supabase
      .from("events")
      .select(
        "id, title, starts_at, ends_at, status, event_rsvps(id, status)",
      )
      .eq("club_id", clubId)
      .gte("starts_at", new Date().toISOString())
      .eq("status", "published")
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("club_activities")
      .select("id, title, activity_date, category, description, outcomes")
      .eq("club_id", clubId)
      .order("activity_date", { ascending: false })
      .limit(5),
    supabase
      .from("club_charters")
      .select("id, status, school_year, expires_at, submitted_at, approved_at")
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .order("version_number", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("club_renewals")
      .select("id, status, school_year, submitted_at, advisor_confirmed_at")
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .maybeSingle(),
    supabase
      .from("club_highlights")
      .select("id, title, summary, published_at")
      .eq("club_id", clubId)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3),
    supabase
      .from("analytics_daily_club")
      .select("*")
      .eq("club_id", clubId)
      .order("metric_date", { ascending: false })
      .limit(14),
    supabase
      .from("attendance_sessions")
      .select("id, starts_at, attendance_records(id, status)")
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(6),
  ]);

  if (clubResult.error || !clubResult.data) {
    throw clubResult.error ?? new Error("Club not found");
  }

  const club = clubResult.data as ClubRow;
  const members = membersResult.data ?? [];
  const activeMembers = members.filter((m) => m.status === "active");
  const officers = activeMembers.filter((m) =>
    OFFICER_ROLES.includes(m.role as (typeof OFFICER_ROLES)[number]),
  );
  const hasAdvisor = activeMembers.some((m) => m.role === "advisor");

  const memberIdsWithoutAttendance = await findMembersWithoutAttendance(
    clubId,
    activeMembers.map((m) => m.id),
  );

  const nextEvent = nextEventResult.data;
  const rsvpCount = (nextEvent?.event_rsvps ?? []).filter(
    (rsvp) => rsvp.status === "going",
  ).length;

  const recommendedActions = buildRecommendedActions({
    slug: club.slug,
    charterExpiresAt: charterResult.data?.expires_at ?? null,
    charterStatus: charterResult.data?.status ?? null,
    renewalStatus: renewalResult.data?.status ?? null,
    hasAdvisor,
    membersWithoutAttendance: memberIdsWithoutAttendance.length,
    nextEventTitle: nextEvent?.title ?? null,
    nextEventRsvps: nextEvent ? rsvpCount : null,
    activeMemberCount: activeMembers.length,
    recentActivityCount: (activitiesResult.data ?? []).length,
  });

  const attendanceTrend = (attendanceTrendResult.data ?? []).map((session) => {
    const records = session.attendance_records ?? [];
    const present = records.filter((r) => r.status === "present").length;
    return {
      id: session.id,
      startsAt: session.starts_at,
      present,
      total: records.length,
    };
  });

  return {
    club,
    schoolYear,
    members,
    officers,
    officerTerms: termsResult.data ?? [],
    memberCount: activeMembers.length,
    nextEvent: nextEvent
      ? {
          id: nextEvent.id,
          title: nextEvent.title,
          startsAt: nextEvent.starts_at,
          rsvpCount,
        }
      : null,
    recentActivities: activitiesResult.data ?? [],
    charter: charterResult.data,
    renewal: renewalResult.data,
    highlights: highlightsResult.data ?? [],
    analytics: analyticsResult.data ?? [],
    attendanceTrend,
    recommendedActions,
  };
}

async function findMembersWithoutAttendance(
  clubId: string,
  membershipIds: string[],
) {
  if (membershipIds.length === 0) return [] as string[];
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("club_id", clubId);
  const sessionIds = (sessions ?? []).map((s) => s.id);
  if (sessionIds.length === 0) return [] as string[];

  const { data: records } = await supabase
    .from("attendance_records")
    .select("membership_id")
    .in("session_id", sessionIds)
    .eq("status", "present");

  const attended = new Set((records ?? []).map((r) => r.membership_id));
  return membershipIds.filter((id) => !attended.has(id));
}

export async function listClubMembers(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();
  const { data, error } = await supabase
    .from("club_memberships")
    .select(
      "id, user_id, role, status, school_year, invited_at, joined_at, exited_at, profiles!club_memberships_user_id_fkey(id, display_name)",
    )
    .eq("club_id", clubId)
    .eq("school_year", schoolYear)
    .order("role");
  if (error) throw error;
  return data ?? [];
}

export async function listOfficerTerms(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_officer_terms")
    .select("*")
    .eq("club_id", clubId)
    .order("starts_on", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listInviteCandidates(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_club_invite_candidates", {
    target_club_id: clubId,
  });
  if (error) throw error;
  return data ?? [];
}

export async function listClubActivities(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_activities")
    .select(
      "*, club_activity_participants(membership_id), club_activity_media(media_asset_id), events:related_event_id(id, title)",
    )
    .eq("club_id", clubId)
    .order("activity_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listClubEvents(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at, status, event_type, event_rsvps(id, status)")
    .eq("club_id", clubId)
    .order("starts_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function listAttendanceSessions(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_sessions")
    .select("id, starts_at, ends_at, location_name, attendance_records(id, status, membership_id)")
    .eq("club_id", clubId)
    .order("starts_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function getCharterSnapshot(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();
  const [{ data: charter }, { data: renewal }] = await Promise.all([
    supabase
      .from("club_charters")
      .select("*")
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .order("version_number", { ascending: false }),
    supabase
      .from("club_renewals")
      .select("*")
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .maybeSingle(),
  ]);
  return { schoolYear, charters: charter ?? [], renewal };
}

export async function listClubMedia(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, title, storage_bucket, visibility, created_at, mime_type")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function listCommunications(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("id, name, subject, status, scheduled_for, sent_at, created_at")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function listNewsletters(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, title, status, published_at, created_at")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function listClubResources(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("published_stem_courses")
    .select("id, title, description, provider_name, discipline")
    .order("title")
    .limit(30);
  if (error) throw error;
  return { clubId, courses: data ?? [] };
}

export async function listClubInsights(clubId: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_daily_club")
    .select("*")
    .eq("club_id", clubId)
    .order("metric_date", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}
