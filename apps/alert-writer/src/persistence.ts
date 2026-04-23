import type { AlertPayload, DeliverySummary, OnchainStatus } from './types';

export interface SubscriberRow {
  id: number;
  webhookUrl: string | null;
  telegramChatId: string | null;
  secret: string | null;
}

export async function insertAlert(db: D1Database, payload: AlertPayload): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO alerts
         (asset, oracle_pair, deviation_bps, alert_type, block_timestamp, evidence, onchain_status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')
       RETURNING id`,
    )
    .bind(
      payload.asset,
      payload.oraclePair,
      payload.deviationBps,
      payload.alertType,
      payload.blockTimestamp,
      JSON.stringify(payload.evidence),
    )
    .first<{ id: number }>();
  if (!result) throw new Error('insertAlert: INSERT RETURNING yielded no row');
  return result.id;
}

export async function findAlertByNaturalKey(
  db: D1Database,
  asset: string,
  oraclePair: string,
  blockTimestamp: number,
): Promise<{ id: number; onchainStatus: OnchainStatus } | null> {
  const row = await db
    .prepare(
      'SELECT id, onchain_status FROM alerts WHERE asset = ? AND oracle_pair = ? AND block_timestamp = ? LIMIT 1',
    )
    .bind(asset, oraclePair, blockTimestamp)
    .first<{ id: number; onchain_status: OnchainStatus }>();
  if (!row) return null;
  return { id: row.id, onchainStatus: row.onchain_status };
}

export async function updateAlertOnchain(
  db: D1Database,
  id: number,
  txHash: string,
  status: OnchainStatus,
): Promise<void> {
  await db
    .prepare('UPDATE alerts SET tx_hash = ?, onchain_status = ? WHERE id = ?')
    .bind(txHash, status, id)
    .run();
}

export async function updateAlertDelivery(
  db: D1Database,
  id: number,
  summary: DeliverySummary,
): Promise<void> {
  await db
    .prepare('UPDATE alerts SET delivery_summary = ? WHERE id = ?')
    .bind(JSON.stringify(summary), id)
    .run();
}

interface SubscriberDbRow {
  id: number;
  webhook_url: string | null;
  telegram_chat_id: string | null;
  asset_filter: string | null;
  secret: string | null;
}

export async function listActiveSubscribersForAsset(
  db: D1Database,
  asset: string,
): Promise<SubscriberRow[]> {
  // asset_filter is CSV; null = subscribe to all assets. Filter in-memory to avoid
  // fragile LIKE patterns against CSV (e.g. BTC/USD would match BTC/USDC if we weren't careful).
  const { results } = await db
    .prepare(
      `SELECT id, webhook_url, telegram_chat_id, asset_filter, secret
       FROM subscriptions
       WHERE active = 1`,
    )
    .all<SubscriberDbRow>();

  return results
    .filter((row) => {
      if (row.asset_filter === null) return true;
      const assets = row.asset_filter.split(',').map((a) => a.trim());
      return assets.includes(asset);
    })
    .map((row) => ({
      id: row.id,
      webhookUrl: row.webhook_url,
      telegramChatId: row.telegram_chat_id,
      secret: row.secret,
    }));
}
