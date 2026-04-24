/**
 * Poller Worker — every minute, cross-checks Phase-1 asset prices across Chainlink
 * (Base Mainnet), Pyth Hermes, and RedStone REST. Deviations above per-asset thresholds
 * are emitted as AlertPayload messages on the ALERTS queue; alert-writer handles fan-out.
 *
 * Bindings (all optional in dev; required in staging/production):
 *   - DB       D1       alert + price history persistence
 *   - PRICES   KV       latest-price cache for public API
 *   - ALERTS   Queue    fan-out channel to alert-writer
 *
 * Owner: 모진영. Research: .research/oracle-inventory-base.md. Regression fixture:
 * src/compare.test.ts (Moonwell MIP-X43, 2026-02-15).
 */

import { http, createPublicClient } from 'viem';
import { base } from 'viem/chains';
import { buildAlerts } from './compare';
import { type AssetConfig, PHASE_1_ASSETS } from './config';
import { fetchChainlinkPrice } from './oracles/chainlink';
import { type PythFeedLookup, fetchPythPrices } from './oracles/pyth';
import { type RedStoneFeedLookup, fetchRedStonePrices } from './oracles/redstone';
import type { AlertPayload, OraclePrice } from './types';

export interface Env {
  ENVIRONMENT: 'staging' | 'production';
  BASE_RPC_URL: string;
  DB?: D1Database;
  PRICES?: KVNamespace;
  ALERTS?: Queue<AlertPayload>;
}

interface TickError {
  asset: string;
  source: string;
  error: string;
}

interface TickResult {
  ok: boolean;
  env: string;
  prices: Record<string, Record<string, string>>;
  alerts: AlertPayload[];
  errors: TickError[];
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    await runTick(env, ctx);
  },

  async fetch(_req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const result = await runTick(env, ctx);
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 'content-type': 'application/json' },
    });
  },
};

async function runTick(env: Env, ctx: ExecutionContext): Promise<TickResult> {
  const client = createPublicClient({ chain: base, transport: http(env.BASE_RPC_URL) });
  const errors: TickError[] = [];

  const [chainlinkPrices, pythPrices, redstonePrices] = await Promise.all([
    fetchChainlinkBatch(client, PHASE_1_ASSETS, errors),
    fetchPythBatch(PHASE_1_ASSETS, errors),
    fetchRedStoneBatch(PHASE_1_ASSETS, errors),
  ]);

  const allPrices: OraclePrice[] = [...chainlinkPrices, ...pythPrices, ...redstonePrices];
  const now = Math.floor(Date.now() / 1000);

  const alerts: AlertPayload[] = [];
  for (const asset of PHASE_1_ASSETS) {
    const forAsset = allPrices.filter((p) => p.asset === asset.symbol);
    alerts.push(...buildAlerts(asset, forAsset, now));
  }

  const sideEffects: Promise<unknown>[] = [];
  if (env.ALERTS) {
    for (const alert of alerts) sideEffects.push(env.ALERTS.send(alert));
  }
  if (env.PRICES) {
    for (const p of allPrices) {
      sideEffects.push(
        env.PRICES.put(
          `latest:${p.asset}:${p.source}`,
          JSON.stringify({ priceE18: p.priceE18.toString(), updatedAt: p.updatedAt }),
          { expirationTtl: 3600 },
        ),
      );
    }
  }
  if (env.DB && allPrices.length > 0) {
    sideEffects.push(writePriceHistory(env.DB, allPrices));
  }
  if (sideEffects.length > 0) {
    // Log rejections explicitly — bare Promise.allSettled swallows them and
    // staging D1/KV/Queue failures would leave no trace (review feedback on PR #2).
    ctx.waitUntil(
      Promise.allSettled(sideEffects).then((results) => {
        for (const r of results) {
          if (r.status === 'rejected') {
            console.error('[poller] side-effect failed', r.reason);
          }
        }
      }),
    );
  }

  const prices: Record<string, Record<string, string>> = {};
  for (const p of allPrices) {
    const bucket = prices[p.asset] ?? {};
    bucket[p.source] = p.priceE18.toString();
    prices[p.asset] = bucket;
  }

  console.info(
    `[poller] tick env=${env.ENVIRONMENT} fetched=${allPrices.length} alerts=${alerts.length} errors=${errors.length}`,
  );
  return { ok: true, env: env.ENVIRONMENT, prices, alerts, errors };
}

async function fetchChainlinkBatch(
  client: Parameters<typeof fetchChainlinkPrice>[0],
  assets: readonly AssetConfig[],
  errors: TickError[],
): Promise<OraclePrice[]> {
  const targets = assets
    .filter((a) => a.oracles.includes('chainlink') && a.chainlinkFeed)
    .map((a) => ({ symbol: a.symbol, feed: a.chainlinkFeed as `0x${string}` }));

  const settled = await Promise.allSettled(
    targets.map((t) => fetchChainlinkPrice(client, t.symbol, t.feed)),
  );

  const out: OraclePrice[] = [];
  for (let i = 0; i < settled.length; i++) {
    const s = settled[i];
    const t = targets[i];
    if (!s || !t) continue;
    if (s.status === 'fulfilled') out.push(s.value);
    else errors.push({ asset: t.symbol, source: 'chainlink', error: String(s.reason) });
  }
  return out;
}

async function fetchPythBatch(
  assets: readonly AssetConfig[],
  errors: TickError[],
): Promise<OraclePrice[]> {
  const lookups: PythFeedLookup[] = [];
  for (const a of assets) {
    if (a.oracles.includes('pyth') && a.pythFeedId) {
      lookups.push({ asset: a.symbol, feedId: a.pythFeedId });
    }
  }
  try {
    return await fetchPythPrices(lookups);
  } catch (err) {
    errors.push({ asset: 'all', source: 'pyth', error: String(err) });
    return [];
  }
}

async function fetchRedStoneBatch(
  assets: readonly AssetConfig[],
  errors: TickError[],
): Promise<OraclePrice[]> {
  const lookups: RedStoneFeedLookup[] = [];
  for (const a of assets) {
    if (a.oracles.includes('redstone') && a.redstoneSymbol) {
      lookups.push({ asset: a.symbol, symbol: a.redstoneSymbol });
    }
  }
  try {
    return await fetchRedStonePrices(lookups);
  } catch (err) {
    errors.push({ asset: 'all', source: 'redstone', error: String(err) });
    return [];
  }
}

async function writePriceHistory(db: D1Database, prices: readonly OraclePrice[]): Promise<void> {
  const stmt = db.prepare(
    'INSERT INTO price_history (asset, source, price_e18, updated_at) VALUES (?, ?, ?, ?)',
  );
  await db.batch(
    prices.map((p) => stmt.bind(p.asset, p.source, p.priceE18.toString(), p.updatedAt)),
  );
}
