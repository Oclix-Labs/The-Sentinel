import type { OraclePrice } from '../types';

const HERMES_URL = 'https://hermes.pyth.network';

interface HermesParsedPrice {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

interface HermesResponse {
  parsed?: HermesParsedPrice[];
}

export interface PythFeedLookup {
  asset: string;
  feedId: string;
}

/**
 * Batch-fetch latest prices from Pyth Hermes (`/v2/updates/price/latest`). Skips feeds
 * whose ID isn't echoed back in the response. Returns one OraclePrice per resolved feed.
 */
export async function fetchPythPrices(feeds: readonly PythFeedLookup[]): Promise<OraclePrice[]> {
  if (feeds.length === 0) return [];

  const params = new URLSearchParams();
  for (const f of feeds) {
    params.append('ids[]', f.feedId.startsWith('0x') ? f.feedId : `0x${f.feedId}`);
  }
  params.set('parsed', 'true');

  const res = await fetch(`${HERMES_URL}/v2/updates/price/latest?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`pyth hermes ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as HermesResponse;
  const parsed = body.parsed ?? [];

  const normalizedLookup = new Map(
    feeds.map((f) => [f.feedId.toLowerCase().replace(/^0x/, ''), f.asset]),
  );

  const out: OraclePrice[] = [];
  for (const entry of parsed) {
    const normalizedId = entry.id.toLowerCase().replace(/^0x/, '');
    const asset = normalizedLookup.get(normalizedId);
    if (!asset) continue;

    // Pyth reports expo as negative for fractional prices. Scale to 18 decimals:
    // priceE18 = raw * 10^(18 + expo). For USD feeds expo is typically -8 so shift = 10.
    const shift = 18 + entry.price.expo;
    if (shift < 0) continue;
    const priceE18 = BigInt(entry.price.price) * 10n ** BigInt(shift);

    out.push({
      asset,
      source: 'pyth',
      priceE18,
      updatedAt: entry.price.publish_time,
      meta: { feedId: entry.id, expo: entry.price.expo },
    });
  }
  return out;
}
