import { EmptyState } from "@/components/ds/states";
import { CourseWorkspace } from "@/features/learn/components/course-workspace";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import { getCourseWorkspace } from "@/features/learn/queries";
import { listCourseTools } from "@/features/learn/tools";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApCoursePage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}`);
  }

  const workspace = await getCourseWorkspace(namespace);
  const registry = workspace.registry ?? getRegistryEntry(namespace);

  if (!workspace.course && !registry) {
    return (
      <EmptyState
        title="Course not found"
        description="That AP namespace is not in the published catalog or the planned registry."
        actionLabel="Back to AP catalog"
        actionHref="/courses"
      />
    );
  }

  const tools = workspace.course ? await listCourseTools(namespace) : [];

  return (
    <CourseWorkspace namespace={namespace} workspace={workspace} tools={tools} />
  );
}
