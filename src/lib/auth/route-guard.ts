import "server-only";

import { redirect } from "next/navigation";

import { AuthorizationError } from "@/lib/auth/authorization";

export function handleAuthorizationError(
  error: unknown,
  nextPath: string,
): never {
  if (!(error instanceof AuthorizationError)) {
    throw error;
  }
  if (error.code === "AUTH_REQUIRED") {
    redirect(
      `/sign-in?reason=session_expired&next=${encodeURIComponent(nextPath)}`,
    );
  }
  if (error.code === "ACCOUNT_PENDING") {
    redirect("/account-pending");
  }
  redirect("/unauthorized");
}
