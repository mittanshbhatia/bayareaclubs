import "server-only";

/** True when Resend can send (both key and from address present). */
export function isEmailConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  return Boolean(apiKey && from);
}

export function emailConfigurationStatus(): "ok" | "missing" {
  return isEmailConfigured() ? "ok" : "missing";
}
