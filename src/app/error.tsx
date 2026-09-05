"use client";

import { useEffect, useState } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorId] = useState(() => error.digest ?? crypto.randomUUID());

  useEffect(() => {
    console.error("Application error", { errorId, digest: error.digest });
  }, [error.digest, errorId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5">
      <p className="text-primary text-sm font-semibold">Error ID: {errorId}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3">
        Please try again. If the problem continues, share the error ID with
        support.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground mt-6 min-h-11 self-start rounded-md px-5 py-3 text-sm font-semibold"
      >
        Try again
      </button>
    </main>
  );
}
