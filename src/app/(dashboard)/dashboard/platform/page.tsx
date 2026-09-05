import { AccessScope } from "@/components/dashboard/access-scope";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function PlatformPage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/platform");
  }

  return (
    <AccessScope
      title="Platform administration"
      description="This route requires an active platform administrator assignment."
    />
  );
}
