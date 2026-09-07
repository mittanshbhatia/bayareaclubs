import "server-only";

import type { ActionResult } from "@/types/action-result";

/**
 * Provider-neutral no-op. OPENAI/ANTHROPIC keys are not configured.
 * Must never publish, change grades, change permissions, or read another
 * student's work.
 */
export async function requestLearningAssistance(_input: {
  namespace?: string;
  prompt?: string;
} = {}): Promise<ActionResult<never>> {
  void _input;
  return {
    ok: false,
    error: {
      code: "AI_UNAVAILABLE",
      message:
        "AI providers are not configured. This assistant cannot publish courses, change grades, change permissions, or read another student's work.",
    },
  };
}

export function isLearningAiEnabled() {
  return false;
}
