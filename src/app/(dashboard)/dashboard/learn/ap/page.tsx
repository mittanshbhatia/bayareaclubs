import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CatalogFamilyChips } from "@/features/learn/components/catalog-family-chips";
import { CatalogFamilySections } from "@/features/learn/components/catalog-family-sections";
import { CatalogPagination } from "@/features/learn/components/catalog-pagination";
import { CatalogSectionHeader } from "@/features/learn/components/catalog-section-header";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import { catalogInventory } from "@/features/learn/catalog-inventory";
import { plannedCatalogEntries } from "@/features/learn/catalog-model";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";
import { getMyLearnProgress, listPublishedApCatalog } from "@/features/learn/queries";
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
  const [catalog, progress] = await Promise.all([
    listPublishedApCatalog(paging.page, paging.pageSize),
    getMyLearnProgress(),
  ]);
  const planned = plannedCatalogEntries(AP_COURSE_REGISTRY, paging.family);

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Courses</h1>
      <CatalogFamilyChips family={paging.family} />

      <CatalogFamilySections
        entries={AP_COURSE_REGISTRY}
        family={paging.family}
        published={catalog.courses}
        progress={progress
          .filter((item) => item.namespace)
          .map((item) => ({
            namespace: item.namespace,
            attemptCount: item.attemptCount,
          }))}
      />

      <CatalogPagination
        page={catalog.page}
        pageCount={catalog.pageCount}
        basePath="/dashboard/learn/ap"
        family={paging.family}
      />

      <section className="space-y-4">
        <CatalogSectionHeader title="Planned" category="Not published" />
        {planned.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No planned titles in this family.
          </p>
        ) : (
          <div className={CATALOG_GRID_CLASS}>
            {planned.map((entry) => {
              const inventory = catalogInventory(entry.namespace);
              return (
                <ApCourseCard
                  key={entry.namespace}
                  title={entry.title}
                  description={entry.description}
                  namespace={entry.namespace}
                  icon={entry.icon}
                  status="planned"
                  illustration={<CourseCardArt namespace={entry.namespace} />}
                  unitCount={inventory.unitCount}
                  moduleCount={inventory.moduleCount}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
