"use server";

import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  commandPaletteQuerySchema,
  type CommandPaletteResult,
} from "@/lib/validation/command-palette";
import type { ActionResult } from "@/types/action-result";

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

export async function searchCommandPaletteAction(
  input: unknown,
): Promise<ActionResult<{ results: CommandPaletteResult[] }>> {
  const parsed = commandPaletteQuerySchema.safeParse(input ?? {});
  if (!parsed.success) {
    return failure("VALIDATION_ERROR", "Invalid search query.");
  }

  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_command_palette", {
      p_query: parsed.data.query,
      p_limit: parsed.data.limit,
    });
    if (error) return failure("SEARCH_FAILED", error.message);

    const results: CommandPaletteResult[] = (data ?? []).map((row) => ({
      id: row.result_id,
      group: row.result_group,
      label: row.label,
      description: row.description,
      href: row.href,
      icon: row.icon,
      rank: row.rank,
    }));

    return { ok: true, data: { results } };
  } catch (error) {
    return failure(
      "UNEXPECTED",
      error instanceof Error ? error.message : "Search failed.",
    );
  }
}
