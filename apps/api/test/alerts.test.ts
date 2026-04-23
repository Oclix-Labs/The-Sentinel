import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { seedAlert } from './fixtures';

describe('GET /alerts', () => {
  it('returns empty list when table is empty', async () => {
    const res = await SELF.fetch('http://self/alerts');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ alerts: [] });
  });

  it('returns rows ordered by block_timestamp DESC, default limit applied', async () => {
    for (let i = 0; i < 60; i++) {
      await seedAlert({
        asset: 'BTC/USD',
        oraclePair: 'chainlink_vs_pyth',
        deviationBps: 100 + i,
        alertType: 0,
        blockTimestamp: 1_700_000_000 + i,
        evidence: { chainlinkValue: '77000', pythValue: '77100' },
      });
    }

    const res = await SELF.fetch('http://self/alerts');
    const body = (await res.json()) as {
      alerts: Array<{ blockTimestamp: number; evidence: Record<string, unknown> }>;
    };
    expect(body.alerts).toHaveLength(50);
    expect(body.alerts[0]).toMatchObject({
      blockTimestamp: 1_700_000_059,
      evidence: { chainlinkValue: '77000' },
    });
    expect(body.alerts[49]).toMatchObject({ blockTimestamp: 1_700_000_010 });
  });

  it('respects ?asset filter', async () => {
    await seedAlert({
      asset: 'BTC/USD',
      oraclePair: 'chainlink_vs_pyth',
      deviationBps: 200,
      alertType: 0,
      blockTimestamp: 1_700_000_000,
      evidence: {},
    });
    await seedAlert({
      asset: 'ETH/USD',
      oraclePair: 'chainlink_vs_pyth',
      deviationBps: 300,
      alertType: 0,
      blockTimestamp: 1_700_000_010,
      evidence: {},
    });

    const res = await SELF.fetch('http://self/alerts?asset=BTC/USD');
    const body = (await res.json()) as { alerts: Array<{ asset: string }> };
    expect(body.alerts).toHaveLength(1);
    expect(body.alerts[0]).toMatchObject({ asset: 'BTC/USD' });
  });

  it('respects ?since filter (unix seconds)', async () => {
    await seedAlert({
      asset: 'BTC/USD',
      oraclePair: 'chainlink_vs_pyth',
      deviationBps: 100,
      alertType: 0,
      blockTimestamp: 1_700_000_000,
      evidence: {},
    });
    await seedAlert({
      asset: 'BTC/USD',
      oraclePair: 'chainlink_vs_pyth',
      deviationBps: 200,
      alertType: 0,
      blockTimestamp: 1_700_000_100,
      evidence: {},
    });

    const res = await SELF.fetch('http://self/alerts?since=1700000050');
    const body = (await res.json()) as { alerts: Array<{ blockTimestamp: number }> };
    expect(body.alerts).toHaveLength(1);
    expect(body.alerts[0]).toMatchObject({ blockTimestamp: 1_700_000_100 });
  });

  it('caps limit at 100', async () => {
    const res = await SELF.fetch('http://self/alerts?limit=101');
    expect(res.status).toBe(400);
  });

  it('rejects limit=0', async () => {
    const res = await SELF.fetch('http://self/alerts?limit=0');
    expect(res.status).toBe(400);
  });
});
