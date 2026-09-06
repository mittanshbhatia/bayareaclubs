import { describe, expect, it } from "vitest";

import { OutboxJobDispatcher } from "@/lib/email/job-dispatcher";
import {
  campaignComposerSchema,
  containsUnsafeContent,
  sanitizePlainText,
} from "@/lib/validation/communications";

const clubId = "11111111-1111-4111-8111-111111111111";

describe("communications validation", () => {
  it("rejects script injection in message and subject", () => {
    expect(containsUnsafeContent('<script>alert(1)</script>')).toBe(true);
    expect(sanitizePlainText("Hello <b>team</b>")).toBe("Hello team");

    const bad = campaignComposerSchema.safeParse({
      clubId,
      name: "Test",
      subject: "Hi <script>",
      messageBody: "Body",
      campaignKind: "announcement",
      audienceType: "all_members",
    });
    expect(bad.success).toBe(false);
  });

  it("requires segment roles and event ids for those audiences", () => {
    expect(
      campaignComposerSchema.safeParse({
        clubId,
        name: "Seg",
        subject: "Hello",
        messageBody: "Body text",
        campaignKind: "announcement",
        audienceType: "membership_segment",
        segmentRoles: [],
      }).success,
    ).toBe(false);

    expect(
      campaignComposerSchema.safeParse({
        clubId,
        name: "Evt",
        subject: "Hello",
        messageBody: "Body text",
        campaignKind: "event_promotion",
        audienceType: "event_registrants",
      }).success,
    ).toBe(false);
  });

  it("accepts a send-now announcement to all members", () => {
    const parsed = campaignComposerSchema.safeParse({
      clubId,
      name: "March note",
      subject: "Club meeting moved",
      messageBody: "We moved the meeting to Friday.",
      campaignKind: "announcement",
      audienceType: "all_members",
      sendMode: "send_now",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("outbox dispatcher", () => {
  it("is idempotent via RPC return of existing job id", async () => {
    const dispatcher = new OutboxJobDispatcher(async () => ({
      data: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      error: null,
    }));
    const first = await dispatcher.enqueue({
      jobType: "send_campaign_batch",
      idempotencyKey: "send-batch:1",
      campaignId: clubId,
    });
    const second = await dispatcher.enqueue({
      jobType: "send_campaign_batch",
      idempotencyKey: "send-batch:1",
      campaignId: clubId,
    });
    expect(first.jobId).toBe(second.jobId);
  });
});
