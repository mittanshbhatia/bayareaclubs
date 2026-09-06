import "server-only";

import { computeAttendanceMetrics } from "@/features/attendance/metrics";
import { currentSchoolYear } from "@/features/clubs/school-year";
import {
  columnsToSections,
  type CharterFieldColumn,
  type CharterSectionDefinition,
} from "@/lib/validation/charters";
import {
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

const FIELD_COLUMNS = new Set<string>([
  "purpose",
  "mission",
  "membership_requirements",
  "officer_structure",
  "officer_responsibilities",
  "elections",
  "meeting_cadence",
  "conduct_expectations",
  "advisor_information",
  "planned_activities",
  "financial_policy",
  "amendment_process",
]);

export async function listCharterSectionDefinitions(): Promise<
  CharterSectionDefinition[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("charter_section_definitions")
    .select(
      "key, label, description, field_column, sort_order, required, min_length",
    )
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;

  return (data ?? [])
    .filter((row) => FIELD_COLUMNS.has(row.field_column))
    .map((row) => ({
      key: row.key,
      label: row.label,
      description: row.description,
      fieldColumn: row.field_column as CharterFieldColumn,
      sortOrder: row.sort_order,
      required: row.required,
      minLength: row.min_length,
    }));
}

export async function getCharterWorkspace(clubId: string, clubSlug: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();
  const definitions = await listCharterSectionDefinitions();

  const [chartersResult, versionsResult, feedbackResult, renewalResult] =
    await Promise.all([
      supabase
        .from("club_charters")
        .select("*")
        .eq("club_id", clubId)
        .eq("school_year", schoolYear)
        .order("version_number", { ascending: false }),
      supabase
        .from("club_charter_versions")
        .select(
          "id, charter_id, version_number, status_at_freeze, snapshot, created_at, created_by",
        )
        .order("version_number", { ascending: false })
        .limit(40),
      supabase
        .from("club_charter_applicant_feedback")
        .select("id, charter_id, decision, applicant_feedback, reviewed_at")
        .order("reviewed_at", { ascending: false })
        .limit(20),
      supabase
        .from("club_renewals")
        .select(
          "id, status, school_year, submitted_at, advisor_confirmed_at, next_year_plan",
        )
        .eq("club_id", clubId)
        .eq("school_year", schoolYear)
        .maybeSingle(),
    ]);

  if (chartersResult.error) throw chartersResult.error;
  if (versionsResult.error) throw versionsResult.error;

  const charters = chartersResult.data ?? [];
  const charterIds = new Set(charters.map((c) => c.id));
  const active =
    charters.find((c) =>
      ["draft", "changes_requested", "submitted"].includes(c.status),
    ) ?? charters[0] ?? null;

  const versions = (versionsResult.data ?? []).filter((v) =>
    charterIds.has(v.charter_id),
  );
  const feedback = (feedbackResult.data ?? []).filter(
    (f) => f.charter_id != null && charterIds.has(f.charter_id),
  );

  const sections = active
    ? columnsToSections(definitions, active)
    : Object.fromEntries(definitions.map((d) => [d.key, ""]));

  return {
    schoolYear,
    clubSlug,
    definitions,
    active,
    charters,
    versions,
    feedback,
    renewal: renewalResult.data,
    sections,
  };
}

export async function buildRenewalDerivedSnapshot(
  clubId: string,
  clubSlug: string,
  schoolYear: string,
) {
  const supabase = await createClient();

  const [
    charterResult,
    membersResult,
    sessionsResult,
    eventsResult,
    activitiesResult,
    highlightsResult,
  ] = await Promise.all([
    supabase
      .from("club_charters")
      .select("id, status, version_number, expires_at, school_year")
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .order("version_number", { ascending: false }),
    supabase
      .from("club_memberships")
      .select(
        "id, role, status, profiles!club_memberships_user_id_fkey(display_name)",
      )
      .eq("club_id", clubId)
      .eq("school_year", schoolYear)
      .eq("status", "active"),
    supabase
      .from("attendance_sessions")
      .select(
        "id, title, starts_at, attendance_records(membership_id, status, club_memberships!attendance_records_membership_id_fkey(id, profiles!club_memberships_user_id_fkey(display_name)))",
      )
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(40),
    supabase
      .from("events")
      .select("id, title, starts_at, status")
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(20),
    supabase
      .from("club_activities")
      .select("id, title, activity_date, category")
      .eq("club_id", clubId)
      .order("activity_date", { ascending: false })
      .limit(20),
    supabase
      .from("club_highlights")
      .select("id, title, status")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const members = membersResult.data ?? [];
  const officers = members
    .filter((m) => m.role !== "member")
    .map((m) => ({
      membershipId: m.id,
      role: m.role,
      displayName:
        (m.profiles as { display_name?: string } | null)?.display_name ??
        "Member",
    }));
  const advisor =
    officers.find((o) => o.role === "advisor") ?? null;

  const sessions = (sessionsResult.data ?? []).map((session) => ({
    id: session.id,
    title: session.title ?? "Meeting",
    startsAt: session.starts_at,
    records: (session.attendance_records ?? []).map((record) => {
      const membership = record.club_memberships as {
        id: string;
        profiles: { display_name: string } | null;
      } | null;
      return {
        membershipId: record.membership_id,
        status: record.status as "present" | "late" | "excused" | "absent",
        displayName: membership?.profiles?.display_name ?? "Member",
      };
    }),
  }));
  const attendance = computeAttendanceMetrics({ sessions });

  const approvedCharter =
    (charterResult.data ?? []).find((c) => c.status === "approved") ??
    (charterResult.data ?? [])[0] ??
    null;

  return {
    schoolYear,
    generatedAt: new Date().toISOString(),
    charter: approvedCharter
      ? {
          id: approvedCharter.id,
          status: approvedCharter.status,
          versionNumber: approvedCharter.version_number,
          expiresAt: approvedCharter.expires_at,
        }
      : null,
    leadership: officers,
    advisor,
    memberCount: members.length,
    meetingsHeld: attendance.meetingsHeld,
    attendance: {
      rate: attendance.attendanceRate,
      uniqueParticipants: attendance.uniqueParticipants,
      meetingsHeld: attendance.meetingsHeld,
    },
    events: (eventsResult.data ?? []).map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.starts_at,
      status: event.status,
    })),
    activities: (activitiesResult.data ?? []).map((activity) => ({
      id: activity.id,
      title: activity.title,
      activityDate: activity.activity_date,
      category: activity.category,
    })),
    highlights: (highlightsResult.data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
    })),
    sourceLinks: {
      members: `/clubs/${clubSlug}/members`,
      attendance: `/clubs/${clubSlug}/attendance`,
      events: `/clubs/${clubSlug}/events`,
      activities: `/clubs/${clubSlug}/activities`,
      charter: `/clubs/${clubSlug}/charter`,
    },
  };
}

export type RenewalDerivedSnapshot = Awaited<
  ReturnType<typeof buildRenewalDerivedSnapshot>
>;

export function formatActivitySummary(snapshot: RenewalDerivedSnapshot) {
  const parts = [
    `${snapshot.memberCount} active members`,
    `${snapshot.meetingsHeld} meetings held`,
    snapshot.attendance.rate == null
      ? "attendance rate unavailable"
      : `${snapshot.attendance.rate}% attendance rate`,
    `${snapshot.events.length} events on record`,
    `${snapshot.activities.length} major activities logged`,
    `${snapshot.highlights.length} highlights`,
  ];
  return parts.join(". ") + ".";
}

export async function getRenewalWorkspace(clubId: string, clubSlug: string) {
  await requireClubManager(clubId);
  const supabase = await createClient();
  const schoolYear = currentSchoolYear();
  const derived = await buildRenewalDerivedSnapshot(clubId, clubSlug, schoolYear);

  const { data: renewal, error } = await supabase
    .from("club_renewals")
    .select("*")
    .eq("club_id", clubId)
    .eq("school_year", schoolYear)
    .maybeSingle();
  if (error) throw error;

  const { data: feedback } = await supabase
    .from("club_renewal_applicant_feedback")
    .select("id, renewal_id, decision, applicant_feedback, reviewed_at")
    .order("reviewed_at", { ascending: false })
    .limit(10);

  const { data: reminders } = await supabase
    .from("renewal_reminders")
    .select("id, reminder_kind, due_on, scheduled_for, sent_at")
    .eq("club_id", clubId)
    .eq("school_year", schoolYear)
    .order("scheduled_for");

  return {
    schoolYear,
    clubSlug,
    derived,
    renewal,
    feedback: (feedback ?? []).filter((row) => row.renewal_id === renewal?.id),
    reminders: reminders ?? [],
  };
}

export async function listSubmittedChartersForReview() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_charters")
    .select(
      "id, club_id, school_year, status, version_number, submitted_at, clubs!inner(id, name, slug, school_id)",
    )
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });
  if (error) throw error;

  const rows = [];
  for (const row of data ?? []) {
    const club = row.clubs as {
      id: string;
      name: string;
      slug: string;
      school_id: string;
    };
    const { data: canReview } = await supabase.rpc("can_review_school", {
      target_school_id: club.school_id,
    });
    if (!canReview) continue;
    rows.push({
      id: row.id,
      clubId: club.id,
      clubName: club.name,
      clubSlug: club.slug,
      schoolYear: row.school_year,
      versionNumber: row.version_number,
      submittedAt: row.submitted_at,
      status: row.status,
    });
  }
  return { userId: user.id, charters: rows };
}

export async function listSubmittedRenewalsForReview() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_renewals")
    .select(
      "id, club_id, school_year, status, submitted_at, clubs!inner(id, name, slug, school_id)",
    )
    .in("status", ["submitted", "under_review"])
    .order("submitted_at", { ascending: true });
  if (error) throw error;

  const rows = [];
  for (const row of data ?? []) {
    const club = row.clubs as {
      id: string;
      name: string;
      slug: string;
      school_id: string;
    };
    const { data: canReview } = await supabase.rpc("can_review_school", {
      target_school_id: club.school_id,
    });
    if (!canReview) continue;
    rows.push({
      id: row.id,
      clubId: club.id,
      clubName: club.name,
      clubSlug: club.slug,
      schoolYear: row.school_year,
      submittedAt: row.submitted_at,
      status: row.status,
    });
  }
  return { userId: user.id, renewals: rows };
}
