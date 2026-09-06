import Link from "next/link";

import { AccessScope } from "@/components/dashboard/access-scope";
import { Button } from "@/components/ui/button";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export default async function PlatformPage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/platform");
  }

  return (
    <div className="space-y-6">
      <AccessScope
        title="Platform administration"
        description="This route requires an active platform administrator assignment."
      />
      <Button asChild>
        <Link href="/dashboard/platform/stem">STEM Resources admin</Link>
      </Button>
    </div>
  );
}
