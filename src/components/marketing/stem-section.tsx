import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageContainer } from "@/components/ds";
import styles from "@/components/marketing/homepage.module.css";
import {
  LearningPath,
  type LearningModule,
} from "@/components/marketing/learning-path";
import { MotionReveal, SceneLabel } from "@/components/marketing/motion-scene";
import { cn } from "@/lib/utils";

const demonstrationPath: LearningModule[] = [
  { title: "Python Foundations", href: "/resources" },
  { title: "Data & Models", href: "/resources" },
  { title: "Machine Learning Basics", href: "/resources" },
  { title: "Build a Club Project", href: "/resources" },
  { title: "Present Your Work", href: "/resources" },
];

export function StemSection() {
  return (
    <section
      id="learn"
      className={cn(
        styles.scene,
        styles.warmScene,
        "scroll-mt-20 py-24 sm:py-32 lg:py-40",
      )}
    >
      <PageContainer size="xl">
        <MotionReveal>
          <SceneLabel>05 · Learning</SceneLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.68fr] lg:items-end">
            <h2 className={cn(styles.sectionDisplay, "text-balance")}>
              Turn club meetings into learning.
            </h2>
            <div>
              <p className="max-w-xl text-base leading-7 text-[var(--home-muted)] sm:text-lg">
                Build a path from free published resources, connect it to club
                goals, and let every member keep their own progress.
              </p>
              <Link
                href="/resources"
                className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--home-indigo)]"
              >
                Browse all learning resources
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1} className="mt-14">
          <LearningPath
            modules={demonstrationPath}
            usingPublishedCourses={false}
          />
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
