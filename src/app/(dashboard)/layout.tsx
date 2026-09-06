import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard");
  }

  const supabase = await createClient();
  const { data: roles } = await supabase
    .from("platform_role_assignments")
    .select("role")
    .eq("user_id", user!.id)
    .is("revoked_at", null);

  const isCommittee = (roles ?? []).some(
    (row) => row.role === "committee_reviewer" || row.role === "platform_admin",
  );

  return (
    <div className="min-h-screen">
      <header className="border-b bg-surface">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              BayAreaClubs
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/start-a-club">Club ideas</Link>
              </Button>
              {isCommittee ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/ideas">Review queue</Link>
                </Button>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/profile">Profile</Link>
            </Button>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
