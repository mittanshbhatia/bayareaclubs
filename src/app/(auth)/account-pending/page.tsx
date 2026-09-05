import { redirect } from "next/navigation";
import { Clock3 } from "lucide-react";

import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPendingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in?reason=session_expired");
  }

  const { data: onboarding } = await supabase
    .from("account_onboarding")
    .select("status, activation_method")
    .eq("user_id", user.id)
    .maybeSingle();
  if (onboarding?.status === "active") {
    redirect("/dashboard");
  }

  const detail =
    onboarding?.status === "pending_guardian"
      ? "A verified guardian must authorize this account before the school can review it."
      : onboarding?.status === "pending_school"
        ? "An authorized school administrator must review and activate this account."
        : "Verify your email address to continue.";

  return (
    <div className="text-center">
      <Clock3 aria-hidden="true" className="text-primary mx-auto size-9" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">
        Account activation pending
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{detail}</p>
      <p className="text-muted-foreground mt-4 text-sm leading-6">
        Under-13 activation requires guardian authorization or school
        management, plus institutional and legal configuration.
      </p>
      <form action={signOutAction} className="mt-7">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  );
}
