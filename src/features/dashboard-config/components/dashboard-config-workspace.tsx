"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { InsightCallout } from "@/components/ds/insight-callout";
import { ErrorState } from "@/components/ds/states";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  reorderModulesAction,
  upsertModuleConfigAction,
} from "@/features/dashboard-config/actions";
import { HomeContentPanel } from "@/features/dashboard-config/components/home-content-panel";
import { ModuleConfigList } from "@/features/dashboard-config/components/module-config-list";
import { SidebarPreview } from "@/features/dashboard-config/components/sidebar-preview";
import { CONFIG_HIERARCHY_COPY } from "@/features/dashboard-config/registry";
import {
  moveModuleInOrder,
  type EditableScope,
  type HydratedModule,
} from "@/features/dashboard-config/resolve";
import type {
  FeaturedOption,
  HomeContentListItem,
  ScopeOption,
} from "@/features/dashboard-config/types";

export function DashboardConfigWorkspace({
  initialScope,
  modules: initialModules,
  persistenceAvailable,
  catalogNotice,
  loadError,
  errorId,
  schools,
  clubs,
  homeContent,
  publishedCourses,
  publishedResources,
  publishedEvents,
}: {
  initialScope: EditableScope;
  modules: HydratedModule[];
  persistenceAvailable: boolean;
  catalogNotice: string | null;
  loadError: string | null;
  errorId: string | null;
  schools: ScopeOption[];
  clubs: ScopeOption[];
  homeContent: HomeContentListItem[];
  publishedCourses: FeaturedOption[];
  publishedResources: FeaturedOption[];
  publishedEvents: FeaturedOption[];
}) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [serverModules, setServerModules] = useState(initialModules);
  if (initialModules !== serverModules) {
    setServerModules(initialModules);
    setModules(initialModules);
  }
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(loadError);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const scopeType = initialScope.scopeType;
  const schoolId = initialScope.schoolId ?? null;
  const clubId = initialScope.clubId ?? null;

  function pushScope(next: EditableScope) {
    const params = new URLSearchParams();
    params.set("scope", next.scopeType);
    if (next.scopeType === "school" && next.schoolId) {
      params.set("school", next.schoolId);
    }
    if (next.scopeType === "club" && next.clubId) {
      params.set("club", next.clubId);
    }
    router.push(`/admin/dashboard-config?${params.toString()}`);
  }

  function onToggle(moduleId: HydratedModule["id"], enabled: boolean) {
    setError(null);
    setStatus(null);
    setPendingId(moduleId);
    startTransition(async () => {
      const result = await upsertModuleConfigAction({
        moduleId,
        scopeType,
        schoolId,
        clubId,
        enabled,
      });
      setPendingId(null);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setModules((current) =>
        current.map((module) =>
          module.id === moduleId ? { ...module, enabled } : module,
        ),
      );
      setStatus(enabled ? `Enabled ${moduleId}.` : `Disabled ${moduleId}.`);
      router.refresh();
    });
  }

  function onMove(moduleId: HydratedModule["id"], direction: "up" | "down") {
    const orderedIds = moveModuleInOrder(
      modules.map((module) => module.id),
      moduleId,
      direction,
    );
    if (orderedIds.join() === modules.map((module) => module.id).join()) {
      return;
    }
    const nextModules = orderedIds
      .map((id, index) => {
        const found = modules.find((module) => module.id === id);
        if (!found) return null;
        return { ...found, resolved_order: index * 10 };
      })
      .filter((module): module is HydratedModule => Boolean(module));
    setModules(nextModules);
    setError(null);
    setStatus(null);
    setPendingId(moduleId);
    startTransition(async () => {
      const result = await reorderModulesAction({
        scopeType,
        schoolId,
        clubId,
        orderedModuleIds: orderedIds,
      });
      setPendingId(null);
      if (!result.ok) {
        setModules(initialModules);
        setError(result.error.message);
        return;
      }
      setStatus(`Moved ${moduleId} ${direction}.`);
      router.refresh();
    });
  }

  const controlsDisabled = !persistenceAvailable || pending;
  const disabledReason = persistenceAvailable
    ? null
    : "Enable, disable, and reorder stay unavailable until dashboard_module_configs can persist the change.";

  return (
    <div className="space-y-6">
      <InsightCallout title="Config hierarchy">{CONFIG_HIERARCHY_COPY}</InsightCallout>

      {catalogNotice ? (
        <InsightCallout title="Catalog status" tone="warning">
          {catalogNotice}
        </InsightCallout>
      ) : null}

      {error ? (
        <ErrorState
          title="Configuration could not be updated"
          description={error}
          errorId={errorId ?? undefined}
          onRetry={() => {
            setError(null);
            router.refresh();
          }}
        />
      ) : null}

      {status ? (
        <p className="text-sm text-success" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}

      <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="config-scope">Scope</Label>
          <Select
            value={scopeType}
            onValueChange={(value) => {
              const nextType = value as EditableScope["scopeType"];
              if (nextType === "global") {
                pushScope({ scopeType: "global" });
                return;
              }
              if (nextType === "school") {
                pushScope({
                  scopeType: "school",
                  schoolId: schoolId ?? schools[0]?.id ?? null,
                });
                return;
              }
              pushScope({
                scopeType: "club",
                clubId: clubId ?? clubs[0]?.id ?? null,
              });
            }}
          >
            <SelectTrigger id="config-scope">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global default</SelectItem>
              <SelectItem value="school">School override</SelectItem>
              <SelectItem value="club">Club override</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {scopeType === "school" ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="config-school">School</Label>
            <Select
              value={schoolId ?? ""}
              onValueChange={(value) =>
                pushScope({ scopeType: "school", schoolId: value })
              }
              disabled={schools.length === 0}
            >
              <SelectTrigger id="config-school">
                <SelectValue placeholder="Choose a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {schools.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No active schools are available to override.
              </p>
            ) : null}
          </div>
        ) : null}
        {scopeType === "club" ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="config-club">Club</Label>
            <Select
              value={clubId ?? ""}
              onValueChange={(value) =>
                pushScope({ scopeType: "club", clubId: value })
              }
              disabled={clubs.length === 0}
            >
              <SelectTrigger id="config-club">
                <SelectValue placeholder="Choose a club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.schoolName
                      ? `${club.name} · ${club.schoolName}`
                      : club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clubs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No active clubs are available to override.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ModuleConfigList
          modules={modules}
          disabled={controlsDisabled}
          disabledReason={disabledReason}
          pendingId={pendingId}
          onToggle={onToggle}
          onMove={onMove}
        />
        <SidebarPreview
          modules={modules}
          emptyLabel="No modules are enabled for this scope after the permission filter."
        />
      </div>

      <HomeContentPanel
        scopeType={scopeType}
        schoolId={schoolId}
        clubId={clubId}
        persistenceAvailable={persistenceAvailable}
        items={homeContent}
        publishedCourses={publishedCourses}
        publishedResources={publishedResources}
        publishedEvents={publishedEvents}
      />
    </div>
  );
}
