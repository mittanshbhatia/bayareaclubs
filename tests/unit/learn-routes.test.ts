import { describe, expect, it } from "vitest";

import { SHELL_MODULE_CATALOG, isModuleActive } from "@/components/dashboard/nav-modules";
import { DASHBOARD_MODULE_REGISTRY } from "@/features/dashboard-config/registry";
import {
  COURSES_CATALOG_PATH,
  courseContentHref,
  coursesCatalogHref,
  isCoursesNavPath,
} from "@/features/learn/routes";

describe("courses catalog routes", () => {
  it("keeps the public catalog at /courses and course content on the learn player", () => {
    expect(COURSES_CATALOG_PATH).toBe("/courses");
    expect(coursesCatalogHref("math")).toBe("/courses?family=math");
    expect(courseContentHref("ap-calc-ab")).toBe("/dashboard/learn/ap/ap-calc-ab");
    expect(isCoursesNavPath("/courses")).toBe(true);
    expect(isCoursesNavPath("/dashboard/learn")).toBe(true);
    expect(isCoursesNavPath("/resources")).toBe(false);
  });

  it("points Courses nav at /courses and treats legacy learn URLs as active", () => {
    expect(
      SHELL_MODULE_CATALOG.find((module) => module.id === "learning")?.route,
    ).toBe("/courses");
    expect(
      DASHBOARD_MODULE_REGISTRY.find((module) => module.id === "learning")?.route,
    ).toBe("/courses");
    expect(isModuleActive("/courses", "/courses")).toBe(true);
    expect(isModuleActive("/courses", "/dashboard/learn/ap/ap-csa")).toBe(true);
    expect(isModuleActive("/courses", "/resources")).toBe(false);
  });
});
