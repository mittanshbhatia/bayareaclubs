import { AdminCourseEditor } from "@/features/stem/components/admin-course-editor";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function NewStemCoursePage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/platform/stem/new");
    return null;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        New STEM course
      </h1>
      <AdminCourseEditor />
    </div>
  );
}
