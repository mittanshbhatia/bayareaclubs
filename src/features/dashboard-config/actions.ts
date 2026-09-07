"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import {
  dashboardConfigClient,
  isMissingRelation,
} from "@/features/dashboard-config/client";
import {
  DASHBOARD_MODULE_BY_ID,
  type DashboardModuleId,
} from "@/features/dashboard-config/registry";
import {
  disableGuard,
  enableGuard,
  hydrateFromCatalogRows,
  ordersFromIds,
  resolveScopedModules,
  type EditableScope,
  type ModuleConfigOverride,
} from "@/features/dashboard-config/resolve";
import {
  reorderModulesSchema,
  upsertModuleConfigSchema,
} from "@/features/dashboard-config/schema";
import {
  AuthorizationError,
  requirePlatformAdmin,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  deleteDashboardHomeContentSchema,
  extractHomeContentBody,
  parseDashboardHomePayload,
  upsertDashboardHomeContentSchema,
} from "@/lib/validation/dashboard-home-content";
import type { ActionResult } from "@/types/action-result";
import type { Json } from "@/types/database.generated";

function failure(
  code: string,
  message: string,
  errorId?: string,
): ActionResult<never> {
  return {
    ok: false,
    error: {
      code,
      message: errorId ? `${message} Error ID: ${errorId}` : message,
    },
  };
}

function validationFailure(
  fieldErrors: Record<string, string[] | undefined>,
): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    },
  };
}

function revalidateDashboardConfig() {
  revalidatePath("/admin/dashboard-config");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

function toScope(input: {
  scopeType: "global" | "school" | "club";
  schoolId?: string | null;
  clubId?: string | null;
}): EditableScope {
  return {
    scopeType: input.scopeType,
    schoolId: input.schoolId ?? null,
    clubId: input.clubId ?? null,
  };
}

async function writeAudit(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  schoolId?: string | null;
  clubId?: string | null;
  metadata: Json;
}) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    school_id: input.schoolId ?? null,
    club_id: input.clubId ?? null,
    metadata: input.metadata,
  });
}

async function loadCatalogAndOverrides() {
  const supabase = await createClient();
  const db = dashboardConfigClient(supabase);
  const [catalogResult, configResult] = await Promise.all([
    db.from("dashboard_modules").select("*").eq("status", "active"),
    db.from("dashboard_module_configs").select("*"),
  ]);

  if (
    isMissingRelation(catalogResult.error) ||
    isMissingRelation(configResult.error)
  ) {
    return { available: false as const };
  }
  if (catalogResult.error) {
    return { available: false as const, error: catalogResult.error.message };
  }
  if (configResult.error) {
    return { available: false as const, error: configResult.error.message };
  }

  const catalog =
    (catalogResult.data ?? []).length > 0
      ? hydrateFromCatalogRows(catalogResult.data ?? [])
      : null;

  const overrides: ModuleConfigOverride[] = (configResult.data ?? []).map(
    (row) => ({
      module_id: row.module_id,
      scope_type: row.scope_type,
      school_id: row.school_id,
      club_id: row.club_id,
      user_id: row.user_id,
      enabled: row.enabled,
      display_order: row.display_order,
    }),
  );

  return { available: true as const, catalog, overrides, db };
}

async function findConfigId(
  db: Awaited<ReturnType<typeof dashboardConfigClient>>,
  moduleId: string,
  scope: EditableScope,
) {
  let query = db
    .from("dashboard_module_configs")
    .select("id")
    .eq("module_id", moduleId)
    .eq("scope_type", scope.scopeType)
    .is("user_id", null);
  if (scope.scopeType === "global") {
    query = query.is("school_id", null).is("club_id", null);
  } else if (scope.scopeType === "school") {
    query = query.eq("school_id", scope.schoolId ?? "").is("club_id", null);
  } else {
    query = query.eq("club_id", scope.clubId ?? "");
  }
  const { data, error } = await query.maybeSingle();
  if (error && !isMissingRelation(error)) throw error;
  return data?.id ?? null;
}

export async function upsertModuleConfigAction(
  input: unknown,
): Promise<ActionResult<{ moduleId: string; enabled: boolean }>> {
  const parsed = upsertModuleConfigSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const errorId = randomUUID();
  try {
    const actor = await requirePlatformAdmin();
    const loaded = await loadCatalogAndOverrides();
    if (!loaded.available) {
      return failure(
        "CATALOG_UNAVAILABLE",
        loaded.error ??
          "dashboard_module_configs is not available yet. Configuration cannot be saved.",
        errorId,
      );
    }

    const catalogEntry =
      loaded.catalog?.find((row) => row.id === parsed.data.moduleId) ??
      DASHBOARD_MODULE_BY_ID[parsed.data.moduleId];
    const scope = toScope(parsed.data);

    if (!parsed.data.enabled) {
      const guard = disableGuard(catalogEntry.id);
      if (!guard.allowed) {
        return failure("MANDATORY_MODULE", guard.reason);
      }
    } else {
      const guard = enableGuard(catalogEntry, scope, parsed.data.forRole);
      if (!guard.allowed) {
        return failure("PERMISSION_FILTER", guard.reason);
      }
    }

    const existingId = await findConfigId(loaded.db, catalogEntry.id, scope);
    const resolved = resolveScopedModules(
      loaded.catalog ?? [catalogEntry],
      loaded.overrides,
      scope,
    ).find((row) => row.id === catalogEntry.id);

    const payload = {
      module_id: catalogEntry.id,
      scope_type: scope.scopeType,
      school_id: scope.scopeType === "school" ? scope.schoolId ?? null : null,
      club_id: scope.scopeType === "club" ? scope.clubId ?? null : null,
      user_id: null,
      enabled: parsed.data.enabled,
      display_order: resolved?.resolved_order ?? catalogEntry.display_order,
    };

    const { error } = existingId
      ? await loaded.db
          .from("dashboard_module_configs")
          .update({
            enabled: payload.enabled,
            display_order: payload.display_order,
          })
          .eq("id", existingId)
      : await loaded.db.from("dashboard_module_configs").insert(payload);

    if (error) {
      if (isMissingRelation(error)) {
        return failure(
          "CATALOG_UNAVAILABLE",
          "dashboard_module_configs is not available yet.",
          errorId,
        );
      }
      throw error;
    }

    await writeAudit({
      actorId: actor.id,
      action: parsed.data.enabled
        ? "dashboard_module.enabled"
        : "dashboard_module.disabled",
      entityType: "dashboard_module_configs",
      entityId: existingId ?? catalogEntry.id,
      schoolId: payload.school_id,
      clubId: payload.club_id,
      metadata: {
        moduleId: catalogEntry.id,
        scopeType: scope.scopeType,
        enabled: parsed.data.enabled,
      },
    });

    revalidateDashboardConfig();
    return { ok: true, data: { moduleId: catalogEntry.id, enabled: parsed.data.enabled } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("upsertModuleConfigAction failed", {
      errorId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "MODULE_CONFIG_FAILED",
      "Could not save the module configuration.",
      errorId,
    );
  }
}

export async function reorderModulesAction(
  input: unknown,
): Promise<ActionResult<{ orderedModuleIds: string[] }>> {
  const parsed = reorderModulesSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const errorId = randomUUID();
  try {
    const actor = await requirePlatformAdmin();
    const loaded = await loadCatalogAndOverrides();
    if (!loaded.available) {
      return failure(
        "CATALOG_UNAVAILABLE",
        loaded.error ??
          "dashboard_module_configs is not available yet. Order cannot be saved.",
        errorId,
      );
    }

    const scope = toScope(parsed.data);
    const catalog = loaded.catalog ?? [];
    const allowedIds = new Set(
      resolveScopedModules(catalog.length ? catalog : [], loaded.overrides, scope)
        .filter((module) => enableGuard(module, scope).allowed || module.enabled)
        .map((module) => module.id),
    );

    const ordered = parsed.data.orderedModuleIds.filter((id) => {
      const registryEntry = DASHBOARD_MODULE_BY_ID[id];
      return registryEntry && (allowedIds.size === 0 || allowedIds.has(id));
    });

    const writes = ordersFromIds(ordered);
    for (const item of writes) {
      const existingId = await findConfigId(loaded.db, item.moduleId, scope);
      const current = loaded.overrides.find(
        (row) =>
          row.module_id === item.moduleId && row.scope_type === scope.scopeType,
      );
      const registryEntry = DASHBOARD_MODULE_BY_ID[item.moduleId as DashboardModuleId];
      const enabled = current?.enabled ?? registryEntry.default_enabled;
      const payload = {
        module_id: item.moduleId,
        scope_type: scope.scopeType,
        school_id: scope.scopeType === "school" ? scope.schoolId ?? null : null,
        club_id: scope.scopeType === "club" ? scope.clubId ?? null : null,
        user_id: null,
        enabled: disableGuard(item.moduleId).allowed ? enabled : true,
        display_order: item.displayOrder,
      };
      const { error } = existingId
        ? await loaded.db
            .from("dashboard_module_configs")
            .update({ display_order: payload.display_order, enabled: payload.enabled })
            .eq("id", existingId)
        : await loaded.db.from("dashboard_module_configs").insert(payload);
      if (error) {
        if (isMissingRelation(error)) {
          return failure(
            "CATALOG_UNAVAILABLE",
            "dashboard_module_configs is not available yet.",
            errorId,
          );
        }
        throw error;
      }
    }

    await writeAudit({
      actorId: actor.id,
      action: "dashboard_module.reordered",
      entityType: "dashboard_module_configs",
      entityId: ordered[0] ?? "dashboard_modules",
      schoolId: scope.schoolId ?? null,
      clubId: scope.clubId ?? null,
      metadata: {
        scopeType: scope.scopeType,
        orderedModuleIds: ordered,
      },
    });

    revalidateDashboardConfig();
    return { ok: true, data: { orderedModuleIds: ordered } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("reorderModulesAction failed", {
      errorId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("MODULE_REORDER_FAILED", "Could not save the module order.", errorId);
  }
}

export async function upsertHomeContentAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = upsertDashboardHomeContentSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const payloadParsed = parseDashboardHomePayload(
    parsed.data.moduleType,
    parsed.data.payload,
  );
  if (!payloadParsed.success) {
    return validationFailure(payloadParsed.error.flatten().fieldErrors);
  }

  const errorId = randomUUID();
  try {
    const actor = await requirePlatformAdmin();
    const supabase = await createClient();
    const db = dashboardConfigClient(supabase);

    if (
      parsed.data.moduleType === "featured_courses" &&
      "courseIds" in payloadParsed.data
    ) {
      const ids = payloadParsed.data.courseIds;
      const { data, error } = await supabase
        .from("stem_courses")
        .select("id")
        .in("id", ids)
        .eq("is_published", true);
      if (error) throw error;
      if ((data ?? []).length !== ids.length) {
        return failure(
          "UNPUBLISHED_COURSE",
          "Only published courses can be featured.",
        );
      }
    }

    if (
      parsed.data.moduleType === "featured_resources" &&
      "courseIds" in payloadParsed.data
    ) {
      const ids = payloadParsed.data.courseIds;
      const { data, error } = await supabase
        .from("stem_resources")
        .select("id")
        .in("id", ids)
        .eq("is_published", true);
      if (error) throw error;
      if ((data ?? []).length !== ids.length) {
        return failure(
          "UNPUBLISHED_RESOURCE",
          "Only published resources can be featured.",
        );
      }
    }

    if (
      parsed.data.moduleType === "featured_events" &&
      "eventIds" in payloadParsed.data
    ) {
      const ids = payloadParsed.data.eventIds;
      const { data, error } = await supabase
        .from("events")
        .select("id, visibility")
        .in("id", ids)
        .eq("status", "published")
        .in("visibility", ["public", "school", "club"]);
      if (error) throw error;
      if ((data ?? []).length !== ids.length) {
        return failure(
          "EVENT_NOT_VISIBLE",
          "Only published, visibility-checked events can be featured. Private events are excluded.",
        );
      }
    }

    const body = extractHomeContentBody(
      parsed.data.moduleType,
      payloadParsed.data,
    );
    const title =
      "title" in payloadParsed.data
        ? payloadParsed.data.title
        : null;
    const contextType: "personal" | "club" | "school" | "platform" =
      parsed.data.scopeType === "school"
        ? "school"
        : parsed.data.scopeType === "club"
          ? "club"
          : "personal";
    const row = {
      module_type: parsed.data.moduleType,
      context_type: contextType,
      payload: payloadParsed.data as Json,
      title,
      body,
      school_id:
        parsed.data.scopeType === "school" ? parsed.data.schoolId ?? null : null,
      club_id: parsed.data.scopeType === "club" ? parsed.data.clubId ?? null : null,
      display_order: parsed.data.displayOrder,
      status: parsed.data.enabled ? "published" : "draft",
      published_at: parsed.data.enabled ? new Date().toISOString() : null,
      updated_by: actor.id,
    };

    const write = parsed.data.id
      ? await db
          .from("dashboard_home_content")
          .update(row)
          .eq("id", parsed.data.id)
          .select("id")
          .single()
      : await db
          .from("dashboard_home_content")
          .insert({ ...row, created_by: actor.id })
          .select("id")
          .single();

    if (write.error || !write.data) {
      if (isMissingRelation(write.error)) {
        return failure(
          "HOME_CONTENT_UNAVAILABLE",
          "dashboard_home_content is not available yet.",
          errorId,
        );
      }
      throw write.error ?? new Error("Missing home content row.");
    }

    await writeAudit({
      actorId: actor.id,
      action: parsed.data.id
        ? "dashboard_home_content.updated"
        : "dashboard_home_content.created",
      entityType: "dashboard_home_content",
      entityId: write.data.id,
      schoolId: row.school_id,
      clubId: row.club_id,
      metadata: {
        moduleType: parsed.data.moduleType,
        contextType,
      },
    });

    revalidateDashboardConfig();
    return { ok: true, data: { id: write.data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("upsertHomeContentAction failed", {
      errorId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("HOME_CONTENT_FAILED", "Could not save home content.", errorId);
  }
}

export async function deleteHomeContentAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = deleteDashboardHomeContentSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const errorId = randomUUID();
  try {
    const actor = await requirePlatformAdmin();
    const supabase = await createClient();
    const db = dashboardConfigClient(supabase);

    const existing = await db
      .from("dashboard_home_content")
      .select("*")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (isMissingRelation(existing.error)) {
      return failure(
        "HOME_CONTENT_UNAVAILABLE",
        "dashboard_home_content is not available yet.",
        errorId,
      );
    }
    if (existing.error) throw existing.error;
    if (!existing.data) {
      return failure("NOT_FOUND", "That home content module was not found.");
    }

    const removed = await db
      .from("dashboard_home_content")
      .delete()
      .eq("id", parsed.data.id);
    if (removed.error) throw removed.error;

    await writeAudit({
      actorId: actor.id,
      action: "dashboard_home_content.deleted",
      entityType: "dashboard_home_content",
      entityId: parsed.data.id,
      schoolId: existing.data.school_id,
      clubId: existing.data.club_id,
      metadata: { moduleType: existing.data.module_type },
    });

    revalidateDashboardConfig();
    return { ok: true, data: { id: parsed.data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("deleteHomeContentAction failed", {
      errorId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "HOME_CONTENT_DELETE_FAILED",
      "Could not delete home content.",
      errorId,
    );
  }
}
