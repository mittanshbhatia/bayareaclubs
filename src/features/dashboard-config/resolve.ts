import {
  DASHBOARD_MODULE_BY_ID,
  DASHBOARD_MODULE_REGISTRY,
  MANDATORY_MODULE_ID_SET,
  type DashboardConfigScope,
  type DashboardContextType,
  type DashboardModuleId,
  type DashboardModuleMirror,
  type DashboardModulePermission,
} from "@/features/dashboard-config/registry";

export const ROLE_PERMISSIONS: Record<string, readonly DashboardModulePermission[]> =
  {
    platform_admin: [
      "view_insights",
      "club.member",
      "club.officer",
      "club.manage",
      "school.dashboard",
      "platform.admin",
    ],
    committee_reviewer: ["view_insights"],
    school_admin: ["school.dashboard", "view_insights"],
    school_advisor: ["school.dashboard", "view_insights"],
    staff: ["school.dashboard"],
    club_admin: ["club.member", "club.officer", "club.manage", "view_insights"],
    president: ["club.member", "club.officer", "club.manage", "view_insights"],
    vice_president: ["club.member", "club.officer", "view_insights"],
    secretary: ["club.member", "club.officer"],
    treasurer: ["club.member", "club.officer"],
    officer: ["club.member", "club.officer"],
    advisor: ["club.member", "club.officer", "club.manage", "view_insights"],
    member: ["club.member"],
    user: [],
  };

export const SCOPE_ROLES: Record<
  Exclude<DashboardConfigScope, "user">,
  readonly string[]
> = {
  global: ["platform_admin", "user", "school_admin", "member"],
  school: ["school_admin", "school_advisor", "staff"],
  club: [
    "club_admin",
    "president",
    "vice_president",
    "secretary",
    "treasurer",
    "officer",
    "advisor",
    "member",
  ],
};

export type ModuleConfigOverride = {
  module_id: string;
  scope_type: DashboardConfigScope;
  school_id: string | null;
  club_id: string | null;
  user_id?: string | null;
  enabled: boolean;
  display_order: number | null;
};

export type EditableScope = {
  scopeType: Exclude<DashboardConfigScope, "user">;
  schoolId?: string | null;
  clubId?: string | null;
};

export type HydratedModule = DashboardModuleMirror & {
  enabled: boolean;
  resolved_order: number;
  source: "registry" | "catalog";
  disableBlockedReason: string | null;
  enableBlockedReason: string | null;
};

export type DisableGuard =
  | { allowed: true }
  | { allowed: false; reason: string };

export type EnableGuard =
  | { allowed: true }
  | { allowed: false; reason: string };

export function isMandatoryModule(moduleId: string) {
  return MANDATORY_MODULE_ID_SET.has(moduleId);
}

export function disableGuard(moduleId: string): DisableGuard {
  if (isMandatoryModule(moduleId)) {
    return {
      allowed: false,
      reason:
        "This governance module is mandatory and cannot be disabled. Hiding other nav items never changes this requirement.",
    };
  }
  return { allowed: true };
}

export function roleHasPermissions(
  role: string,
  required: readonly string[],
) {
  if (required.length === 0) return true;
  const granted = new Set(ROLE_PERMISSIONS[role] ?? []);
  return required.every((permission) => granted.has(permission as DashboardModulePermission));
}

export function roleMayUseModule(
  role: string,
  module: Pick<DashboardModuleMirror, "required_permissions">,
) {
  return roleHasPermissions(role, module.required_permissions);
}

export function moduleAppliesToScope(
  module: Pick<DashboardModuleMirror, "context_types">,
  scopeType: Exclude<DashboardConfigScope, "user">,
) {
  if (scopeType === "global") return true;
  const context: DashboardContextType = scopeType;
  return module.context_types.includes(context);
}

export function enableGuard(
  module: Pick<
    DashboardModuleMirror,
    "id" | "required_permissions" | "context_types"
  >,
  scope: EditableScope,
  forRole?: string,
): EnableGuard {
  if (forRole && !roleMayUseModule(forRole, module)) {
    return {
      allowed: false,
      reason: `Cannot enable ${module.id} for ${forRole}: that role lacks required_permissions.`,
    };
  }

  if (!moduleAppliesToScope(module, scope.scopeType)) {
    return {
      allowed: false,
      reason: `This module is not available in the ${scope.scopeType} context.`,
    };
  }

  if (scope.scopeType === "global") {
    return { allowed: true };
  }

  const roles = SCOPE_ROLES[scope.scopeType];
  const anyRoleCanAccess = roles.some((role) => roleMayUseModule(role, module));
  if (!anyRoleCanAccess) {
    return {
      allowed: false,
      reason:
        "Cannot enable a module for a scope whose roles lack the required permissions. Permissions are never granted by showing a nav item.",
    };
  }

  return { allowed: true };
}

export function moveModuleInOrder(
  orderedIds: string[],
  moduleId: string,
  direction: "up" | "down",
) {
  const index = orderedIds.indexOf(moduleId);
  if (index < 0) return [...orderedIds];
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= orderedIds.length) {
    return [...orderedIds];
  }
  const next = [...orderedIds];
  const current = next[index];
  const swap = next[nextIndex];
  if (current === undefined || swap === undefined) return [...orderedIds];
  next[index] = swap;
  next[nextIndex] = current;
  return next;
}

export function ordersFromIds(orderedIds: string[]) {
  return orderedIds.map((id, index) => ({
    moduleId: id,
    displayOrder: index * 10,
  }));
}

function overrideMatches(
  row: ModuleConfigOverride,
  scope: EditableScope,
) {
  if (row.scope_type !== scope.scopeType) return false;
  if (scope.scopeType === "global") {
    return row.school_id === null && row.club_id === null;
  }
  if (scope.scopeType === "school") {
    return row.school_id === scope.schoolId && row.club_id === null;
  }
  return row.club_id === scope.clubId;
}

export function pickOverride(
  overrides: ModuleConfigOverride[],
  moduleId: string,
  scope: EditableScope,
) {
  return overrides.find(
    (row) => row.module_id === moduleId && overrideMatches(row, scope),
  );
}

export function resolveScopedModules(
  catalog: readonly DashboardModuleMirror[],
  overrides: ModuleConfigOverride[],
  scope: EditableScope,
  options: { applyPermissionFilter?: boolean; role?: string } = {},
): HydratedModule[] {
  const source: "registry" | "catalog" =
    catalog === DASHBOARD_MODULE_REGISTRY ? "registry" : "catalog";

  const applicable = catalog.filter((module) =>
    moduleAppliesToScope(module, scope.scopeType),
  );

  const globalById = new Map(
    overrides
      .filter((row) => row.scope_type === "global")
      .map((row) => [row.module_id, row]),
  );
  const schoolById = new Map(
    overrides
      .filter(
        (row) =>
          row.scope_type === "school" &&
          scope.schoolId &&
          row.school_id === scope.schoolId,
      )
      .map((row) => [row.module_id, row]),
  );
  const clubById = new Map(
    overrides
      .filter(
        (row) =>
          row.scope_type === "club" &&
          scope.clubId &&
          row.club_id === scope.clubId,
      )
      .map((row) => [row.module_id, row]),
  );

  const resolved = applicable.map((module) => {
    const layers = [globalById.get(module.id)];
    if (scope.scopeType === "school" || scope.scopeType === "club") {
      layers.push(schoolById.get(module.id));
    }
    if (scope.scopeType === "club") {
      layers.push(clubById.get(module.id));
    }

    let enabled = module.default_enabled;
    let displayOrder = module.display_order;
    for (const layer of layers) {
      if (!layer) continue;
      enabled = layer.enabled;
      if (layer.display_order != null) {
        displayOrder = layer.display_order;
      }
    }

    if (isMandatoryModule(module.id)) {
      enabled = true;
    }

    const disable = disableGuard(module.id);
    const enable = enableGuard(module, scope, options.role);
    if (!enable.allowed) {
      enabled = false;
    }

    if (options.applyPermissionFilter && options.role) {
      if (!roleMayUseModule(options.role, module)) {
        enabled = false;
      }
    }

    return {
      ...module,
      enabled,
      resolved_order: displayOrder,
      source,
      disableBlockedReason: disable.allowed ? null : disable.reason,
      enableBlockedReason: enable.allowed ? null : enable.reason,
    };
  });

  return resolved.sort((a, b) => {
    if (a.resolved_order !== b.resolved_order) {
      return a.resolved_order - b.resolved_order;
    }
    return a.label.localeCompare(b.label);
  });
}

export function hydrateFromCatalogRows(
  rows: Array<{
    id: string;
    slug?: string;
    label?: string;
    description?: string;
    icon?: string;
    route?: string;
    context_types?: DashboardContextType[] | null;
    required_permissions?: string[] | null;
    default_enabled?: boolean;
    display_order?: number;
    section?: DashboardModuleMirror["section"];
    mobile_visibility?: DashboardModuleMirror["mobile_visibility"];
    feature_flag?: string | null;
    status?: DashboardModuleMirror["status"];
    mandatory?: boolean;
  }>,
): DashboardModuleMirror[] {
  return rows.map((row) => {
    const mirror =
      DASHBOARD_MODULE_BY_ID[row.id as DashboardModuleId] ??
      DASHBOARD_MODULE_BY_ID[row.slug as DashboardModuleId];
    return {
      id: (mirror?.id ?? row.id) as DashboardModuleId,
      slug: (mirror?.slug ?? row.slug ?? row.id) as DashboardModuleId,
      label: mirror?.label ?? row.label ?? row.id,
      description: mirror?.description ?? row.description ?? "",
      icon: mirror?.icon ?? row.icon ?? "Circle",
      route: mirror?.route ?? row.route ?? "/dashboard",
      context_types: row.context_types ?? mirror?.context_types ?? ["personal"],
      required_permissions: (row.required_permissions ??
        mirror?.required_permissions ??
        []) as DashboardModulePermission[],
      default_enabled: row.default_enabled ?? mirror?.default_enabled ?? true,
      display_order: row.display_order ?? mirror?.display_order ?? 0,
      section: row.section ?? mirror?.section ?? "shared",
      mobile_visibility:
        row.mobile_visibility ?? mirror?.mobile_visibility ?? "always",
      feature_flag: row.feature_flag ?? mirror?.feature_flag ?? null,
      status: row.status ?? mirror?.status ?? "active",
      mandatory: row.mandatory ?? mirror?.mandatory ?? isMandatoryModule(row.id),
    };
  });
}

export function previewEnabledModules(modules: HydratedModule[]) {
  return modules.filter((module) => module.enabled);
}
