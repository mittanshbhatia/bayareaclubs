import { notFound } from "next/navigation";

import { AdminCourseEditor } from "@/features/stem/components/admin-course-editor";
import { getAdminCourse } from "@/features/stem/queries";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import type { AdminCourseInput } from "@/lib/validation/stem";

export const dynamic = "force-dynamic";

export default async function AdminEditResourcePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, `/admin/resources/${courseId}`);
  }

  const detail = await getAdminCourse(courseId);
  if (!detail) notFound();

  const initial: AdminCourseInput = {
    courseId: detail.course.id,
    slug: detail.course.slug,
    title: detail.course.title,
    description: detail.course.description,
    discipline: detail.course.discipline as AdminCourseInput["discipline"],
    gradeBands: detail.course.grade_bands as AdminCourseInput["gradeBands"],
    difficulty: detail.course.difficulty as AdminCourseInput["difficulty"],
    format: (detail.course.format ?? "self_paced") as AdminCourseInput["format"],
    estimatedMinutes: detail.course.estimated_minutes,
    providerName: detail.course.provider_name,
    sourceUrl: detail.course.source_url,
    licenseName: detail.course.license_name,
    licenseUrl: detail.course.license_url ?? "",
    lastVerifiedAt:
      detail.course.last_verified_at ??
      new Date().toISOString().slice(0, 10),
    isFree: true,
    modules: detail.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description ?? "",
      estimatedMinutes: module.estimated_minutes,
      resources: detail.resources
        .filter((resource) => resource.module_id === module.id)
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description ?? "",
          resourceType: resource.resource_type as AdminCourseInput["modules"][number]["resources"][number]["resourceType"],
          externalUrl: resource.external_url ?? "",
          estimatedMinutes: resource.estimated_minutes,
        })),
    })),
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Edit STEM course
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Engagement: subscriptions {detail.metrics?.subscription_count ?? 0},
          starts {detail.metrics?.start_count ?? 0}, lesson completions{" "}
          {detail.metrics?.resource_completion_count ?? 0}, course completions{" "}
          {detail.metrics?.course_completion_count ?? 0}. These are usage
          counters only.
        </p>
      </div>
      <AdminCourseEditor
        courseId={courseId}
        status={detail.course.status}
        initial={initial}
      />
    </div>
  );
}
