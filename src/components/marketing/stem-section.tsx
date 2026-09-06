import Link from "next/link";
import { BookOpen } from "lucide-react";

import { CourseCard, PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { listPublishedCourses } from "@/features/stem/queries";
import {
  COURSE_DIFFICULTY_LABELS,
  formatEffortMinutes,
} from "@/lib/validation/stem";

export async function StemSection() {
  const courses = await listPublishedCourses({});
  const featured = courses.slice(0, 6);

  return (
    <section
      id="stem"
      className="scroll-mt-20 border-b border-border bg-surface-muted/35 py-16 sm:py-24"
    >
      <PageContainer>
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 text-accent">
            <BookOpen aria-hidden className="size-4" />
            <span className="text-xs font-semibold tracking-[0.14em] uppercase">
              STEM resources
            </span>
          </div>
          <SectionHeader
            title="Turn club meetings into learning."
            description="Browse free STEM resources, add them to My Learning, and keep progress inside your dashboard—never hosting copyrighted third-party course files."
            actions={
              <Button asChild variant="outline">
                <Link href="/resources">Explore Resources</Link>
              </Button>
            }
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0
            ? featured.map((course, index) => (
                <Reveal key={course.id} delay={index * 0.04}>
                  <CourseCard
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
                    className="h-full"
                    href={`/resources/${course.slug}`}
                    actionLabel="View resource"
                  />
                </Reveal>
              ))
            : [0, 1, 2].map((index) => (
                <Reveal key={index} delay={index * 0.04}>
                  <CourseCard
                    title="Free STEM catalog"
                    provider="BayAreaClubs"
                    duration="Browse anytime"
                    level="All levels"
                    className="h-full"
                    href="/resources"
                    actionLabel="Open catalog"
                  />
                </Reveal>
              ))}
        </div>
      </PageContainer>
    </section>
  );
}
