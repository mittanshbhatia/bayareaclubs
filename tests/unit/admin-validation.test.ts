import { describe, expect, it } from "vitest";

import {
  assignPlatformRoleSchema,
  revokePlatformRoleSchema,
  schoolUpsertSchema,
  slugFromName,
} from "@/lib/validation/admin";

describe("admin validation", () => {
  it("builds kebab-case slugs from school names", () => {
    expect(slugFromName("Mission High School")).toBe("mission-high-school");
  });

  it("accepts school upserts without home addresses", () => {
    const parsed = schoolUpsertSchema.safeParse({
      name: "Mission High",
      slug: "mission-high",
      level: "high",
      city: "San Francisco",
      stateCode: "CA",
      emailDomain: "mission.edu",
      isActive: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("requires explicit confirmation for role assignment", () => {
    expect(
      assignPlatformRoleSchema.safeParse({
        userId: "00000000-0000-4000-8000-000000000001",
        role: "committee_reviewer",
        confirm: false,
      }).success,
    ).toBe(false);
    expect(
      assignPlatformRoleSchema.safeParse({
        userId: "00000000-0000-4000-8000-000000000001",
        role: "platform_admin",
        confirm: true,
      }).success,
    ).toBe(true);
  });

  it("requires explicit confirmation for role revocation", () => {
    expect(
      revokePlatformRoleSchema.safeParse({
        assignmentId: "00000000-0000-4000-8000-000000000002",
        confirm: true,
      }).success,
    ).toBe(true);
  });
});
