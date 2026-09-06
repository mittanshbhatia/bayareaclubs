export function currentSchoolYear(reference = new Date()): string {
  const year = reference.getFullYear();
  const startYear = reference.getMonth() >= 7 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

export function daysUntil(dateIso: string | null | undefined, now = new Date()) {
  if (!dateIso) return null;
  const target = new Date(dateIso);
  if (Number.isNaN(target.getTime())) return null;
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
