/**
 * AlertWriter Worker — consumes the ALERTS queue and fans out:
 *   1. Persist full alert payload to D1 (alerts table).
 *   2. Call AlertRegistry.logAlert() on Base Mainnet (stubbed until D4 pairing).
 *   3. Deliver to subscribers: webhook POST, Telegram bot sendMessage.
 *
 * Queue retry semantics:
 *   - Each message is validated at boundary with zod. Malformed → ack + log (permanent failure).
 *   - Valid message: processAlert outcome → msg.ack() on ok, msg.retry() on ok=false or throw.
 *   - Cloudflare Queue retry cap + exponential backoff configured in wrangler.jsonc
 *     (`max_retries: 3`) so we don't loop forever on transient failures.
 *
 * Owner: 모진영 (core) + 권상현 (contract call — D4 pairing).
 */

import { processAlert } from './fanout';
import { alertPayloadSchema } from './schema';
import type { AlertPayload } from './types';

export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  ALERT_REGISTRY_ADDRESS: `0x${string}`;
  BASE_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY: string;
  TELEGRAM_BOT_TOKEN: string;
}

export default {
  async queue(batch: MessageBatch<AlertPayload>, env: Env, _ctx: ExecutionContext): Promise<void> {
    for (const msg of batch.messages) {
      const parsed = alertPayloadSchema.safeParse(msg.body);
      if (!parsed.success) {
        // Permanent failure — retrying won't fix a schema mismatch. Ack + log, move on.
        console.error('[alert-writer] invalid AlertPayload, dropping message', parsed.error.issues);
        msg.ack();
        continue;
      }
      try {
        const result = await processAlert(parsed.data, env);
        if (result.ok) {
          msg.ack();
        } else {
          msg.retry();
        }
      } catch (err) {
        console.error('[alert-writer] handler threw; retrying', err);
        msg.retry();
      }
    }
  },
};
