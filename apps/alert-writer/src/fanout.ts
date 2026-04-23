import { logAlertOnChain } from './deliveries/onchain';
import { deliverTelegram } from './deliveries/telegram';
import { deliverWebhook } from './deliveries/webhook';
import {
  type SubscriberRow,
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
}

export interface FanoutResult {
  ok: boolean;
  alertId: number;
}

const TERMINAL_ONCHAIN_STATUSES: ReadonlySet<OnchainStatus> = new Set(['confirmed', 'failed']);

interface DispatchDescriptor {
  subscriptionId: number;
  channel: 'webhook' | 'telegram';
  promise: Promise<DeliveryOutcome>;
}

function buildDispatches(
  subs: readonly SubscriberRow[],
  payload: AlertPayload,
  env: FanoutEnv,
): DispatchDescriptor[] {
  const out: DispatchDescriptor[] = [];
  for (const sub of subs) {
    if (sub.webhookUrl) {
      out.push({
        subscriptionId: sub.id,
        channel: 'webhook',
        promise: deliverWebhook(sub, payload),
      });
    }
    if (sub.telegramChatId) {
      out.push({
        subscriptionId: sub.id,
        channel: 'telegram',
        promise: deliverTelegram(sub, payload, env),
      });
    }
  }
  return out;
}

/**
 * Processes one alert end-to-end. Ordering:
 *   1. Dedup lookup on natural key → reuse row on redelivery.
 *   2. Onchain submit (skipped if status is terminal — prevents redelivery regression).
 *   3. Fan-out to matching subscribers in parallel with allSettled.
 *   4. Persist delivery summary.
 *
 * If the process dies between steps 2 and 4, the row has tx_hash but no delivery_summary.
 * Retry replays step 2 (no-op via terminal-status guard) then re-fans out — acceptable per
 * Phase-1 contract ("subscribers MUST dedup by alert id"). See plan §Design decisions.
 */
export async function processAlert(payload: AlertPayload, env: FanoutEnv): Promise<FanoutResult> {
  const existing = await findAlertByNaturalKey(
    env.DB,
    payload.asset,
    payload.oraclePair,
    payload.blockTimestamp,
  );
  const alertId = existing ? existing.id : await insertAlert(env.DB, payload);

  if (!existing || !TERMINAL_ONCHAIN_STATUSES.has(existing.onchainStatus)) {
    const onchain = await logAlertOnChain(payload, env);
    await updateAlertOnchain(env.DB, alertId, onchain.txHash, onchain.status);
  }

  const subs = await listActiveSubscribersForAsset(env.DB, payload.asset);
  const dispatches = buildDispatches(subs, payload, env);

  // allSettled over .all — a rejected promise from any delivery (e.g. future delivery
  // module that forgets the try/catch) won't abort the batch; it surfaces as an error
  // outcome so updateAlertDelivery always runs.
  const settled = await Promise.allSettled(dispatches.map((d) => d.promise));
  const outcomes: DeliveryOutcome[] = settled.map((s, i) => {
    const d = dispatches[i];
    if (s.status === 'fulfilled') return s.value;
    return {
      subscriptionId: d?.subscriptionId ?? -1,
      channel: d?.channel ?? 'webhook',
      status: 'error',
      error: s.reason instanceof Error ? s.reason.message : String(s.reason),
    };
  });

  await updateAlertDelivery(env.DB, alertId, { attempts: 1, outcomes });

  const allOk = outcomes.every((o) => o.status === 'ok');
  return { ok: allOk, alertId };
}
