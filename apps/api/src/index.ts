/**
 * Public API Worker — Hono HTTP server.
 *
 * Endpoints (Phase 1):
 *   GET  /health         — liveness probe
 *   GET  /prices         — latest cross-check snapshot for all Phase-1 assets
 *   GET  /alerts         — recent alerts (query params: asset, limit, since)
 *   POST /subscribers    — register webhook subscription
 *
 * Owner: 모진영. Implement in D3–D5.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
  ENVIRONMENT: 'staging' | 'production';
  // DB: D1Database;
  // PRICES: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) =>
  c.json({
    name: 'RWA Sentinel',
    env: c.env.ENVIRONMENT,
    company: 'Oclix Labs',
    docs: 'https://github.com/Oclix-Labs/The-Sentinel',
  }),
);

app.get('/health', (c) => c.json({ status: 'ok', env: c.env.ENVIRONMENT }));

app.get('/prices', async (c) => {
  // TODO(모진영): read from KV or D1 price_history (latest per asset).
  return c.json({ assets: [], note: 'stub — implemented D3-D5' });
});

app.get('/alerts', async (c) => {
  // TODO(모진영): SELECT FROM D1.alerts ORDER BY block_timestamp DESC LIMIT :limit.
  return c.json({ alerts: [], note: 'stub — implemented D3-D5' });
});

app.post('/subscribers', async (c) => {
  // TODO(모진영): validate payload with zod, insert into D1.subscribers, return subscription id.
  return c.json({ error: 'not implemented', note: 'stub — implemented D3-D5' }, 501);
});

export default app;
