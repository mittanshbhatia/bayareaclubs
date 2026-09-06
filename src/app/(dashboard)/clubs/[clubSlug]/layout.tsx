import { notFound } from "next/navigation";

import { ClubCommandNav } from "@/features/clubs/components/club-command-nav";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { AuthorizationError } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

export default async function ClubCommandLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}>) {
  const { clubSlug } = await params;

  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}`);
    }
    throw error;
  }

  if (!context) notFound();

  return (
    <div>
      <ClubCommandNav
        clubSlug={context.club.slug}
        clubName={context.club.name}
      />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
