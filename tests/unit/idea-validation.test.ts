import { describe, expect, it } from "vitest";

import {
  convertIdeaSchema,
  decideIdeaSchema,
  ideaDraftSchema,
  ideaSubmitSchema,
} from "@/lib/validation/ideas";

const ideaId = "11111111-1111-4111-8111-111111111111";
const reviewId = "22222222-2222-4222-8222-222222222222";
const schoolId = "33333333-3333-4333-8333-333333333333";

const baseDraft = {
  draftStep: 1,
  schoolId,
  title: "Robotics Lab",
  category: "STEM",
  description: "A hands-on robotics club for builders and mentors alike.",
  mission: "Grow student engineering skills through collaborative builds.",
  problemOpportunity:
    "Students need a structured place to practice robotics after school.",
  expectedActivities: ["Weekly build nights", "Competition prep"],
  expectedMembership: 24,
  proposedMeetingCadence: "Wednesdays 3:30-4:30 PM",
  gradeMin: 9,
  gradeMax: 12,
  officers: [{ proposedName: "Alex Rivera", proposedRole: "president" as const }],
  links: [],
};

describe("idea validation", () => {
  it("accepts draft saves with partial content", () => {
    const parsed = ideaDraftSchema.safeParse({
      draftStep: 2,
      title: "Draft",
      category: "",
      description: "",
      mission: "",
      problemOpportunity: "",
      expectedActivities: [],
      proposedMeetingCadence: "",
      officers: [],
      links: [],
    });
    expect(parsed.success).toBe(true);
  });

  it("requires complete fields for submission", () => {
    const ok = ideaSubmitSchema.safeParse(baseDraft);
    expect(ok.success).toBe(true);

    const incomplete = ideaSubmitSchema.safeParse({
      ...baseDraft,
      mission: "too short",
    });
    expect(incomplete.success).toBe(false);
  });

  it("requires meaningful feedback for changes and rejection", () => {
    const changes = decideIdeaSchema.safeParse({
      ideaId,
      reviewId,
      decision: "changes_requested",
      applicantFeedback: "short",
    });
    expect(changes.success).toBe(false);

    const reject = decideIdeaSchema.safeParse({
      ideaId,
      reviewId,
      decision: "rejected",
      applicantFeedback: "Not enough detail for a viable club plan.",
    });
    expect(reject.success).toBe(true);

    const approve = decideIdeaSchema.safeParse({
      ideaId,
      reviewId,
      decision: "approved",
      applicantFeedback: "",
    });
    expect(approve.success).toBe(true);
  });

  it("validates conversion confirmation payload", () => {
    const ok = convertIdeaSchema.safeParse({
      ideaId,
      confirmName: "Robotics Lab",
      slug: "robotics-lab",
    });
    expect(ok.success).toBe(true);

    const badSlug = convertIdeaSchema.safeParse({
      ideaId,
      confirmName: "Robotics Lab",
      slug: "Bad Slug",
    });
    expect(badSlug.success).toBe(false);
  });
});
