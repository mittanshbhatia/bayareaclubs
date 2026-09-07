import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ApCourseCard } from "@/features/learn/components/ap-course-card";
import { CatalogFamilyChips } from "@/features/learn/components/catalog-family-chips";
import { CatalogPagination } from "@/features/learn/components/catalog-pagination";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import {
  AP_COURSE_REGISTRY,
  filterRegistryByFamily,
} from "@/features/learn/courses/registry";
import { listPublishedApCatalog } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { catalogPageSchema } from "@/lib/validation/learn";

export const dynamic = "force-dynamic";

export default async function ApCatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/learn/ap");
  }

  const params = await searchParams;
  const paging = catalogPageSchema.parse({
    page: typeof params.page === "string" ? params.page : 1,
    family: typeof params.family === "string" ? params.family : "all",
  });
  const catalog = await listPublishedApCatalog(paging.page, paging.pageSize);
  const published = catalog.courses.filter((course) => {
    if (paging.family === "all") return true;
    return filterRegistryByFamily(AP_COURSE_REGISTRY, paging.family).some(
      (entry) => entry.namespace === course.course_namespace,
    );
  });
  const shipping = filterRegistryByFamily(
    AP_COURSE_REGISTRY.filter((entry) => entry.status === "shipping"),
    paging.family,
  );
  const planned = filterRegistryByFamily(
    AP_COURSE_REGISTRY.filter((entry) => entry.status === "planned"),
    paging.family,
  );

  return (
    <div className="space-y-10" style={{ background: "var(--learning-background)" }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Browse</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            AP courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Original BayAreaClubs lessons first. Planned titles stay visible so clubs
            can see what is coming — they are not published courses.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/learn">Back to Learn</Link>
        </Button>
      </div>

      <CatalogFamilyChips family={paging.family} />

      <section className="space-y-4">
        <h2 className="font-semibold">Published</h2>
        {published.length === 0 ? (
          <EmptyState
            title="No published AP courses in this path yet"
            description="Shipping originals appear here after approval. STEM resources stay available while this family is empty."
            actionLabel="Open STEM resources"
            actionHref="/resources"
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {published.map((course) => {
              const registry = AP_COURSE_REGISTRY.find(
                (entry) => entry.namespace === course.course_namespace,
              );
              return (
                <ApCourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  namespace={course.course_namespace}
                  icon={registry?.icon}
                  status="published"
                  minutes={course.estimated_minutes}
                  href={`/dashboard/learn/ap/${course.course_namespace}`}
                  illustration={<CourseCardArt namespace={course.course_namespace} />}
                />
              );
            })}
          </div>
        )}
        <CatalogPagination
          page={catalog.page}
          pageCount={catalog.pageCount}
          basePath="/dashboard/learn/ap"
          family={paging.family}
        />
      </section>

      {shipping.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-semibold">Shipping originals</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {shipping.map((entry) => (
              <ApCourseCard
                key={entry.namespace}
                title={entry.title}
                description={entry.description}
                namespace={entry.namespace}
                icon={entry.icon}
                status="shipping"
                href={`/dashboard/learn/ap/${entry.namespace}`}
                illustration={<CourseCardArt namespace={entry.namespace} />}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-semibold">Planned</h2>
        {planned.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No planned titles in this family.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {planned.map((entry) => (
              <ApCourseCard
                key={entry.namespace}
                title={entry.title}
                description={entry.description}
                namespace={entry.namespace}
                icon={entry.icon}
                status="planned"
                illustration={<CourseCardArt namespace={entry.namespace} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
