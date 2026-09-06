import {
  CourseCard,
  FilterBar,
  PageContainer,
  SectionHeader,
} from "@/components/ds";
import { EmptyState } from "@/components/ds/states";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listPublishedCourses } from "@/features/stem/queries";
import {
  COURSE_DIFFICULTIES,
  COURSE_DIFFICULTY_LABELS,
  COURSE_FORMAT_LABELS,
  COURSE_FORMATS,
  EFFORT_BUCKET_LABELS,
  EFFORT_BUCKETS,
  GRADE_BAND_LABELS,
  GRADE_BANDS,
  STEM_DISCIPLINE_LABELS,
  STEM_DISCIPLINES,
  catalogFilterSchema,
  formatEffortMinutes,
} from "@/lib/validation/stem";

export const dynamic = "force-dynamic";

const selectClassName =
  "h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm sm:w-auto sm:min-w-[10rem]";

export default async function ResourcesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = {
    q: typeof params.q === "string" ? params.q : undefined,
    discipline:
      typeof params.discipline === "string" ? params.discipline : undefined,
    difficulty:
      typeof params.difficulty === "string" ? params.difficulty : undefined,
    format: typeof params.format === "string" ? params.format : undefined,
    gradeBand:
      typeof params.gradeBand === "string" ? params.gradeBand : undefined,
    effort: typeof params.effort === "string" ? params.effort : undefined,
  };
  const filters = catalogFilterSchema.parse(raw);
  const courses = await listPublishedCourses(filters);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen border-b border-border bg-surface-muted/30">
        <PageContainer className="py-12 sm:py-16">
          <SectionHeader
            title="STEM Resources"
            description="Excellent free STEM learning resources for club members. BayAreaClubs stores metadata and links — we do not host copyrighted third-party course content."
          />

          <form className="mt-8">
            <FilterBar
              leading={
                <Input
                  name="q"
                  defaultValue={filters.q ?? ""}
                  placeholder="Search title, provider, or topic"
                  className="min-h-11 w-full min-w-0 flex-1"
                  aria-label="Search resources"
                />
              }
              trailing={
                <Button type="submit" className="w-full sm:w-auto">
                  Apply filters
                </Button>
              }
            >
              <select
                name="discipline"
                defaultValue={filters.discipline ?? ""}
                className={selectClassName}
                aria-label="Subject"
              >
                <option value="">All subjects</option>
                {STEM_DISCIPLINES.filter((item) => item !== "other").map(
                  (item) => (
                    <option key={item} value={item}>
                      {STEM_DISCIPLINE_LABELS[item]}
                    </option>
                  ),
                )}
              </select>
              <select
                name="gradeBand"
                defaultValue={filters.gradeBand ?? ""}
                className={selectClassName}
                aria-label="Grade band"
              >
                <option value="">All grade bands</option>
                {GRADE_BANDS.map((item) => (
                  <option key={item} value={item}>
                    {GRADE_BAND_LABELS[item]}
                  </option>
                ))}
              </select>
              <select
                name="difficulty"
                defaultValue={filters.difficulty ?? ""}
                className={selectClassName}
                aria-label="Difficulty"
              >
                <option value="">All difficulties</option>
                {COURSE_DIFFICULTIES.map((item) => (
                  <option key={item} value={item}>
                    {COURSE_DIFFICULTY_LABELS[item]}
                  </option>
                ))}
              </select>
              <select
                name="format"
                defaultValue={filters.format ?? ""}
                className={selectClassName}
                aria-label="Format"
              >
                <option value="">All formats</option>
                {COURSE_FORMATS.map((item) => (
                  <option key={item} value={item}>
                    {COURSE_FORMAT_LABELS[item]}
                  </option>
                ))}
              </select>
              <select
                name="effort"
                defaultValue={filters.effort ?? ""}
                className={selectClassName}
                aria-label="Estimated time"
              >
                <option value="">Any time</option>
                {EFFORT_BUCKETS.map((item) => (
                  <option key={item} value={item}>
                    {EFFORT_BUCKET_LABELS[item]}
                  </option>
                ))}
              </select>
            </FilterBar>
          </form>

          {courses.length === 0 ? (
            <EmptyState
              className="mt-10"
              title="No matching resources"
              description="Try clearing filters or check back after committee publishes free STEM courses."
              actionLabel="Clear filters"
              actionHref="/resources"
            />
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title ?? "Course"}
                  provider={`${course.provider_name ?? "Provider"} · Free`}
                  duration={formatEffortMinutes(course.estimated_minutes)}
                  level={
                    course.difficulty
                      ? COURSE_DIFFICULTY_LABELS[
                          course.difficulty as keyof typeof COURSE_DIFFICULTY_LABELS
                        ]
                      : "Level varies"
                  }
                  href={`/resources/${course.slug}`}
                  actionLabel="View resource"
                  className="h-full"
                />
              ))}
            </div>
          )}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
