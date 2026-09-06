import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export function getEmailFromAddress() {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM is not configured.");
  }
  return from;
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
