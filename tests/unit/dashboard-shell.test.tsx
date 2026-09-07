import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContextSwitcher } from "@/components/dashboard/context-switcher";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  filterContextsByQuery,
  hintFromPathname,
  isModuleVisible,
  modulesForSurface,
  resolveVisibleCatalogModules,
  selectActiveContext,
  SHELL_MODULE_CATALOG,
} from "@/components/dashboard/nav-modules";
import type {
  DashboardContextOption,
  DashboardPermissions,
  ResolvedDashboardModule,
} from "@/components/dashboard/types";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/dashboard",
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);
Element.prototype.scrollIntoView = vi.fn();

const personal: DashboardContextOption = {
  type: "personal",
  id: "personal",
  label: "Personal",
  href: "/dashboard",
};

const robotics: DashboardContextOption = {
  type: "club",
  id: "club:robotics",
  label: "Robotics",
  href: "/clubs/robotics",
  clubSlug: "robotics",
  clubId: "club-1",
};

const lincoln: DashboardContextOption = {
  type: "school",
  id: "school:lincoln",
  label: "Lincoln High",
  href: "/dashboard/schools/school-1",
  schoolId: "school-1",
  schoolSlug: "lincoln-high",
};

const studentPermissions: DashboardPermissions = {
  isPlatformAdmin: false,
  canAccessAdminConsole: false,
  canAccessSchoolDashboard: false,
};

const schoolAdminPermissions: DashboardPermissions = {
  isPlatformAdmin: false,
  canAccessAdminConsole: false,
  canAccessSchoolDashboard: true,
};

function sampleModules(): ResolvedDashboardModule[] {
  return resolveVisibleCatalogModules({
    contextType: "personal",
    permissions: studentPermissions,
  });
}

describe("dashboard context authorization", () => {
  it("falls back to personal when a club hint is not authorized", () => {
    const active = selectActiveContext([personal, lincoln], {
      context: "club",
      club: "robotics",
    });
    expect(active.id).toBe("personal");
  });

  it("does not select platform unless that context was authorized", () => {
    const active = selectActiveContext([personal, robotics], {
      context: "platform",
      pathname: "/admin",
    });
    expect(active.type).toBe("personal");
  });

  it("selects an authorized school from the URL", () => {
    const hint = hintFromPathname("/dashboard/schools/school-1/extra");
    const active = selectActiveContext([personal, lincoln], hint);
    expect(active.id).toBe("school:lincoln");
  });

  it("filters the switcher list by name without adding unauthorized rows", () => {
    const authorized = [personal, robotics];
    const matches = filterContextsByQuery(authorized, "robo");
    expect(matches.map((item) => item.id)).toEqual(["club:robotics"]);
    expect(matches.some((item) => item.type === "school")).toBe(false);
    expect(matches.some((item) => item.id === "platform")).toBe(false);
  });

  it("hides school modules from students and platform modules from non-admins", () => {
    const studentModules = resolveVisibleCatalogModules({
      contextType: "personal",
      permissions: studentPermissions,
    });
    expect(studentModules.some((module) => module.id === "school-clubs")).toBe(
      false,
    );
    expect(studentModules.some((module) => module.id === "platform-admin")).toBe(
      false,
    );

    const schoolModules = resolveVisibleCatalogModules({
      contextType: "school",
      permissions: schoolAdminPermissions,
    });
    expect(schoolModules.some((module) => module.id === "school-clubs")).toBe(
      true,
    );
    expect(schoolModules.some((module) => module.id === "platform-admin")).toBe(
      false,
    );
  });
});

describe("dashboard module visibility", () => {
  it("keeps deprecated and flagged modules hidden", () => {
    const flagged = {
      ...SHELL_MODULE_CATALOG[0],
      featureFlag: "beta-home",
    };
    const deprecated = {
      ...SHELL_MODULE_CATALOG[0],
      status: "deprecated" as const,
    };
    expect(isModuleVisible(flagged, "personal", [])).toBe(false);
    expect(isModuleVisible(flagged, "personal", ["beta-home"])).toBe(true);
    expect(isModuleVisible(deprecated, "personal", [])).toBe(false);
  });

  it("keeps mandatory modules reachable on mobile even when marked hidden", () => {
    const hiddenMandatory: ResolvedDashboardModule = {
      ...SHELL_MODULE_CATALOG.find((module) => module.id === "home")!,
      mobileVisibility: "hidden",
      mandatory: true,
    };
    const hiddenOptional: ResolvedDashboardModule = {
      ...SHELL_MODULE_CATALOG.find((module) => module.id === "club-media")!,
      contextTypes: ["personal"],
      mobileVisibility: "hidden",
      mandatory: false,
    };
    const mobile = modulesForSurface([hiddenMandatory, hiddenOptional], "mobile");
    expect(mobile.map((module) => module.id)).toEqual(["home"]);
  });
});

describe("ContextSwitcher", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("lists only authorized contexts and navigates from the filtered list", async () => {
    const user = userEvent.setup();
    render(
      <ContextSwitcher
        contexts={[personal, robotics, lincoln]}
        activeContextId="personal"
      />,
    );

    expect(screen.getByLabelText("Workspace")).toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "Workspace" }));
    expect(screen.getByRole("option", { name: /Robotics/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Platform/ })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Filter workspaces"), "linc");
    expect(screen.queryByRole("option", { name: /Robotics/ })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Lincoln High/ })).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(push).toHaveBeenCalledWith("/dashboard/schools/school-1");
  });

  it("does not render an unauthorized platform option", () => {
    render(
      <ContextSwitcher
        contexts={[personal, robotics]}
        activeContextId="personal"
      />,
    );
    expect(screen.queryByText("Platform")).not.toBeInTheDocument();
  });
});

describe("dashboard shell breakpoints", () => {
  it("keeps the desktop sidebar out of the 375px column", () => {
    const { container } = render(
      <DashboardSidebar modules={sampleModules()} pathname="/dashboard" />,
    );
    const aside = container.querySelector("[data-slot='dashboard-sidebar']");
    expect(aside).toBeTruthy();
    expect(aside).toHaveClass("hidden");
    expect(aside).toHaveClass("md:flex");
    expect(aside).toHaveClass("w-64");
  });

  it("exposes mobile navigation only below md", async () => {
    const user = userEvent.setup();
    render(
      <DashboardMobileNav modules={sampleModules()} pathname="/dashboard" />,
    );
    const wrapper = document.querySelector("[data-slot='dashboard-mobile-nav']");
    expect(wrapper).toHaveClass("md:hidden");

    await user.click(screen.getByRole("button", { name: "Open dashboard modules" }));
    expect(
      screen.getByRole("navigation", { name: "Dashboard modules" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
  });
});
