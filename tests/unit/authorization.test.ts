import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import {
  requireClubAdmin,
  requireClubOfficer,
  requireCommitteeReviewer,
  requirePlatformAdmin,
  requireSchoolAccess,
  requireUser,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

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
) {
  const chains: ReturnType<typeof query>[] = [];
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
      chains.push(next);
      return next;
    }),
  };
  vi.mocked(createClient).mockResolvedValue(
    client as unknown as Awaited<ReturnType<typeof createClient>>,
  );
  return { client, chains };
}

describe("server authorization helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an authoritative Supabase user", async () => {
    setupClient({});
    await expect(requireUser()).resolves.toMatchObject({ id: "user-1" });
  });

  it("rejects an expired or missing session", async () => {
    setupClient({}, null);
    await expect(requireUser()).rejects.toMatchObject({
      code: "AUTH_REQUIRED",
    });
  });

  it("allows an active platform administrator assignment", async () => {
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      platform_role_assignments: [
        query({ data: { id: "assignment-1" }, error: null }),
      ],
    });
    await expect(requirePlatformAdmin()).resolves.toMatchObject({
      id: "user-1",
    });
  });

  it("denies committee review without a persisted assignment", async () => {
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      platform_role_assignments: [query({ data: null, error: null })],
    });
    await expect(requireCommitteeReviewer()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows committee surfaces for platform administrators", async () => {
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      platform_role_assignments: [
        query({ data: { id: "assignment-admin" }, error: null }),
      ],
    });
    await expect(requireCommitteeReviewer()).resolves.toMatchObject({
      id: "user-1",
    });
  });

  it("allows school access through active school membership", async () => {
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      platform_role_assignments: [query({ data: null, error: null })],
      user_school_memberships: [
        query({ data: { id: "membership-1" }, error: null }),
      ],
    });
    await expect(requireSchoolAccess("school-1")).resolves.toMatchObject({
      id: "user-1",
    });
  });

  it("limits officer access to operational club roles", async () => {
    const officerQuery = query({ data: { id: "membership-1" }, error: null });
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      club_memberships: [officerQuery],
    });

    await expect(requireClubOfficer("club-1")).resolves.toMatchObject({
      id: "user-1",
    });
    expect(officerQuery.in).toHaveBeenCalledWith(
      "role",
      expect.not.arrayContaining(["member"]),
    );
  });

  it("denies club administration without club_admin membership", async () => {
    setupClient({
      account_onboarding: [query({ data: { status: "active" }, error: null })],
      club_memberships: [query({ data: null, error: null })],
    });
    await expect(requireClubAdmin("club-1")).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
