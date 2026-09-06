import { notFound } from "next/navigation";

import { MediaLibraryPanel } from "@/features/media/components/media-library-panel";
import { MediaUploader } from "@/features/media/components/media-uploader";
import {
  listClubMediaAttachTargets,
  listClubMediaLibrary,
  listClubMediaUploaders,
} from "@/features/media/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubMediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ clubSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { clubSlug } = await params;
  const query = await searchParams;

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

  const activityId =
    typeof query.activityId === "string" ? query.activityId : null;

  const [items, uploaders, attachTargets] = await Promise.all([
    listClubMediaLibrary({
      clubId: context.club.id,
      q: typeof query.q === "string" ? query.q : "",
      mediaType:
        typeof query.type === "string" &&
        ["image", "video", "document", "audio", "other"].includes(query.type)
          ? (query.type as "image" | "video" | "document" | "audio" | "other")
          : "all",
      eventId: typeof query.eventId === "string" ? query.eventId : null,
      activityId,
      uploaderId: typeof query.uploaderId === "string" ? query.uploaderId : null,
      createdFrom: typeof query.from === "string" ? query.from : null,
      createdTo: typeof query.to === "string" ? query.to : null,
      visibility: "all",
    }),
    listClubMediaUploaders(context.club.id),
    listClubMediaAttachTargets(context.club.id),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          Media
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Private by default. Signed URLs protect private objects. Path guessing
          cannot bypass authorization because Storage reads require media
          metadata and RLS.
        </p>
      </header>

      <MediaUploader
        clubId={context.club.id}
        events={attachTargets.events.map((event) => ({
          id: event.id,
          title: event.title,
        }))}
      />

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Media library
        </h2>
        <MediaLibraryPanel
          clubId={context.club.id}
          initialItems={items as never}
          uploaders={uploaders}
          attachTargets={attachTargets}
        />
      </section>
    </div>
  );
}
