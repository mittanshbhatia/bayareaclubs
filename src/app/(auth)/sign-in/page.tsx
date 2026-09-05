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
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-muted-foreground mt-2 mb-6 text-sm leading-6">
        Access your clubs, reviews, events, and learning resources.
      </p>
      {notice ? (
        <p
          role="status"
          className="border-primary mb-5 border-l-2 pl-3 text-sm"
        >
          {notice}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="mb-5 border-l-2 border-red-700 pl-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      <SignInForm googleEnabled={isGoogleAuthEnabled()} />
    </>
  );
}
