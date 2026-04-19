# The Sentinel

> The public watchdog for tokenized RWAs on Base.
> By Oclix Labs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status: Pre-release](https://img.shields.io/badge/Status-Pre--release-orange.svg)]()
[![Base Batches 003](https://img.shields.io/badge/Base%20Batches-003%20Student%20Track-blue.svg)]()

> ⚠️ Pre-release / Base Batches 003 submission state (2026-04). Interfaces and on-chain addresses may change until v1.0.

## What is this

Over the past 18 months, at least **nine oracle-composition or hardcoded-oracle failures** across Base-adjacent DeFi have caused **≥$50M in losses** — most recently the Moonwell cbETH incident of February 2026 ($2.68M, ~181 borrowers). Every single one would have been caught by a simple multi-oracle cross-check in the same block it occurred.

Today, no public service provides this for Base. Chaos Labs, Hypernative, and Forta are enterprise-only; RWA.xyz has no alerts; Chainlink Proof-of-Reserve publishes data but never warns.

**RWA Sentinel** is the public, free, retail-facing watchdog that closes that gap — with an append-only on-chain alert log on Base Mainnet so anyone can verify detection history without trusting our backend.

## Phase 1 coverage (5 assets)

| Asset | Cross-check sources |
|---|---|
| BTC / USD | Chainlink + Pyth + RedStone (triple-sourced) |
| ETH / USD | Chainlink + Pyth + RedStone (triple-sourced) |
| USDC / USD | Chainlink + Pyth + RedStone (triple-sourced) |
| cbETH / USD | Chainlink + Pyth sponsored (dual-sourced — Moonwell incident replay target) |
| USDO | Chainlink Proof-of-Reserve attestation tracking (Base-native) |

## Architecture at a glance

```
┌──────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                            │
│                                                               │
│   [Poller Worker]  ──── cron 1min ───── 5 assets × 3 oracles │
│        │                                                      │
│        ▼                                                      │
│   ±2% deviation check ── if exceeded ──▶ Queue                │
│                                             │                 │
│                                             ▼                 │
│   [AlertWriter Worker]  ──┬──▶ D1 (alert log)                │
│                           ├──▶ Webhook / Telegram            │
│                           └──▶ Base AlertRegistry (on-chain) │
│                                                               │
│   [Public API Worker]  (Hono)  ──▶ GET /alerts /prices       │
└──────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │      Base Mainnet         │
                        │   AlertRegistry.sol       │
                        │  (append-only alert log)  │
                        └──────────────────────────┘
```

## Roadmap (Progressive Decentralization)

| Phase | Window | Decentralization | Token |
|---|---|---|---|
| **1** | 2026 Q2 | Centralized MVP (Oclix Labs runs poller) | None |
| **2** | 2026 Q4 – 2027 Q1 | Federated — 2-3 independent operators | Designed, not issued |
| **3** | 2027 Q2+ | Permissionless network + DAO | **SENTINEL live** |

Full roadmap in [`docs/ROADMAP.md`](./docs/ROADMAP.md). Token framework in [`docs/TOKENOMICS-OUTLINE.md`](./docs/TOKENOMICS-OUTLINE.md). Lite Whitepaper in [`docs/WHITEPAPER-v0.1-SKELETON.md`](./docs/WHITEPAPER-v0.1-SKELETON.md).

## Team

Four undergraduates from [Yonsei University's BAY Blockchain Society](https://yonsei-bay.xyz):

- **권상현 (Sanghyun Kwon)** — Team Lead + Smart Contracts
- **모진영 (Jinyoung Mo)** — Core Engine + Backend + Infrastructure
- **이재근 (Jaegeun Lee)** — Marketing + Community + Frontend
- **김현우 (Hyunwoo Kim)** — Research + Video + Documentation

Based in Seoul. Oclix Labs incorporating in Delaware post-Base Batches.

## Repository layout

```
.
├── apps/
│   ├── contracts/          # Foundry project — AlertRegistry.sol
│   ├── poller/             # CF Worker — cron polling + deviation detection
│   ├── alert-writer/       # CF Worker — Queue consumer + alert fan-out
│   └── api/                # CF Worker — public HTTP API (Hono)
├── packages/               # (shared types, oracle adapters — later)
├── docs/
│   ├── SSOT-INDEX.md       # 🎯 agent entry point — read first
│   ├── ROADMAP.md
│   ├── TOKENOMICS-OUTLINE.md
│   ├── WHITEPAPER-v0.1-SKELETON.md
│   ├── APPLICATION-BM-DRAFTS.md
│   ├── MEMBER-TASKS.md
│   └── DECISIONS/          # ADRs (Architecture Decision Records)
├── .research/              # SSOT — external reality snapshots (cite, don't copy)
├── AGENTS.md               # primary rules for AI agents
├── CLAUDE.md               # Claude Code-specific notes
└── LICENSE                 # MIT
```

## Local development

> ⚠️ Most of this repository is stub / scaffold state during Base Batches build sprint (2026-04-19 to 2026-04-27). See [`docs/MEMBER-TASKS.md`](./docs/MEMBER-TASKS.md) for build plan.

```bash
pnpm install
pnpm --filter poller dev          # run poller locally
pnpm --filter api dev             # run public API locally
pnpm --filter contracts test      # Foundry tests
```

See [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for full setup.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`AGENTS.md`](./AGENTS.md).

## License

MIT — see [`LICENSE`](./LICENSE).
