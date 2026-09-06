import { notFound } from "next/navigation";

import { getPublicNewsletter } from "@/features/publishing/queries";
import { BLOCK_TYPE_LABELS } from "@/lib/validation/publishing";

export const dynamic = "force-dynamic";

export default async function PublicNewsletterPage({
  params,
}: {
  params: Promise<{ clubSlug: string; newsletterId: string }>;
}) {
  const { clubSlug, newsletterId } = await params;
  const data = await getPublicNewsletter(newsletterId);
  if (!data || data.clubSlug !== clubSlug) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
        {data.clubName ?? "BayAreaClubs"}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        {data.newsletter.title}
      </h1>
      {data.newsletter.issue_label ? (
        <p className="mt-2 text-muted-foreground">{data.newsletter.issue_label}</p>
      ) : null}
      {data.newsletter.published_at ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Published {new Date(data.newsletter.published_at).toLocaleDateString()}
        </p>
      ) : null}

      <div className="mt-10 space-y-6">
        {data.blocks.map((block) => {
          const content = (block.content ?? {}) as Record<string, unknown>;
          if (block.block_type === "divider") {
            return <hr key={block.id} className="border-border" />;
          }
          return (
            <section key={block.id} className="space-y-2">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                {BLOCK_TYPE_LABELS[
                  block.block_type as keyof typeof BLOCK_TYPE_LABELS
                ] ?? block.block_type}
              </p>
              <h2 className="font-display text-xl font-semibold">
                {String(content.title ?? "")}
              </h2>
              <p className="whitespace-pre-wrap text-base leading-7 text-foreground/90">
                {String(
                  content.body ??
                    content.summary ??
                    content.subtitle ??
                    content.label ??
                    "",
                )}
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
