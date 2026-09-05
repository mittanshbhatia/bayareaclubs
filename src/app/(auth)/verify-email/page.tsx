import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <MailCheck aria-hidden="true" className="text-primary mx-auto size-9" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">
        Verify your email
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        Open the verification link sent to your email address. Your account
        remains unavailable until verification succeeds.
      </p>
      <Link
        href="/sign-in"
        className="text-primary mt-6 inline-block text-sm underline-offset-4 hover:underline"
      >
        Return to sign in
      </Link>
    </div>
  );
}
