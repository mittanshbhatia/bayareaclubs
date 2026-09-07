import "server-only";

import { createLearnClient } from "@/features/learn/database";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { similarityCheckSchema } from "@/lib/validation/learn";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "which",
  "that",
  "with",
]);

export function tokenizePrompt(prompt: string) {
  return new Set(
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

export function jaccardSimilarity(left: Set<string>, right: Set<string>) {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export type SimilarityMatch = {
  questionId: string;
  namespace: string;
  slug: string;
  score: number;
};

/**
 * Compare a prompt to OUR learning_questions bank only.
 * Never scrapes third-party sites or external question banks.
 */
export async function similarityCheckAgainstOwnBank(
  namespace: string,
  prompt: string,
): Promise<SimilarityMatch[]> {
  await requirePlatformAdmin();
  const parsed = similarityCheckSchema.safeParse({ namespace, prompt });
  if (!parsed.success) return [];

  const supabase = await createLearnClient();
  const { data, error } = await supabase
    .from("learning_questions")
    .select("id, namespace, slug, prompt")
    .limit(400);
  if (error) throw error;

  const needle = tokenizePrompt(parsed.data.prompt);
  return (data ?? [])
    .map((row) => ({
      questionId: row.id,
      namespace: row.namespace,
      slug: row.slug,
      score: jaccardSimilarity(needle, tokenizePrompt(row.prompt)),
    }))
    .filter((row) => row.score >= 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function similarityCheckAgainstPrompts(
  prompt: string,
  bank: Array<{ id: string; namespace: string; slug: string; prompt: string }>,
) {
  const needle = tokenizePrompt(prompt);
  return bank
    .map((row) => ({
      questionId: row.id,
      namespace: row.namespace,
      slug: row.slug,
      score: jaccardSimilarity(needle, tokenizePrompt(row.prompt)),
    }))
    .filter((row) => row.score >= 0.45)
    .sort((a, b) => b.score - a.score);
}
