import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CatalogSectionHeader } from "@/features/learn/components/catalog-section-header";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import {
  catalogCardProgressPercent,
  catalogInventory,
} from "@/features/learn/catalog-inventory";
import { groupedAvailableCatalog } from "@/features/learn/catalog-model";
import type { ApCourseRegistryEntry } from "@/features/learn/courses/registry";
import type { PublishedApCourse } from "@/features/learn/database";

export type CatalogProgressRow = {
  namespace: string;
  attemptCount: number;
};

export function CatalogFamilySections({
  entries,
  family,
  published,
  progress = [],
  coverUrls = {},
}: {
  entries: readonly ApCourseRegistryEntry[];
  family: Parameters<typeof groupedAvailableCatalog>[1];
  published: readonly PublishedApCourse[];
  progress?: readonly CatalogProgressRow[];
  coverUrls?: Readonly<Record<string, string>>;
}) {
  const groups = groupedAvailableCatalog(entries, family);
  const progressByNamespace = new Map(
    progress.map((row) => [row.namespace, row.attemptCount]),
  );

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.family} className="space-y-4">
          <CatalogSectionHeader family={group.family} />
          <div className={CATALOG_GRID_CLASS}>
            {group.entries.map((entry) => {
              const row = published.find(
                (course) => course.course_namespace === entry.namespace,
              );
              const inventory = catalogInventory(entry.namespace);
              return (
                <ApCourseCard
                  key={entry.namespace}
                  title={entry.title}
                  description={entry.description}
                  namespace={entry.namespace}
                  icon={entry.icon}
                  status={row ? "published" : "shipping"}
                  minutes={row?.estimated_minutes}
                  href={`/dashboard/learn/ap/${entry.namespace}`}
                  illustration={<CourseCardArt namespace={entry.namespace} />}
                  coverUrl={coverUrls[entry.namespace]}
                  unitCount={inventory.unitCount}
                  moduleCount={inventory.moduleCount}
                  progressPercent={catalogCardProgressPercent({
                    attemptCount: progressByNamespace.get(entry.namespace) ?? 0,
                    moduleCount: inventory.moduleCount,
                  })}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
