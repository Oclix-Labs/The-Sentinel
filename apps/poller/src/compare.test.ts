import { describe, expect, it } from 'vitest';
import { buildAlerts, deviationBps } from './compare';
import type { AssetConfig } from './config';
import type { OraclePrice } from './types';

const E18 = 10n ** 18n;
const usd = (n: number): bigint => BigInt(Math.round(n * 1e6)) * 10n ** 12n;

const cbETH: AssetConfig = {
  symbol: 'cbETH/USD',
  thresholdBps: 50,
  oracles: ['chainlink', 'pyth'],
};

function price(source: OraclePrice['source'], priceE18: bigint): OraclePrice {
  return { asset: cbETH.symbol, source, priceE18, updatedAt: 1_700_000_000 };
}

describe('deviationBps', () => {
  it('is 0 for equal prices', () => {
    expect(deviationBps(2000n * E18, 2000n * E18)).toBe(0);
  });

  it('is symmetric', () => {
    const a = 2195n * E18;
    const b = 2200n * E18;
    expect(deviationBps(a, b)).toBe(deviationBps(b, a));
  });

  it('is 0 for any non-positive operand (defensive)', () => {
    expect(deviationBps(0n, 100n * E18)).toBe(0);
    expect(deviationBps(100n * E18, 0n)).toBe(0);
  });

  it('matches hand-calculated midpoint formula for a ~0.5% gap', () => {
    // (2200 - 2189) / ((2200+2189)/2) = 11 / 2194.5 = 0.005013 → 50 bps
    const bps = deviationBps(2189n * E18, 2200n * E18);
    expect(bps).toBe(50);
  });
});

describe('Moonwell MIP-X43 cbETH regression (2026-02-15)', () => {
  // Source: .research/incident-forensics-moonwell.md §Incident-summary
  // MIP-X43 shipped a Chainlink OEV wrapper that derived cbETH/USD from cbETH/ETH
  // alone (~1.12), missing the ETH/USD multiplier (~$1,960). Market cbETH ≈ $2,195.
  // Any ±2% cross-check against a healthy second feed would have flagged this instantly.
  const misconfigured = usd(1.12);
  const market = 2195n * E18;

  it('trips at any threshold ≤ 10000 bps — deviation is far above', () => {
    const bps = deviationBps(misconfigured, market);
    expect(bps).toBeGreaterThan(10_000);
  });

  it('emits a chainlink_vs_pyth alert at the 50 bps cbETH threshold', () => {
    const alerts = buildAlerts(
      cbETH,
      [price('chainlink', misconfigured), price('pyth', market)],
      1_739_642_460, // 15 Feb 2026 18:01 UTC — MIP-X43 execution time
    );
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.asset).toBe('cbETH/USD');
    expect(alerts[0]?.oraclePair).toBe('chainlink_vs_pyth');
    expect(alerts[0]?.deviationBps).toBeGreaterThan(10_000);
    expect(alerts[0]?.evidence.chainlinkValue).toBe(misconfigured.toString());
    expect(alerts[0]?.evidence.pythValue).toBe(market.toString());
    // Staleness delta (review feedback): downstream consumers see now-updatedAt
    // without having to subtract on their own.
    expect(alerts[0]?.evidence.chainlinkStalenessSec).toBeGreaterThanOrEqual(0);
    expect(alerts[0]?.evidence.pythStalenessSec).toBeGreaterThanOrEqual(0);
  });
});

describe('buildAlerts', () => {
  it('emits no alerts when all pairs are within threshold', () => {
    const alerts = buildAlerts(cbETH, [price('chainlink', usd(2195)), price('pyth', usd(2196))], 0);
    expect(alerts).toEqual([]);
  });

  it('uses alphabetical ordering for pair names (chainlink_vs_pyth, not pyth_vs_chainlink)', () => {
    const alerts = buildAlerts(cbETH, [price('pyth', usd(2195)), price('chainlink', usd(1.12))], 0);
    expect(alerts[0]?.oraclePair).toBe('chainlink_vs_pyth');
  });

  it('enumerates every pair when 3 oracles disagree', () => {
    const btc: AssetConfig = {
      symbol: 'BTC/USD',
      thresholdBps: 50,
      oracles: ['chainlink', 'pyth', 'redstone'],
    };
    const alerts = buildAlerts(
      btc,
      [
        { asset: 'BTC/USD', source: 'chainlink', priceE18: 77_000n * E18, updatedAt: 0 },
        { asset: 'BTC/USD', source: 'pyth', priceE18: 78_000n * E18, updatedAt: 0 },
        { asset: 'BTC/USD', source: 'redstone', priceE18: 80_000n * E18, updatedAt: 0 },
      ],
      0,
    );
    // All three pairs differ by >50 bps → 3 alerts.
    expect(alerts).toHaveLength(3);
    const pairs = alerts.map((a) => a.oraclePair).sort();
    expect(pairs).toEqual(['chainlink_vs_pyth', 'chainlink_vs_redstone', 'pyth_vs_redstone']);
  });
});
