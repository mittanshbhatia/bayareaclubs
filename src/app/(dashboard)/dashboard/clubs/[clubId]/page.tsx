import { AccessScope } from "@/components/dashboard/access-scope";
import { requireClubMember } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubMember(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}`);
  }

  return (
    <AccessScope
      title="Club workspace"
      description="This route requires active membership in the requested club."
    />
  );
}
