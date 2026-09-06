import { describe, expect, it } from "vitest";

import {
  EVENT_BUILDER_STEPS,
  eventDraftSchema,
  overrideRsvpSchema,
  publishEventSchema,
  upsertRsvpSchema,
} from "@/lib/validation/events";

const clubId = "11111111-1111-4111-8111-111111111111";
const eventId = "22222222-2222-4222-8222-222222222222";

describe("event validation", () => {
  it("exposes ten builder sections", () => {
    expect(EVENT_BUILDER_STEPS).toHaveLength(10);
    expect(EVENT_BUILDER_STEPS.map((step) => step.key)).toContain("logistics");
  });

  it("accepts draft saves with partial basics", () => {
    const parsed = eventDraftSchema.safeParse({
      clubId,
      title: "Kickoff",
      eventType: "club_meeting",
      format: "in_person",
    });
    expect(parsed.success).toBe(true);
  });

  it("maps declined to not_going for RSVP upsert", () => {
    const ok = upsertRsvpSchema.safeParse({
      eventId,
      status: "not_going",
    });
    expect(ok.success).toBe(true);
  });

  it("requires an override note for admin RSVP changes", () => {
    const bad = overrideRsvpSchema.safeParse({
      clubId,
      rsvpId: eventId,
      status: "going",
      overrideNote: "no",
    });
    expect(bad.success).toBe(false);
  });

  it("requires ids to publish", () => {
    expect(publishEventSchema.safeParse({ clubId, eventId }).success).toBe(true);
  });
});
