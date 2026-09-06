import { FilterBar } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAdminEvents } from "@/features/admin/queries";
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

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const schoolId =
    typeof params.school === "string" ? params.school : undefined;

  let events;
  try {
    events = await listAdminEvents({ q, schoolId });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/events");
    }
    throw error;
  }

  const supabase = await createClient();
  const { data: schools } = await supabase
    .from("schools")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Events
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cross-tenant view of club events for operational awareness.
        </p>
      </div>

      <form>
        <FilterBar
          leading={
            <>
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search events"
                className="max-w-xs"
                aria-label="Search events"
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
            </>
          }
          trailing={
            <Button type="submit" size="sm">
              Apply
            </Button>
          }
        />
      </form>

      {events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Published and draft events across clubs appear here when available."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Platform events</caption>
            <thead className="border-b bg-surface-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Club</th>
                <th className="px-4 py-3 font-medium">School</th>
                <th className="px-4 py-3 font-medium">Starts</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-surface-muted/40">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3">{event.clubName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {event.schoolName}
                  </td>
                  <td className="px-4 py-3">{formatWhen(event.startsAt)}</td>
                  <td className="px-4 py-3 capitalize">{event.eventType}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        event.status === "published"
                          ? "active"
                          : event.status === "draft"
                            ? "draft"
                            : "pending"
                      }
                    />
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
