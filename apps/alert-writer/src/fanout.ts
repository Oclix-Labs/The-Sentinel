import { logAlertOnChain } from './deliveries/onchain';
import { deliverTelegram } from './deliveries/telegram';
import { deliverWebhook } from './deliveries/webhook';
import {
  findAlertByNaturalKey,
  insertAlert,
  listActiveSubscribersForAsset,
  updateAlertDelivery,
  updateAlertOnchain,
} from './persistence';
import type { AlertPayload, DeliveryOutcome, OnchainStatus } from './types';

interface FanoutEnv {
  DB: D1Database;
  ALERT_REGISTRY_ADDRESS: `0x${string}`;
  TELEGRAM_BOT_TOKEN: string;
  PUBLISHER_PRIVATE_KEY?: string;
}

export interface FanoutResult {
  ok: boolean;
  alertId: number;
}

const TERMINAL_ONCHAIN_STATUSES: ReadonlySet<OnchainStatus> = new Set(['confirmed', 'failed']);

export async function processAlert(payload: AlertPayload, env: FanoutEnv): Promise<FanoutResult> {
  // 1. Dedup: find existing row or insert a new pending one.
  const existing = await findAlertByNaturalKey(
    env.DB,
    payload.asset,
    payload.oraclePair,
    payload.blockTimestamp,
  );
  const alertId = existing ? existing.id : await insertAlert(env.DB, payload);

  // 2. Onchain submit — skip if the row already reached a terminal state (confirmed/failed).
  // Protects against a redelivered queue message regressing a confirmed status.
  if (!existing || !TERMINAL_ONCHAIN_STATUSES.has(existing.onchainStatus)) {
    const onchain = await logAlertOnChain(payload, env);
    await updateAlertOnchain(env.DB, alertId, onchain.txHash, onchain.status);
  }

  // 3. Resolve subscribers and dispatch in parallel.
  const subs = await listActiveSubscribersForAsset(env.DB, payload.asset);
  const outcomes = await Promise.all(
    subs.flatMap<Promise<DeliveryOutcome>>((sub) => {
      const dispatch: Promise<DeliveryOutcome>[] = [];
      if (sub.webhookUrl) dispatch.push(deliverWebhook(sub, payload));
      if (sub.telegramChatId) dispatch.push(deliverTelegram(sub, payload, env));
      return dispatch;
    }),
  );

  await updateAlertDelivery(env.DB, alertId, { attempts: 1, outcomes });

  const allOk = outcomes.every((o) => o.status === 'ok');
  return { ok: allOk, alertId };
}
