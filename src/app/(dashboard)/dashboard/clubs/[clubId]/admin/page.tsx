import { redirect } from "next/navigation";

import { requireClubAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export default async function ClubAdminRedirect({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubAdmin(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}/admin`);
  }

  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();

  if (club?.slug) redirect(`/clubs/${club.slug}/settings`);
  redirect("/dashboard");
}
