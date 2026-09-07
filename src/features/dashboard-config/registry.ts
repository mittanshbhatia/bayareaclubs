export const DASHBOARD_CONTEXT_TYPES = [
  "personal",
  "club",
  "school",
  "platform",
] as const;

export type DashboardContextType = (typeof DASHBOARD_CONTEXT_TYPES)[number];

export const DASHBOARD_CONFIG_SCOPES = [
  "global",
  "school",
  "club",
  "user",
] as const;

export type DashboardConfigScope = (typeof DASHBOARD_CONFIG_SCOPES)[number];

export const DASHBOARD_MOBILE_VISIBILITY = [
  "always",
  "overflow",
  "hidden",
] as const;

export type DashboardMobileVisibility =
  (typeof DASHBOARD_MOBILE_VISIBILITY)[number];

export const DASHBOARD_MODULE_STATUSES = ["active", "deprecated"] as const;

export type DashboardModuleStatus = (typeof DASHBOARD_MODULE_STATUSES)[number];

export const DASHBOARD_MODULE_PERMISSIONS = [
  "view_insights",
  "club.member",
  "club.officer",
  "club.manage",
  "school.dashboard",
  "platform.admin",
] as const;

export type DashboardModulePermission =
  (typeof DASHBOARD_MODULE_PERMISSIONS)[number];

export const DASHBOARD_MODULE_IDS = [
  "home",
  "my-day",
  "my-clubs",
  "learning",
  "stem-resources",
  "ideas",
  "notifications",
  "insights",
  "profile",
  "club-overview",
  "club-members",
  "club-attendance",
  "club-events",
  "club-charter",
  "club-media",
  "club-highlights",
  "club-comms",
  "club-resources",
  "school-clubs",
  "school-applications",
  "school-charters",
  "school-events",
  "school-attendance",
  "school-learning",
  "platform-admin",
  "platform-audit",
  "dashboard-config",
] as const;

export type DashboardModuleId = (typeof DASHBOARD_MODULE_IDS)[number];

export const MANDATORY_MODULE_IDS = [
  "home",
  "profile",
  "club-overview",
  "school-clubs",
  "platform-admin",
  "platform-audit",
] as const satisfies readonly DashboardModuleId[];

export type MandatoryModuleId = (typeof MANDATORY_MODULE_IDS)[number];

export const MANDATORY_MODULE_ID_SET = new Set<string>(MANDATORY_MODULE_IDS);

export const CONFIG_HIERARCHY_COPY =
  "Resolution order: global default → school override → club override → permission filter → user preference. Later layers win for enablement and order, never for permission. Hiding a nav module does not grant or revoke access.";

export type DashboardModuleMirror = {
  id: DashboardModuleId;
  slug: DashboardModuleId;
  label: string;
  description: string;
  icon: string;
  route: string;
  context_types: readonly DashboardContextType[];
  required_permissions: readonly DashboardModulePermission[];
  default_enabled: boolean;
  display_order: number;
  section: string;
  mobile_visibility: DashboardMobileVisibility;
  feature_flag: string | null;
  status: DashboardModuleStatus;
  mandatory: boolean;
};

function module(
  spec: Omit<DashboardModuleMirror, "slug" | "status" | "feature_flag"> & {
    feature_flag?: string | null;
  },
): DashboardModuleMirror {
  return {
    ...spec,
    slug: spec.id,
    feature_flag: spec.feature_flag ?? null,
    status: "active",
  };
}

export const DASHBOARD_MODULE_REGISTRY: readonly DashboardModuleMirror[] = [
  module({
    id: "home",
    label: "Home",
    description: "Context home for the active operating center.",
    icon: "Home",
    route: "/dashboard",
    context_types: ["personal", "club", "school", "platform"],
    required_permissions: [],
    default_enabled: true,
    display_order: 0,
    section: "shared",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "my-day",
    label: "My Day",
    description: "Next actions, events, and learning items for today.",
    icon: "CalendarClock",
    route: "/dashboard#my-day",
    context_types: ["personal"],
    required_permissions: [],
    default_enabled: true,
    display_order: 10,
    section: "personal",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "my-clubs",
    label: "My Clubs",
    description: "Clubs the signed-in member belongs to.",
    icon: "Users",
    route: "/dashboard#clubs",
    context_types: ["personal"],
    required_permissions: [],
    default_enabled: true,
    display_order: 20,
    section: "personal",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "learning",
    label: "Learning",
    description: "STEM and structured learning catalog.",
    icon: "GraduationCap",
    route: "/dashboard/learn",
    context_types: ["personal", "club"],
    required_permissions: [],
    default_enabled: true,
    display_order: 30,
    section: "personal",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "stem-resources",
    label: "STEM Resources",
    description: "Published STEM resource catalog.",
    icon: "BookOpen",
    route: "/resources",
    context_types: ["personal", "club"],
    required_permissions: [],
    default_enabled: true,
    display_order: 40,
    section: "personal",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "ideas",
    label: "Start a Club",
    description: "Submit or continue a club idea.",
    icon: "Lightbulb",
    route: "/start-a-club",
    context_types: ["personal"],
    required_permissions: [],
    default_enabled: true,
    display_order: 50,
    section: "personal",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "notifications",
    label: "Notifications",
    description: "Account notifications inbox.",
    icon: "Bell",
    route: "/dashboard/notifications",
    context_types: ["personal"],
    required_permissions: [],
    default_enabled: true,
    display_order: 60,
    section: "personal",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "insights",
    label: "Insights",
    description: "Participation insights the actor is allowed to view.",
    icon: "BarChart3",
    route: "/dashboard/insights",
    context_types: ["personal", "club", "school", "platform"],
    required_permissions: ["view_insights"],
    default_enabled: true,
    display_order: 70,
    section: "shared",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "profile",
    label: "Profile",
    description: "Account profile and preferences.",
    icon: "User",
    route: "/dashboard/profile",
    context_types: ["personal"],
    required_permissions: [],
    default_enabled: true,
    display_order: 80,
    section: "personal",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "club-overview",
    label: "Club Overview",
    description: "Club command-center home.",
    icon: "LayoutDashboard",
    route: "/clubs/:slug",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 100,
    section: "club",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "club-members",
    label: "Members",
    description: "Club roster for authorized members.",
    icon: "UsersRound",
    route: "/clubs/:slug/members",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 110,
    section: "club",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "club-attendance",
    label: "Attendance",
    description: "Attendance sessions for officers and managers.",
    icon: "ClipboardCheck",
    route: "/clubs/:slug/attendance",
    context_types: ["club"],
    required_permissions: ["club.officer"],
    default_enabled: true,
    display_order: 120,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "club-events",
    label: "Events",
    description: "Club events and RSVPs.",
    icon: "Calendar",
    route: "/clubs/:slug/events",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 130,
    section: "club",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "club-charter",
    label: "Charter",
    description: "Charter and renewal workflow.",
    icon: "FileText",
    route: "/clubs/:slug/charter",
    context_types: ["club"],
    required_permissions: ["club.manage"],
    default_enabled: true,
    display_order: 140,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "club-media",
    label: "Media",
    description: "Club media library.",
    icon: "Image",
    route: "/clubs/:slug/media",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 150,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "club-highlights",
    label: "Highlights",
    description: "Published club highlights.",
    icon: "Sparkles",
    route: "/clubs/:slug/highlights",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 160,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "club-comms",
    label: "Communications",
    description: "Club announcements and newsletters.",
    icon: "Mail",
    route: "/clubs/:slug/communications",
    context_types: ["club"],
    required_permissions: ["club.officer"],
    default_enabled: true,
    display_order: 170,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "club-resources",
    label: "Club Resources",
    description: "Learning collections recommended to the club.",
    icon: "Library",
    route: "/clubs/:slug/resources",
    context_types: ["club"],
    required_permissions: ["club.member"],
    default_enabled: true,
    display_order: 180,
    section: "club",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "school-clubs",
    label: "School Clubs",
    description: "Clubs at the authorized school.",
    icon: "Building2",
    route: "/dashboard/schools/:schoolId",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 200,
    section: "school",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "school-applications",
    label: "Applications",
    description: "Club ideas scoped to the school.",
    icon: "Inbox",
    route: "/dashboard/schools/:schoolId#applications",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 210,
    section: "school",
    mobile_visibility: "always",
    mandatory: false,
  }),
  module({
    id: "school-charters",
    label: "School Charters",
    description: "Charters and renewals for the school.",
    icon: "ScrollText",
    route: "/dashboard/schools/:schoolId#charters",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 220,
    section: "school",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "school-events",
    label: "School Events",
    description: "School-scoped events.",
    icon: "CalendarDays",
    route: "/dashboard/schools/:schoolId#events",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 230,
    section: "school",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "school-attendance",
    label: "School Attendance",
    description: "Aggregate attendance for authorized school staff.",
    icon: "ClipboardList",
    route: "/dashboard/schools/:schoolId#attendance",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 240,
    section: "school",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "school-learning",
    label: "School Learning",
    description: "Aggregate learning usage for the school.",
    icon: "BookMarked",
    route: "/dashboard/schools/:schoolId#learning",
    context_types: ["school"],
    required_permissions: ["school.dashboard"],
    default_enabled: true,
    display_order: 250,
    section: "school",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
  module({
    id: "platform-admin",
    label: "Platform Admin",
    description: "Platform staff console.",
    icon: "Shield",
    route: "/admin",
    context_types: ["platform"],
    required_permissions: ["platform.admin"],
    default_enabled: true,
    display_order: 300,
    section: "platform",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "platform-audit",
    label: "Platform Audit",
    description: "Append-only administrative audit log.",
    icon: "FileSearch",
    route: "/admin/audit",
    context_types: ["platform"],
    required_permissions: ["platform.admin"],
    default_enabled: true,
    display_order: 310,
    section: "platform",
    mobile_visibility: "always",
    mandatory: true,
  }),
  module({
    id: "dashboard-config",
    label: "Dashboard Configuration",
    description: "Enable, disable, and reorder dashboard modules.",
    icon: "SlidersHorizontal",
    route: "/admin/dashboard-config",
    context_types: ["platform"],
    required_permissions: ["platform.admin"],
    default_enabled: true,
    display_order: 320,
    section: "platform",
    mobile_visibility: "overflow",
    mandatory: false,
  }),
] as const;

export const DASHBOARD_MODULE_BY_ID: Record<
  DashboardModuleId,
  DashboardModuleMirror
> = Object.fromEntries(
  DASHBOARD_MODULE_REGISTRY.map((entry) => [entry.id, entry]),
) as Record<DashboardModuleId, DashboardModuleMirror>;
