import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DashboardHomeContentRevisionRow,
  DashboardHomeContentRow,
  DashboardModuleConfigRow,
  DashboardModuleRow,
} from "@/features/dashboard-config/types";
import type { Database, Json } from "@/types/database.generated";

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type DashboardConfigSchema = {
  public: {
    Tables: {
      dashboard_modules: TableDef<
        DashboardModuleRow,
        Partial<DashboardModuleRow> & { id: string },
        Partial<DashboardModuleRow>
      >;
      dashboard_module_configs: TableDef<
        DashboardModuleConfigRow,
        Omit<DashboardModuleConfigRow, "id"> & { id?: string },
        Partial<DashboardModuleConfigRow>
      >;
      dashboard_home_content: TableDef<
        DashboardHomeContentRow,
        Omit<DashboardHomeContentRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          payload?: Json;
        },
        Partial<DashboardHomeContentRow>
      >;
      dashboard_home_content_revisions: TableDef<
        DashboardHomeContentRevisionRow,
        Omit<DashboardHomeContentRevisionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        },
        Partial<DashboardHomeContentRevisionRow>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DashboardConfigClient = SupabaseClient<DashboardConfigSchema>;

export function dashboardConfigClient(
  supabase: SupabaseClient<Database>,
): DashboardConfigClient {
  return supabase as unknown as DashboardConfigClient;
}

export function isMissingRelation(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const message = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /does not exist/i.test(message) ||
    /Could not find the table/i.test(message) ||
    /schema cache/i.test(message)
  );
}
