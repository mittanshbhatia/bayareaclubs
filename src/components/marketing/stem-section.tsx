import Link from "next/link";
import { BookOpen } from "lucide-react";

import { CourseCard, PageContainer, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "AI & Machine Learning",
    provider: "STEM Library",
    duration: "6 weeks",
    level: "Intermediate",
  },
  {
    title: "Competitive Programming",
    provider: "STEM Library",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    title: "Robotics",
    provider: "STEM Library",
    duration: "5 weeks",
    level: "Beginner",
  },
  {
    title: "Physics",
    provider: "STEM Library",
    duration: "4 weeks",
    level: "Beginner",
  },
  {
    title: "Data Science",
    provider: "STEM Library",
    duration: "6 weeks",
    level: "Intermediate",
  },
] as const;

export function StemSection() {
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
            description="Subscribe to courses and keep resources inside the club dashboard—ready for the next meeting agenda."
            actions={
              <Button asChild variant="outline">
                <Link href="/sign-up">Explore Resources</Link>
              </Button>
            }
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <Reveal key={course.title} delay={index * 0.04}>
              <CourseCard
                {...course}
                className="h-full"
                href="/sign-up"
                actionLabel="Subscribe via account"
              />
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
