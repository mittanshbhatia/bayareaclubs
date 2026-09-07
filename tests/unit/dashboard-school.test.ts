import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import {
  AuthorizationError,
  requireSchoolAccess,
  requireSchoolDashboardAccess,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  buildSchoolActionItems,
  buildSchoolShortcuts,
  clubStatusToBadge,
  formatLabel,
  isSchoolDashboardRole,
  isSchoolRouteParamUuid,
  resolveSchoolForDashboard,
  workflowStatusToBadge,
} from "@/features/dashboard/school";

type QueryResult = { data: unknown; error: null | { message: string } };

function query(result: QueryResult) {
  const chain: Record<string, unknown> = {};
  const self = chain as {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    is: ReturnType<typeof vi.fn>;
    in: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
    then: (
      resolve: (value: QueryResult) => unknown,
      reject?: (reason: unknown) => unknown,
    ) => Promise<unknown>;
  };
  self.select = vi.fn().mockReturnValue(self);
  self.eq = vi.fn().mockReturnValue(self);
  self.is = vi.fn().mockReturnValue(self);
  self.in = vi.fn().mockReturnValue(self);
  self.limit = vi.fn().mockReturnValue(self);
  self.order = vi.fn().mockReturnValue(self);
  self.maybeSingle = vi.fn().mockResolvedValue(result);
  self.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return self;
}

function setupClient(
  results: Record<string, ReturnType<typeof query>[]>,
  user: { id: string } | null = { id: "user-1" },
) {
  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: user ? null : { message: "invalid session" },
      }),
    },
    from: vi.fn((table: string) => {
      const next = results[table]?.shift();
      if (!next) throw new Error(`No mock query for ${table}`);
      return next;
    }),
  };
  vi.mocked(createClient).mockResolvedValue(
    client as unknown as Awaited<ReturnType<typeof createClient>>,
  );
  return client;
}

function activeAccount() {
  return {
    account_onboarding: [query({ data: { status: "active" }, error: null })],
  };
}

describe("school dashboard authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("treats only school_admin, school_advisor, and staff as dashboard roles", () => {
    expect(isSchoolDashboardRole("school_admin")).toBe(true);
    expect(isSchoolDashboardRole("school_advisor")).toBe(true);
    expect(isSchoolDashboardRole("staff")).toBe(true);
    expect(isSchoolDashboardRole("student")).toBe(false);
    expect(isSchoolDashboardRole(null)).toBe(false);
  });

  it("accepts a school UUID or slug in the route param", () => {
    expect(isSchoolRouteParamUuid("2f1d4c3a-8b9e-4a11-9c22-0d3e4f5a6b7c")).toBe(
      true,
    );
    expect(isSchoolRouteParamUuid("lincoln-high")).toBe(false);
    expect(isSchoolRouteParamUuid("not-a-uuid")).toBe(false);
  });

  it("denies students even with an active school membership", async () => {
    const membershipQuery = query({ data: null, error: null });
    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [membershipQuery],
    });

    await expect(
      requireSchoolDashboardAccess("school-1"),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(membershipQuery.in).toHaveBeenCalledWith(
      "role",
      expect.arrayContaining(["school_admin", "school_advisor", "staff"]),
    );
    expect(membershipQuery.in).toHaveBeenCalledWith(
      "role",
      expect.not.arrayContaining(["student"]),
    );
  });

  it("still allows students through requireSchoolAccess, which is too broad for this route", async () => {
    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [
        query({ data: { id: "mem-1" }, error: null }),
      ],
    });

    await expect(requireSchoolAccess("school-1")).resolves.toMatchObject({
      id: "user-1",
    });
  });

  it("allows school administrators, advisors, and staff from persisted memberships", async () => {
    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [
        query({ data: { id: "mem-1", role: "school_admin" }, error: null }),
      ],
    });
    await expect(
      requireSchoolDashboardAccess("school-1"),
    ).resolves.toMatchObject({ id: "user-1" });

    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [
        query({ data: { id: "mem-2", role: "school_advisor" }, error: null }),
      ],
    });
    await expect(
      requireSchoolDashboardAccess("school-1"),
    ).resolves.toMatchObject({ id: "user-1" });

    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [
        query({ data: { id: "mem-3", role: "staff" }, error: null }),
      ],
    });
    await expect(
      requireSchoolDashboardAccess("school-1"),
    ).resolves.toMatchObject({ id: "user-1" });
  });

  it("allows platform administrators without a school membership", async () => {
    setupClient({
      ...activeAccount(),
      platform_role_assignments: [
        query({ data: { id: "assignment-1" }, error: null }),
      ],
      user_school_memberships: [query({ data: null, error: null })],
    });

    await expect(
      requireSchoolDashboardAccess("school-1"),
    ).resolves.toMatchObject({ id: "user-1" });
  });

  it("denies an active user with no qualifying assignment", async () => {
    setupClient({
      ...activeAccount(),
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [query({ data: null, error: null })],
    });

    await expect(requireSchoolDashboardAccess("school-1")).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });

  it("resolves a school by UUID or slug", async () => {
    const uuid = "2f1d4c3a-8b9e-4a11-9c22-0d3e4f5a6b7c";
    const school = {
      id: uuid,
      name: "Lincoln High",
      slug: "lincoln-high",
      level: "high",
      city: "San Jose",
    };

    const uuidQuery = query({ data: school, error: null });
    setupClient({ schools: [uuidQuery] });
    await expect(resolveSchoolForDashboard(uuid)).resolves.toEqual(school);
    expect(uuidQuery.eq).toHaveBeenCalledWith("id", uuid);

    const slugQuery = query({ data: school, error: null });
    setupClient({ schools: [slugQuery] });
    await expect(resolveSchoolForDashboard("lincoln-high")).resolves.toEqual(
      school,
    );
    expect(slugQuery.eq).toHaveBeenCalledWith("slug", "lincoln-high");
  });
});

describe("school dashboard aggregates", () => {
  it("emits action items only when real review or deadline data exists", () => {
    expect(
      buildSchoolActionItems({
        ideasAwaitingReview: [],
        renewalsDue: [],
        chartersExpiring: [],
      }),
    ).toEqual([]);

    const items = buildSchoolActionItems({
      ideasAwaitingReview: [
        { id: "idea-1", title: "Robotics expansion", href: null },
      ],
      renewalsDue: [
        {
          id: "ren-1",
          clubName: "Robotics",
          status: "submitted",
          href: "/clubs/robotics/charter/renewal",
        },
      ],
      chartersExpiring: [
        {
          id: "ch-1",
          clubName: "Debate",
          daysLeft: 9,
          href: "/clubs/debate/charter",
        },
      ],
    });

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.title)).toEqual([
      "Robotics expansion is awaiting review",
      "Robotics renewal is open",
      "Debate charter expires in 9 days",
    ]);
    expect(JSON.stringify(items)).not.toMatch(/@|email|address/i);
  });

  it("does not invent admin routes the actor cannot open", () => {
    const schoolOnly = buildSchoolShortcuts({
      schoolId: "school-1",
      hasAdminConsole: false,
      isPlatformAdmin: false,
      firstManagedClubSlug: "robotics",
    });
    expect(schoolOnly.map((item) => item.id)).toEqual([
      "personal-home",
      "resources",
      "managed-club",
    ]);
    expect(schoolOnly.some((item) => item.href.startsWith("/admin"))).toBe(
      false,
    );

    const admin = buildSchoolShortcuts({
      schoolId: "school-1",
      hasAdminConsole: true,
      isPlatformAdmin: true,
      firstManagedClubSlug: null,
    });
    expect(admin.map((item) => item.href)).toEqual(
      expect.arrayContaining([
        "/admin/ideas?school=school-1",
        "/admin/charters",
        "/admin/renewals",
        "/admin/insights?schoolId=school-1",
        "/dashboard/platform",
      ]),
    );
  });

  it("maps statuses without exposing private roster fields", () => {
    expect(clubStatusToBadge("active")).toBe("active");
    expect(clubStatusToBadge("inactive")).toBe("pending");
    expect(workflowStatusToBadge("submitted")).toBe("active");
    expect(workflowStatusToBadge("changes_requested")).toBe("pending");
    expect(formatLabel("school_admin")).toBe("school admin");
  });
});
