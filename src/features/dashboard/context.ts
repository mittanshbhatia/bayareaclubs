import "server-only";

import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  DASHBOARD_PERMISSIONS,
  dashboardContextHintSchema,
  type DashboardContextHint,
  type DashboardContextType,
  type DashboardPermission,
} from "@/lib/validation/dashboard";
import type { Database } from "@/types/database.generated";

type SchoolRole = Database["public"]["Enums"]["school_role"];
type ClubRole = Database["public"]["Enums"]["club_role"];
type PlatformRole = Database["public"]["Enums"]["platform_role"];

const SCHOOL_DASHBOARD_ROLES = new Set<SchoolRole>([
  "school_admin",
  "school_advisor",
  "staff",
]);

const CLUB_OFFICER_ROLES = new Set<ClubRole>([
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type DashboardSchoolMembership = {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
  role: SchoolRole;
};

export type DashboardClubMembership = {
  clubId: string;
  clubSlug: string;
  clubName: string;
  schoolId: string;
  role: ClubRole;
};

export type DashboardActor = {
  userId: string;
  isPlatformAdmin: boolean;
  isCommitteeReviewer: boolean;
  schoolMemberships: DashboardSchoolMembership[];
  clubMemberships: DashboardClubMembership[];
};

export type PersonalDashboardContext = {
  type: "personal";
  label: string;
};

export type ClubDashboardContext = {
  type: "club";
  label: string;
  clubId: string;
  clubSlug: string;
  clubName: string;
  schoolId: string;
  role: ClubRole;
};

export type SchoolDashboardContext = {
  type: "school";
  label: string;
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
  role: SchoolRole | "platform_admin";
};

export type PlatformDashboardContext = {
  type: "platform";
  label: string;
};

export type DashboardActiveContext =
  | PersonalDashboardContext
  | ClubDashboardContext
  | SchoolDashboardContext
  | PlatformDashboardContext;

export type DashboardPermissions = {
  keys: DashboardPermission[];
  canAccessPersonal: true;
  canAccessClub: boolean;
  canManageClub: boolean;
  canAccessSchoolDashboard: boolean;
  canAccessPlatform: boolean;
};

export type DashboardResolvedContext = {
  actor: DashboardActor;
  activeContext: DashboardActiveContext;
  availableContexts: DashboardActiveContext[];
  permissions: DashboardPermissions;
};

export type PersistedDashboardPreference = {
  lastContextType: DashboardContextType;
  lastClubId: string | null;
  lastSchoolId: string | null;
  hiddenModuleIds: string[];
  moduleOrder: string[];
};

export function isSchoolDashboardRole(role: SchoolRole): boolean {
  return SCHOOL_DASHBOARD_ROLES.has(role);
}

export function isClubOfficerRole(role: ClubRole): boolean {
  return CLUB_OFFICER_ROLES.has(role);
}

function uniquePermissions(keys: DashboardPermission[]): DashboardPermission[] {
  return DASHBOARD_PERMISSIONS.filter((key) => keys.includes(key));
}

export function buildAvailableContexts(
  actor: DashboardActor,
  extraSchool?: SchoolDashboardContext | null,
): DashboardActiveContext[] {
  const contexts: DashboardActiveContext[] = [
    { type: "personal", label: "Personal" },
  ];

  for (const club of actor.clubMemberships) {
    contexts.push({
      type: "club",
      label: club.clubName,
      clubId: club.clubId,
      clubSlug: club.clubSlug,
      clubName: club.clubName,
      schoolId: club.schoolId,
      role: club.role,
    });
  }

  const schoolIds = new Set<string>();
  for (const school of actor.schoolMemberships) {
    if (!isSchoolDashboardRole(school.role) && !actor.isPlatformAdmin) {
      continue;
    }
    schoolIds.add(school.schoolId);
    contexts.push({
      type: "school",
      label: school.schoolName,
      schoolId: school.schoolId,
      schoolSlug: school.schoolSlug,
      schoolName: school.schoolName,
      role: actor.isPlatformAdmin ? "platform_admin" : school.role,
    });
  }

  if (
    extraSchool &&
    actor.isPlatformAdmin &&
    !schoolIds.has(extraSchool.schoolId)
  ) {
    contexts.push(extraSchool);
  }

  if (actor.isPlatformAdmin) {
    contexts.push({ type: "platform", label: "Platform" });
  }

  return contexts;
}

function contextKey(context: DashboardActiveContext): string {
  if (context.type === "club") return `club:${context.clubId}`;
  if (context.type === "school") return `school:${context.schoolId}`;
  return context.type;
}

function findAuthorizedContext(
  available: DashboardActiveContext[],
  candidate: {
    type?: DashboardContextType;
    clubSlug?: string;
    clubId?: string;
    schoolId?: string;
    schoolSlug?: string;
  },
): DashboardActiveContext | null {
  if (!candidate.type) return null;

  return (
    available.find((context) => {
      if (context.type !== candidate.type) return false;
      if (context.type === "club") {
        if (candidate.clubId) return context.clubId === candidate.clubId;
        if (candidate.clubSlug) return context.clubSlug === candidate.clubSlug;
        return false;
      }
      if (context.type === "school") {
        if (candidate.schoolId) return context.schoolId === candidate.schoolId;
        if (candidate.schoolSlug) {
          return context.schoolSlug === candidate.schoolSlug;
        }
        return false;
      }
      return true;
    }) ?? null
  );
}

export function selectActiveContext(
  available: DashboardActiveContext[],
  hint?: DashboardContextHint | null,
  preference?: Pick<
    PersistedDashboardPreference,
    "lastContextType" | "lastClubId" | "lastSchoolId"
  > | null,
): DashboardActiveContext {
  const personal =
    available.find((context) => context.type === "personal") ?? {
      type: "personal" as const,
      label: "Personal",
    };

  const fromHint = findAuthorizedContext(available, {
    type: hint?.type,
    clubSlug: hint?.clubSlug,
    schoolSlug:
      hint?.schoolRef && !UUID_RE.test(hint.schoolRef)
        ? hint.schoolRef
        : undefined,
    schoolId:
      hint?.schoolRef && UUID_RE.test(hint.schoolRef)
        ? hint.schoolRef
        : undefined,
  });
  if (fromHint) return fromHint;

  if (hint?.type) {
    return personal;
  }

  const fromPreference = findAuthorizedContext(available, {
    type: preference?.lastContextType,
    clubId: preference?.lastClubId ?? undefined,
    schoolId: preference?.lastSchoolId ?? undefined,
  });
  return fromPreference ?? personal;
}

export function permissionsForContext(
  actor: DashboardActor,
  context: DashboardActiveContext,
): DashboardPermissions {
  const keys: DashboardPermission[] = ["personal"];

  if (actor.isPlatformAdmin) {
    keys.push(
      "platform.admin",
      "school.dashboard",
      "school.admin",
      "club.manage",
      "club.officer",
      "club.member",
    );
  }

  if (context.type === "club") {
    keys.push("club.member");
    if (isClubOfficerRole(context.role)) {
      keys.push("club.officer", "club.manage");
    }
  }

  if (context.type === "school") {
    keys.push("school.dashboard");
    if (context.role === "school_admin" || actor.isPlatformAdmin) {
      keys.push("school.admin");
    }
  }

  if (context.type === "platform" && actor.isPlatformAdmin) {
    keys.push("platform.admin");
  }

  const unique = uniquePermissions(keys);
  return {
    keys: unique,
    canAccessPersonal: true,
    canAccessClub: unique.includes("club.member"),
    canManageClub: unique.includes("club.manage"),
    canAccessSchoolDashboard: unique.includes("school.dashboard"),
    canAccessPlatform: unique.includes("platform.admin"),
  };
}

export function deriveDashboardContext(input: {
  actor: DashboardActor;
  hint?: DashboardContextHint | null;
  preference?: PersistedDashboardPreference | null;
  extraSchool?: SchoolDashboardContext | null;
}): DashboardResolvedContext {
  const availableContexts = buildAvailableContexts(
    input.actor,
    input.extraSchool,
  );
  const activeContext = selectActiveContext(
    availableContexts,
    input.hint,
    input.preference,
  );
  return {
    actor: input.actor,
    activeContext,
    availableContexts,
    permissions: permissionsForContext(input.actor, activeContext),
  };
}

function parseHint(raw?: DashboardContextHint | null): DashboardContextHint | null {
  if (!raw) return null;
  const parsed = dashboardContextHintSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

type ClubJoin = {
  id: string;
  name: string;
  slug: string;
  school_id: string;
  status: string;
};

type SchoolJoin = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
};

export async function resolveDashboardContext(input?: {
  hint?: DashboardContextHint | null;
}): Promise<DashboardResolvedContext> {
  const user = await requireActiveUser();
  const hint = parseHint(input?.hint);
  const supabase = await createClient();

  const [
    platformResult,
    schoolResult,
    clubResult,
    preferenceResult,
    hintedSchoolResult,
  ] = await Promise.all([
    supabase
      .from("platform_role_assignments")
      .select("role")
      .eq("user_id", user.id)
      .is("revoked_at", null),
    supabase
      .from("user_school_memberships")
      .select("school_id, role, schools!inner(id, name, slug, is_active)")
      .eq("user_id", user.id)
      .eq("status", "active"),
    supabase
      .from("club_memberships")
      .select("club_id, role, clubs!inner(id, name, slug, school_id, status)")
      .eq("user_id", user.id)
      .eq("status", "active"),
    supabase
      .from("dashboard_user_preferences")
      .select(
        "last_context_type, last_club_id, last_school_id, hidden_module_ids, module_order",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    hint?.type === "school" && hint.schoolRef
      ? UUID_RE.test(hint.schoolRef)
        ? supabase
            .from("schools")
            .select("id, name, slug, is_active")
            .eq("id", hint.schoolRef)
            .maybeSingle()
        : supabase
            .from("schools")
            .select("id, name, slug, is_active")
            .eq("slug", hint.schoolRef)
            .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (platformResult.error) throw platformResult.error;
  if (schoolResult.error) throw schoolResult.error;
  if (clubResult.error) throw clubResult.error;
  // Preferences are optional UX state. A missing table or RLS miss must not
  // take down the dashboard with an unserializable Postgrest error overlay.

  const platformRoles = (platformResult.data ?? []).map(
    (row) => row.role as PlatformRole,
  );
  const isPlatformAdmin = platformRoles.includes("platform_admin");
  const isCommitteeReviewer = platformRoles.includes("committee_reviewer");

  const schoolMemberships: DashboardSchoolMembership[] = (
    schoolResult.data ?? []
  ).flatMap((row) => {
    const school = row.schools as SchoolJoin | SchoolJoin[] | null;
    const record = Array.isArray(school) ? school[0] : school;
    if (!record?.id || record.is_active === false) return [];
    return [
      {
        schoolId: record.id,
        schoolSlug: record.slug,
        schoolName: record.name,
        role: row.role,
      },
    ];
  });

  const clubMemberships: DashboardClubMembership[] = (
    clubResult.data ?? []
  ).flatMap((row) => {
    const club = row.clubs as ClubJoin | ClubJoin[] | null;
    const record = Array.isArray(club) ? club[0] : club;
    if (!record?.id || record.status !== "active") return [];
    return [
      {
        clubId: record.id,
        clubSlug: record.slug,
        clubName: record.name,
        schoolId: record.school_id,
        role: row.role,
      },
    ];
  });

  const actor: DashboardActor = {
    userId: user.id,
    isPlatformAdmin,
    isCommitteeReviewer,
    schoolMemberships,
    clubMemberships,
  };

  const preferenceRow = preferenceResult.data;
  const preference: PersistedDashboardPreference | null = preferenceRow
    ? {
        lastContextType: preferenceRow.last_context_type,
        lastClubId: preferenceRow.last_club_id,
        lastSchoolId: preferenceRow.last_school_id,
        hiddenModuleIds: preferenceRow.hidden_module_ids ?? [],
        moduleOrder: preferenceRow.module_order ?? [],
      }
    : null;

  const hintedSchool = hintedSchoolResult.data as SchoolJoin | null;
  const extraSchool: SchoolDashboardContext | null =
    isPlatformAdmin && hintedSchool?.id && hintedSchool.is_active
      ? {
          type: "school",
          label: hintedSchool.name,
          schoolId: hintedSchool.id,
          schoolSlug: hintedSchool.slug,
          schoolName: hintedSchool.name,
          role: "platform_admin",
        }
      : null;

  return deriveDashboardContext({
    actor,
    hint,
    preference,
    extraSchool,
  });
}

export function sameDashboardContext(
  left: DashboardActiveContext,
  right: DashboardActiveContext,
): boolean {
  return contextKey(left) === contextKey(right);
}
