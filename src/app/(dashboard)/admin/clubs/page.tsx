import Link from "next/link";

import { FilterBar } from "@/components/ds/filter-bar";
import { StatusBadge } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAdminClubs } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function statusKey(status: string): "active" | "archived" | "pending" | "draft" {
  if (status === "active") return "active";
  if (status === "archived") return "archived";
  if (status === "inactive") return "pending";
  return "draft";
}

export default async function AdminClubsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const schoolId =
    typeof params.school === "string" ? params.school : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const status =
    typeof params.status === "string" ? params.status : undefined;

  let clubs;
  try {
    clubs = await listAdminClubs({ q, schoolId, category, status });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/clubs");
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
          Clubs
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Directory of clubs across schools with membership, renewal, and
          activity signals.
        </p>
      </div>

      <form>
        <FilterBar
          leading={
            <>
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search clubs"
                className="max-w-xs"
                aria-label="Search clubs"
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
              <Input
                name="category"
                defaultValue={category}
                placeholder="Category"
                className="max-w-[10rem]"
                aria-label="Filter by category"
              />
              <select
                name="status"
                defaultValue={status ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
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

      {clubs.length === 0 ? (
        <EmptyState
          title="No clubs match"
          description="Adjust filters or wait for approved ideas to convert into clubs."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Platform clubs directory</caption>
            <thead className="border-b bg-surface-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Club</th>
                <th className="px-4 py-3 font-medium">School</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Members</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
                <th className="px-4 py-3 font-medium">Renewal</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-surface-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clubs/${club.id}`}
                      className="font-medium hover:underline"
                    >
                      {club.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {club.schoolName}
                  </td>
                  <td className="px-4 py-3">{club.category}</td>
                  <td className="px-4 py-3 font-mono">{club.members}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {club.lastActivity ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{club.renewal}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusKey(club.status)} />
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
