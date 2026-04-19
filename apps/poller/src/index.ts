/**
 * Poller Worker — D1 target: runs every minute via Cron Trigger, fetches prices from
 * Chainlink (Base), Pyth (Hermes), and RedStone (REST) for the Phase-1 asset set,
 * computes pairwise deviations, and publishes to the `ALERTS` queue when > threshold.
 *
 * Scope (locked): BTC/USD, ETH/USD, USDC/USD, cbETH/USD (price) + USDO (attestation-only).
 *
 * Status: STUB. Replace `poll()` body with real implementation in D1–D3.
 * Owner: 모진영. Research: .research/oracle-inventory-base.md.
 */

export interface Env {
  ENVIRONMENT: 'staging' | 'production';
  BASE_RPC_URL: string;
  // DB: D1Database;
  // PRICES: KVNamespace;
  // ALERTS: Queue<AlertPayload>;
}

// Phase-1 asset coverage (locked — see docs/DECISIONS/0002-phase1-scope-5-assets.md).
const PHASE_1_ASSETS = [
  { symbol: 'BTC/USD', thresholdBps: 50 },
  { symbol: 'ETH/USD', thresholdBps: 50 },
  { symbol: 'USDC/USD', thresholdBps: 20 },
  { symbol: 'cbETH/USD', thresholdBps: 50 },
] as const;

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await poll(env);
  },

  async fetch(_req: Request, env: Env): Promise<Response> {
    // Manual invocation for local dev / debugging.
    await poll(env);
    return new Response(
      JSON.stringify({ ok: true, env: env.ENVIRONMENT, assets: PHASE_1_ASSETS }),
      { headers: { 'content-type': 'application/json' } },
    );
  },
};

/**
 * D1-D3 implementation plan (모진영):
 *   1. For each asset in PHASE_1_ASSETS:
 *      a. Fetch Chainlink latest round via viem + BASE_RPC_URL
 *      b. Fetch Pyth price via Hermes REST (hermes.pyth.network/v2/updates/price/latest)
 *      c. Fetch RedStone price via REST (api.redstone.finance/prices)
 *   2. Normalize to 18 decimals, compute pairwise deviation in basis points.
 *   3. If max deviation > thresholdBps → publish AlertPayload to ALERTS queue.
 *   4. Write latest prices snapshot to PRICES KV (key = symbol).
 *   5. Log tick summary to D1 price_history table.
 *
 * Keep this file ≤ 300 lines. Split into src/oracles/{chainlink,pyth,redstone}.ts and
 * src/compare.ts as logic lands.
 */
async function poll(env: Env): Promise<void> {
  // TODO(모진영): implement per plan above.
  console.log(`[poller] tick env=${env.ENVIRONMENT} assets=${PHASE_1_ASSETS.length}`);
}
