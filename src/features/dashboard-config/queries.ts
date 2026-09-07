import "server-only";

import { randomUUID } from "node:crypto";

import {
  dashboardConfigClient,
  isMissingRelation,
} from "@/features/dashboard-config/client";
import {
  DASHBOARD_MODULE_REGISTRY,
} from "@/features/dashboard-config/registry";
import {
  hydrateFromCatalogRows,
  resolveScopedModules,
  type EditableScope,
  type HydratedModule,
  type ModuleConfigOverride,
} from "@/features/dashboard-config/resolve";
import type {
  DashboardConfigPageData,
  HomeContentListItem,
  ScopeOption,
} from "@/features/dashboard-config/types";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import type { DashboardHomeModuleType } from "@/lib/validation/dashboard-home-content";

function asHomeType(value: string): DashboardHomeModuleType {
  return value as DashboardHomeModuleType;
}

export async function loadDashboardConfigWorkspace(
  scope: EditableScope,
): Promise<
  DashboardConfigPageData & {
    modules: HydratedModule[];
  }
> {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const db = dashboardConfigClient(supabase);
  const errorId = randomUUID();

  const [
    catalogResult,
    configResult,
    homeResult,
    schoolsResult,
    clubsResult,
    coursesResult,
    resourcesResult,
    eventsResult,
  ] = await Promise.all([
    db
      .from("dashboard_modules")
      .select("*")
      .eq("status", "active")
      .order("display_order"),
    db.from("dashboard_module_configs").select("*"),
    (() => {
      const contextType =
        scope.scopeType === "school"
          ? "school"
          : scope.scopeType === "club"
            ? "club"
            : "personal";
      let query = db
        .from("dashboard_home_content")
        .select("*")
        .eq("context_type", contextType)
        .order("display_order");
      if (scope.scopeType === "global") {
        query = query.is("school_id", null).is("club_id", null);
      } else if (scope.scopeType === "school" && scope.schoolId) {
        query = query.eq("school_id", scope.schoolId);
      } else if (scope.scopeType === "club" && scope.clubId) {
        query = query.eq("club_id", scope.clubId);
      } else {
        query = query.eq("id", "00000000-0000-4000-8000-000000000000");
      }
      return query;
    })(),
    supabase
      .from("schools")
      .select("id, name")
      .eq("is_active", true)
      .order("name")
      .limit(200),
    supabase
      .from("clubs")
      .select("id, name, school_id, schools(name)")
      .eq("status", "active")
      .order("name")
      .limit(200),
    supabase
      .from("stem_courses")
      .select("id, title")
      .eq("is_published", true)
      .order("title")
      .limit(50),
    supabase
      .from("stem_resources")
      .select("id, title")
      .eq("is_published", true)
      .order("title")
      .limit(50),
    supabase
      .from("events")
      .select("id, title")
      .eq("status", "published")
      .in("visibility", ["public", "school", "club"])
      .order("starts_at", { ascending: false })
      .limit(50),
  ]);

  const persistenceAvailable = !(
    isMissingRelation(catalogResult.error) ||
    isMissingRelation(configResult.error)
  );

  let catalogSource: "catalog" | "registry" = "registry";
  let catalogNotice: string | null = null;
  let loadError: string | null = null;
  let catalog = [...DASHBOARD_MODULE_REGISTRY];

  if (catalogResult.error && !isMissingRelation(catalogResult.error)) {
    loadError = catalogResult.error.message;
    logger.error("loadDashboardConfigWorkspace catalog failed", {
      errorId,
      error: catalogResult.error.message,
    });
  } else if (!persistenceAvailable) {
    catalogNotice =
      "dashboard_modules is not available yet. Labels come from the typed registry. Enable, disable, and persist stay unavailable until Agent 02 catalogs the table.";
  } else if ((catalogResult.data ?? []).length === 0) {
    catalogNotice =
      "The dashboard_modules catalog is empty. The typed registry is shown for labels only until seed rows exist.";
  } else {
    catalogSource = "catalog";
    catalog = hydrateFromCatalogRows(catalogResult.data ?? []);
  }

  const overrides: ModuleConfigOverride[] = persistenceAvailable
    ? (configResult.data ?? []).map((row) => ({
        module_id: row.module_id,
        scope_type: row.scope_type,
        school_id: row.school_id,
        club_id: row.club_id,
        user_id: row.user_id,
        enabled: row.enabled,
        display_order: row.display_order,
      }))
    : [];

  const modules = resolveScopedModules(catalog, overrides, scope);

  const schools: ScopeOption[] = (schoolsResult.data ?? []).map((school) => ({
    id: school.id,
    name: school.name,
  }));

  const clubs: ScopeOption[] = (clubsResult.data ?? []).map((club) => {
    const school = club.schools as { name: string } | { name: string }[] | null;
    const schoolName = Array.isArray(school)
      ? (school[0]?.name ?? null)
      : (school?.name ?? null);
    return {
      id: club.id,
      name: club.name,
      schoolId: club.school_id,
      schoolName,
    };
  });

  const homeContent: HomeContentListItem[] =
    homeResult.error && !isMissingRelation(homeResult.error)
      ? []
      : (homeResult.data ?? []).map((row) => ({
          id: row.id,
          moduleType: asHomeType(row.module_type),
          payload: row.payload,
          body: row.body,
          title: row.title,
          enabled: row.status === "published",
          displayOrder: row.display_order,
        }));

  return {
    persistenceAvailable,
    catalogSource,
    catalogNotice,
    schools,
    clubs,
    publishedCourses: (coursesResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
    })),
    publishedResources: (resourcesResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
    })),
    publishedEvents: (eventsResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
    })),
    homeContent,
    errorId: loadError ? errorId : null,
    loadError,
    modules,
  };
}
