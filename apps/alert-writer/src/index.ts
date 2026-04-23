/**
 * AlertWriter Worker — consumes the ALERTS queue and fans out:
 *   1. Persist full alert payload to D1 (alerts table).
 *   2. Call AlertRegistry.logAlert() on Base Mainnet (stubbed until D4 pairing).
 *   3. Deliver to subscribers: webhook POST, Telegram bot sendMessage.
 *
 * Queue retry semantics:
 *   - Each message is processed independently; successful → msg.ack().
 *   - Any fan-out failure (non-2xx response or network error) → msg.retry().
 *   - Cloudflare Queue retry cap + exponential backoff configured in wrangler.jsonc
 *     (`max_retries: 3`) so we don't loop forever.
 *
 * Owner: 모진영 (core) + 권상현 (contract call — D4 pairing).
 */

import { processAlert } from './fanout';
import type { AlertPayload } from './types';

export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  ALERT_REGISTRY_ADDRESS: `0x${string}`;
  TELEGRAM_BOT_TOKEN: string;
  PUBLISHER_PRIVATE_KEY?: string;
  BASE_RPC_URL?: string;
}

export default {
  async queue(
    batch: MessageBatch<AlertPayload>,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    for (const msg of batch.messages) {
      try {
        const result = await processAlert(msg.body, env);
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
