import type {
  DashboardContextHint,
  DashboardContextOption,
  DashboardContextType,
  DashboardPermissions,
  ResolvedDashboardModule,
} from "@/components/dashboard/types";

export type { DashboardContextOption, ResolvedDashboardModule };

export const SCHOOL_DASHBOARD_ROLES = [
  "school_admin",
  "school_advisor",
  "staff",
] as const;

export type ShellModuleCatalogItem = Omit<ResolvedDashboardModule, "href">;

/**
 * Client-safe catalog mirror of the seeded dashboard_modules rows.
 * Visibility is still filtered by context, permissions, status, and flags.
 */
export const SHELL_MODULE_CATALOG: readonly ShellModuleCatalogItem[] = [
  {
    id: "home",
    slug: "home",
    label: "Home",
    description: "Context home",
    icon: "Home",
    route: "/",
    contextTypes: ["personal", "club", "school", "platform"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 10,
    section: "Overview",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "my-day",
    slug: "my-day",
    label: "My Day",
    description: "Upcoming items for today",
    icon: "CalendarDays",
    route: "/dashboard#my-day",
    contextTypes: ["personal"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 20,
    section: "Personal",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "my-clubs",
    slug: "my-clubs",
    label: "My Clubs",
    description: "Clubs you belong to",
    icon: "Users",
    route: "/dashboard#clubs",
    contextTypes: ["personal"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 30,
    section: "Personal",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "learning",
    slug: "learning",
    label: "Learning",
    description: "STEM and AP courses",
    icon: "GraduationCap",
    route: "/dashboard/learn",
    contextTypes: ["personal", "club"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 40,
    section: "Learning",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "stem-resources",
    slug: "stem-resources",
    label: "STEM resources",
    description: "Browse STEM catalog",
    icon: "BookOpen",
    route: "/resources",
    contextTypes: ["personal", "club"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 50,
    section: "Learning",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "ideas",
    slug: "ideas",
    label: "Club ideas",
    description: "Start or track a club idea",
    icon: "Lightbulb",
    route: "/start-a-club",
    contextTypes: ["personal"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 60,
    section: "Personal",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "notifications",
    slug: "notifications",
    label: "Notifications",
    description: "Your inbox",
    icon: "Bell",
    route: "/dashboard/notifications",
    contextTypes: ["personal"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 70,
    section: "Account",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "insights",
    slug: "insights",
    label: "Insights",
    description: "Activity and trends",
    icon: "BarChart3",
    route: "/dashboard/insights",
    contextTypes: ["personal", "club", "school", "platform"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 80,
    section: "Insights",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "profile",
    slug: "profile",
    label: "Profile",
    description: "Your account",
    icon: "User",
    route: "/dashboard/profile",
    contextTypes: ["personal"],
    requiredPermissions: [],
    defaultEnabled: true,
    displayOrder: 90,
    section: "Account",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "club-overview",
    slug: "club-overview",
    label: "Club overview",
    description: "Club command home",
    icon: "LayoutDashboard",
    route: "/clubs/:slug",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 10,
    section: "Club",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "club-members",
    slug: "club-members",
    label: "Members",
    description: "Club roster",
    icon: "Users",
    route: "/clubs/:slug/members",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 20,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-attendance",
    slug: "club-attendance",
    label: "Attendance",
    description: "Meetings and check-in",
    icon: "ClipboardCheck",
    route: "/clubs/:slug/attendance",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 30,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-events",
    slug: "club-events",
    label: "Events",
    description: "Club events",
    icon: "Calendar",
    route: "/clubs/:slug/events",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 40,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-charter",
    slug: "club-charter",
    label: "Charter",
    description: "Charter and renewal",
    icon: "ScrollText",
    route: "/clubs/:slug/charter",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 50,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-media",
    slug: "club-media",
    label: "Media",
    description: "Club media",
    icon: "Image",
    route: "/clubs/:slug/media",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 60,
    section: "Club",
    mobileVisibility: "hidden",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-highlights",
    slug: "club-highlights",
    label: "Highlights",
    description: "Club highlights",
    icon: "Sparkles",
    route: "/clubs/:slug/highlights",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 70,
    section: "Club",
    mobileVisibility: "hidden",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-comms",
    slug: "club-comms",
    label: "Communications",
    description: "Club messages",
    icon: "Mail",
    route: "/clubs/:slug/communications",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 80,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "club-resources",
    slug: "club-resources",
    label: "Resources",
    description: "Club learning resources",
    icon: "Library",
    route: "/clubs/:slug/resources",
    contextTypes: ["club"],
    requiredPermissions: ["club.member"],
    defaultEnabled: true,
    displayOrder: 90,
    section: "Club",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "school-clubs",
    slug: "school-clubs",
    label: "School clubs",
    description: "Clubs at this school",
    icon: "Building2",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 10,
    section: "School",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "school-applications",
    slug: "school-applications",
    label: "Applications",
    description: "Club idea applications",
    icon: "Inbox",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 20,
    section: "School",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "school-charters",
    slug: "school-charters",
    label: "Charters",
    description: "School charters",
    icon: "FileText",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 30,
    section: "School",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "school-events",
    slug: "school-events",
    label: "Events",
    description: "School events",
    icon: "Calendar",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 40,
    section: "School",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "school-attendance",
    slug: "school-attendance",
    label: "Attendance",
    description: "Aggregate attendance",
    icon: "ClipboardList",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 50,
    section: "School",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "school-learning",
    slug: "school-learning",
    label: "Learning",
    description: "School learning usage",
    icon: "GraduationCap",
    route: "/dashboard/schools/:id",
    contextTypes: ["school"],
    requiredPermissions: ["school.dashboard"],
    defaultEnabled: true,
    displayOrder: 60,
    section: "School",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
  {
    id: "platform-admin",
    slug: "platform-admin",
    label: "Admin console",
    description: "Platform administration",
    icon: "Shield",
    route: "/admin",
    contextTypes: ["platform"],
    requiredPermissions: ["platform.admin"],
    defaultEnabled: true,
    displayOrder: 10,
    section: "Platform",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "platform-audit",
    slug: "platform-audit",
    label: "Audit",
    description: "Platform audit log",
    icon: "FileSearch",
    route: "/admin/audit",
    contextTypes: ["platform"],
    requiredPermissions: ["platform.admin"],
    defaultEnabled: true,
    displayOrder: 20,
    section: "Platform",
    mobileVisibility: "always",
    featureFlag: null,
    status: "active",
    mandatory: true,
  },
  {
    id: "dashboard-config",
    slug: "dashboard-config",
    label: "Dashboard config",
    description: "Module visibility and order",
    icon: "SlidersHorizontal",
    route: "/admin/dashboard-config",
    contextTypes: ["platform"],
    requiredPermissions: ["platform.admin"],
    defaultEnabled: true,
    displayOrder: 30,
    section: "Platform",
    mobileVisibility: "overflow",
    featureFlag: null,
    status: "active",
    mandatory: false,
  },
] as const;

export function hrefForContext(context: DashboardContextOption): string {
  switch (context.type) {
    case "personal":
      return "/dashboard";
    case "club":
      return context.clubSlug ? `/clubs/${context.clubSlug}` : "/dashboard";
    case "school":
      return context.schoolId
        ? `/dashboard/schools/${context.schoolId}`
        : "/dashboard";
    case "platform":
      return "/dashboard/platform";
    default:
      return "/dashboard";
  }
}

export function hintFromPathname(pathname: string): DashboardContextHint {
  const clubMatch = pathname.match(/^\/clubs\/([^/]+)/);
  if (clubMatch?.[1]) {
    return { context: "club", club: clubMatch[1], pathname };
  }
  const schoolMatch = pathname.match(/^\/dashboard\/schools\/([^/]+)/);
  if (schoolMatch?.[1]) {
    return { context: "school", school: schoolMatch[1], pathname };
  }
  if (
    pathname.startsWith("/dashboard/platform") ||
    pathname.startsWith("/admin")
  ) {
    return { context: "platform", pathname };
  }
  return { context: "personal", pathname };
}

export function selectActiveContext(
  available: readonly DashboardContextOption[],
  hint: DashboardContextHint,
): DashboardContextOption {
  const personal =
    available.find((context) => context.type === "personal") ?? available[0];

  if (!personal) {
    return {
      type: "personal",
      id: "personal",
      label: "Personal",
      href: "/dashboard",
    };
  }

  if (hint.context === "club" && hint.club) {
    return (
      available.find(
        (context) =>
          context.type === "club" &&
          (context.clubSlug === hint.club || context.clubId === hint.club),
      ) ?? personal
    );
  }

  if (hint.context === "school" && hint.school) {
    return (
      available.find(
        (context) =>
          context.type === "school" &&
          (context.schoolId === hint.school ||
            context.schoolSlug === hint.school),
      ) ?? personal
    );
  }

  if (hint.context === "platform") {
    return available.find((context) => context.type === "platform") ?? personal;
  }

  return personal;
}

export function filterContextsByQuery(
  contexts: readonly DashboardContextOption[],
  query: string,
): DashboardContextOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...contexts];
  return contexts.filter((context) => {
    const haystack = [
      context.label,
      context.type,
      context.clubSlug,
      context.schoolSlug,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function isFeatureEnabled(
  featureFlag: string | null,
  enabledFlags: readonly string[] = [],
): boolean {
  if (!featureFlag) return true;
  return enabledFlags.includes(featureFlag);
}

export function isModulePermitted(
  module: Pick<ResolvedDashboardModule, "requiredPermissions">,
  permissions: DashboardPermissions,
  contextType: DashboardContextType,
): boolean {
  return module.requiredPermissions.every((permission) => {
    if (permission === "platform_admin" || permission === "platform.admin") {
      return permissions.isPlatformAdmin;
    }
    if (
      permission === "school_dashboard" ||
      permission === "school.dashboard"
    ) {
      return permissions.canAccessSchoolDashboard;
    }
    if (permission === "club_member" || permission === "club.member") {
      return contextType === "club";
    }
    if (permission === "club.officer" || permission === "club.manage") {
      return contextType === "club";
    }
    if (permission === "view_insights") return true;
    return false;
  });
}

export function isModuleVisible(
  module: Pick<
    ResolvedDashboardModule,
    "status" | "featureFlag" | "contextTypes"
  >,
  contextType: DashboardContextType,
  enabledFlags: readonly string[] = [],
): boolean {
  if (module.status !== "active") return false;
  if (!module.contextTypes.includes(contextType)) return false;
  return isFeatureEnabled(module.featureFlag, enabledFlags);
}

export function modulesForSurface(
  modules: readonly ResolvedDashboardModule[],
  surface: "desktop" | "mobile",
): ResolvedDashboardModule[] {
  return modules.filter((module) => {
    if (surface === "desktop") return true;
    if (module.mandatory) return true;
    return module.mobileVisibility !== "hidden";
  });
}

export function resolveVisibleCatalogModules(input: {
  contextType: DashboardContextType;
  permissions: DashboardPermissions;
  enabledFlags?: readonly string[];
  catalog?: readonly ShellModuleCatalogItem[];
}): ResolvedDashboardModule[] {
  const catalog = input.catalog ?? SHELL_MODULE_CATALOG;
  return catalog
    .filter(
      (module) =>
        isModuleVisible(
          module,
          input.contextType,
          input.enabledFlags ?? [],
        ) &&
        isModulePermitted(module, input.permissions, input.contextType),
    )
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export function resolveModuleHref(
  module: ResolvedDashboardModule,
  context: DashboardContextOption,
): string {
  if (module.href) return module.href;

  const clubSlug = context.clubSlug ?? "";
  const schoolId = context.schoolId ?? context.schoolSlug ?? "";

  if (module.id === "home") {
    return hrefForContext(context);
  }

  if (module.id === "insights") {
    if (context.type === "club" && clubSlug) {
      return `/clubs/${clubSlug}/insights`;
    }
    if (context.type === "platform") return "/admin/insights";
    if (context.type === "school" && schoolId) {
      return `/dashboard/schools/${schoolId}`;
    }
    return "/dashboard/insights";
  }

  return module.route
    .replaceAll(":slug", clubSlug)
    .replaceAll(":clubSlug", clubSlug)
    .replaceAll(":id", schoolId)
    .replaceAll(":schoolId", schoolId);
}

export function isModuleActive(href: string, pathname: string): boolean {
  const [path] = href.split("#");
  const normalizedPath = path || "/";
  const exactHomes = new Set([
    "/dashboard",
    "/admin",
    "/dashboard/platform",
  ]);

  if (
    exactHomes.has(normalizedPath) ||
    /^\/clubs\/[^/]+$/.test(normalizedPath) ||
    /^\/dashboard\/schools\/[^/]+$/.test(normalizedPath)
  ) {
    return pathname === normalizedPath || pathname === `${normalizedPath}/`;
  }

  return (
    pathname === normalizedPath || pathname.startsWith(`${normalizedPath}/`)
  );
}

function sectionLabel(section: string): string {
  if (section === "shared") return "Overview";
  if (!section) return "Overview";
  return section.charAt(0).toUpperCase() + section.slice(1);
}

export function groupModulesBySection(
  modules: readonly ResolvedDashboardModule[],
): Array<{ section: string; modules: ResolvedDashboardModule[] }> {
  const groups = new Map<string, ResolvedDashboardModule[]>();
  for (const entry of modules) {
    const list = groups.get(entry.section) ?? [];
    list.push(entry);
    groups.set(entry.section, list);
  }
  return [...groups.entries()].map(([section, items]) => ({
    section: sectionLabel(section),
    modules: items,
  }));
}

export function groupContextsByType(
  contexts: readonly DashboardContextOption[],
): Array<{ type: DashboardContextType; label: string; contexts: DashboardContextOption[] }> {
  const labels: Record<DashboardContextType, string> = {
    personal: "Personal",
    club: "Clubs",
    school: "Schools",
    platform: "Platform",
  };
  const order: DashboardContextType[] = [
    "personal",
    "club",
    "school",
    "platform",
  ];
  return order
    .map((type) => ({
      type,
      label: labels[type],
      contexts: contexts.filter((context) => context.type === type),
    }))
    .filter((group) => group.contexts.length > 0);
}

export function withResolvedHrefs(
  modules: readonly ResolvedDashboardModule[],
  context: DashboardContextOption,
): ResolvedDashboardModule[] {
  return modules.map((module) => ({
    ...module,
    href: resolveModuleHref(module, context),
  }));
}
