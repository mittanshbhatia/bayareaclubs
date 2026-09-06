import "server-only";

import {
  requireActiveUser,
  requireAdminConsoleAccess,
  requirePlatformAdmin,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { PlatformRoleKey } from "@/features/admin/sections";

export async function getAdminAccessRoles(): Promise<PlatformRoleKey[]> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_role_assignments")
    .select("role")
    .eq("user_id", user.id)
    .is("revoked_at", null);
  return (data ?? [])
    .map((row) => row.role)
    .filter(
      (role): role is PlatformRoleKey =>
        role === "platform_admin" || role === "committee_reviewer",
    );
}

export { requireAdminConsoleAccess };

export async function getAdminOverview() {
  await requireAdminConsoleAccess();
  const supabase = await createClient();
  const now = new Date();
  const in14 = new Date(now);
  in14.setDate(now.getDate() + 14);

  const [
    pendingIdeas,
    agingIdeas,
    renewalsDue,
    upcomingEvents,
    resourceDrafts,
    recentAudit,
    clubsNeedingAttention,
  ] = await Promise.all([
    supabase
      .from("club_ideas")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "under_review", "changes_requested"]),
    supabase
      .from("club_ideas")
      .select("id, title, submitted_at, status, schools(name)")
      .in("status", ["submitted", "under_review"])
      .not("submitted_at", "is", null)
      .lt(
        "submitted_at",
        new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
      )
      .order("submitted_at", { ascending: true })
      .limit(8),
    supabase
      .from("club_renewals")
      .select("id, status, school_year, clubs(name, slug), updated_at")
      .in("status", ["draft", "submitted", "under_review", "changes_requested"])
      .order("updated_at", { ascending: true })
      .limit(8),
    supabase
      .from("events")
      .select("id, title, starts_at, status, clubs(name, slug), event_type")
      .eq("status", "published")
      .gte("starts_at", now.toISOString())
      .lte("starts_at", in14.toISOString())
      .order("starts_at", { ascending: true })
      .limit(8),
    supabase
      .from("stem_courses")
      .select("id, title, status, provider_name, updated_at")
      .in("status", ["draft", "review"])
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("audit_logs")
      .select("id, action, entity_type, created_at, actor_id, school_id, club_id")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("club_charters")
      .select("id, club_id, expires_at, status, clubs(name, slug)")
      .eq("status", "approved")
      .not("expires_at", "is", null)
      .lte("expires_at", in14.toISOString())
      .order("expires_at", { ascending: true })
      .limit(8),
  ]);

  return {
    pendingApplications: pendingIdeas.count ?? 0,
    agingApplications: (agingIdeas.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      submittedAt: row.submitted_at,
      status: row.status,
      schoolName: (row.schools as { name: string } | null)?.name ?? null,
    })),
    renewalsDue: (renewalsDue.data ?? []).map((row) => ({
      id: row.id,
      status: row.status,
      schoolYear: row.school_year,
      clubName: (row.clubs as { name: string; slug: string } | null)?.name ?? null,
      clubSlug: (row.clubs as { name: string; slug: string } | null)?.slug ?? null,
    })),
    upcomingEvents: (upcomingEvents.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      startsAt: row.starts_at,
      eventType: row.event_type,
      clubName: (row.clubs as { name: string; slug: string } | null)?.name ?? null,
      clubSlug: (row.clubs as { name: string; slug: string } | null)?.slug ?? null,
    })),
    resourceReviewQueue: resourceDrafts.data ?? [],
    recentActions: recentAudit.data ?? [],
    clubsNeedingAttention: (clubsNeedingAttention.data ?? []).map((row) => ({
      id: row.id,
      expiresAt: row.expires_at,
      clubName: (row.clubs as { name: string; slug: string } | null)?.name ?? null,
      clubSlug: (row.clubs as { name: string; slug: string } | null)?.slug ?? null,
      clubId: row.club_id,
    })),
  };
}

export async function listAdminClubs(filters: {
  q?: string;
  schoolId?: string;
  category?: string;
  status?: string;
}) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("clubs")
    .select(
      "id, name, slug, category, status, school_id, created_at, updated_at, schools(name)",
    )
    .order("name")
    .limit(100);
  if (filters.schoolId) query = query.eq("school_id", filters.schoolId);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.status) {
    query = query.eq(
      "status",
      filters.status as "active" | "inactive" | "archived",
    );
  }
  if (filters.q) {
    const q = filters.q.replaceAll(",", " ").trim();
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%`);
  }
  const { data: clubs, error } = await query;
  if (error) throw error;

  const clubIds = (clubs ?? []).map((club) => club.id);
  const [{ data: memberCounts }, { data: renewals }, { data: activity }] =
    await Promise.all([
      clubIds.length
        ? supabase
            .from("club_memberships")
            .select("club_id")
            .in("club_id", clubIds)
            .eq("status", "active")
        : Promise.resolve({ data: [] as { club_id: string }[] }),
      clubIds.length
        ? supabase
            .from("club_renewals")
            .select("club_id, status, updated_at")
            .in("club_id", clubIds)
            .order("updated_at", { ascending: false })
        : Promise.resolve({ data: [] as { club_id: string; status: string; updated_at: string }[] }),
      clubIds.length
        ? supabase
            .from("analytics_daily_club")
            .select("club_id, metric_date, activities, meetings, events")
            .in("club_id", clubIds)
            .order("metric_date", { ascending: false })
            .limit(300)
        : Promise.resolve({
            data: [] as {
              club_id: string;
              metric_date: string;
              activities: number;
              meetings: number;
              events: number;
            }[],
          }),
    ]);

  const membersByClub = new Map<string, number>();
  for (const row of memberCounts ?? []) {
    membersByClub.set(row.club_id, (membersByClub.get(row.club_id) ?? 0) + 1);
  }
  const renewalByClub = new Map<string, string>();
  for (const row of renewals ?? []) {
    if (!renewalByClub.has(row.club_id)) renewalByClub.set(row.club_id, row.status);
  }
  const lastActivityByClub = new Map<string, string>();
  for (const row of activity ?? []) {
    if (lastActivityByClub.has(row.club_id)) continue;
    if (row.activities + row.meetings + row.events > 0) {
      lastActivityByClub.set(row.club_id, row.metric_date);
    }
  }

  return (clubs ?? []).map((club) => ({
    id: club.id,
    name: club.name,
    slug: club.slug,
    category: club.category,
    status: club.status,
    schoolId: club.school_id,
    schoolName: (club.schools as { name: string } | null)?.name ?? "—",
    members: membersByClub.get(club.id) ?? 0,
    renewal: renewalByClub.get(club.id) ?? "none",
    lastActivity: lastActivityByClub.get(club.id) ?? null,
  }));
}

export async function getAdminClubDetail(clubId: string) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data: club, error } = await supabase
    .from("clubs")
    .select("*, schools(id, name, slug, level, city)")
    .eq("id", clubId)
    .maybeSingle();
  if (error) throw error;
  if (!club) return null;

  const [
    memberships,
    events,
    charter,
    renewal,
    activities,
    audit,
  ] = await Promise.all([
    supabase
      .from("club_memberships")
      .select(
        "id, role, status, joined_at, user_id, profiles!club_memberships_user_id_fkey(display_name)",
      )
      .eq("club_id", clubId)
      .order("joined_at", { ascending: false })
      .limit(100),
    supabase
      .from("events")
      .select("id, title, starts_at, status, event_type")
      .eq("club_id", clubId)
      .order("starts_at", { ascending: false })
      .limit(20),
    supabase
      .from("club_charters")
      .select("id, status, school_year, expires_at, submitted_at, approved_at")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("club_renewals")
      .select("id, status, school_year, submitted_at, updated_at")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("club_activities")
      .select("id, title, activity_date, category")
      .eq("club_id", clubId)
      .order("activity_date", { ascending: false })
      .limit(20),
    supabase
      .from("audit_logs")
      .select("id, action, entity_type, created_at, actor_id, metadata")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const active = (memberships.data ?? []).filter((row) => row.status === "active");
  const leadership = active.filter((row) => row.role !== "member");

  return {
    club,
    leadership,
    membershipAggregates: {
      active: active.length,
      officers: leadership.filter((row) => row.role !== "advisor").length,
      advisors: leadership.filter((row) => row.role === "advisor").length,
      members: active.filter((row) => row.role === "member").length,
    },
    events: events.data ?? [],
    charters: charter.data ?? [],
    renewals: renewal.data ?? [],
    activities: activities.data ?? [],
    audit: audit.data ?? [],
  };
}

export async function listAdminSchools() {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data: schools, error } = await supabase
    .from("schools")
    .select(
      "id, name, slug, level, city, state_code, timezone, website_url, email_domain, is_active, updated_at",
    )
    .order("name");
  if (error) throw error;

  const schoolIds = (schools ?? []).map((school) => school.id);
  const [{ data: clubs }, { data: memberships }] = await Promise.all([
    schoolIds.length
      ? supabase.from("clubs").select("id, school_id, status").in("school_id", schoolIds)
      : Promise.resolve({ data: [] as { id: string; school_id: string; status: string }[] }),
    schoolIds.length
      ? supabase
          .from("user_school_memberships")
          .select(
            "school_id, role, status, user_id, profiles!user_school_memberships_user_id_fkey(display_name)",
          )
          .in("school_id", schoolIds)
          .eq("status", "active")
      : Promise.resolve({
          data: [] as {
            school_id: string;
            role: string;
            status: string;
            user_id: string;
            profiles: { display_name: string } | null;
          }[],
        }),
  ]);

  return (schools ?? []).map((school) => {
    const schoolClubs = (clubs ?? []).filter((club) => club.school_id === school.id);
    const staff = (memberships ?? []).map((row) => ({
      school_id: row.school_id,
      role: row.role,
      status: row.status,
      user_id: row.user_id,
      profiles:
        (
          row.profiles as unknown as { display_name: string } | null
        ) ?? null,
    }));
    const schoolStaff = staff.filter((row) => row.school_id === school.id);
    const administrators = schoolStaff.filter((row) => row.role === "school_admin");
    const advisors = schoolStaff.filter((row) =>
      ["school_advisor", "staff"].includes(row.role),
    );
    return {
      ...school,
      clubCount: schoolClubs.filter((club) => club.status === "active").length,
      administrators,
      advisors,
    };
  });
}

export async function listAdminEvents(filters: { q?: string; schoolId?: string }) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select(
      "id, title, starts_at, ends_at, status, event_type, club_id, clubs(name, slug, school_id, schools(name))",
    )
    .order("starts_at", { ascending: false })
    .limit(80);
  if (filters.q) {
    const q = filters.q.replaceAll(",", " ").trim();
    query = query.ilike("title", `%${q}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? [])
    .map((event) => {
      const club = event.clubs as {
        name: string;
        slug: string;
        school_id: string;
        schools: { name: string } | null;
      } | null;
      return {
        id: event.id,
        title: event.title,
        startsAt: event.starts_at,
        status: event.status,
        eventType: event.event_type,
        clubName: club?.name ?? "—",
        clubSlug: club?.slug ?? null,
        schoolName: club?.schools?.name ?? "—",
        schoolId: club?.school_id ?? null,
      };
    })
    .filter((event) =>
      filters.schoolId ? event.schoolId === filters.schoolId : true,
    );
}

export async function listAdminUsersAndRoles() {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data: assignments, error } = await supabase
    .from("platform_role_assignments")
    .select(
      "id, user_id, role, assigned_at, revoked_at, assigned_by, profiles!platform_role_assignments_user_id_fkey(display_name)",
    )
    .is("revoked_at", null)
    .order("assigned_at", { ascending: false });
  if (error) throw error;

  const { count } = await supabase
    .from("platform_role_assignments")
    .select("id", { count: "exact", head: true })
    .eq("role", "platform_admin")
    .is("revoked_at", null);

  return {
    assignments: (assignments ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      role: row.role,
      assignedAt: row.assigned_at,
      displayName:
        (
          row.profiles as unknown as { display_name: string } | null
        )?.display_name ?? "Member",
    })),
    activePlatformAdmins: count ?? 0,
  };
}

export async function listAuditLogs(filters: {
  actorId?: string;
  action?: string;
  entityType?: string;
  schoolId?: string;
  clubId?: string;
  start?: string;
  end?: string;
}) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("audit_logs")
    .select(
      "id, actor_id, action, entity_type, entity_id, school_id, club_id, metadata, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (filters.actorId) query = query.eq("actor_id", filters.actorId);
  if (filters.action) query = query.ilike("action", `%${filters.action}%`);
  if (filters.entityType) query = query.eq("entity_type", filters.entityType);
  if (filters.schoolId) query = query.eq("school_id", filters.schoolId);
  if (filters.clubId) query = query.eq("club_id", filters.clubId);
  if (filters.start) query = query.gte("created_at", `${filters.start}T00:00:00`);
  if (filters.end) query = query.lte("created_at", `${filters.end}T23:59:59`);
  const { data, error } = await query;
  if (error) throw error;

  const actorIds = [...new Set((data ?? []).map((row) => row.actor_id).filter(Boolean))] as string[];
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", actorIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row.display_name]));

  return (data ?? []).map((row) => ({
    ...row,
    actorName: row.actor_id ? profileMap.get(row.actor_id) ?? "System" : "System",
    // Strip potentially sensitive metadata keys for display
    safeMetadata: sanitizeAuditMetadata(row.metadata),
  }));
}

function sanitizeAuditMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }
  const blocked = new Set([
    "email",
    "password",
    "token",
    "secret",
    "access_token",
    "refresh_token",
    "phone",
    "address",
  ]);
  return Object.fromEntries(
    Object.entries(metadata as Record<string, unknown>).filter(
      ([key]) => !blocked.has(key.toLowerCase()),
    ),
  );
}

export async function listAdminCommunications() {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select(
      "id, name, subject, status, campaign_kind, created_at, scheduled_for, club_id, clubs(name, slug)",
    )
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}
