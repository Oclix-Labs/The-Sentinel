import type { OracleSource, PriceSnapshot } from './types';

const ORACLE_SOURCES: readonly OracleSource[] = ['chainlink', 'pyth', 'redstone'];

function isOracleSource(value: string): value is OracleSource {
  return ORACLE_SOURCES.includes(value as OracleSource);
}

interface KvPriceRecord {
  priceE18: string;
  updatedAt: number;
}

export async function readLatestPrices(kv: KVNamespace): Promise<PriceSnapshot[]> {
  const listed = await kv.list({ prefix: 'latest:' });
  const snapshots: PriceSnapshot[] = [];

  for (const key of listed.keys) {
    const parts = key.name.split(':');
    if (parts.length !== 3) continue;
    const [, asset, source] = parts;
    if (!asset || !source || !isOracleSource(source)) continue;

    const raw = await kv.get(key.name);
    if (!raw) continue;

    let parsed: KvPriceRecord;
    try {
      parsed = JSON.parse(raw) as KvPriceRecord;
    } catch {
      continue;
    }
    if (typeof parsed.priceE18 !== 'string' || typeof parsed.updatedAt !== 'number') continue;

    snapshots.push({
      asset,
      source,
      priceE18: parsed.priceE18,
      updatedAt: parsed.updatedAt,
    });
  }

  snapshots.sort((a, b) => {
    if (a.asset !== b.asset) return a.asset < b.asset ? -1 : 1;
    return a.source < b.source ? -1 : 1;
  });
  return snapshots;
}
