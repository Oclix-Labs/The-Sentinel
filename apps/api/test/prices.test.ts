import { SELF, env } from 'cloudflare:test';
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

  it('skips keys with extra segments (forward-compat for future key formats)', async () => {
    await seedPrice('BTC/USD', 'chainlink', 77_000n * 10n ** 18n, 1_700_000_000);
    // Directly write a key with an extra segment — readLatestPrices must drop it.
    await env.PRICES.put(
      'latest:BTC/USD:chainlink:v2',
      JSON.stringify({ priceE18: '99999', updatedAt: 1 }),
    );

    const res = await SELF.fetch('http://self/prices');
    const body = (await res.json()) as { prices: Array<{ source: string; priceE18: string }> };
    expect(body.prices).toHaveLength(1);
    expect(body.prices[0]).toMatchObject({
      source: 'chainlink',
      priceE18: (77_000n * 10n ** 18n).toString(),
    });
  });

  it('skips malformed JSON values without throwing', async () => {
    await seedPrice('ETH/USD', 'chainlink', 2_300n * 10n ** 18n, 1_700_000_000);
    await env.PRICES.put('latest:BTC/USD:chainlink', 'not-json');

    const res = await SELF.fetch('http://self/prices');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { prices: Array<{ asset: string }> };
    expect(body.prices).toHaveLength(1);
    expect(body.prices[0]).toMatchObject({ asset: 'ETH/USD' });
  });

  it('skips values where priceE18 is not a string', async () => {
    await env.PRICES.put(
      'latest:BTC/USD:chainlink',
      JSON.stringify({ priceE18: 12345, updatedAt: 1_700_000_000 }),
    );

    const res = await SELF.fetch('http://self/prices');
    const body = (await res.json()) as { prices: unknown[] };
    expect(body.prices).toEqual([]);
  });
});
