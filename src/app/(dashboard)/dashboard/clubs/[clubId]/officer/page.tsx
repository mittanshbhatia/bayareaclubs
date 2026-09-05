import { AccessScope } from "@/components/dashboard/access-scope";
import { requireClubOfficer } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function ClubOfficerPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubOfficer(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}/officer`);
  }

  return (
    <AccessScope
      title="Club operations"
      description="This route requires an active officer or advisor assignment in the requested club."
    />
  );
}
