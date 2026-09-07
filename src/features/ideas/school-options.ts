export type PersistedSchoolOption = {
  id: string;
  name: string;
  city: string;
  label: string;
};

export function presentSchoolOptions(
  schools: Array<{ id: string; name: string; city: string | null }>,
): PersistedSchoolOption[] {
  return schools.map((school) => ({
    id: school.id,
    name: school.name,
    city: school.city ?? "",
    label: school.city ? `${school.name} (${school.city})` : school.name,
  }));
}
