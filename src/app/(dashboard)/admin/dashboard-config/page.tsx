import { InsightCallout } from "@/components/ds/insight-callout";
import { ErrorState } from "@/components/ds/states";
import { DashboardConfigWorkspace } from "@/features/dashboard-config/components/dashboard-config-workspace";
import { loadDashboardConfigWorkspace } from "@/features/dashboard-config/queries";
import { CONFIG_HIERARCHY_COPY } from "@/features/dashboard-config/registry";
import type { EditableScope } from "@/features/dashboard-config/resolve";
import { AuthorizationError } from "@/lib/auth/authorization";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

function firstString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function parseScope(
  params: Record<string, string | string[] | undefined>,
): EditableScope {
  const scope = firstString(params.scope);
  const schoolId = firstString(params.school) ?? null;
  const clubId = firstString(params.club) ?? null;
  if (scope === "school") {
    return { scopeType: "school", schoolId };
  }
  if (scope === "club") {
    return { scopeType: "club", clubId };
  }
  return { scopeType: "global" };
}

export default async function AdminDashboardConfigPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/admin/dashboard-config");
  }

  const params = await searchParams;
  const scope = parseScope(params);

  let payload;
  try {
    payload = await loadDashboardConfigWorkspace(scope);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/dashboard-config");
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Dashboard Configuration
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Enable, disable, and reorder operating-center modules. The TypeScript
          registry supplies labels and icons; <code>dashboard_modules</code>{" "}
          remains the persisted catalog.
        </p>
      </div>

      <InsightCallout title="Permissions stay authoritative">
        {CONFIG_HIERARCHY_COPY}
      </InsightCallout>

      {payload.loadError ? (
        <ErrorState
          title="Could not load the module catalog"
          description={payload.loadError}
          errorId={payload.errorId ?? undefined}
        />
      ) : null}

      <DashboardConfigWorkspace
        initialScope={scope}
        modules={payload.modules}
        persistenceAvailable={payload.persistenceAvailable}
        catalogNotice={payload.catalogNotice}
        loadError={null}
        errorId={payload.errorId}
        schools={payload.schools}
        clubs={payload.clubs}
        homeContent={payload.homeContent}
        publishedCourses={payload.publishedCourses}
        publishedResources={payload.publishedResources}
        publishedEvents={payload.publishedEvents}
      />
    </div>
  );
}
