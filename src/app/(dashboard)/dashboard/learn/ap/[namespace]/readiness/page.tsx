import { ApToolPage } from "@/features/learn/components/tool-page";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApReadinessPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/readiness`);
  }

  return (
    <ApToolPage
      namespace={namespace}
      kind="readiness"
      title="Readiness"
      description="A mixed-difficulty check using original published items. This is not a College Board exam."
    />
  );
}
