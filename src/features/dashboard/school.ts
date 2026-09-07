import "server-only";

import { z } from "zod";

import { getSchoolAttendanceAggregate } from "@/features/attendance/queries";
import { daysUntil } from "@/features/clubs/school-year";
import {
  requireActiveUser,
  requireSchoolDashboardAccess,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.generated";

type SchoolRole = Database["public"]["Enums"]["school_role"];
type ClubStatus = Database["public"]["Enums"]["club_status"];

export const SCHOOL_DASHBOARD_ROLES = [
  "school_admin",
  "school_advisor",
  "staff",
] as const satisfies readonly SchoolRole[];

const IDEA_REVIEW_STATUSES = [
  "submitted",
  "under_review",
  "changes_requested",
  "resubmitted",
] as const;

const RENEWAL_OPEN_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "changes_requested",
] as const;

const CHARTER_OPEN_STATUSES = [
  "draft",
  "submitted",
  "changes_requested",
] as const;

const CLUB_MANAGER_ROLES = [
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
] as const;

const uuidSchema = z.string().uuid();

export function isSchoolRouteParamUuid(value: string): boolean {
  return uuidSchema.safeParse(value).success;
}

export function isSchoolDashboardRole(
  role: string | null | undefined,
): role is (typeof SCHOOL_DASHBOARD_ROLES)[number] {
  return (
    role === "school_admin" ||
    role === "school_advisor" ||
    role === "staff"
  );
}

export type SchoolActionItem = {
  id: string;
  title: string;
  detail: string;
  href: string | null;
};

export type SchoolShortcut = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export type SchoolDashboardClub = {
  id: string;
  name: string;
  slug: string;
  status: ClubStatus;
  category: string;
  href: string | null;
};

export type SchoolDashboardIdea = {
  id: string;
  title: string;
  status: string;
  submittedAt: string | null;
  href: string | null;
};

export type SchoolDashboardCharter = {
  id: string;
  clubName: string;
  clubSlug: string;
  status: string;
  schoolYear: string;
  expiresAt: string | null;
  href: string | null;
};

export type SchoolDashboardRenewal = {
  id: string;
  clubName: string;
  clubSlug: string;
  status: string;
  schoolYear: string;
  href: string | null;
};

export type SchoolDashboardEvent = {
  id: string;
  title: string;
  startsAt: string;
  clubName: string;
  clubSlug: string | null;
  href: string | null;
};

export type SchoolAttendanceClub = {
  clubId: string;
  clubName: string;
  clubSlug: string;
  attendanceRate: number | null;
  meetingsHeld: number;
  uniqueParticipants: number;
};

export type SchoolDashboardModel = {
  school: {
    id: string;
    name: string;
    slug: string;
    level: string;
    city: string;
  };
  actorRole: (typeof SCHOOL_DASHBOARD_ROLES)[number] | "platform_admin";
  clubs: SchoolDashboardClub[];
  ideas: SchoolDashboardIdea[];
  charters: SchoolDashboardCharter[];
  renewals: SchoolDashboardRenewal[];
  upcomingEvents: SchoolDashboardEvent[];
  attendance: {
    clubs: SchoolAttendanceClub[];
    meetingsHeld: number;
    schoolWideRate: number | null;
    visible: boolean;
  };
  learning: {
    subscriptionCount: number | null;
    metricDate: string | null;
    visible: boolean;
  };
  actionItems: SchoolActionItem[];
  shortcuts: SchoolShortcut[];
  charterSummary: {
    open: number;
    approved: number;
    expiringSoon: number;
  };
  renewalSummary: {
    open: number;
  };
};

type SchoolRow = {
  id: string;
  name: string;
  slug: string;
  level: string;
  city: string;
};

type DashboardCapabilities = {
  isPlatformAdmin: boolean;
  hasAdminConsole: boolean;
  canManageSchool: boolean;
  schoolRole: SchoolRole | null;
};

export function buildSchoolActionItems(input: {
  ideasAwaitingReview: Array<{ id: string; title: string; href: string | null }>;
  renewalsDue: Array<{
    id: string;
    clubName: string;
    status: string;
    href: string | null;
  }>;
  chartersExpiring: Array<{
    id: string;
    clubName: string;
    daysLeft: number;
    href: string | null;
  }>;
}): SchoolActionItem[] {
  const items: SchoolActionItem[] = [];

  for (const idea of input.ideasAwaitingReview) {
    items.push({
      id: `idea-${idea.id}`,
      title: `${idea.title} is awaiting review`,
      detail: "Club idea application needs a reviewer decision.",
      href: idea.href,
    });
  }

  for (const renewal of input.renewalsDue) {
    items.push({
      id: `renewal-${renewal.id}`,
      title: `${renewal.clubName} renewal is open`,
      detail: `Status: ${formatLabel(renewal.status)}.`,
      href: renewal.href,
    });
  }

  for (const charter of input.chartersExpiring) {
    items.push({
      id: `charter-${charter.id}`,
      title: `${charter.clubName} charter expires in ${charter.daysLeft} days`,
      detail: "Renewal window is approaching.",
      href: charter.href,
    });
  }

  return items;
}

export function buildSchoolShortcuts(input: {
  schoolId: string;
  hasAdminConsole: boolean;
  isPlatformAdmin: boolean;
  firstManagedClubSlug: string | null;
}): SchoolShortcut[] {
  const shortcuts: SchoolShortcut[] = [
    {
      id: "personal-home",
      label: "Personal dashboard",
      href: "/dashboard",
      description: "Return to your personal operating home.",
    },
    {
      id: "resources",
      label: "STEM catalog",
      href: "/resources",
      description: "Published learning resources available to members.",
    },
  ];

  if (input.firstManagedClubSlug) {
    shortcuts.push({
      id: "managed-club",
      label: "Club command",
      href: `/clubs/${input.firstManagedClubSlug}`,
      description: "Open a club you are authorized to manage.",
    });
  }

  if (input.hasAdminConsole) {
    shortcuts.push(
      {
        id: "admin-ideas",
        label: "Idea review queue",
        href: `/admin/ideas?school=${encodeURIComponent(input.schoolId)}`,
        description: "Committee review for ideas at this school.",
      },
      {
        id: "admin-charters",
        label: "Charter review",
        href: "/admin/charters",
        description: "Submitted charters you are authorized to review.",
      },
      {
        id: "admin-renewals",
        label: "Renewal review",
        href: "/admin/renewals",
        description: "Open renewals awaiting a review decision.",
      },
    );
  }

  if (input.isPlatformAdmin) {
    shortcuts.push(
      {
        id: "admin-insights",
        label: "Platform insights",
        href: `/admin/insights?schoolId=${encodeURIComponent(input.schoolId)}`,
        description: "School-filtered platform analytics.",
      },
      {
        id: "platform-home",
        label: "Platform administration",
        href: "/dashboard/platform",
        description: "Platform operating center and STEM admin.",
      },
    );
  }

  return shortcuts;
}

async function loadDashboardCapabilities(
  userId: string,
  schoolId: string,
): Promise<DashboardCapabilities> {
  const supabase = await createClient();
  const [{ data: platformRows }, { data: membership }] = await Promise.all([
    supabase
      .from("platform_role_assignments")
      .select("role")
      .eq("user_id", userId)
      .is("revoked_at", null),
    supabase
      .from("user_school_memberships")
      .select("role")
      .eq("user_id", userId)
      .eq("school_id", schoolId)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const platformRoles = (platformRows ?? []).map((row) => row.role);
  const isPlatformAdmin = platformRoles.includes("platform_admin");
  const hasAdminConsole =
    isPlatformAdmin || platformRoles.includes("committee_reviewer");
  const schoolRole = membership?.role ?? null;

  return {
    isPlatformAdmin,
    hasAdminConsole,
    canManageSchool: isPlatformAdmin || schoolRole === "school_admin",
    schoolRole,
  };
}

export async function resolveSchoolForDashboard(
  schoolRef: string,
): Promise<SchoolRow | null> {
  const supabase = await createClient();
  const query = supabase
    .from("schools")
    .select("id, name, slug, level, city")
    .limit(1);

  const { data, error } = isSchoolRouteParamUuid(schoolRef)
    ? await query.eq("id", schoolRef).maybeSingle()
    : await query.eq("slug", schoolRef).maybeSingle();

  if (error) throw error;
  return data;
}

export async function loadSchoolDashboard(
  schoolRef: string,
): Promise<SchoolDashboardModel | null> {
  await requireActiveUser();
  const school = await resolveSchoolForDashboard(schoolRef);
  if (!school) return null;

  const user = await requireSchoolDashboardAccess(school.id);
  const capabilities = await loadDashboardCapabilities(user.id, school.id);
  const supabase = await createClient();
  const now = new Date();
  const nowIso = now.toISOString();

  const [
    clubsResult,
    ideasResult,
    chartersResult,
    renewalsResult,
    eventsResult,
    officerClubsResult,
    analyticsResult,
    attendanceResult,
  ] = await Promise.all([
    supabase
      .from("clubs")
      .select("id, name, slug, status, category")
      .eq("school_id", school.id)
      .order("name"),
    supabase
      .from("club_ideas")
      .select("id, title, status, submitted_at")
      .eq("school_id", school.id)
      .in("status", [...IDEA_REVIEW_STATUSES])
      .order("submitted_at", { ascending: true, nullsFirst: false })
      .limit(20),
    supabase
      .from("club_charters")
      .select(
        "id, status, school_year, expires_at, club_id, clubs!inner(id, name, slug, school_id)",
      )
      .eq("clubs.school_id", school.id)
      .order("updated_at", { ascending: false })
      .limit(40),
    supabase
      .from("club_renewals")
      .select(
        "id, status, school_year, club_id, clubs!inner(id, name, slug, school_id)",
      )
      .eq("clubs.school_id", school.id)
      .in("status", [...RENEWAL_OPEN_STATUSES])
      .order("updated_at", { ascending: true })
      .limit(20),
    supabase
      .from("events")
      .select("id, title, starts_at, status, visibility, club_id, clubs(name, slug)")
      .eq("school_id", school.id)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(12),
    supabase
      .from("club_memberships")
      .select("club_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", [...CLUB_MANAGER_ROLES]),
    capabilities.canManageSchool
      ? supabase
          .from("analytics_daily_school")
          .select(
            "resource_subscriptions, attendance_present, attendance_recorded, metric_date",
          )
          .eq("school_id", school.id)
          .order("metric_date", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    getSchoolAttendanceAggregate(school.id).catch(() => []),
  ]);

  if (clubsResult.error) throw clubsResult.error;
  if (ideasResult.error) throw ideasResult.error;
  if (chartersResult.error) throw chartersResult.error;
  if (renewalsResult.error) throw renewalsResult.error;
  if (eventsResult.error) throw eventsResult.error;
  if (officerClubsResult.error) throw officerClubsResult.error;
  if (analyticsResult.error) throw analyticsResult.error;

  const managedClubIds = new Set(
    (officerClubsResult.data ?? []).map((row) => row.club_id),
  );
  const canOpenClub = (clubId: string) =>
    capabilities.canManageSchool || managedClubIds.has(clubId);
  const clubHref = (clubId: string, slug: string) =>
    canOpenClub(clubId) ? `/clubs/${slug}` : null;

  const clubs: SchoolDashboardClub[] = (clubsResult.data ?? []).map((club) => ({
    id: club.id,
    name: club.name,
    slug: club.slug,
    status: club.status,
    category: club.category,
    href: clubHref(club.id, club.slug),
  }));

  const ideas: SchoolDashboardIdea[] = (ideasResult.data ?? []).map((idea) => ({
    id: idea.id,
    title: idea.title,
    status: idea.status,
    submittedAt: idea.submitted_at,
    href: capabilities.hasAdminConsole ? `/admin/ideas/${idea.id}` : null,
  }));

  const charters: SchoolDashboardCharter[] = (chartersResult.data ?? []).map(
    (row) => {
      const club = row.clubs as {
        id: string;
        name: string;
        slug: string;
      };
      return {
        id: row.id,
        clubName: club.name,
        clubSlug: club.slug,
        status: row.status,
        schoolYear: row.school_year,
        expiresAt: row.expires_at,
        href: canOpenClub(club.id) ? `/clubs/${club.slug}/charter` : null,
      };
    },
  );

  const renewals: SchoolDashboardRenewal[] = (renewalsResult.data ?? []).map(
    (row) => {
      const club = row.clubs as {
        id: string;
        name: string;
        slug: string;
      };
      return {
        id: row.id,
        clubName: club.name,
        clubSlug: club.slug,
        status: row.status,
        schoolYear: row.school_year,
        href: canOpenClub(club.id)
          ? `/clubs/${club.slug}/charter/renewal`
          : null,
      };
    },
  );

  const upcomingEvents: SchoolDashboardEvent[] = (eventsResult.data ?? []).map(
    (event) => {
      const club = event.clubs as { name: string; slug: string } | null;
      return {
        id: event.id,
        title: event.title,
        startsAt: event.starts_at,
        clubName: club?.name ?? "Club",
        clubSlug: club?.slug ?? null,
        href:
          club?.slug && canOpenClub(event.club_id)
            ? `/clubs/${club.slug}/events/${event.id}`
            : null,
      };
    },
  );

  const attendanceClubs = attendanceResult as SchoolAttendanceClub[];
  const meetingsHeld = attendanceClubs.reduce(
    (sum, club) => sum + club.meetingsHeld,
    0,
  );
  const analytics = analyticsResult.data;
  const schoolWideRate =
    analytics && analytics.attendance_recorded > 0
      ? Math.round(
          (analytics.attendance_present / analytics.attendance_recorded) * 100,
        )
      : null;

  const learningVisible = capabilities.canManageSchool;
  const learningCount = analytics?.resource_subscriptions ?? null;

  const openCharters = charters.filter((charter) =>
    (CHARTER_OPEN_STATUSES as readonly string[]).includes(charter.status),
  );
  const approvedCharters = charters.filter(
    (charter) => charter.status === "approved",
  );
  const expiringCharters = approvedCharters.filter((charter) => {
    if (!charter.expiresAt) return false;
    const days = daysUntil(charter.expiresAt, now);
    return days != null && days >= 0 && days <= 14;
  });

  const actionItems = buildSchoolActionItems({
    ideasAwaitingReview: ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      href: idea.href,
    })),
    renewalsDue: renewals.map((renewal) => ({
      id: renewal.id,
      clubName: renewal.clubName,
      status: renewal.status,
      href: renewal.href,
    })),
    chartersExpiring: expiringCharters.map((charter) => ({
      id: charter.id,
      clubName: charter.clubName,
      daysLeft: daysUntil(charter.expiresAt, now) ?? 0,
      href: charter.href,
    })),
  });

  const firstManagedClubSlug =
    clubs.find((club) => club.href)?.slug ??
    (capabilities.canManageSchool ? (clubs[0]?.slug ?? null) : null);

  const actorRole: SchoolDashboardModel["actorRole"] = capabilities.isPlatformAdmin
    ? "platform_admin"
    : isSchoolDashboardRole(capabilities.schoolRole)
      ? capabilities.schoolRole
      : "staff";

  return {
    school,
    actorRole,
    clubs,
    ideas,
    charters,
    renewals,
    upcomingEvents,
    attendance: {
      clubs: attendanceClubs,
      meetingsHeld,
      schoolWideRate,
      visible:
        capabilities.canManageSchool ||
        attendanceClubs.length > 0 ||
        schoolWideRate != null,
    },
    learning: {
      subscriptionCount: learningVisible ? learningCount : null,
      metricDate: learningVisible ? (analytics?.metric_date ?? null) : null,
      visible: learningVisible,
    },
    actionItems,
    shortcuts: buildSchoolShortcuts({
      schoolId: school.id,
      hasAdminConsole: capabilities.hasAdminConsole,
      isPlatformAdmin: capabilities.isPlatformAdmin,
      firstManagedClubSlug,
    }),
    charterSummary: {
      open: openCharters.length,
      approved: approvedCharters.length,
      expiringSoon: expiringCharters.length,
    },
    renewalSummary: {
      open: renewals.length,
    },
  };
}

export function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function clubStatusToBadge(
  status: ClubStatus,
): "active" | "pending" | "archived" {
  if (status === "active") return "active";
  if (status === "archived") return "archived";
  return "pending";
}

export function workflowStatusToBadge(
  status: string,
): "active" | "pending" | "approved" | "rejected" | "draft" | "archived" {
  if (status === "approved" || status === "converted_to_club") return "approved";
  if (status === "rejected") return "rejected";
  if (status === "archived") return "archived";
  if (status === "draft") return "draft";
  if (
    status === "submitted" ||
    status === "under_review" ||
    status === "resubmitted" ||
    status === "published"
  ) {
    return "active";
  }
  return "pending";
}
