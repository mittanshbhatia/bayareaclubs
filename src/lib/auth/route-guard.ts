import "server-only";

import { redirect, unstable_rethrow } from "next/navigation";

import { AuthorizationError } from "@/lib/auth/authorization";

function toSerializableError(error: unknown): Error {
  if (error instanceof Error) {
    return new Error(error.message);
  }
  return new Error("The page could not be loaded.");
}

export function handleAuthorizationError(
  error: unknown,
  nextPath: string,
): never {
  unstable_rethrow(error);
  if (error instanceof AuthorizationError) {
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
  throw toSerializableError(error);
}

/**
 * Run route work, then convert AuthorizationError into a redirect *outside*
 * the catch. Calling `redirect()` inside `catch` is reported as an RSC overlay
 * with only react-server-dom frames.
 */
export async function withAuthorization<T>(
  nextPath: string,
  work: () => Promise<T>,
): Promise<T> {
  let failure: unknown;
  let value: T | undefined;
  try {
    value = await work();
  } catch (error) {
    unstable_rethrow(error);
    failure = error;
  }
  if (failure !== undefined) {
    handleAuthorizationError(failure, nextPath);
  }
  return value as T;
}
