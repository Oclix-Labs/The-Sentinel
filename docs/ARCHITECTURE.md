# Architecture — The Sentinel

> Technical architecture for Phase 1 MVP (ships 2026-04-27). For Phase 2/3 architecture evolution see [`ROADMAP.md`](./ROADMAP.md).

## System diagram

```
                        ┌─────────────────────────────────────────────┐
                        │             Cloudflare Edge                  │
                        │                                              │
   Cron (1 min) ──────▶ │   [Poller Worker]                            │
                        │       │                                      │
                        │       ├── fetch Chainlink latestRoundData    │
                        │       ├── fetch Pyth Hermes (sponsored/pull) │
                        │       └── fetch RedStone REST                │
                        │                                              │
                        │       │                                      │
                        │       ▼                                      │
                        │   normalize → pairwise deviation check       │
                        │       │                                      │
                        │  deviation > threshold?                      │
                        │       │                                      │
                        │       ▼ yes                                  │
                        │   [Queue: ALERTS]                            │
                        │       │                                      │
                        │       ▼                                      │
                        │   [AlertWriter Worker] (Queue consumer)      │
                        │       ├── INSERT D1.alerts                   │
                        │       ├── call AlertRegistry.logAlert() ───────┐
                        │       ├── webhook fan-out                      │
                        │       └── Telegram sendMessage                 │
                        │                                              │ │
                        │   [API Worker] Hono ──────── /alerts /prices  │ │
                        │                              /subscribers     │ │
                        └─────────────────────────────────────────────┘ │
                                                                         │
                                                                         ▼
                                                     ┌────────────────────────────────────┐
                                                     │           Base Mainnet              │
                                                     │   AlertRegistry.sol (MIT)           │
                                                     │   (append-only alert audit log)     │
                                                     └────────────────────────────────────┘
```

## Components

### `apps/poller` — cron-triggered polling Worker

Responsibility: every minute, fetch current prices from Chainlink / Pyth / RedStone for the 5 Phase-1 assets, compute pairwise deviations, and publish to the `ALERTS` queue if > threshold. Does NOT write to chain or databases.

- Entry: `scheduled` handler (see `apps/poller/src/index.ts`)
- Output: messages on CF Queue `rwa-sentinel-alerts-{env}`
- Persistence: latest prices → CF KV (`PRICES` binding)
- Config: `apps/poller/wrangler.jsonc` sets cron + env bindings
- Asset list: `PHASE_1_ASSETS` constant (see `AGENTS.md` §Stack for rationale)

### `apps/alert-writer` — Queue consumer Worker

Responsibility: consume `ALERTS` queue; persist to D1; call `AlertRegistry.logAlert` on-chain; fan out to subscribers (webhook / Telegram).

- Entry: `queue` handler
- Persistence: CF D1 `alerts` + `subscribers` tables
- On-chain: viem walletClient → `AlertRegistry.logAlert(asset, oraclePair, deviationBps, evidenceHash, alertType)` on Base
- Secret: `PUBLISHER_PRIVATE_KEY` (wrangler secret)

### `apps/api` — Hono HTTP API Worker

Responsibility: public HTTP endpoints for querying alerts, prices, and registering subscribers.

Endpoints:

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness probe |
| GET | `/prices` | latest price snapshot per (asset, oracle) from KV |
| GET | `/alerts` | recent alerts from D1 (query: asset, limit, since) |
| POST | `/subscribers` | register webhook subscription |

### `apps/contracts` — Foundry project

Responsibility: on-chain alert registry.

- `AlertRegistry.sol` — append-only Alert log; access-controlled `logAlert`; admin + publisher roles
- Deploy: Base Sepolia (dev) and Base Mainnet (prod)
- Tests: `forge test -vvv` must pass; includes Moonwell cbETH replay fixture

## Data stores

### CF D1 (SQLite)

Tables (to be implemented D2-D3 by 모진영):

- `alerts(id, asset, oracle_pair, deviation_bps, block_ts, evidence_hash, alert_type, tx_hash, delivery_status, created_at)`
- `subscribers(id, webhook_url, asset_filter, tg_chat_id, api_key_hash, created_at)`
- `price_history(asset, oracle, price, decimals, ts)` — 24-hour rolling (older rows pruned)

### CF KV

- `PRICES` — key = `<asset>:<oracle>`, value = `{ price, decimals, ts }`

### CF Queues

- `rwa-sentinel-alerts-{env}` — messages typed as `AlertPayload` (see `apps/alert-writer/src/index.ts`)

## Data flow (deviation detected)

1. Poller tick at T: fetches 5 × 3 oracle values.
2. Normalize each to 18 decimals.
3. For each asset, compute pairwise bps deviation between oracle pairs.
4. Max deviation > threshold? If yes → `ALERTS.send({asset, oraclePair, deviationBps, blockTimestamp, evidence, alertType})`.
5. AlertWriter consumes:
   - Insert into D1.alerts
   - Sign + send `AlertRegistry.logAlert(...)` transaction
   - SELECT matching subscribers; for each: POST webhook OR Telegram sendMessage
   - Update D1.alerts row with tx_hash + delivery status

## Failure modes and responses

| Failure | Behavior |
|---|---|
| Oracle RPC timeout | skip that oracle for this tick; if < 2 oracles respond, skip deviation check and log `insufficient_sources` |
| Pyth Hermes 429 rate limit | backoff 1 minute, retry once |
| Queue send failure | CF automatically retries; if still failing after 3 attempts, message dead-letters |
| Contract call revert | retry once with fresh nonce; if still failing, record `onchain_delivery_failed` in D1.alerts and continue off-chain delivery |
| D1 quota exceeded | alerts still emit off-chain + on-chain; ingest resumes when quota window resets (never loses data because we also have KV snapshots) |
| Secret key rotation | `wrangler secret put PUBLISHER_PRIVATE_KEY <new>`; contract admin rotates publisher role via `setPublisher` |

## Configuration

All per-environment configuration lives in each app's `wrangler.jsonc` `env.staging` / `env.production` block. Shared settings:

- `compatibility_date: "2026-04-01"`
- `compatibility_flags: ["nodejs_compat"]`

## Observability (Phase 1 — minimal)

- CF dashboard: Request / Error / CPU per Worker
- `console.log` in handlers → CF Logs (no external log sink in Phase 1)
- D1 query: `SELECT count(*) FROM alerts WHERE created_at > datetime('now', '-24 hours')` — daily alert count smoke test

Phase 2 adds: OpenTelemetry traces to Axiom or Baselime.

## Open technical decisions deferred

See `AGENTS.md` §"Open technical decisions" and carry on in Agenda #Q4+ on:

- Single Worker vs multi-Worker split (chose multi: 3 Workers for clear boundaries)
- Telegram library choice (grammy vs node-telegram-bot-api vs hand-rolled fetch)
- Rate-limiting strategy for public API
- Webhook signature verification (for subscribers verifying authenticity)

---

_Owner: 모진영. Update when architecture changes (via PR with ADR if material)._
