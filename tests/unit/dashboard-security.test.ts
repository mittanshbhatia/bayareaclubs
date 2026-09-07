import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { adminSectionsForRoles } from "@/features/admin/sections";
import {
  deriveDashboardContext,
  isSchoolDashboardRole,
  type DashboardActor,
} from "@/features/dashboard/context";
import { DASHBOARD_MODULE_BY_ID } from "@/features/dashboard-config/registry";
import {
  enableGuard,
  resolveScopedModules,
  roleMayUseModule,
} from "@/features/dashboard-config/resolve";
import {
  AuthorizationError,
  requireAdminConsoleAccess,
  requireClubManager,
  requireClubMember,
  requireClubOfficer,
  requireCommitteeReviewer,
  requirePlatformAdmin,
  requireSchoolAccess,
  requireSchoolDashboardAccess,
} from "@/lib/auth/authorization";
import { requireCronBearer } from "@/lib/security/cron-auth";
import { createClient } from "@/lib/supabase/server";
import { dashboardContextHintSchema } from "@/lib/validation/dashboard";
import { mediaSignedUrlSchema } from "@/lib/validation/media";

type QueryResult = { data: unknown; error: null | { message: string } };

function query(result: QueryResult) {
  const chain = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    in: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
  Object.values(chain).forEach((method) => {
    if (method !== chain.maybeSingle) method.mockReturnValue(chain);
  });
  return chain;
}

function setupClient(
  results: Record<string, ReturnType<typeof query>[]>,
  user: { id: string } | null = { id: "user-1" },
  rpcResult: { data: unknown; error: null | { message: string } } = {
    data: false,
    error: null,
  },
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
    rpc: vi.fn().mockResolvedValue(rpcResult),
  };
  vi.mocked(createClient).mockResolvedValue(
    client as unknown as Awaited<ReturnType<typeof createClient>>,
  );
  return client;
}

function activeUserQueries(copies = 1) {
  return {
    account_onboarding: Array.from({ length: copies }, () =>
      query({ data: { status: "active" }, error: null }),
    ),
  };
}

function srcFile(...parts: string[]) {
  return path.join(process.cwd(), "src", ...parts);
}

function walkTsFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
      continue;
    }
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

const studentActor: DashboardActor = {
  userId: "user-student",
  isPlatformAdmin: false,
  isCommitteeReviewer: false,
  schoolMemberships: [
    {
      schoolId: "11111111-1111-4111-8111-111111111111",
      schoolSlug: "school-a",
      schoolName: "School A",
      role: "student",
    },
  ],
  clubMemberships: [
    {
      clubId: "22222222-2222-4222-8222-222222222222",
      clubSlug: "club-a",
      clubName: "Club A",
      schoolId: "11111111-1111-4111-8111-111111111111",
      role: "member",
    },
  ],
};

const reviewerActor: DashboardActor = {
  userId: "user-reviewer",
  isPlatformAdmin: false,
  isCommitteeReviewer: true,
  schoolMemberships: [],
  clubMemberships: [],
};

describe("dashboard hostile authorization (all DENY)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("AM-01 cross-club private data", () => {
    it("denies club membership for a club the actor does not belong to", async () => {
      setupClient({
        ...activeUserQueries(),
        club_memberships: [query({ data: null, error: null })],
      });
      await expect(requireClubMember("club-b")).rejects.toMatchObject({
        code: "FORBIDDEN",
        name: "AuthorizationError",
      });
    });

    it("denies officer tools on a foreign club", async () => {
      setupClient({
        ...activeUserQueries(),
        club_memberships: [query({ data: null, error: null })],
      });
      await expect(requireClubOfficer("club-b")).rejects.toBeInstanceOf(
        AuthorizationError,
      );
    });

    it("denies club manager when membership and can_manage_club are absent", async () => {
      const client = setupClient(
        {
          ...activeUserQueries(),
          club_memberships: [query({ data: null, error: null })],
        },
        { id: "user-1" },
        { data: false, error: null },
      );
      await expect(requireClubManager("club-b")).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
      expect(client.rpc).toHaveBeenCalledWith("can_manage_club", {
        target_club_id: "club-b",
      });
    });
  });

  describe("AM-02 cross-school admin", () => {
    it("denies school access without a persisted membership or platform_admin", async () => {
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
        user_school_memberships: [query({ data: null, error: null })],
      });
      await expect(requireSchoolAccess("school-b")).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("AM-03 student opens school command center", () => {
    it("denies a student via requireSchoolDashboardAccess", async () => {
      const membershipQuery = query({ data: null, error: null });
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
        user_school_memberships: [membershipQuery],
      });
      await expect(
        requireSchoolDashboardAccess("school-a"),
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
      expect(membershipQuery.in).toHaveBeenCalledWith(
        "role",
        expect.not.arrayContaining(["student"]),
      );
      expect(membershipQuery.in).toHaveBeenCalledWith(
        "role",
        expect.arrayContaining(["school_admin", "school_advisor", "staff"]),
      );
    });

    it("does not treat student as a school dashboard role", () => {
      expect(isSchoolDashboardRole("student")).toBe(false);
      expect(isSchoolDashboardRole("school_admin")).toBe(true);
    });

    it("school hint for a student falls back to personal", () => {
      const resolved = deriveDashboardContext({
        actor: studentActor,
        hint: {
          type: "school",
          schoolRef: "11111111-1111-4111-8111-111111111111",
        },
      });
      expect(resolved.activeContext.type).toBe("personal");
      expect(
        resolved.availableContexts.some((context) => context.type === "school"),
      ).toBe(false);
      expect(resolved.permissions.canAccessSchoolDashboard).toBe(false);
    });

    it("school command page loads through requireSchoolDashboardAccess", () => {
      const schoolLoader = readFileSync(
        srcFile("features/dashboard/school.ts"),
        "utf8",
      );
      expect(schoolLoader).toContain(
        'requireSchoolDashboardAccess',
      );
      expect(schoolLoader).toMatch(
        /from "@\/lib\/auth\/authorization"/,
      );
      expect(schoolLoader).toContain("loadSchoolDashboard");
      expect(schoolLoader).toContain("await requireSchoolDashboardAccess");
    });
  });

  describe("AM-04 forged school_id / club_id / role query hints", () => {
    it("rejects school_id, club_id, and role as hint fields", () => {
      expect(
        dashboardContextHintSchema.safeParse({
          type: "school",
          school_id: "11111111-1111-4111-8111-111111111111",
          club_id: "22222222-2222-4222-8222-222222222222",
          role: "platform_admin",
        }).success,
      ).toBe(false);
    });

    it("does not treat query-string school_id as requireSchoolAccess authority", async () => {
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
        user_school_memberships: [query({ data: null, error: null })],
      });
      await expect(
        requireSchoolAccess("00000000-0000-4000-8000-000000000099"),
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("unauthorized club or school hint falls back to personal", () => {
      const resolved = deriveDashboardContext({
        actor: studentActor,
        hint: { type: "club", clubSlug: "club-b" },
      });
      expect(resolved.activeContext.type).toBe("personal");
    });

    it("authorization helpers have no role-hint overload", () => {
      expect(requireSchoolAccess.length).toBe(1);
      expect(requireClubMember.length).toBe(1);
      expect(requireSchoolDashboardAccess.length).toBe(1);
      expect(requirePlatformAdmin.length).toBe(0);
    });
  });

  describe("AM-05 disabled nav module cannot escalate", () => {
    it("committee reviewer nav never includes platform-only dashboard-config", () => {
      const sections = adminSectionsForRoles(["committee_reviewer"]);
      expect(sections.map((section) => section.key)).not.toContain(
        "dashboard-config",
      );
      expect(sections.map((section) => section.key)).not.toContain("audit");
    });

    it("student cannot use a school command module even when enabled", () => {
      expect(
        roleMayUseModule("student", {
          required_permissions: ["school.dashboard"],
        }),
      ).toBe(false);
      const schoolClubs = DASHBOARD_MODULE_BY_ID["school-clubs"];
      expect(
        enableGuard(
          schoolClubs,
          { scopeType: "school", schoolId: "school-a" },
          "student",
        ).allowed,
      ).toBe(false);
      const resolved = resolveScopedModules(
        [schoolClubs],
        [
          {
            module_id: "school-clubs",
            scope_type: "school",
            school_id: "school-a",
            club_id: null,
            enabled: true,
            display_order: 0,
          },
        ],
        { scopeType: "school", schoolId: "school-a" },
        { applyPermissionFilter: true, role: "student" },
      );
      expect(resolved[0]?.enabled).toBe(false);
    });

    it("enabling platform-admin for a reviewer still DENYs the permission", () => {
      const platformAdmin = DASHBOARD_MODULE_BY_ID["platform-admin"];
      expect(
        roleMayUseModule("committee_reviewer", platformAdmin),
      ).toBe(false);
      const resolved = resolveScopedModules(
        [platformAdmin],
        [
          {
            module_id: "platform-admin",
            scope_type: "global",
            school_id: null,
            club_id: null,
            enabled: true,
            display_order: 0,
          },
        ],
        { scopeType: "global" },
        { applyPermissionFilter: true, role: "committee_reviewer" },
      );
      expect(resolved[0]?.enabled).toBe(false);
    });
  });

  describe("AM-09 cron without Bearer", () => {
    it("denies a request with no Authorization header", async () => {
      vi.stubEnv("CRON_SECRET", "unit-cron-secret");
      const denied = requireCronBearer(
        new Request("http://localhost/api/cron/refresh-analytics"),
      );
      expect(denied).not.toBeNull();
      expect(denied?.status).toBe(401);
      await expect(denied?.json()).resolves.toMatchObject({ ok: false });
    });

    it("denies a query-string secret (Referer/log leak)", async () => {
      vi.stubEnv("CRON_SECRET", "unit-cron-secret");
      const denied = requireCronBearer(
        new Request(
          "http://localhost/api/cron/refresh-analytics?secret=unit-cron-secret&CRON_SECRET=unit-cron-secret&token=unit-cron-secret",
        ),
      );
      expect(denied?.status).toBe(401);
    });

    it("denies a wrong Bearer token", async () => {
      vi.stubEnv("CRON_SECRET", "unit-cron-secret");
      const denied = requireCronBearer(
        new Request("http://localhost/api/cron/refresh-analytics", {
          headers: { authorization: "Bearer other-secret" },
        }),
      );
      expect(denied?.status).toBe(401);
    });

    it("denies a non-Bearer scheme even with the correct secret", async () => {
      vi.stubEnv("CRON_SECRET", "unit-cron-secret");
      const denied = requireCronBearer(
        new Request("http://localhost/api/cron/refresh-analytics", {
          headers: { authorization: "unit-cron-secret" },
        }),
      );
      expect(denied?.status).toBe(401);
    });

    it("fails closed when CRON_SECRET is missing", async () => {
      vi.stubEnv("CRON_SECRET", "");
      const denied = requireCronBearer(
        new Request("http://localhost/api/cron/refresh-analytics", {
          headers: { authorization: "Bearer unit-cron-secret" },
        }),
      );
      expect(denied?.status).toBe(503);
    });

    it("every cron route handler calls requireCronBearer first", () => {
      const files = walkTsFiles(srcFile("app/api/cron"));
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) {
        expect(readFileSync(file, "utf8"), file).toContain("requireCronBearer");
      }
    });
  });

  describe("AM-10 storage path guessing", () => {
    it("signed-URL schema rejects a non-uuid and ignores a guessed path", () => {
      expect(
        mediaSignedUrlSchema.safeParse({
          storagePath: "course-assets/secret/lesson.pdf",
          path: "guessed/object",
        }).success,
      ).toBe(false);
    });

    it("does not accept storagePath as an authority field", () => {
      const parsed = mediaSignedUrlSchema.safeParse({
        mediaAssetId: "11111111-1111-4111-8111-111111111111",
        storagePath: "course-assets/secret/lesson.pdf",
        path: "guessed/object",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).not.toHaveProperty("storagePath");
        expect(parsed.data).not.toHaveProperty("path");
      }
    });

    it("media signing looks up media_assets by id, not a caller-supplied path", () => {
      const source = readFileSync(srcFile("features/media/actions.ts"), "utf8");
      expect(source).toContain("createMediaSignedUrl");
      expect(source).toMatch(/\.from\("media_assets"\)/);
      expect(source).toMatch(/createSignedUrl\(\s*asset\.storage_path/);
      expect(source).not.toMatch(
        /createSignedUrl\(\s*(input|parsed|path|storagePath)/,
      );
    });
  });

  describe("AM-12 committee reviewer is not platform context", () => {
    it("denies requirePlatformAdmin without a platform_admin assignment", async () => {
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
      });
      await expect(requirePlatformAdmin()).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });

    it("requireAdminConsoleAccess still requires a persisted assignment", async () => {
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
      });
      await expect(requireAdminConsoleAccess()).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });

    it("requireCommitteeReviewer denies when no assignment exists", async () => {
      setupClient({
        ...activeUserQueries(),
        platform_role_assignments: [query({ data: null, error: null })],
      });
      await expect(requireCommitteeReviewer()).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });

    it("platform hint for a reviewer falls back to personal", () => {
      const resolved = deriveDashboardContext({
        actor: reviewerActor,
        hint: { type: "platform" },
      });
      expect(resolved.activeContext.type).toBe("personal");
      expect(
        resolved.availableContexts.some((context) => context.type === "platform"),
      ).toBe(false);
      expect(resolved.permissions.canAccessPlatform).toBe(false);
    });

    it("platform dashboard route requires platform_admin, not committee reviewer", () => {
      const source = readFileSync(
        srcFile("app/(dashboard)/dashboard/platform/page.tsx"),
        "utf8",
      );
      expect(source).toContain("requirePlatformAdmin");
      expect(source).not.toContain("requireCommitteeReviewer");
      expect(source).not.toContain("requireAdminConsoleAccess");
    });
  });
});
