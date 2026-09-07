import { describe, expect, it } from "vitest";

import {
  containsHtmlOrScript,
  deadlinePayloadSchema,
  extractHomeContentBody,
  parseDashboardHomePayload,
  upsertDashboardHomeContentSchema,
} from "@/lib/validation/dashboard-home-content";
import { sanitizePlainText } from "@/lib/validation/communications";

const schoolId = "11111111-1111-4111-8111-111111111111";
const courseId = "22222222-2222-4222-8222-222222222222";
const eventId = "33333333-3333-4333-8333-333333333333";

describe("home content sanitization", () => {
  it("rejects HTML and script payloads", () => {
    expect(containsHtmlOrScript("<script>alert(1)</script>")).toBe(true);
    expect(containsHtmlOrScript("Hello <b>team</b>")).toBe(true);
    expect(containsHtmlOrScript("javascript:alert(1)")).toBe(true);
    expect(containsHtmlOrScript("Club night is Friday.")).toBe(false);
    expect(sanitizePlainText("Hello <b>team</b>")).toBe("Hello team");

    expect(
      parseDashboardHomePayload("announcement", {
        title: "Hi <script>",
        body: "All good",
      }).success,
    ).toBe(false);
    expect(
      parseDashboardHomePayload("school_message", {
        title: "Note",
        body: "<img src=x onerror=alert(1)>",
      }).success,
    ).toBe(false);
  });

  it("accepts typed plain-text modules", () => {
    const announcement = parseDashboardHomePayload("announcement", {
      title: "Assembly moved",
      body: "Meet in the gym at 3pm.",
    });
    expect(announcement.success).toBe(true);
    if (announcement.success) {
      expect(extractHomeContentBody("announcement", announcement.data)).toBe(
        "Meet in the gym at 3pm.",
      );
    }

    expect(
      parseDashboardHomePayload("featured_courses", {
        courseIds: [courseId],
      }).success,
    ).toBe(true);
    expect(
      parseDashboardHomePayload("featured_events", {
        eventIds: [eventId],
      }).success,
    ).toBe(true);
  });

  it("requires school scope for school messages and rejects unsafe deadline links", () => {
    expect(
      upsertDashboardHomeContentSchema.safeParse({
        moduleType: "school_message",
        scopeType: "global",
        payload: { title: "Hello", body: "From the office." },
      }).success,
    ).toBe(false);

    expect(
      upsertDashboardHomeContentSchema.safeParse({
        moduleType: "school_message",
        scopeType: "school",
        schoolId,
        payload: { title: "Hello", body: "From the office." },
      }).success,
    ).toBe(true);

    expect(
      deadlinePayloadSchema.safeParse({
        title: "Charter due",
        dueAt: "2026-09-10T17:00:00.000Z",
        href: "javascript:alert(1)",
      }).success,
    ).toBe(false);

    expect(
      deadlinePayloadSchema.safeParse({
        title: "Charter due",
        dueAt: "2026-09-10T17:00:00.000Z",
        href: "/dashboard",
      }).success,
    ).toBe(true);
  });
});
