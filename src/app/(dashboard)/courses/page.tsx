import { EmptyState } from "@/components/ds/states";
import { CatalogFamilyChips } from "@/features/learn/components/catalog-family-chips";
import { CatalogFamilySections } from "@/features/learn/components/catalog-family-sections";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";
import { getMyLearnProgress, listPublishedApCatalog } from "@/features/learn/queries";
import { COURSES_CATALOG_PATH } from "@/features/learn/routes";
import { requireActiveUser } from "@/lib/auth/authorization";
import { withAuthorization } from "@/lib/auth/route-guard";
import { catalogPageSchema } from "@/lib/validation/learn";

export const dynamic = "force-dynamic";

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await withAuthorization(COURSES_CATALOG_PATH, () => requireActiveUser());

  const params = await searchParams;
  const paging = catalogPageSchema.parse({
    page: 1,
    family: typeof params.family === "string" ? params.family : "all",
  });

  const [catalog, progress] = await Promise.all([
    listPublishedApCatalog(1, 48),
    getMyLearnProgress(),
  ]);

  const shipping = AP_COURSE_REGISTRY.filter(
    (entry) =>
      catalog.courses.some((course) => course.course_namespace === entry.namespace) ||
      entry.status === "shipping",
  );

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Courses</h1>
      <CatalogFamilyChips family={paging.family} basePath={COURSES_CATALOG_PATH} />
      {shipping.length === 0 ? (
        <EmptyState
          title="No published courses yet"
          description="Original AP titles appear here after they ship. STEM resources stay on their own catalog."
          actionLabel="Browse STEM resources"
          actionHref="/resources"
        />
      ) : (
        <div id="catalog-families">
          <CatalogFamilySections
            entries={shipping}
            family={paging.family}
            published={catalog.courses}
            coverUrls={catalog.coverUrls}
            progress={progress
              .filter((item) => item.namespace)
              .map((item) => ({
                namespace: item.namespace,
                attemptCount: item.attemptCount,
              }))}
          />
        </div>
      )}
    </div>
  );
}
