import Link from "next/link";
import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="text-center">
      <ShieldX aria-hidden="true" className="mx-auto size-9 text-red-700" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">
        Access not authorized
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        Your account does not have the required school, club, or platform
        assignment for this page.
      </p>
      <Button asChild className="mt-7">
        <Link href="/dashboard">Return to dashboard</Link>
      </Button>
    </div>
  );
}
