import { ApToolPage } from "@/features/learn/components/tool-page";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApQuizPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/quiz`);
  }

  return (
    <ApToolPage
      namespace={namespace}
      kind="quiz"
      title="Quiz"
      description="A shorter original set. Checks stay private to you."
    />
  );
}
