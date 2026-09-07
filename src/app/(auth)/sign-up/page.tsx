import { SignUpForm } from "@/features/auth/components/auth-forms";
import { getSignupSchools } from "@/features/auth/queries";
import { isGoogleAuthEnabled } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const schools = await getSignupSchools();

  return (
    <>
      <h1 className="font-display text-center text-3xl font-semibold tracking-tight text-slate-950">
        Sign up
      </h1>
      <p className="mt-2 mb-7 text-center text-sm leading-6 text-slate-600">
        Start your club journey with Google or email.
      </p>
      <SignUpForm schools={schools} googleEnabled={isGoogleAuthEnabled()} />
    </>
  );
}
