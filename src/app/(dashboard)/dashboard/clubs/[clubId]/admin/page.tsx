import { AccessScope } from "@/components/dashboard/access-scope";
import { requireClubAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function ClubAdminPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubAdmin(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}/admin`);
  }

  return (
    <AccessScope
      title="Club administration"
      description="This route requires the active club administrator assignment for the requested club."
    />
  );
}
