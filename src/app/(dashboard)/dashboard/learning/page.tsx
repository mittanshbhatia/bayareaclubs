import { redirect } from "next/navigation";

import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

/** STEM progress lives on /resources. Learning chrome is the AP catalog. */
export default async function MyLearningRedirectPage() {
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/learn");
    return null;
  }
  redirect("/dashboard/learn");
}
