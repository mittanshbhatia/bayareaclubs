import { AccessScope } from "@/components/dashboard/access-scope";
import { requireCommitteeReviewer } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function ReviewPage() {
  try {
    await requireCommitteeReviewer();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/review");
  }

  return (
    <AccessScope
      title="Committee review"
      description="This route requires an active committee reviewer assignment."
    />
  );
}
