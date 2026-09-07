import { ApToolPage } from "@/features/learn/components/tool-page";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApReviewPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/review`);
  }

  return (
    <ApToolPage
      namespace={namespace}
      kind="review"
      title="Review"
      description="Mixed original items across published units. There is no public leaderboard."
    />
  );
}
