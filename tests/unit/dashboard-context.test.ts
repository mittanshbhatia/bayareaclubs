import { describe, expect, it } from "vitest";

import {
  deriveDashboardContext,
  permissionsForContext,
  type DashboardActor,
  type DashboardActiveContext,
} from "@/features/dashboard/context";
import { resolveVisibleModules } from "@/features/dashboard/queries";
import type { Database } from "@/types/database.generated";

type ModuleRow = Database["public"]["Tables"]["dashboard_modules"]["Row"];
type ConfigRow = Database["public"]["Tables"]["dashboard_module_configs"]["Row"];

const studentActor: DashboardActor = {
  userId: "user-student",
  isPlatformAdmin: false,
  isCommitteeReviewer: false,
  schoolMemberships: [
    {
      schoolId: "school-1",
      schoolSlug: "homestead-high-school",
      schoolName: "Homestead High School",
      role: "student",
    },
  ],
  clubMemberships: [
    {
      clubId: "club-1",
      clubSlug: "robotics-club",
      clubName: "Robotics Club",
      schoolId: "school-1",
      role: "member",
    },
  ],
};

const advisorActor: DashboardActor = {
  ...studentActor,
  userId: "user-advisor",
  schoolMemberships: [
    {
      ...studentActor.schoolMemberships[0],
      role: "school_advisor",
    },
  ],
  clubMemberships: [
    {
      ...studentActor.clubMemberships[0],
      role: "advisor",
    },
  ],
};

function moduleRow(
  overrides: Partial<ModuleRow> & Pick<ModuleRow, "id" | "context_types">,
): ModuleRow {
  return {
    slug: overrides.id,
    label: overrides.id,
    description: overrides.id,
    icon: "House",
    route: "/dashboard",
    required_permissions: [],
    default_enabled: true,
    display_order: 10,
    section: "primary",
    mobile_visibility: "always",
    feature_flag: null,
    status: "active",
    mandatory: false,
    created_at: "2026-09-06T00:00:00Z",
    updated_at: "2026-09-06T00:00:00Z",
    ...overrides,
  };
}

function configRow(
  overrides: Partial<ConfigRow> &
    Pick<ConfigRow, "module_id" | "scope_type" | "enabled">,
): ConfigRow {
  return {
    id: `${overrides.scope_type}-${overrides.module_id}`,
    school_id: null,
    club_id: null,
    user_id: null,
    display_order: null,
    created_at: "2026-09-06T00:00:00Z",
    updated_at: "2026-09-06T00:00:00Z",
    ...overrides,
  };
}

describe("dashboard context resolution", () => {
  it("falls back to personal when a hint is forged or unauthorized", () => {
    const resolved = deriveDashboardContext({
      actor: studentActor,
      hint: {
        type: "school",
        schoolRef: "school-1",
      },
    });

    expect(resolved.availableContexts.map((context) => context.type)).toEqual([
      "personal",
      "club",
    ]);
    expect(resolved.activeContext.type).toBe("personal");
  });

  it("does not give students a school operating context", () => {
    const resolved = deriveDashboardContext({
      actor: studentActor,
      hint: {
        type: "school",
        schoolRef: "homestead-high-school",
      },
    });

    expect(
      resolved.availableContexts.some((context) => context.type === "school"),
    ).toBe(false);
    expect(resolved.permissions.canAccessSchoolDashboard).toBe(false);
    expect(resolved.activeContext).toMatchObject({ type: "personal" });
  });

  it("lets an authorized school advisor select a school hint", () => {
    const resolved = deriveDashboardContext({
      actor: advisorActor,
      hint: {
        type: "school",
        schoolRef: "homestead-high-school",
      },
    });

    expect(resolved.activeContext.type).toBe("school");
    if (resolved.activeContext.type !== "school") return;
    expect(resolved.activeContext.schoolId).toBe("school-1");
    expect(resolved.permissions.canAccessSchoolDashboard).toBe(true);
  });

  it("ignores forged role fields and still requires a matching authorized context", () => {
    const resolved = deriveDashboardContext({
      actor: studentActor,
      hint: { type: "platform" },
    });

    expect(resolved.activeContext.type).toBe("personal");
    expect(resolved.permissions.canAccessPlatform).toBe(false);
  });

  it("does not treat committee reviewer as platform context", () => {
    const resolved = deriveDashboardContext({
      actor: {
        ...studentActor,
        isCommitteeReviewer: true,
      },
      hint: { type: "platform" },
    });
    expect(resolved.activeContext.type).toBe("personal");
    expect(
      resolved.availableContexts.some((context) => context.type === "platform"),
    ).toBe(false);
  });
});

describe("dashboard module permission filter", () => {
  const personal: DashboardActiveContext = {
    type: "personal",
    label: "Personal",
  };
  const club: DashboardActiveContext = {
    type: "club",
    label: "Robotics Club",
    clubId: "club-1",
    clubSlug: "robotics-club",
    clubName: "Robotics Club",
    schoolId: "school-1",
    role: "member",
  };

  const modules = [
    moduleRow({
      id: "home",
      context_types: ["personal", "club", "school", "platform"],
      mandatory: true,
      display_order: 10,
    }),
    moduleRow({
      id: "profile",
      context_types: ["personal"],
      mandatory: true,
      display_order: 20,
    }),
    moduleRow({
      id: "club-comms",
      context_types: ["club"],
      required_permissions: ["club.officer"],
      display_order: 30,
    }),
    moduleRow({
      id: "insights",
      context_types: ["personal", "club"],
      display_order: 40,
    }),
    moduleRow({
      id: "school-clubs",
      context_types: ["school"],
      required_permissions: ["school.dashboard"],
      mandatory: true,
      display_order: 50,
    }),
  ];

  it("hides modules the actor cannot access even if a config enables them", () => {
    const permissions = permissionsForContext(studentActor, club);
    const visible = resolveVisibleModules({
      context: club,
      permissions,
      modules,
      userId: studentActor.userId,
      configs: [
        configRow({
          module_id: "club-comms",
          scope_type: "club",
          club_id: "club-1",
          enabled: true,
        }),
        configRow({
          module_id: "club-comms",
          scope_type: "user",
          user_id: studentActor.userId,
          enabled: true,
        }),
      ],
    });

    expect(visible.map((module) => module.id)).toEqual(["home", "insights"]);
    expect(visible.some((module) => module.id === "club-comms")).toBe(false);
  });

  it("keeps mandatory modules even when the user hides them", () => {
    const permissions = permissionsForContext(studentActor, personal);
    const visible = resolveVisibleModules({
      context: personal,
      permissions,
      modules,
      userId: studentActor.userId,
      configs: [
        configRow({
          module_id: "profile",
          scope_type: "user",
          user_id: studentActor.userId,
          enabled: false,
        }),
      ],
      preference: {
        hiddenModuleIds: ["home", "profile", "insights"],
        moduleOrder: ["insights"],
      },
    });

    expect(visible.map((module) => module.id)).toEqual(["home", "profile"]);
  });

  it("does not surface school modules on a personal context", () => {
    const permissions = permissionsForContext(studentActor, personal);
    const visible = resolveVisibleModules({
      context: personal,
      permissions,
      modules,
      configs: [],
    });
    expect(visible.some((module) => module.id === "school-clubs")).toBe(false);
  });
});
