import { describe, expect, it } from "vitest";

import {
  highlightFormSchema,
  newsletterDraftSchema,
  NEWSLETTER_BLOCK_TYPES,
} from "@/lib/validation/publishing";

const clubId = "11111111-1111-4111-8111-111111111111";

describe("publishing validation", () => {
  it("accepts a highlight from an activity source", () => {
    const parsed = highlightFormSchema.safeParse({
      clubId,
      title: "Robotics demo day",
      summary: "Members demoed their builds.",
      sourceType: "activity",
      occurredOn: "2026-09-01",
      visibility: "club",
      publish: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects unsafe highlight HTML", () => {
    expect(
      highlightFormSchema.safeParse({
        clubId,
        title: "Bad <script>",
        summary: "Nope",
        sourceType: "other",
        occurredOn: "2026-09-01",
      }).success,
    ).toBe(false);
  });

  it("stores structured newsletter blocks instead of raw HTML", () => {
    const parsed = newsletterDraftSchema.safeParse({
      clubId,
      title: "September issue",
      blocks: [
        { blockType: "hero", content: { title: "Hello" } },
        { blockType: "stats", content: { summary: "Meetings recorded: 2" } },
        { blockType: "divider", content: {} },
      ],
      selectedFacts: {
        includeMeetings: true,
        includeEvents: false,
        includeNewMembers: false,
        includeAttendance: false,
        includeHighlights: false,
        includeUpcoming: false,
        eventIds: [],
        highlightIds: [],
        upcomingEventIds: [],
        courseIds: [],
      },
    });
    expect(parsed.success).toBe(true);
    expect(NEWSLETTER_BLOCK_TYPES).toContain("course_recommendation");
  });
});
