import "server-only";

import { z } from "zod";

import { getPublicSupabaseEnv } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

const participantRowSchema = z.object({
  logo_bucket: z.literal("school-branding"),
  logo_path: z.string().regex(/^participants\/[a-z0-9-]+[.]png$/),
  logo_alt: z.string().min(2),
  sort_order: z.number().int(),
  schools: z.object({
    name: z.string().min(2),
    website_url: z.url(),
  }),
});

export type PublicSchoolParticipant = {
  name: string;
  websiteUrl: string;
  logoUrl: string;
  logoAlt: string;
};

export async function listPublicSchoolParticipants(): Promise<
  PublicSchoolParticipant[]
> {
  const {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
  } = getPublicSupabaseEnv();
  const query = new URLSearchParams({
    select:
      "logo_bucket,logo_path,logo_alt,sort_order,schools!inner(name,website_url)",
    is_published: "eq.true",
    logo_path: "not.is.null",
    order: "sort_order.asc",
  });

  try {
    const response = await fetch(
      `${url}/rest/v1/homepage_school_participants?${query}`,
      {
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
        },
        next: {
          revalidate: 3600,
          tags: ["homepage-school-participants"],
        },
      },
    );
    if (!response.ok) {
      logger.warn("Public school participants query failed", {
        status: response.status,
      });
      return [];
    }

    const rows = z.array(participantRowSchema).parse(await response.json());
    return rows.map((row) => ({
      name: row.schools.name,
      websiteUrl: row.schools.website_url,
      logoAlt: row.logo_alt,
      logoUrl: `${url}/storage/v1/object/public/${row.logo_bucket}/${row.logo_path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
    }));
  } catch (error) {
    logger.warn("Public school participants are unavailable", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return [];
  }
}
