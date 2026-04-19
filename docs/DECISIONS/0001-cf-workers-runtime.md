# ADR 0001: Use Cloudflare Workers as the runtime

**Status**: ACCEPTED
**Date**: 2026-04-19
**Deciders**: 권상현, 모진영 (with team consensus)

## Context

For Phase 1 MVP (8-day build sprint ending 2026-04-27) we must pick a backend runtime. Constraints:

- Cost-sensitive ("저렴하면 좋겠네")
- Off-chain cross-check of 3 oracles × 5 assets every 60 seconds
- Public HTTP API
- Queue-based alert fan-out
- Minimal on-chain contract interaction (write `AlertRegistry.logAlert(...)`)
- Phase 1 ships in 8 days with a 4-person student team

`.research/oracle-inventory-base.md` §7 quantifies that the **hybrid pattern — off-chain cross-check + on-chain alert emit only on deviation — is ~150× cheaper** than continuous on-chain Pyth/RedStone pull updates ($55/mo vs $8,750/mo). So the runtime must be optimized for off-chain compute, not on-chain composition.

## Decision

Adopt **Cloudflare Workers** (with `nodejs_compat` compatibility flag) + TypeScript for all server-side components (poller, alert-writer, public API). Bundle-mate Cloudflare platform services: **D1** (SQLite for alerts / subscribers / price history), **KV** (latest price cache), **Queues** (alert fan-out).

## Consequences

### Positive
- **$0–5/month** operating cost for Phase 1 volume (100% free tier feasible)
- Zero infrastructure operations (no VM, no cold-start concerns — V8 isolates)
- Bundled services (D1 / KV / Queues) remove integration work
- Global edge deployment by default; future latency benefits in Phase 2+
- TypeScript ecosystem — broadest Web3 library support (viem, Pyth SDK, RedStone)
- Team familiarity with JS/TS (all four members)

### Negative / cost
- Cloudflare platform lock-in (mitigated: TS code is portable to Fly.io / Railway with minimal change)
- Cron Triggers minimum 1 minute — not 30 s. Impact on detection latency assessed acceptable for Phase 1 (see §Detection latency budget in `.research/incident-forensics-moonwell.md` §6)
- D1 is SQLite — sufficient for Phase 1 volume (<10M rows) but not for Phase 3 analytic dashboards

### Neutral
- Sub-minute polling path exists via Durable Object alarms (deferred to Phase 2 if needed)

## Alternatives considered

### Alternative A — Fly.io container (always-on Node)
- Pros: True 30-second polling, no cron floor
- Rejected because: $5–30/mo cost for infrastructure Oclix doesn't need, operational overhead of managing containers

### Alternative B — Vercel Serverless + Cron
- Pros: Familiar Next.js developer experience
- Rejected because: Cron minimum 1 minute (same as CF), no bundled queue primitive (would need Upstash), less web3-friendly

### Alternative C — Full on-chain (Pyth `updatePriceFeeds` every 30 s)
- Pros: Maximally decentralized from day 1
- Rejected because: `.research/oracle-inventory-base.md` §7 quantifies $8,750/mo cost — 150× more than hybrid pattern — for no additional detection capability

## Related research / prior decisions

- `.research/oracle-inventory-base.md` §7 (gas cost & infra implications)
- `.research/oracle-inventory-base.md` §8 (Phase-1 feasibility verdict)

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —
