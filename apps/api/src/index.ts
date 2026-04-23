/**
 * Public API Worker — Hono HTTP server.
 *
 * Endpoints (Phase 1):
 *   GET  /             — project metadata
 *   GET  /health       — liveness probe
 *   GET  /prices       — latest cross-check snapshot per asset
 *   GET  /alerts       — recent alerts (query: asset, limit, since)
 *   POST /subscribers  — register webhook or telegram subscription
 *
 * Owner: 모진영. D1 schema: apps/poller/migrations/0001_init.sql.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  PRICES: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({ origin: '*' }));

app.get('/', (c) =>
  c.json({
    name: 'RWA Sentinel',
    env: c.env.ENVIRONMENT,
    company: 'Oclix Labs',
    docs: 'https://github.com/Oclix-Labs/The-Sentinel',
  }),
);

app.get('/health', (c) => c.json({ status: 'ok', env: c.env.ENVIRONMENT }));

app.get('/prices', async (c) => c.json({ prices: [], note: 'stub — implemented in Task 4' }));

app.get('/alerts', async (c) => c.json({ alerts: [], note: 'stub — implemented in Task 5' }));

app.post('/subscribers', async (c) =>
  c.json({ error: 'not implemented', note: 'stub — implemented in Task 6' }, 501),
);

export default app;
