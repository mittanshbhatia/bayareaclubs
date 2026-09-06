/**
 * Escape a user-provided substring for use inside a PostgREST `.or()` /
 * `.filter()` `ilike.%…%` fragment so commas, periods, and wildcards cannot
 * alter the filter expression.
 */
export function escapePostgrestFilterValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/,/g, " ")
    .replace(/\./g, " ")
    .replace(/"/g, "")
    .trim()
    .slice(0, 100);
}

/** Build `column.ilike.%term%` fragments joined by commas for `.or()`. */
export function postgrestIlikeOr(
  columns: readonly string[],
  rawSearch: string,
): string | null {
  const term = escapePostgrestFilterValue(rawSearch);
  if (!term) return null;
  return columns.map((column) => `${column}.ilike.%${term}%`).join(",");
}
