import "server-only";

import {
  type DashboardActiveContext,
  type DashboardPermissions,
  type PersistedDashboardPreference,
  resolveDashboardContext,
} from "@/features/dashboard/context";
import { createClient } from "@/lib/supabase/server";
import type { DashboardContextHint } from "@/lib/validation/dashboard";
import type { Database, Json } from "@/types/database.generated";

export type DashboardModuleRow =
  Database["public"]["Tables"]["dashboard_modules"]["Row"];
export type DashboardModuleConfigRow =
  Database["public"]["Tables"]["dashboard_module_configs"]["Row"];
export type DashboardHomeContentRow =
  Database["public"]["Tables"]["dashboard_home_content"]["Row"];
export type DashboardUserPreferenceRow =
  Database["public"]["Tables"]["dashboard_user_preferences"]["Row"];

export type ResolvedDashboardModule = DashboardModuleRow & {
  enabled: boolean;
  resolvedOrder: number;
  hiddenByUser: boolean;
};

export type ModuleResolutionInput = {
  context: DashboardActiveContext;
  permissions: DashboardPermissions;
  modules: DashboardModuleRow[];
  configs: DashboardModuleConfigRow[];
  userId?: string;
  preference?: Pick<
    PersistedDashboardPreference,
    "hiddenModuleIds" | "moduleOrder"
  > | null;
};

function configFor(
  configs: DashboardModuleConfigRow[],
  moduleId: string,
  scope: DashboardModuleConfigRow["scope_type"],
  schoolId?: string | null,
  clubId?: string | null,
  userId?: string | null,
) {
  return configs.find((config) => {
    if (config.module_id !== moduleId || config.scope_type !== scope) {
      return false;
    }
    if (scope === "school") return config.school_id === schoolId;
    if (scope === "club") return config.club_id === clubId;
    if (scope === "user") return userId ? config.user_id === userId : true;
    return true;
  });
}

function hasRequiredPermissions(
  required: string[],
  granted: readonly string[],
) {
  return required.every((permission) => granted.includes(permission));
}

/**
 * global default → school → club → permission filter → user preference.
 * Later wins for enable/order. Permission is never granted by nav config.
 * Mandatory modules always remain visible when the actor may access the context.
 */
export function resolveVisibleModules(
  input: ModuleResolutionInput,
): ResolvedDashboardModule[] {
  const schoolId =
    input.context.type === "school"
      ? input.context.schoolId
      : input.context.type === "club"
        ? input.context.schoolId
        : null;
  const clubId = input.context.type === "club" ? input.context.clubId : null;
  const hidden = new Set(input.preference?.hiddenModuleIds ?? []);
  const orderOverride = input.preference?.moduleOrder ?? [];

  const resolved = input.modules
    .filter(
      (module) =>
        module.status === "active" &&
        module.context_types.includes(input.context.type),
    )
    .map((module) => {
      const globalConfig = configFor(input.configs, module.id, "global");
      const schoolConfig = schoolId
        ? configFor(input.configs, module.id, "school", schoolId)
        : undefined;
      const clubConfig = clubId
        ? configFor(input.configs, module.id, "club", schoolId, clubId)
        : undefined;
      const userConfig = configFor(
        input.configs,
        module.id,
        "user",
        null,
        null,
        input.userId,
      );

      let enabled = module.default_enabled;
      let resolvedOrder = module.display_order;

      if (globalConfig) {
        enabled = globalConfig.enabled;
        if (globalConfig.display_order != null) {
          resolvedOrder = globalConfig.display_order;
        }
      }
      if (schoolConfig) {
        enabled = schoolConfig.enabled;
        if (schoolConfig.display_order != null) {
          resolvedOrder = schoolConfig.display_order;
        }
      }
      if (clubConfig) {
        enabled = clubConfig.enabled;
        if (clubConfig.display_order != null) {
          resolvedOrder = clubConfig.display_order;
        }
      }

      const permitted = hasRequiredPermissions(
        module.required_permissions,
        input.permissions.keys,
      );
      if (!permitted) {
        enabled = false;
      }

      let hiddenByUser = false;
      if (!module.mandatory) {
        if (userConfig?.enabled === false) {
          enabled = false;
          hiddenByUser = true;
        }
        if (hidden.has(module.id)) {
          enabled = false;
          hiddenByUser = true;
        }
        if (userConfig?.display_order != null) {
          resolvedOrder = userConfig.display_order;
        }
      } else {
        enabled = permitted;
      }

      const preferenceIndex = orderOverride.indexOf(module.id);
      if (preferenceIndex >= 0 && !module.mandatory) {
        resolvedOrder = preferenceIndex;
      }

      return {
        ...module,
        enabled,
        resolvedOrder,
        hiddenByUser,
      };
    })
    .filter((module) => module.enabled)
    .sort((left, right) => {
      if (left.resolvedOrder !== right.resolvedOrder) {
        return left.resolvedOrder - right.resolvedOrder;
      }
      return left.id.localeCompare(right.id);
    });

  return resolved;
}

function homeContentFilter(context: DashboardActiveContext) {
  return {
    contextType: context.type,
    schoolId: context.type === "school" ? context.schoolId : null,
    clubId: context.type === "club" ? context.clubId : null,
  };
}

export async function listDashboardModules() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dashboard_modules")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DashboardModuleRow[];
}

export async function listDashboardModuleConfigs(context: DashboardActiveContext) {
  const supabase = await createClient();
  let query = supabase.from("dashboard_module_configs").select("*");

  if (context.type === "personal" || context.type === "platform") {
    query = query.in("scope_type", ["global", "user"]);
  } else if (context.type === "school") {
    query = query.in("scope_type", ["global", "school", "user"]);
  } else {
    query = query.in("scope_type", ["global", "school", "club", "user"]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DashboardModuleConfigRow[];
}

export async function getDashboardUserPreference(
  userId: string,
): Promise<PersistedDashboardPreference | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dashboard_user_preferences")
    .select(
      "last_context_type, last_club_id, last_school_id, hidden_module_ids, module_order",
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    lastContextType: data.last_context_type,
    lastClubId: data.last_club_id,
    lastSchoolId: data.last_school_id,
    hiddenModuleIds: data.hidden_module_ids ?? [],
    moduleOrder: data.module_order ?? [],
  };
}

export async function listVisibleDashboardModules(input?: {
  hint?: DashboardContextHint | null;
}) {
  const resolved = await resolveDashboardContext({ hint: input?.hint });
  const [modules, configs, preference] = await Promise.all([
    listDashboardModules(),
    listDashboardModuleConfigs(resolved.activeContext),
    getDashboardUserPreference(resolved.actor.userId),
  ]);

  return {
    ...resolved,
    modules: resolveVisibleModules({
      context: resolved.activeContext,
      permissions: resolved.permissions,
      modules,
      configs,
      userId: resolved.actor.userId,
      preference,
    }),
  };
}

export async function listDashboardHomeContent(
  context: DashboardActiveContext,
): Promise<DashboardHomeContentRow[]> {
  const supabase = await createClient();
  const filter = homeContentFilter(context);
  let query = supabase
    .from("dashboard_home_content")
    .select("*")
    .eq("context_type", filter.contextType)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (filter.schoolId) query = query.eq("school_id", filter.schoolId);
  else query = query.is("school_id", null);

  if (filter.clubId) query = query.eq("club_id", filter.clubId);
  else query = query.is("club_id", null);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DashboardHomeContentRow[];
}

export function dashboardHomePayload(row: DashboardHomeContentRow): Json {
  return row.payload;
}
