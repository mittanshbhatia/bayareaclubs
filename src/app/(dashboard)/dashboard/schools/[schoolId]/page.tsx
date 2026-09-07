import { notFound } from "next/navigation";

import { SchoolHome } from "@/components/dashboard/school-home";
import { loadSchoolDashboard } from "@/features/dashboard/school";
import { withAuthorization } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  const dashboard = await withAuthorization(
    `/dashboard/schools/${schoolId}`,
    () => loadSchoolDashboard(schoolId),
  );

  if (!dashboard) notFound();

  return <SchoolHome dashboard={dashboard} />;
}
