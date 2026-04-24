/**
 * Shared types for the public API. AlertRecord represents a row from D1.alerts
 * after JSON-parsing the evidence column. Must stay compatible with the poller's
 * AlertPayload schema (apps/poller/src/types.ts) — poller writes, api reads.
 */

export type OracleSource = 'chainlink' | 'pyth' | 'redstone';

export interface PriceSnapshot {
  asset: string;
  source: OracleSource;
  priceE18: string;
  updatedAt: number;
}

export interface AlertRecord {
  id: number;
  asset: string;
  oraclePair: string;
  deviationBps: number;
  alertType: number;
  blockTimestamp: number;
  evidence: Record<string, unknown>;
  txHash: string | null;
  onchainStatus: string;
  deliverySummary: Record<string, unknown> | null;
  createdAt: number;
}

export interface CreatedSubscription {
  id: number;
  createdAt: number;
}
