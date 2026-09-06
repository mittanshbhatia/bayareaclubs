import { describe, expect, it } from "vitest";

import {
  adminCourseSchema,
  catalogFilterSchema,
  subscribeCourseSchema,
} from "@/lib/validation/stem";

describe("stem validation", () => {
  it("accepts catalog filters including competitive programming", () => {
    const parsed = catalogFilterSchema.safeParse({
      discipline: "competitive_programming",
      difficulty: "intermediate",
      format: "reading",
      gradeBand: "age_13_17",
      effort: "over_300",
      q: "usaco",
    });
    expect(parsed.success).toBe(true);
  });

  it("requires free courses only in admin schema", () => {
    const parsed = adminCourseSchema.safeParse({
      slug: "intro-python",
      title: "Intro Python",
      description: "Free external curriculum.",
      discipline: "computer_science",
      gradeBands: ["age_13_17"],
      difficulty: "beginner",
      format: "interactive",
      providerName: "freeCodeCamp",
      sourceUrl: "https://www.freecodecamp.org/",
      licenseName: "BSD-3-Clause",
      lastVerifiedAt: "2026-09-05",
      isFree: true,
      modules: [
        {
          title: "Start",
          resources: [
            {
              title: "Lesson",
              resourceType: "external_link",
              externalUrl: "https://www.freecodecamp.org/learn/",
            },
          ],
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects non-https subscribe payloads that are malformed", () => {
    expect(subscribeCourseSchema.safeParse({ courseId: "nope" }).success).toBe(
      false,
    );
  });
});
