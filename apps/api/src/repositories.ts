import type { SubscriptionCreate } from './schemas';
import type { AlertRecord, CreatedSubscription, OracleSource, PriceSnapshot } from './types';

const ORACLE_SOURCES: readonly OracleSource[] = ['chainlink', 'pyth', 'redstone'];

function isOracleSource(value: string): value is OracleSource {
  return ORACLE_SOURCES.includes(value as OracleSource);
}

interface KvPriceRecord {
  priceE18: string;
  updatedAt: number;
}

export async function readLatestPrices(kv: KVNamespace): Promise<PriceSnapshot[]> {
  // N+1 kv.get per key is acceptable at Phase-1 cardinality (4 assets × ≤3 sources = ≤12 keys).
  // If coverage grows, batch via Promise.all or switch to a single D1 query against price_history.
  const listed = await kv.list({ prefix: 'latest:' });
  const snapshots: PriceSnapshot[] = [];

  for (const key of listed.keys) {
    const parts = key.name.split(':');
    if (parts.length !== 3) continue;
    const [, asset, source] = parts;
    if (!asset || !source || !isOracleSource(source)) continue;

    const raw = await kv.get(key.name);
    if (!raw) continue;

    let parsed: KvPriceRecord;
    try {
      parsed = JSON.parse(raw) as KvPriceRecord;
    } catch {
      continue;
    }
    if (typeof parsed.priceE18 !== 'string' || typeof parsed.updatedAt !== 'number') continue;

    snapshots.push({
      asset,
      source,
      priceE18: parsed.priceE18,
      updatedAt: parsed.updatedAt,
    });
  }

  snapshots.sort((a, b) => {
    if (a.asset !== b.asset) return a.asset < b.asset ? -1 : 1;
    return a.source < b.source ? -1 : 1;
  });
  return snapshots;
}

interface AlertRow {
  id: number;
  asset: string;
  oracle_pair: string;
  deviation_bps: number;
  alert_type: number;
  block_timestamp: number;
  evidence: string;
  tx_hash: string | null;
  onchain_status: string;
  delivery_summary: string | null;
  created_at: number;
}

function parseJsonObject(value: string | null): Record<string, unknown> | null {
  if (value === null) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function rowToAlert(row: AlertRow): AlertRecord {
  return {
    id: row.id,
    asset: row.asset,
    oraclePair: row.oracle_pair,
    deviationBps: row.deviation_bps,
    alertType: row.alert_type,
    blockTimestamp: row.block_timestamp,
    evidence: parseJsonObject(row.evidence) ?? {},
    txHash: row.tx_hash,
    onchainStatus: row.onchain_status,
    deliverySummary: parseJsonObject(row.delivery_summary),
    createdAt: row.created_at,
  };
}

export interface ListAlertsFilters {
  asset?: string;
  limit: number;
  since?: number;
}

export async function listAlerts(
  db: D1Database,
  filters: ListAlertsFilters,
): Promise<AlertRecord[]> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (filters.asset !== undefined) {
    clauses.push('asset = ?');
    params.push(filters.asset);
  }
  if (filters.since !== undefined) {
    clauses.push('block_timestamp >= ?');
    params.push(filters.since);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

  const { results } = await db
    .prepare(
      `SELECT id, asset, oracle_pair, deviation_bps, alert_type, block_timestamp,
              evidence, tx_hash, onchain_status, delivery_summary, created_at
       FROM alerts
       ${where}
       ORDER BY block_timestamp DESC
       LIMIT ?`,
    )
    .bind(...params, filters.limit)
    .all<AlertRow>();

  return results.map(rowToAlert);
}

export async function createSubscription(
  db: D1Database,
  input: SubscriptionCreate,
): Promise<CreatedSubscription> {
  const assetFilter =
    input.assetFilter && input.assetFilter.length > 0 ? input.assetFilter.join(',') : null;

  const row = await db
    .prepare(
      `INSERT INTO subscriptions (webhook_url, telegram_chat_id, asset_filter, secret)
       VALUES (?, ?, ?, ?)
       RETURNING id, created_at`,
    )
    .bind(input.webhookUrl ?? null, input.telegramChatId ?? null, assetFilter, input.secret ?? null)
    .first<{ id: number; created_at: number }>();

  if (!row) throw new Error('createSubscription: INSERT RETURNING yielded no row');
  return { id: row.id, createdAt: row.created_at };
}
