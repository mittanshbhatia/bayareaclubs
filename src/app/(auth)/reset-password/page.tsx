import { ResetPasswordForm } from "@/features/auth/components/auth-forms";

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Choose a new password
      </h1>
      <p className="text-muted-foreground mt-2 mb-7 text-sm leading-6">
        Use at least 12 characters with both letters and numbers.
      </p>
      <ResetPasswordForm />
    </>
  );
}
