import { EmptyState } from "@/components/ds/states";
import { CheckInRedeemForm } from "@/features/attendance/components/check-in-redeem-form";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AttendanceCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/attendance/check-in");
  }

  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-lg space-y-6 px-5 py-12 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Attendance check-in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Authenticated check-in only. There is no public open QR attendance
          door.
        </p>
      </div>

      {!token ? (
        <EmptyState
          title="Missing check-in token"
          description="Ask an officer for a current check-in link. Expired or reused tokens will not work."
        />
      ) : (
        <CheckInRedeemForm token={token} />
      )}
    </div>
  );
}
