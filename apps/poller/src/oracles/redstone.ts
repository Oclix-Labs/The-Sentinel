import type { OraclePrice } from '../types';

const REDSTONE_URL = 'https://api.redstone.finance';

interface RedStoneEntry {
  symbol: string;
  value: number;
  timestamp: number;
  provider?: string;
}

type RedStoneResponse = Record<string, RedStoneEntry>;

export interface RedStoneFeedLookup {
  asset: string;
  symbol: string;
}

/**
 * Batch-fetch latest prices from RedStone REST (`/prices?symbols=...`).
 * The default `redstone` provider returns aggregated values equivalent to on-chain push.
 */
export async function fetchRedStonePrices(
  feeds: readonly RedStoneFeedLookup[],
): Promise<OraclePrice[]> {
  if (feeds.length === 0) return [];
  const symbols = feeds.map((f) => f.symbol).join(',');
  const res = await fetch(
    `${REDSTONE_URL}/prices?symbols=${encodeURIComponent(symbols)}&provider=redstone`,
  );
  if (!res.ok) {
    throw new Error(`redstone ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as RedStoneResponse;

  const out: OraclePrice[] = [];
  for (const f of feeds) {
    const entry = body[f.symbol];
    if (!entry) continue;
    // Float USD → fixed-point: round to 8 decimals first to kill float drift, then scale to 18.
    const scaled8 = Math.round(entry.value * 1e8);
    if (!Number.isFinite(scaled8) || scaled8 <= 0) continue;
    const priceE18 = BigInt(scaled8) * 10n ** 10n;
    out.push({
      asset: f.asset,
      source: 'redstone',
      priceE18,
      // RedStone timestamps are ms; OraclePrice.updatedAt is unix seconds.
      updatedAt: Math.floor(entry.timestamp / 1000),
      meta: { symbol: f.symbol, provider: entry.provider ?? 'redstone' },
    });
  }
  return out;
}
