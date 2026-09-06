/**
 * Same-origin relative path only: no protocol-relative, backslash, or scheme tricks.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value) return fallback;
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("@") ||
    /[\u0000-\u001f\u007f]/.test(value) ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return fallback;
  }
  return value;
}
