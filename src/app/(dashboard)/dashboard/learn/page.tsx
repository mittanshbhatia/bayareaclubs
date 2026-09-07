import { redirect } from "next/navigation";

import { coursesCatalogHref } from "@/features/learn/routes";
import { requireActiveUser } from "@/lib/auth/authorization";
import { withAuthorization } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

/** Legacy catalog URL. Courses live at /courses. */
export default async function LearnHubRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await withAuthorization("/dashboard/learn", () => requireActiveUser());
  const params = await searchParams;
  redirect(
    coursesCatalogHref(typeof params.family === "string" ? params.family : null),
  );
}
