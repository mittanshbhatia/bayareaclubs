import { describe, expect, it } from "vitest";

import { adminSectionsForRoles } from "@/features/admin/sections";
import {
  DASHBOARD_MODULE_IDS,
  DASHBOARD_MODULE_REGISTRY,
  MANDATORY_MODULE_IDS,
} from "@/features/dashboard-config/registry";
import {
  disableGuard,
  enableGuard,
  moveModuleInOrder,
  ordersFromIds,
  resolveScopedModules,
  roleMayUseModule,
} from "@/features/dashboard-config/resolve";

describe("dashboard module registry", () => {
  it("mirrors every contract seed id exactly once", () => {
    const ids = DASHBOARD_MODULE_REGISTRY.map((module) => module.id);
    expect(ids).toEqual([...DASHBOARD_MODULE_IDS]);
    expect(new Set(ids).size).toBe(DASHBOARD_MODULE_IDS.length);
  });

  it("marks governance modules as mandatory", () => {
    expect([...MANDATORY_MODULE_IDS]).toEqual([
      "home",
      "profile",
      "club-overview",
      "school-clubs",
      "platform-admin",
      "platform-audit",
    ]);
    for (const id of MANDATORY_MODULE_IDS) {
      const catalogEntry = DASHBOARD_MODULE_REGISTRY.find((row) => row.id === id);
      expect(catalogEntry?.mandatory).toBe(true);
      expect(disableGuard(id).allowed).toBe(false);
    }
  });
});

describe("admin navigation", () => {
  it("exposes Dashboard Configuration to platform admins only", () => {
    const admin = adminSectionsForRoles(["platform_admin"]);
    const section = admin.find((row) => row.key === "dashboard-config");
    expect(section?.href).toBe("/dashboard-config");
    expect(section?.label).toBe("Dashboard Configuration");

    const reviewer = adminSectionsForRoles(["committee_reviewer"]);
    expect(reviewer.some((row) => row.key === "dashboard-config")).toBe(false);
  });
});

describe("module reorder", () => {
  it("moves items with up/down and is a no-op at the edges", () => {
    const start = ["home", "my-day", "learning"];
    expect(moveModuleInOrder(start, "my-day", "up")).toEqual([
      "my-day",
      "home",
      "learning",
    ]);
    expect(moveModuleInOrder(start, "my-day", "down")).toEqual([
      "home",
      "learning",
      "my-day",
    ]);
    expect(moveModuleInOrder(start, "home", "up")).toEqual(start);
    expect(moveModuleInOrder(start, "learning", "down")).toEqual(start);
    expect(ordersFromIds(["learning", "home"])).toEqual([
      { moduleId: "learning", displayOrder: 0 },
      { moduleId: "home", displayOrder: 10 },
    ]);
  });
});

describe("permission-aware enablement", () => {
  const platformAdmin = DASHBOARD_MODULE_REGISTRY.find(
    (module) => module.id === "platform-admin",
  )!;
  const schoolClubs = DASHBOARD_MODULE_REGISTRY.find(
    (module) => module.id === "school-clubs",
  )!;
  const clubComms = DASHBOARD_MODULE_REGISTRY.find(
    (module) => module.id === "club-comms",
  )!;

  it("cannot enable a module for a role that lacks required_permissions", () => {
    expect(roleMayUseModule("member", clubComms)).toBe(false);
    expect(
      enableGuard(clubComms, { scopeType: "club", clubId: "club-1" }, "member")
        .allowed,
    ).toBe(false);
    expect(roleMayUseModule("school_admin", platformAdmin)).toBe(false);
    expect(
      enableGuard(
        platformAdmin,
        { scopeType: "school", schoolId: "school-1" },
        "school_admin",
      ).allowed,
    ).toBe(false);
  });

  it("rejects enabling platform modules on a school scope", () => {
    const result = enableGuard(platformAdmin, {
      scopeType: "school",
      schoolId: "school-1",
    });
    expect(result.allowed).toBe(false);
  });

  it("allows school staff modules on a school scope", () => {
    expect(
      enableGuard(schoolClubs, {
        scopeType: "school",
        schoolId: "school-1",
      }).allowed,
    ).toBe(true);
  });
});

describe("config hierarchy", () => {
  it("lets school override win for enable and order, then applies permission filter", () => {
    const catalog = DASHBOARD_MODULE_REGISTRY.filter((module) =>
      ["insights", "school-clubs", "school-learning"].includes(module.id),
    );
    const resolved = resolveScopedModules(
      catalog,
      [
        {
          module_id: "school-learning",
          scope_type: "global",
          school_id: null,
          club_id: null,
          enabled: true,
          display_order: 10,
        },
        {
          module_id: "school-learning",
          scope_type: "school",
          school_id: "school-1",
          club_id: null,
          enabled: false,
          display_order: 90,
        },
        {
          module_id: "insights",
          scope_type: "school",
          school_id: "school-1",
          club_id: null,
          enabled: true,
          display_order: 5,
        },
      ],
      { scopeType: "school", schoolId: "school-1" },
      { applyPermissionFilter: true, role: "staff" },
    );

    const learning = resolved.find((module) => module.id === "school-learning");
    const insights = resolved.find((module) => module.id === "insights");
    expect(learning?.enabled).toBe(false);
    expect(learning?.resolved_order).toBe(90);
    expect(insights?.enabled).toBe(false);
    expect(roleMayUseModule("staff", insights!)).toBe(false);
  });

  it("never treats a hidden module as a permission grant", () => {
    const comms = DASHBOARD_MODULE_REGISTRY.find(
      (module) => module.id === "club-comms",
    )!;
    const resolved = resolveScopedModules(
      [comms],
      [
        {
          module_id: "club-comms",
          scope_type: "club",
          school_id: null,
          club_id: "club-1",
          enabled: true,
          display_order: 0,
        },
      ],
      { scopeType: "club", clubId: "club-1" },
      { applyPermissionFilter: true, role: "member" },
    );
    expect(resolved[0]?.enabled).toBe(false);
    expect(roleMayUseModule("member", comms)).toBe(false);
  });

  it("keeps mandatory modules enabled even if an override tries to disable them", () => {
    const home = DASHBOARD_MODULE_REGISTRY.find((module) => module.id === "home")!;
    const resolved = resolveScopedModules(
      [home],
      [
        {
          module_id: "home",
          scope_type: "global",
          school_id: null,
          club_id: null,
          enabled: false,
          display_order: 0,
        },
      ],
      { scopeType: "global" },
    );
    expect(resolved[0]?.enabled).toBe(true);
    expect(resolved[0]?.disableBlockedReason).toMatch(/mandatory/i);
  });
});
