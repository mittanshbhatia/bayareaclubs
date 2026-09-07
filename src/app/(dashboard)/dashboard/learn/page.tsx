import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CatalogFamilyChips } from "@/features/learn/components/catalog-family-chips";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import { LearnProgressBar } from "@/features/learn/components/learn-progress";
import {
  availableCatalogEntries,
  featuredRegistryEntries,
} from "@/features/learn/catalog-model";
import {
  AP_COURSE_REGISTRY,
  filterRegistryByFamily,
} from "@/features/learn/courses/registry";
import { getMyLearnProgress, listPublishedApCatalog } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { withAuthorization } from "@/lib/auth/route-guard";
import { catalogPageSchema } from "@/lib/validation/learn";

export const dynamic = "force-dynamic";

export default async function LearnHubPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await withAuthorization("/dashboard/learn", () => requireActiveUser());

  const params = await searchParams;
  const paging = catalogPageSchema.parse({
    page: 1,
    family: typeof params.family === "string" ? params.family : "all",
  });

  const [catalog, progress] = await Promise.all([
    listPublishedApCatalog(1, 48),
    getMyLearnProgress(),
  ]);

  const featured = featuredRegistryEntries().filter((entry) =>
    paging.family === "all"
      ? true
      : filterRegistryByFamily([entry], paging.family).length > 0,
  );
  const available = availableCatalogEntries(
    AP_COURSE_REGISTRY.filter((entry) =>
      catalog.courses.some((course) => course.course_namespace === entry.namespace) ||
      entry.status === "shipping",
    ),
    paging.family,
  );

  return (
    <div
      className="space-y-10 rounded-xl p-1"
      style={{ background: "var(--learning-background)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Learn</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            AP catalog
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Original BayAreaClubs courses. Student work stays private — there is no
            public ranking.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/learning">STEM dashboard</Link>
        </Button>
      </div>

      <CatalogFamilyChips family={paging.family} basePath="/dashboard/learn" />

      <section className="space-y-3">
        <h2 className="font-semibold">Your progress</h2>
        {progress.length === 0 ? (
          <EmptyState
            title="No AP attempts yet"
            description="Open a featured course or pick a tile below. Checks stay on your account."
            actionLabel="Browse AP courses"
            actionHref="/dashboard/learn/ap"
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {progress.map((item) => (
              <li
                key={item.courseId}
                className="rounded-md border border-(--course-border) bg-learning-surface p-4"
              >
                <h3 className="font-display text-base font-extrabold tracking-tight">
                  {item.title}
                </h3>
                <LearnProgressBar
                  className="mt-3"
                  value={item.correctCount}
                  max={item.attemptCount}
                  label={`${item.correctCount} of ${item.attemptCount} recent checks correct`}
                />
                {item.namespace ? (
                  <Button asChild size="sm" className="mt-3">
                    <Link href={`/dashboard/learn/ap/${item.namespace}`}>Continue</Link>
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Featured</h2>
        <div className={CATALOG_GRID_CLASS}>
          {featured.map((entry) => (
            <ApCourseCard
              key={entry.namespace}
              title={entry.title}
              description={entry.description}
              namespace={entry.namespace}
              icon={entry.icon}
              status={entry.status === "shipping" ? "shipping" : "planned"}
              href={`/dashboard/learn/ap/${entry.namespace}`}
              illustration={<CourseCardArt namespace={entry.namespace} />}
              actionLabel="Open course"
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-semibold">Courses</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/learn/ap">Full catalog</Link>
          </Button>
        </div>
        {available.length === 0 ? (
          <EmptyState
            title="No courses in this family yet"
            description="Choose another family or open the full AP catalog."
            actionLabel="All AP"
            actionHref="/dashboard/learn"
          />
        ) : (
          <div className={CATALOG_GRID_CLASS}>
            {available.map((entry) => {
              const published = catalog.courses.find(
                (course) => course.course_namespace === entry.namespace,
              );
              return (
                <ApCourseCard
                  key={entry.namespace}
                  title={entry.title}
                  namespace={entry.namespace}
                  icon={entry.icon}
                  status={published ? "published" : "shipping"}
                  minutes={published?.estimated_minutes}
                  href={`/dashboard/learn/ap/${entry.namespace}`}
                  illustration={<CourseCardArt namespace={entry.namespace} />}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
