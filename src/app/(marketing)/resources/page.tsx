import Link from "next/link";

import { CourseCard, FilterBar, PageContainer, SectionHeader } from "@/components/ds";
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
                  className="min-w-[14rem] flex-1"
                  aria-label="Search resources"
                />
              }
              trailing={
                <Button type="submit" variant="outline">
                  Apply filters
                </Button>
              }
            >
              <select
                name="discipline"
                defaultValue={filters.discipline ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Subject"
              >
                <option value="">All subjects</option>
                {STEM_DISCIPLINES.filter((item) => item !== "other").map((item) => (
                  <option key={item} value={item}>
                    {STEM_DISCIPLINE_LABELS[item]}
                  </option>
                ))}
              </select>
              <select
                name="gradeBand"
                defaultValue={filters.gradeBand ?? ""}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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

          {courses.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              No free published resources match these filters.{" "}
              <Link href="/resources" className="underline">
                Clear filters
              </Link>
            </p>
          ) : null}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
