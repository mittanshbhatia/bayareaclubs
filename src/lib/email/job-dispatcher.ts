import "server-only";

import type { Json } from "@/types/database.generated";

/**
 * Job dispatch adapters for communications.
 * Default: durable DB outbox processed by Vercel cron.
 * Optional: Vercel Queues when explicitly enabled — domain code stays the same.
 */

export type CommunicationJobEnqueueInput = {
  jobType: "prepare_campaign_recipients" | "send_campaign_batch" | "send_test_email";
  idempotencyKey: string;
  campaignId?: string;
  payload?: Json;
  runAfter?: string;
};

export interface CommunicationJobDispatcher {
  readonly name: string;
  enqueue(input: CommunicationJobEnqueueInput): Promise<{ jobId: string }>;
}

type EnqueueRpc = (args: {
  p_job_type: CommunicationJobEnqueueInput["jobType"];
  p_idempotency_key: string;
  p_campaign_id?: string;
  p_payload?: Json;
  p_run_after?: string;
}) => Promise<{ data: string | null; error: { message: string } | null }>;

export class OutboxJobDispatcher implements CommunicationJobDispatcher {
  readonly name = "database_outbox";

  constructor(private readonly enqueueRpc: EnqueueRpc) {}

  async enqueue(input: CommunicationJobEnqueueInput) {
    const { data, error } = await this.enqueueRpc({
      p_job_type: input.jobType,
      p_idempotency_key: input.idempotencyKey,
      ...(input.campaignId ? { p_campaign_id: input.campaignId } : {}),
      p_payload: input.payload ?? {},
      ...(input.runAfter ? { p_run_after: input.runAfter } : {}),
    });
    if (error || !data) {
      throw new Error(error?.message ?? "Failed to enqueue communication job.");
    }
    return { jobId: data };
  }
}

/**
 * Adapter for Vercel Queues. Enabled only when VERCEL_QUEUES_ENABLED=true
 * and a queue publish function is provided by the host.
 */
export class VercelQueuesJobDispatcher implements CommunicationJobDispatcher {
  readonly name = "vercel_queues";

  constructor(
    private readonly publish: (message: CommunicationJobEnqueueInput) => Promise<void>,
    private readonly outboxFallback: CommunicationJobDispatcher,
  ) {}

  async enqueue(input: CommunicationJobEnqueueInput) {
    const outbox = await this.outboxFallback.enqueue(input);
    try {
      await this.publish({
        ...input,
        payload: {
          ...(typeof input.payload === "object" && input.payload && !Array.isArray(input.payload)
            ? input.payload
            : {}),
          outboxJobId: outbox.jobId,
        },
      });
    } catch {
      // Cron will still drain the outbox if queue publish fails.
    }
    return outbox;
  }
}

export function isVercelQueuesEnabled() {
  return process.env.VERCEL_QUEUES_ENABLED === "true";
}

export function createCommunicationDispatcher(
  enqueueRpc: EnqueueRpc,
  queuePublish?: (message: CommunicationJobEnqueueInput) => Promise<void>,
): CommunicationJobDispatcher {
  const outbox = new OutboxJobDispatcher(enqueueRpc);
  if (isVercelQueuesEnabled() && queuePublish) {
    return new VercelQueuesJobDispatcher(queuePublish, outbox);
  }
  return outbox;
}
