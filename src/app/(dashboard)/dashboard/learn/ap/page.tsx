import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ApCourseCard } from "@/features/learn/components/ap-course-card";
import { CatalogPagination } from "@/features/learn/components/catalog-pagination";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";
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
  });
  const catalog = await listPublishedApCatalog(paging.page, paging.pageSize);
  const planned = AP_COURSE_REGISTRY.filter((entry) => entry.status === "planned");
  const shipping = AP_COURSE_REGISTRY.filter((entry) => entry.status === "shipping");

  return (
    <div className="space-y-8" style={{ background: "var(--learning-background)" }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">AP catalog</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            AP courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Published originals first. Planned titles are listed so clubs can see
            what is coming — they are not published courses.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/learn">Back to Learn</Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold">Published</h2>
        {catalog.courses.length === 0 ? (
          <EmptyState
            title="No published AP courses yet"
            description="Shipping skeletons for AP CSP and AP CSA are in the registry. Lessons and questions are authored separately and appear here only after approval and publish."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.courses.map((course) => {
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
                />
              );
            })}
          </div>
        )}
        <CatalogPagination
          page={catalog.page}
          pageCount={catalog.pageCount}
          basePath="/dashboard/learn/ap"
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Shipping skeletons</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {shipping.map((entry) => (
            <ApCourseCard
              key={entry.namespace}
              title={entry.title}
              description={entry.description}
              namespace={entry.namespace}
              icon={entry.icon}
              status="shipping"
              href={`/dashboard/learn/ap/${entry.namespace}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Planned (P1)</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {planned.map((entry) => (
            <ApCourseCard
              key={entry.namespace}
              title={entry.title}
              description={entry.description}
              namespace={entry.namespace}
              icon={entry.icon}
              status="planned"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
