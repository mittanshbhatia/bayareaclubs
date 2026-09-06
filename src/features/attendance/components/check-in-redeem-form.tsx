"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { redeemCheckInAction } from "@/features/attendance/actions";

export function CheckInRedeemForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="text-sm text-success" role="status">
        Check-in recorded. You can close this page.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        You must be signed in as an active member of this club. Tokens are
        short-lived and single-use.
      </p>
      <Button
        type="button"
        disabled={pending || !token}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await redeemCheckInAction({ token });
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            setDone(true);
            router.refresh();
          })
        }
      >
        Confirm check-in
      </Button>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
