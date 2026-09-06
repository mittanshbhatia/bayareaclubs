import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import {
  listClubMedia,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubMediaPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}/media`);
    }
    throw error;
  }
  if (!context) notFound();

  const media = await listClubMedia(context.club.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Private media stays private by default. Upload and consent workflows will
        expand here; existing assets are listed from the database.
      </p>
      {media.length === 0 ? (
        <EmptyState
          title="No media assets"
          description="Club branding, documents, and activity media will appear here once uploaded."
        />
      ) : (
        <ul className="space-y-3">
          {media.map((asset) => (
            <li
              key={asset.id}
              className="rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <p className="font-medium">{asset.title}</p>
              <p className="text-sm text-muted-foreground">
                {asset.storage_bucket} · {asset.visibility} · {asset.mime_type}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
