import { redirect } from "next/navigation";

import { CompleteProfileForm } from "@/features/auth/components/auth-forms";
import { getSignupSchools } from "@/features/auth/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in?reason=session_expired");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.onboarding_completed_at) {
    redirect("/dashboard");
  }

  const schools = await getSignupSchools();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Complete your profile
      </h1>
      <p className="text-muted-foreground mt-2 mb-7 text-sm leading-6">
        Google has verified your identity. Provide the minimum information
        needed for account governance. Privileged roles cannot be selected here.
      </p>
      <CompleteProfileForm schools={schools} />
    </>
  );
}
