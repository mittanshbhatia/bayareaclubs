import Link from "next/link";

import { ForgotPasswordForm } from "@/features/auth/components/auth-forms";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
      <p className="text-muted-foreground mt-2 mb-7 text-sm leading-6">
        Enter your account email. For privacy, the response is the same whether
        or not an account exists.
      </p>
      <ForgotPasswordForm />
      <Link
        href="/sign-in"
        className="text-primary mt-6 inline-block text-sm underline-offset-4 hover:underline"
      >
        Return to sign in
      </Link>
    </>
  );
}
