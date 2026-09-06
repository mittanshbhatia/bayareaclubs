import { describe, expect, it } from "vitest";

import {
  NOTIFICATION_CATEGORY_LABELS,
  OPTIONAL_NOTIFICATION_CATEGORIES,
  updateNotificationPreferenceSchema,
} from "@/lib/validation/notifications";

describe("notification preferences validation", () => {
  it("allows muting optional categories only", () => {
    for (const category of OPTIONAL_NOTIFICATION_CATEGORIES) {
      expect(
        updateNotificationPreferenceSchema.safeParse({
          category,
          inAppEnabled: false,
        }).success,
      ).toBe(true);
      expect(NOTIFICATION_CATEGORY_LABELS[category]).toBeTruthy();
    }
  });

  it("rejects critical category preference updates", () => {
    expect(
      updateNotificationPreferenceSchema.safeParse({
        category: "club_ideas",
        inAppEnabled: false,
      }).success,
    ).toBe(false);
    expect(
      updateNotificationPreferenceSchema.safeParse({
        category: "membership",
        inAppEnabled: true,
      }).success,
    ).toBe(false);
  });
});
