import "server-only";

import { Resend } from "resend";

import { isEmailConfigured } from "@/lib/email/config";

let client: Resend | null = null;

export { isEmailConfigured } from "@/lib/email/config";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export function getEmailFromAddress() {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) {
    throw new Error("EMAIL_FROM is not configured.");
  }
  return from;
}

export function assertEmailConfigured() {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email is not configured. Set RESEND_API_KEY and EMAIL_FROM.",
    );
  }
}

export function isPermanentEmailFailure(statusCode?: number, message?: string) {
  if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
    return true;
  }
  const text = (message ?? "").toLowerCase();
  return (
    text.includes("invalid") ||
    text.includes("does not exist") ||
    text.includes("suppressed") ||
    text.includes("bounced") ||
    text.includes("unsubscribed")
  );
}
