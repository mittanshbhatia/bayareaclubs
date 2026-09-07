import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CatalogFamilyChips } from "@/features/learn/components/catalog-family-chips";
import { CatalogFamilySections } from "@/features/learn/components/catalog-family-sections";
import { CatalogPagination } from "@/features/learn/components/catalog-pagination";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import {
  featuredRegistryEntries,
  plannedCatalogEntries,
} from "@/features/learn/catalog-model";
import { AP_COURSE_REGISTRY, filterRegistryByFamily } from "@/features/learn/courses/registry";
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
  const planned = plannedCatalogEntries(AP_COURSE_REGISTRY, paging.family);
  const featured = featuredRegistryEntries().filter((entry) =>
    paging.family === "all"
      ? true
      : filterRegistryByFamily([entry], paging.family).length > 0,
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

      {featured.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-semibold">Featured</h2>
          <div className={CATALOG_GRID_CLASS}>
            {featured.map((entry) => (
              <ApCourseCard
                key={entry.namespace}
                title={entry.title}
                description={entry.description}
                namespace={entry.namespace}
                icon={entry.icon}
                status="shipping"
                href={`/dashboard/learn/ap/${entry.namespace}`}
                illustration={<CourseCardArt namespace={entry.namespace} />}
                actionLabel="Open course"
              />
            ))}
          </div>
        </section>
      ) : null}

      <CatalogFamilySections
        entries={AP_COURSE_REGISTRY}
        family={paging.family}
        published={catalog.courses}
      />

      <CatalogPagination
        page={catalog.page}
        pageCount={catalog.pageCount}
        basePath="/dashboard/learn/ap"
        family={paging.family}
      />

      <section className="space-y-4">
        <h2 className="font-semibold">Planned</h2>
        {planned.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No planned titles in this family.
          </p>
        ) : (
          <div className={CATALOG_GRID_CLASS}>
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
