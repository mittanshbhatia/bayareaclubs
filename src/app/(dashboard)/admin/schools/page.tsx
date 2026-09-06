import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { SchoolFormDialog } from "@/features/admin/components/school-form-dialog";
import { listAdminSchools } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  let schools;
  try {
    schools = await listAdminSchools();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/schools");
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Schools
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Institutional directory with administrators, advisors, and club
            counts. Student home locations are never stored.
          </p>
        </div>
        <SchoolFormDialog />
      </div>

      {schools.length === 0 ? (
        <EmptyState
          title="No schools yet"
          description="Add the first Bay Area school to begin onboarding clubs."
        />
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => (
            <li
              key={school.id}
              className="rounded-xl border border-border bg-surface p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">{school.name}</h3>
                    <StatusBadge
                      status={school.is_active ? "active" : "archived"}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {school.level} · {school.city}, {school.state_code}
                    {school.email_domain ? ` · @${school.email_domain}` : ""}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">Clubs: </span>
                    <span className="font-mono">{school.clubCount}</span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-muted-foreground">Timezone: </span>
                    {school.timezone}
                  </p>
                </div>
                <SchoolFormDialog
                  triggerLabel="Settings"
                  initial={{
                    id: school.id,
                    name: school.name,
                    slug: school.slug,
                    level: school.level,
                    city: school.city,
                    stateCode: school.state_code,
                    timezone: school.timezone,
                    websiteUrl: school.website_url ?? "",
                    emailDomain: school.email_domain ?? "",
                    isActive: school.is_active,
                  }}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <StaffList
                  title="Administrators"
                  people={school.administrators}
                />
                <StaffList title="Advisors" people={school.advisors} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StaffList({
  title,
  people,
}: {
  title: string;
  people: {
    user_id: string;
    role: string;
    profiles: { display_name: string } | null;
  }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      {people.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">None assigned.</p>
      ) : (
        <ul className="mt-1 space-y-1 text-sm">
          {people.map((person) => (
            <li key={`${person.user_id}-${person.role}`}>
              {person.profiles?.display_name ?? "Member"}{" "}
              <span className="text-muted-foreground">
                ({person.role.replaceAll("_", " ")})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
