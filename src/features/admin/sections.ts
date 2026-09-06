export const PLATFORM_ROLES = ["platform_admin", "committee_reviewer"] as const;

export type PlatformRoleKey = (typeof PLATFORM_ROLES)[number];

export const ADMIN_SECTIONS = [
  {
    key: "overview",
    label: "Overview",
    href: "",
    roles: ["platform_admin", "committee_reviewer"] as const,
  },
  {
    key: "ideas",
    label: "Club Ideas",
    href: "/ideas",
    roles: ["platform_admin", "committee_reviewer"] as const,
  },
  {
    key: "clubs",
    label: "Clubs",
    href: "/clubs",
    roles: ["platform_admin"] as const,
  },
  {
    key: "schools",
    label: "Schools",
    href: "/schools",
    roles: ["platform_admin"] as const,
  },
  {
    key: "events",
    label: "Events",
    href: "/events",
    roles: ["platform_admin"] as const,
  },
  {
    key: "renewals",
    label: "Renewals",
    href: "/renewals",
    roles: ["platform_admin", "committee_reviewer"] as const,
  },
  {
    key: "resources",
    label: "Resources",
    href: "/resources",
    roles: ["platform_admin"] as const,
  },
  {
    key: "users",
    label: "Users & Roles",
    href: "/users",
    roles: ["platform_admin"] as const,
  },
  {
    key: "communications",
    label: "Communications",
    href: "/communications",
    roles: ["platform_admin"] as const,
  },
  {
    key: "insights",
    label: "Insights",
    href: "/insights",
    roles: ["platform_admin"] as const,
  },
  {
    key: "audit",
    label: "Audit Log",
    href: "/audit",
    roles: ["platform_admin"] as const,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    roles: ["platform_admin"] as const,
  },
] as const;

export function adminSectionsForRoles(roles: PlatformRoleKey[]) {
  return ADMIN_SECTIONS.filter((section) =>
    section.roles.some((role) => roles.includes(role)),
  );
}
