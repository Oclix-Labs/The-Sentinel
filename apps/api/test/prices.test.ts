import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { seedPrice } from './fixtures';

describe('GET /prices', () => {
  it('returns empty list when KV is empty', async () => {
    const res = await SELF.fetch('http://self/prices');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { prices: unknown[] };
    expect(body.prices).toEqual([]);
  });

  it('returns one entry per seeded asset/source pair', async () => {
    await seedPrice('BTC/USD', 'chainlink', 77_000n * 10n ** 18n, 1_700_000_000);
    await seedPrice('BTC/USD', 'pyth', 77_100n * 10n ** 18n, 1_700_000_010);
    await seedPrice('ETH/USD', 'chainlink', 2_300n * 10n ** 18n, 1_700_000_020);

    const res = await SELF.fetch('http://self/prices');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      prices: Array<{ asset: string; source: string; priceE18: string; updatedAt: number }>;
    };
    expect(body.prices).toHaveLength(3);

    const btcChainlink = body.prices.find((p) => p.asset === 'BTC/USD' && p.source === 'chainlink');
    expect(btcChainlink).toEqual({
      asset: 'BTC/USD',
      source: 'chainlink',
      priceE18: (77_000n * 10n ** 18n).toString(),
      updatedAt: 1_700_000_000,
    });
  });

  it('sorts output by asset then source alphabetical for stable diff', async () => {
    await seedPrice('ETH/USD', 'pyth', 1n, 1);
    await seedPrice('BTC/USD', 'redstone', 2n, 2);
    await seedPrice('BTC/USD', 'chainlink', 3n, 3);

    const res = await SELF.fetch('http://self/prices');
    const body = (await res.json()) as { prices: Array<{ asset: string; source: string }> };
    const keys = body.prices.map((p) => `${p.asset}:${p.source}`);
    expect(keys).toEqual(['BTC/USD:chainlink', 'BTC/USD:redstone', 'ETH/USD:pyth']);
  });
});
