# ADR 0004: Branch strategy — `main` (prod) + `dev` (staging) + feature branches

**Status**: ACCEPTED
**Date**: 2026-04-19
**Deciders**: 모진영, 권상현 (consensus with team)

## Context

4-person team shipping an MVP in 8 days with split deployments:

- Cloudflare Workers (3 workers: poller, alert-writer, api)
- Foundry contract on Base Sepolia (dev) + Base Mainnet (prod)
- Public GitHub repo (private until D7 per `AGENTS.md`)

A safe demo-record state is needed for the 1-minute founder video. Simultaneously, most-recent code must be deployable for judges to inspect.

## Decision

Two-branch main-stream model:

- **`main`** — production. Deploys to `rwa-sentinel.workers.dev` and Base Mainnet contracts. Merges require 권상현 approval.
- **`dev`** — staging. Default PR target. Deploys to `rwa-sentinel-staging.workers.dev` and Base Sepolia.
- **`feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`** — work branches. PR → `dev`.
- **Release flow**: `dev → main` PR when ready for production; 권상현 approves.

Force-push is prohibited on `main` and `dev` (GitHub branch protection). Feature branches allow force-push.

## Consequences

### Positive
- Clean separation between demo-stable (`main`) and active-work (`dev`) states
- CI/CD simplicity: per-branch deploy targets via wrangler env flags
- Base Sepolia serves as contract staging; zero cost for dev deploys
- Single source of truth for "what's live in prod" = `main` HEAD

### Negative / cost
- Slightly slower than trunk-based (single-branch) for solo dev — acceptable for 4-person team
- `dev → main` PR adds a step vs direct push to main

### Neutral
- No release branches (no parallel major versions expected before Phase 2)

## Alternatives considered

### Alternative A — Trunk-based (single `main`)
- Pros: Simpler mental model
- Rejected because: Founder video requires stable demo state; direct-to-main risks breaking demo right before submission

### Alternative B — Full GitFlow (develop + master + release/* + hotfix/* + feature/*)
- Pros: Battle-tested for bigger teams
- Rejected because: ceremony overhead not justified for 4-person 8-day sprint

## Related research / prior decisions

- `AGENTS.md` §Branch & commit (authoritative rules)
- `CONTRIBUTING.md` §Branch strategy (human-facing summary)
- `.github/workflows/deploy-*.yml` (per-branch deploy automation, added separately)

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —
