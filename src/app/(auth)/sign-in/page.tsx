import { SignInForm } from "@/features/auth/components/auth-forms";
import { isGoogleAuthEnabled } from "@/lib/env";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  session_expired: "Your session expired. Sign in to continue.",
};
const errors: Record<string, string> = {
  verification_failed: "The verification link is invalid or has expired.",
  google_not_configured:
    "Google sign-in is not configured for this institution.",
  google_unavailable: "Google sign-in is temporarily unavailable.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const notice = params.reason ? notices[params.reason] : undefined;
  const error = params.error ? errors[params.error] : undefined;

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 mb-6 text-sm leading-6 text-muted-foreground">
        Access your clubs, reviews, events, and learning resources.
      </p>
      {notice ? (
        <p
          role="status"
          className="mb-5 border-l-2 border-primary pl-3 text-sm"
        >
          {notice}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="mb-5 border-l-2 border-danger pl-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}
      <SignInForm googleEnabled={isGoogleAuthEnabled()} />
    </>
  );
}
