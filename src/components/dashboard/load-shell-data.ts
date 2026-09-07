import "server-only";

import {
  DASHBOARD_MODULE_BY_ID,
  DASHBOARD_MODULE_REGISTRY,
  type DashboardModuleId,
} from "@/features/dashboard-config/registry";
import {
  type DashboardActiveContext,
  type DashboardResolvedContext,
  resolveDashboardContext,
} from "@/features/dashboard/context";
import {
  listVisibleDashboardModules,
  type ResolvedDashboardModule as CatalogResolvedModule,
} from "@/features/dashboard/queries";
import type { DashboardContextHint as AgentContextHint } from "@/lib/validation/dashboard";
import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import {
  hintFromPathname,
  hrefForContext,
  isFeatureEnabled,
  resolveVisibleCatalogModules,
  SCHOOL_DASHBOARD_ROLES,
  selectActiveContext,
  withResolvedHrefs,
} from "@/components/dashboard/nav-modules";
import type {
  DashboardContextOption,
  DashboardPermissions,
  DashboardShellData,
  ResolvedDashboardModule,
} from "@/components/dashboard/types";

type NamedRecord = { id: string; name: string; slug: string };

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function agentHintFromPathname(pathname: string): AgentContextHint {
  const hint = hintFromPathname(pathname);
  if (hint.context === "club" && hint.club) {
    return { type: "club", clubSlug: hint.club };
  }
  if (hint.context === "school" && hint.school) {
    return { type: "school", schoolRef: hint.school };
  }
  if (hint.context === "platform") {
    return { type: "platform" };
  }
  return { type: "personal" };
}

function serializeContext(
  context: DashboardActiveContext,
): DashboardContextOption {
  if (context.type === "club") {
    const option: DashboardContextOption = {
      type: "club",
      id: `club:${context.clubSlug}`,
      label: context.label,
      href: "",
      clubId: context.clubId,
      clubSlug: context.clubSlug,
    };
    return { ...option, href: hrefForContext(option) };
  }
  if (context.type === "school") {
    const option: DashboardContextOption = {
      type: "school",
      id: `school:${context.schoolId}`,
      label: context.label,
      href: "",
      schoolId: context.schoolId,
      schoolSlug: context.schoolSlug,
    };
    return { ...option, href: hrefForContext(option) };
  }
  if (context.type === "platform") {
    return {
      type: "platform",
      id: "platform",
      label: context.label,
      href: "/dashboard/platform",
    };
  }
  return {
    type: "personal",
    id: "personal",
    label: context.label,
    href: "/dashboard",
  };
}

function serializePermissions(
  resolved: DashboardResolvedContext,
): DashboardPermissions {
  return {
    isPlatformAdmin: resolved.actor.isPlatformAdmin,
    canAccessAdminConsole:
      resolved.actor.isPlatformAdmin || resolved.actor.isCommitteeReviewer,
    canAccessSchoolDashboard: resolved.permissions.canAccessSchoolDashboard,
  };
}

function serializeCatalogModule(
  module: CatalogResolvedModule,
): ResolvedDashboardModule {
  const mirror = DASHBOARD_MODULE_BY_ID[module.id as DashboardModuleId];
  return {
    id: module.id,
    slug: module.slug,
    label: module.label,
    description: module.description,
    icon: module.icon,
    route: mirror?.route ?? module.route,
    contextTypes: module.context_types,
    requiredPermissions: module.required_permissions,
    defaultEnabled: module.default_enabled,
    displayOrder: module.resolvedOrder,
    section: module.section,
    mobileVisibility: module.mobile_visibility,
    featureFlag: module.feature_flag,
    status: module.status,
    mandatory: module.mandatory,
  };
}

function modulesFromRegistry(
  resolved: DashboardResolvedContext,
): ResolvedDashboardModule[] {
  const keys = new Set(resolved.permissions.keys);
  return DASHBOARD_MODULE_REGISTRY.filter((module) => {
    if (module.status !== "active") return false;
    if (!module.context_types.includes(resolved.activeContext.type)) {
      return false;
    }
    if (!isFeatureEnabled(module.feature_flag, [])) return false;
    return module.required_permissions.every((permission) => {
      if (permission === "view_insights") return true;
      return keys.has(permission);
    });
  }).map((module) => ({
    id: module.id,
    slug: module.slug,
    label: module.label,
    description: module.description,
    icon: module.icon,
    route: module.route,
    contextTypes: [...module.context_types],
    requiredPermissions: [...module.required_permissions],
    defaultEnabled: module.default_enabled,
    displayOrder: module.display_order,
    section: module.section,
    mobileVisibility: module.mobile_visibility,
    featureFlag: module.feature_flag,
    status: module.status,
    mandatory: module.mandatory,
  }));
}

function toShellData(
  resolved: DashboardResolvedContext,
  modules: ResolvedDashboardModule[],
  displayName: string | null = null,
): DashboardShellData {
  const availableContexts = resolved.availableContexts.map(serializeContext);
  const activeContext = serializeContext(resolved.activeContext);
  return {
    actor: {
      id: resolved.actor.userId,
      displayName,
    },
    activeContext,
    availableContexts,
    modules: withResolvedHrefs(
      modules.filter((module) => isFeatureEnabled(module.featureFlag, [])),
      activeContext,
    ),
    permissions: serializePermissions(resolved),
    enabledFlags: [],
  };
}

async function loadActorDisplayName(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  return data?.display_name ?? null;
}

async function loadFromAgent02(pathname: string): Promise<DashboardShellData> {
  const hint = agentHintFromPathname(pathname);
  try {
    const listed = await listVisibleDashboardModules({ hint });
    const displayName = await loadActorDisplayName(listed.actor.userId);
    return toShellData(
      listed,
      listed.modules.map(serializeCatalogModule),
      displayName,
    );
  } catch {
    const resolved = await resolveDashboardContext({ hint });
    const displayName = await loadActorDisplayName(resolved.actor.userId);
    return toShellData(resolved, modulesFromRegistry(resolved), displayName);
  }
}

async function loadFromMemberships(
  pathname: string,
): Promise<DashboardShellData> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const hint = hintFromPathname(pathname);

  const [profileResult, platformResult, schoolResult, clubResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("platform_role_assignments")
        .select("role")
        .eq("user_id", user.id)
        .is("revoked_at", null),
      supabase
        .from("user_school_memberships")
        .select("role, school_id, schools(id, name, slug)")
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("club_memberships")
        .select("role, clubs(id, name, slug)")
        .eq("user_id", user.id)
        .eq("status", "active"),
    ]);

  const platformRoles = new Set(
    (platformResult.data ?? []).map((row) => row.role),
  );
  const isPlatformAdmin = platformRoles.has("platform_admin");
  const canAccessAdminConsole =
    isPlatformAdmin || platformRoles.has("committee_reviewer");

  const schoolContexts: DashboardContextOption[] = [];
  for (const membership of schoolResult.data ?? []) {
    if (
      !isPlatformAdmin &&
      !SCHOOL_DASHBOARD_ROLES.includes(
        membership.role as (typeof SCHOOL_DASHBOARD_ROLES)[number],
      )
    ) {
      continue;
    }
    const school = asOne(
      membership.schools as NamedRecord | NamedRecord[] | null,
    );
    if (!school) continue;
    const option: DashboardContextOption = {
      type: "school",
      id: `school:${school.id}`,
      label: school.name,
      href: "",
      schoolId: school.id,
      schoolSlug: school.slug,
    };
    schoolContexts.push({ ...option, href: hrefForContext(option) });
  }

  const clubContexts: DashboardContextOption[] = [];
  for (const membership of clubResult.data ?? []) {
    const club = asOne(membership.clubs as NamedRecord | NamedRecord[] | null);
    if (!club?.slug) continue;
    const option: DashboardContextOption = {
      type: "club",
      id: `club:${club.slug}`,
      label: club.name,
      href: "",
      clubId: club.id,
      clubSlug: club.slug,
    };
    clubContexts.push({ ...option, href: hrefForContext(option) });
  }

  const permissions: DashboardPermissions = {
    isPlatformAdmin,
    canAccessAdminConsole,
    canAccessSchoolDashboard: isPlatformAdmin || schoolContexts.length > 0,
  };

  const availableContexts: DashboardContextOption[] = [
    {
      type: "personal",
      id: "personal",
      label: "Personal",
      href: "/dashboard",
    },
    ...clubContexts,
    ...schoolContexts,
  ];

  if (isPlatformAdmin) {
    availableContexts.push({
      type: "platform",
      id: "platform",
      label: "Platform",
      href: "/dashboard/platform",
    });
  }

  const activeContext = selectActiveContext(availableContexts, hint);
  const modules = withResolvedHrefs(
    resolveVisibleCatalogModules({
      contextType: activeContext.type,
      permissions,
    }),
    activeContext,
  );

  return {
    actor: {
      id: user.id,
      displayName: profileResult.data?.display_name ?? null,
    },
    activeContext,
    availableContexts,
    modules,
    permissions,
    enabledFlags: [],
  };
}

export async function loadDashboardShellData(input: {
  pathname: string;
}): Promise<DashboardShellData> {
  try {
    return await loadFromAgent02(input.pathname);
  } catch {
    return loadFromMemberships(input.pathname);
  }
}
