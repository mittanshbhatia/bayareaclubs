import { AccessScope } from "@/components/dashboard/access-scope";
import { requireSchoolAccess } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  try {
    await requireSchoolAccess(schoolId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/schools/${schoolId}`);
  }

  return (
    <AccessScope
      title="School workspace"
      description="This route requires an active membership in the requested school or platform administration."
    />
  );
}
