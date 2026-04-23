/**
 * Shared type definitions for the poller pipeline. Kept local to apps/poller until
 * a packages/shared lands. AlertPayload MUST stay byte-compatible with
 * apps/alert-writer/src/index.ts AlertPayload (Queue contract).
 */

export type OracleSource = 'chainlink' | 'pyth' | 'redstone';

/** A single oracle reading for one asset at one point in time. */
export interface OraclePrice {
  asset: string;
  source: OracleSource;
  /** Price normalized to 18 decimal fixed-point, stored as bigint. */
  priceE18: bigint;
  /** Oracle-reported publish/update time (unix seconds). */
  updatedAt: number;
  /** Source-specific metadata (round id, feed id, etc.). */
  meta?: Record<string, string | number>;
}

/** Queue payload — consumed by alert-writer. Schema must match alert-writer AlertPayload. */
export interface AlertPayload {
  asset: string;
  oraclePair: string;
  deviationBps: number;
  blockTimestamp: number;
  evidence: {
    chainlinkValue?: string;
    pythValue?: string;
    redstoneValue?: string;
    [extra: string]: unknown;
  };
  alertType: 0 | 1;
}
