import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import {
  listClubResources,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubResourcesPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/resources`);
    }
    throw error;
  }
  if (!context) notFound();

  const { courses } = await listClubResources(context.club.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Published STEM resources available to clubs. Course progress and club
        subscriptions will expand here.
      </p>
      {courses.length === 0 ? (
        <EmptyState
          title="No published courses"
          description="When STEM courses are published on the platform, they will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course.id}
              className="rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <p className="font-medium">{course.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.provider_name}
                {course.discipline ? ` · ${course.discipline}` : ""}
              </p>
              {course.description ? (
                <p className="mt-2 text-sm">{course.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
