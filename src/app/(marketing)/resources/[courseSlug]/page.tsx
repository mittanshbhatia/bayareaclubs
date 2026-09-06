import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/ds";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { MarkCompleteButton } from "@/features/stem/components/mark-complete-button";
import { SubscribeButton } from "@/features/stem/components/subscribe-button";
import {
  getMySubscription,
  getPublishedCourseBySlug,
} from "@/features/stem/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import {
  COURSE_DIFFICULTY_LABELS,
  COURSE_FORMAT_LABELS,
  GRADE_BAND_LABELS,
  STEM_DISCIPLINE_LABELS,
  formatEffortMinutes,
} from "@/lib/validation/stem";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const detail = await getPublishedCourseBySlug(courseSlug);
  if (!detail) notFound();

  let subscribed = false;
  let completedIds = new Set<string>();
  let signedIn = false;
  try {
    const user = await requireActiveUser();
    signedIn = true;
    const subscription = await getMySubscription(detail.course.id!, user.id);
    subscribed = Boolean(subscription);
    if (subscription) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data } = await supabase
        .from("course_progress")
        .select("resource_id, completed")
        .eq("subscription_id", subscription.id)
        .eq("completed", true);
      completedIds = new Set((data ?? []).map((row) => row.resource_id));
    }
  } catch {
    signedIn = false;
  }

  const course = detail.course;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen border-b border-border">
        <PageContainer className="py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Free STEM resource
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{course.description}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Provider</dt>
              <dd className="font-medium">{course.provider_name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="font-medium">
                {course.discipline
                  ? STEM_DISCIPLINE_LABELS[
                      course.discipline as keyof typeof STEM_DISCIPLINE_LABELS
                    ]
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd className="font-medium">
                {course.difficulty
                  ? COURSE_DIFFICULTY_LABELS[
                      course.difficulty as keyof typeof COURSE_DIFFICULTY_LABELS
                    ]
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Format</dt>
              <dd className="font-medium">
                {course.format
                  ? COURSE_FORMAT_LABELS[
                      course.format as keyof typeof COURSE_FORMAT_LABELS
                    ]
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estimated effort</dt>
              <dd className="font-medium">
                {formatEffortMinutes(course.estimated_minutes)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Grade range</dt>
              <dd className="font-medium">
                {(course.grade_bands ?? [])
                  .map(
                    (band) =>
                      GRADE_BAND_LABELS[band as keyof typeof GRADE_BAND_LABELS] ??
                      band,
                  )
                  .join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">License / source terms</dt>
              <dd className="font-medium">
                {course.license_url ? (
                  <a
                    href={course.license_url}
                    className="underline"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {course.license_name}
                  </a>
                ) : (
                  course.license_name
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Free status</dt>
              <dd className="font-medium">Free</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last verified</dt>
              <dd className="font-medium">
                {course.last_verified_at
                  ? new Date(course.last_verified_at).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {signedIn ? (
              <SubscribeButton
                courseId={course.id!}
                subscribed={subscribed}
              />
            ) : (
              <Button asChild>
                <Link href={`/sign-in?next=/resources/${course.slug}`}>
                  Sign in to add to Dashboard
                </Link>
              </Button>
            )}
            {course.source_url ? (
              <Button asChild variant="outline">
                <a href={course.source_url} target="_blank" rel="noreferrer">
                  Open provider site
                </a>
              </Button>
            ) : null}
          </div>

          <section className="mt-12 space-y-6">
            <h2 className="font-display text-2xl font-semibold">Modules</h2>
            {detail.modules.map((module) => {
              const resources = detail.resources.filter(
                (resource) => resource.module_id === module.id,
              );
              return (
                <article
                  key={module.id}
                  className="rounded-lg border border-border bg-surface p-5 shadow-xs"
                >
                  <h3 className="font-semibold">{module.title}</h3>
                  {module.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  ) : null}
                  <ul className="mt-4 space-y-3">
                    {resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
                      >
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.resource_type?.replaceAll("_", " ")}
                            {resource.estimated_minutes
                              ? ` · ${formatEffortMinutes(resource.estimated_minutes)}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resource.external_url ? (
                            <Button asChild size="sm" variant="outline">
                              <a
                                href={resource.external_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open lesson
                              </a>
                            </Button>
                          ) : null}
                          {subscribed && resource.id ? (
                            <MarkCompleteButton
                              courseId={course.id!}
                              resourceId={resource.id}
                              completed={completedIds.has(resource.id)}
                            />
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
