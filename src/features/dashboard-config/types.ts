import type { Json } from "@/types/database.generated";

import type {
  DashboardConfigScope,
  DashboardContextType,
  DashboardMobileVisibility,
  DashboardModuleStatus,
} from "@/features/dashboard-config/registry";
import type { DashboardHomeModuleType } from "@/lib/validation/dashboard-home-content";

export type DashboardModuleRow = {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  context_types: DashboardContextType[];
  required_permissions: string[];
  default_enabled: boolean;
  display_order: number;
  section: string;
  mobile_visibility: DashboardMobileVisibility;
  feature_flag: string | null;
  status: DashboardModuleStatus;
  mandatory: boolean;
};

export type DashboardModuleConfigRow = {
  id: string;
  module_id: string;
  scope_type: DashboardConfigScope;
  school_id: string | null;
  club_id: string | null;
  user_id: string | null;
  enabled: boolean;
  display_order: number | null;
};

export type DashboardHomeContentRow = {
  id: string;
  module_type: DashboardHomeModuleType;
  context_type: "personal" | "club" | "school" | "platform";
  school_id: string | null;
  club_id: string | null;
  title: string | null;
  body: string;
  payload: Json;
  status: string;
  display_order: number;
  created_by: string;
  updated_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardHomeContentRevisionRow = {
  id: string;
  content_id: string | null;
  content_uuid: string;
  actor_id: string | null;
  action: "insert" | "update" | "delete";
  module_type: DashboardHomeModuleType;
  context_type: "personal" | "club" | "school" | "platform";
  school_id: string | null;
  club_id: string | null;
  title: string | null;
  body: string | null;
  payload: Json;
  status: string;
  created_at: string;
};

export type ScopeOption = {
  id: string;
  name: string;
  schoolId?: string;
  schoolName?: string | null;
};

export type FeaturedOption = {
  id: string;
  title: string;
};

export type HomeContentListItem = {
  id: string;
  moduleType: DashboardHomeModuleType;
  payload: Json;
  body: string;
  title: string | null;
  enabled: boolean;
  displayOrder: number;
};

export type DashboardConfigPageData = {
  persistenceAvailable: boolean;
  catalogSource: "catalog" | "registry";
  catalogNotice: string | null;
  schools: ScopeOption[];
  clubs: ScopeOption[];
  publishedCourses: FeaturedOption[];
  publishedResources: FeaturedOption[];
  publishedEvents: FeaturedOption[];
  homeContent: HomeContentListItem[];
  errorId: string | null;
  loadError: string | null;
};
