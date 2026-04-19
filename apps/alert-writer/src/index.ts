/**
 * AlertWriter Worker — consumes the ALERTS queue and fans out:
 *   1. Persist full alert payload to D1 (alerts table).
 *   2. Call AlertRegistry.logAlert() on Base Mainnet (minimal on-chain audit trail).
 *   3. Deliver to subscribers: webhook POST, Telegram bot sendMessage, (later) Discord.
 *
 * Status: STUB. Implement body in D3–D5.
 * Owner: 모진영 (core) + 권상현 (contract call part via D3–D4 pairing).
 */

export interface Env {
  ENVIRONMENT: 'staging' | 'production';
  BASE_RPC_URL: string;
  ALERT_REGISTRY_ADDRESS: string;
  // DB: D1Database;
  PUBLISHER_PRIVATE_KEY?: string; // wrangler secret put PUBLISHER_PRIVATE_KEY
  TELEGRAM_BOT_TOKEN?: string;
}

export interface AlertPayload {
  asset: string; // e.g. 'cbETH/USD'
  oraclePair: string; // e.g. 'chainlink_vs_pyth'
  deviationBps: number;
  blockTimestamp: number;
  evidence: {
    chainlinkValue?: string;
    pythValue?: string;
    redstoneValue?: string;
    [extra: string]: unknown;
  };
  alertType: 0 | 1; // 0 = price-cross-check, 1 = attestation-expiry
}

export default {
  async queue(batch: MessageBatch<AlertPayload>, env: Env, _ctx: ExecutionContext): Promise<void> {
    for (const msg of batch.messages) {
      try {
        await handleAlert(msg.body, env);
        msg.ack();
      } catch (err) {
        console.error('[alert-writer] handler failed', err);
        msg.retry();
      }
    }
  },
};

/**
 * D3-D5 implementation plan:
 *   1. INSERT alert row into D1.alerts (with evidence JSON).
 *   2. viem walletClient — sign + send AlertRegistry.logAlert(...).
 *      Use BASE_RPC_URL + PUBLISHER_PRIVATE_KEY (wrangler secret).
 *   3. SELECT subscribers from D1 where asset_filter matches → POST webhook OR Telegram sendMessage.
 *   4. Update alert row with tx hash + delivery status.
 */
async function handleAlert(payload: AlertPayload, env: Env): Promise<void> {
  console.log(
    `[alert-writer] alert ${payload.asset} ${payload.oraclePair} ${payload.deviationBps}bps env=${env.ENVIRONMENT}`,
  );
  // TODO(모진영 + 권상현): implement per plan above.
}
