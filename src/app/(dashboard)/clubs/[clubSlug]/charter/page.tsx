import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import {
  getCharterSnapshot,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubCharterPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}/charter`);
    }
    throw error;
  }
  if (!context) notFound();

  const snapshot = await getCharterSnapshot(context.club.id);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        <h2 className="font-semibold">School year {snapshot.schoolYear}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Charter drafting and renewal submission workflows will expand here.
          Status below is live from the database.
        </p>
        {snapshot.renewal ? (
          <p className="mt-3 text-sm">
            Renewal status:{" "}
            <span className="capitalize">
              {snapshot.renewal.status.replaceAll("_", " ")}
            </span>
            {snapshot.renewal.advisor_confirmed_at
              ? " · Advisor confirmed"
              : " · Advisor confirmation pending"}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No renewal record for this school year yet.
          </p>
        )}
      </div>

      {snapshot.charters.length === 0 ? (
        <EmptyState
          title="No charter versions"
          description="Create a draft charter for this school year to unlock renewal and compliance tracking."
        />
      ) : (
        <ul className="space-y-3">
          {snapshot.charters.map((charter) => (
            <li
              key={charter.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <div>
                <p className="font-medium">
                  Version {charter.version_number} · {charter.school_year}
                </p>
                <p className="text-sm text-muted-foreground">
                  {charter.expires_at
                    ? `Expires ${new Date(charter.expires_at).toLocaleDateString()}`
                    : "No expiration set"}
                </p>
              </div>
              <StatusBadge
                status={
                  charter.status === "approved"
                    ? "approved"
                    : charter.status === "submitted"
                      ? "pending"
                      : "draft"
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
