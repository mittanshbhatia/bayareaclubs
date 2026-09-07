import { ApCourseCard, CATALOG_GRID_CLASS } from "@/features/learn/components/ap-course-card";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import { groupedAvailableCatalog } from "@/features/learn/catalog-model";
import type { ApCourseRegistryEntry } from "@/features/learn/courses/registry";
import type { PublishedApCourse } from "@/features/learn/database";

export function CatalogFamilySections({
  entries,
  family,
  published,
}: {
  entries: readonly ApCourseRegistryEntry[];
  family: Parameters<typeof groupedAvailableCatalog>[1];
  published: readonly PublishedApCourse[];
}) {
  const groups = groupedAvailableCatalog(entries, family);

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.family} className="space-y-3">
          <h2 className="font-semibold">{group.label}</h2>
          <div className={CATALOG_GRID_CLASS}>
            {group.entries.map((entry) => {
              const row = published.find(
                (course) => course.course_namespace === entry.namespace,
              );
              return (
                <ApCourseCard
                  key={entry.namespace}
                  title={entry.title}
                  namespace={entry.namespace}
                  icon={entry.icon}
                  status={row ? "published" : "shipping"}
                  minutes={row?.estimated_minutes}
                  href={`/dashboard/learn/ap/${entry.namespace}`}
                  illustration={<CourseCardArt namespace={entry.namespace} />}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
