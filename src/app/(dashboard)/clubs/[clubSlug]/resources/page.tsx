import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { ClubResourcesManager } from "@/features/stem/components/club-resources-manager";
import {
  listClubLearningCollections,
  listClubRecommendations,
  listPublishedCourses,
} from "@/features/stem/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { STEM_DISCIPLINE_LABELS } from "@/lib/validation/stem";

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

  const [courses, recommendations, collections] = await Promise.all([
    listPublishedCourses({}),
    listClubRecommendations(context.club.id),
    listClubLearningCollections(context.club.id),
  ]);

  const courseOptions = courses.map((course) => ({
    id: course.id!,
    title: course.title ?? "Course",
    provider_name: course.provider_name,
    discipline: course.discipline,
  }));

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Recommend free STEM resources and build optional learning collections.
        Members are never auto-enrolled.
      </p>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Catalog picks
          </h2>
          <Link href="/resources" className="text-sm underline">
            Open full STEM catalog
          </Link>
        </div>
        {courses.length === 0 ? (
          <EmptyState
            title="No published courses"
            description="When free STEM courses are published on the platform, they appear here for recommendation."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {courses.slice(0, 6).map((course) => (
              <li
                key={course.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <p className="font-medium">{course.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course.provider_name}
                  {course.discipline
                    ? ` · ${
                        STEM_DISCIPLINE_LABELS[
                          course.discipline as keyof typeof STEM_DISCIPLINE_LABELS
                        ] ?? course.discipline
                      }`
                    : ""}
                  {" · Free"}
                </p>
                <Link
                  href={`/resources/${course.slug}`}
                  className="mt-3 inline-block text-sm underline"
                >
                  View resource
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ClubResourcesManager
        clubId={context.club.id}
        clubName={context.club.name}
        courses={courseOptions}
        recommendations={recommendations.map((item) => ({
          id: item.id,
          note: item.note,
          course: item.course
            ? {
                id: item.course.id!,
                title: item.course.title ?? "Course",
                provider_name: item.course.provider_name,
                discipline: item.course.discipline,
              }
            : null,
        }))}
        collections={collections.map((collection) => ({
          id: collection.id,
          title: collection.title,
          description: collection.description,
          items: collection.items.map((item) => ({
            course: item.course
              ? {
                  id: item.course.id!,
                  title: item.course.title ?? "Course",
                  provider_name: item.course.provider_name,
                  discipline: item.course.discipline,
                }
              : null,
          })),
        }))}
      />
    </div>
  );
}
