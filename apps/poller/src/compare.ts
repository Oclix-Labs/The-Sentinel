import type { AssetConfig } from './config';
import type { AlertPayload, OraclePrice } from './types';

/**
 * Absolute deviation between two 18-decimal fixed-point prices, expressed in basis points
 * relative to the midpoint. Symmetric: deviationBps(a, b) === deviationBps(b, a).
 * Returns 0 if either operand is zero.
 */
export function deviationBps(a: bigint, b: bigint): number {
  if (a <= 0n || b <= 0n) return 0;
  const diff = a > b ? a - b : b - a;
  const mid = (a + b) / 2n;
  if (mid === 0n) return 0;
  return Number((diff * 10_000n) / mid);
}

/**
 * Enumerate every pair of oracle readings for the asset and build an AlertPayload for
 * each pair whose deviation exceeds `asset.thresholdBps`. Multiple pairs (chainlink_vs_pyth,
 * chainlink_vs_redstone, pyth_vs_redstone) can all trip in a single tick; emit each separately
 * so alert-writer fan-out can deduplicate downstream if needed.
 */
export function buildAlerts(
  asset: AssetConfig,
  prices: readonly OraclePrice[],
  blockTimestamp: number,
): AlertPayload[] {
  const alerts: AlertPayload[] = [];
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const a = prices[i];
      const b = prices[j];
      if (!a || !b) continue;

      const dev = deviationBps(a.priceE18, b.priceE18);
      if (dev <= asset.thresholdBps) continue;

      // Stable pair name: alphabetical order so chainlink_vs_pyth (never pyth_vs_chainlink).
      const [left, right] = a.source < b.source ? [a, b] : [b, a];
      alerts.push({
        asset: asset.symbol,
        oraclePair: `${left.source}_vs_${right.source}`,
        deviationBps: dev,
        blockTimestamp,
        evidence: {
          [`${left.source}Value`]: left.priceE18.toString(),
          [`${right.source}Value`]: right.priceE18.toString(),
          [`${left.source}UpdatedAt`]: left.updatedAt,
          [`${right.source}UpdatedAt`]: right.updatedAt,
          // Staleness delta surfaces a frozen-feed scenario to subscribers and
          // downstream Grafana views without forcing them to compute it.
          // Reviewer flag: Base Chainlink cbETH heartbeat is 'uncertain' per
          // .research/oracle-inventory-base.md §2.1; two frozen feeds could match
          // each other while the market moves.
          [`${left.source}StalenessSec`]: Math.max(0, blockTimestamp - left.updatedAt),
          [`${right.source}StalenessSec`]: Math.max(0, blockTimestamp - right.updatedAt),
        },
        alertType: 0,
      });
    }
  }
  return alerts;
}
