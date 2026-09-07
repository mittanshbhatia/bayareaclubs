import { describe, expect, it } from "vitest";

import {
  dashboardContextHintSchema,
  dashboardHomePayloadSchema,
  dashboardModuleConfigSchema,
  dashboardUserPreferenceSchema,
} from "@/lib/validation/dashboard";

describe("dashboard validation", () => {
  it("accepts URL hints and ignores unused selector fields", () => {
    expect(
      dashboardContextHintSchema.safeParse({
        type: "club",
        clubSlug: "robotics-club",
      }).success,
    ).toBe(true);
    expect(
      dashboardContextHintSchema.safeParse({
        type: "school",
        schoolRef: "homestead-high-school",
      }).success,
    ).toBe(true);
  });

  it("rejects forged authority fields on hints", () => {
    expect(
      dashboardContextHintSchema.safeParse({
        type: "school",
        schoolRef: "homestead-high-school",
        role: "school_admin",
        school_id: "00000000-0000-4000-8000-000000000099",
        club_id: "00000000-0000-4000-8000-000000000098",
      }).success,
    ).toBe(false);
  });

  it("requires a club or school id when that context is persisted", () => {
    expect(
      dashboardUserPreferenceSchema.safeParse({
        lastContextType: "club",
        hiddenModuleIds: [],
        moduleOrder: [],
      }).success,
    ).toBe(false);
    expect(
      dashboardUserPreferenceSchema.safeParse({
        lastContextType: "school",
        lastSchoolId: "00000000-0000-4000-8000-000000000011",
        hiddenModuleIds: [],
        moduleOrder: [],
      }).success,
    ).toBe(true);
  });

  it("validates module config scope shapes", () => {
    expect(
      dashboardModuleConfigSchema.safeParse({
        moduleId: "insights",
        scopeType: "global",
        enabled: true,
        displayOrder: 12,
      }).success,
    ).toBe(true);
    expect(
      dashboardModuleConfigSchema.safeParse({
        moduleId: "insights",
        scopeType: "school",
        enabled: false,
      }).success,
    ).toBe(false);
  });

  it("rejects HTML in home content payloads", () => {
    expect(
      dashboardHomePayloadSchema.safeParse({
        type: "announcement",
        payload: {
          title: "Hello",
          body: "<script>alert(1)</script>",
        },
      }).success,
    ).toBe(false);
    expect(
      dashboardHomePayloadSchema.safeParse({
        type: "deadline",
        payload: {
          title: "Charter due",
          dueAt: "2026-09-15T17:00:00-07:00",
          href: "/clubs/robotics-club/charter",
        },
      }).success,
    ).toBe(true);
  });
});
