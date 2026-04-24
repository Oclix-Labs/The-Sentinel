import { env } from 'cloudflare:test';
import type { OracleSource } from '../src/types';

export async function seedPrice(
  asset: string,
  source: OracleSource,
  priceE18: bigint,
  updatedAt: number,
): Promise<void> {
  await env.PRICES.put(
    `latest:${asset}:${source}`,
    JSON.stringify({ priceE18: priceE18.toString(), updatedAt }),
  );
}

export async function seedAlert(row: {
  asset: string;
  oraclePair: string;
  deviationBps: number;
  alertType: number;
  blockTimestamp: number;
  evidence: Record<string, unknown>;
  onchainStatus?: string;
  txHash?: string | null;
}): Promise<number> {
  const result = await env.DB.prepare(
    `INSERT INTO alerts (asset, oracle_pair, deviation_bps, alert_type, block_timestamp, evidence, tx_hash, onchain_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`,
  )
    .bind(
      row.asset,
      row.oraclePair,
      row.deviationBps,
      row.alertType,
      row.blockTimestamp,
      JSON.stringify(row.evidence),
      row.txHash ?? null,
      row.onchainStatus ?? 'pending',
    )
    .first<{ id: number }>();
  if (!result) throw new Error('seedAlert: insert returned no row');
  return result.id;
}
