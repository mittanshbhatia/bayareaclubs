import { SignUpForm } from "@/features/auth/components/auth-forms";
import { getSignupSchools } from "@/features/auth/queries";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const schools = await getSignupSchools();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="text-muted-foreground mt-2 mb-7 text-sm leading-6">
        Start with a standard account. Institutional and club permissions are
        assigned only after authorization.
      </p>
      <SignUpForm schools={schools} />
    </>
  );
}
