import { FilterBar } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAuditLogs } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const actorId =
    typeof params.actor === "string" ? params.actor : undefined;
  const action =
    typeof params.action === "string" ? params.action : undefined;
  const entityType =
    typeof params.entity === "string" ? params.entity : undefined;
  const schoolId =
    typeof params.school === "string" ? params.school : undefined;
  const clubId =
    typeof params.club === "string" ? params.club : undefined;
  const start =
    typeof params.start === "string" ? params.start : undefined;
  const end = typeof params.end === "string" ? params.end : undefined;

  let rows;
  try {
    rows = await listAuditLogs({
      actorId,
      action,
      entityType,
      schoolId,
      clubId,
      start,
      end,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/audit");
    }
    throw error;
  }

  const supabase = await createClient();
  const [{ data: schools }, { data: clubs }] = await Promise.all([
    supabase.from("schools").select("id, name").order("name"),
    supabase.from("clubs").select("id, name").order("name").limit(200),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Audit Log
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Append-oriented administrative activity. Secrets and excessive PII are
          filtered from displayed metadata.
        </p>
      </div>

      <form>
        <FilterBar
          leading={
            <>
              <Input
                name="actor"
                defaultValue={actorId}
                placeholder="Actor user ID"
                className="max-w-[12rem]"
                aria-label="Filter by actor"
              />
              <Input
                name="action"
                defaultValue={action}
                placeholder="Action"
                className="max-w-[10rem]"
                aria-label="Filter by action"
              />
              <Input
                name="entity"
                defaultValue={entityType}
                placeholder="Entity type"
                className="max-w-[10rem]"
                aria-label="Filter by entity"
              />
              <select
                name="school"
                defaultValue={schoolId ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by school"
              >
                <option value="">All schools</option>
                {(schools ?? []).map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <select
                name="club"
                defaultValue={clubId ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by club"
              >
                <option value="">All clubs</option>
                {(clubs ?? []).map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <Input
                name="start"
                type="date"
                defaultValue={start}
                aria-label="Start date"
              />
              <Input
                name="end"
                type="date"
                defaultValue={end}
                aria-label="End date"
              />
            </>
          }
          trailing={
            <Button type="submit" size="sm">
              Apply
            </Button>
          }
        />
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title="No audit events"
          description="Try broadening filters. The log is append-only and cannot be edited here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Administrative audit log</caption>
            <thead className="border-b bg-surface-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="align-top hover:bg-surface-muted/40">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatWhen(row.created_at)}
                  </td>
                  <td className="px-4 py-3">{row.actorName}</td>
                  <td className="px-4 py-3 font-medium">{row.action}</td>
                  <td className="px-4 py-3">
                    <p>{row.entity_type}</p>
                    {row.entity_id ? (
                      <p className="font-mono text-xs text-muted-foreground">
                        {row.entity_id}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {Object.keys(row.safeMetadata).length === 0 ? (
                      "—"
                    ) : (
                      <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(row.safeMetadata, null, 0)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
