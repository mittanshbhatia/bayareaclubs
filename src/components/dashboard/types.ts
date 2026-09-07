/**
 * Serialized dashboard-shell types matching
 * docs/architecture/dashboard-operating-center.md.
 *
 * Agent 02 owns resolveDashboardContext / resolveVisibleModules.
 * These are shims only — not a second context resolver.
 */

export type DashboardContextType = "personal" | "club" | "school" | "platform";

export type DashboardMobileVisibility = "always" | "overflow" | "hidden";

export type DashboardModuleStatus = "active" | "deprecated";

export type DashboardContextHint = {
  context?: DashboardContextType | string;
  club?: string;
  school?: string;
  pathname?: string;
};

export type DashboardContextOption = {
  type: DashboardContextType;
  id: string;
  label: string;
  href: string;
  clubId?: string;
  clubSlug?: string;
  schoolId?: string;
  schoolSlug?: string;
};

export type DashboardPermissions = {
  isPlatformAdmin: boolean;
  canAccessAdminConsole: boolean;
  canAccessSchoolDashboard: boolean;
};

export type ResolvedDashboardActor = {
  id: string;
  displayName?: string | null;
};

export type ResolvedDashboardContext = {
  actor: ResolvedDashboardActor;
  activeContext: DashboardContextOption;
  availableContexts: DashboardContextOption[];
  permissions: DashboardPermissions;
};

export type ResolvedDashboardModule = {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  href?: string;
  contextTypes: DashboardContextType[];
  requiredPermissions: string[];
  defaultEnabled: boolean;
  displayOrder: number;
  section: string;
  mobileVisibility: DashboardMobileVisibility;
  featureFlag: string | null;
  status: DashboardModuleStatus;
  mandatory: boolean;
};

export type DashboardShellData = {
  actor: ResolvedDashboardActor;
  activeContext: DashboardContextOption;
  availableContexts: DashboardContextOption[];
  modules: ResolvedDashboardModule[];
  permissions: DashboardPermissions;
  enabledFlags: string[];
};
