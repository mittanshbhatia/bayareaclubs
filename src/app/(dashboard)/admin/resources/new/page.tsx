import { AdminCourseEditor } from "@/features/stem/components/admin-course-editor";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminNewResourcePage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/admin/resources/new");
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        New STEM course
      </h2>
      <AdminCourseEditor />
    </div>
  );
}
