# RWA Sentinel

> The public watchdog for tokenized RWAs on Base.
> By Oclix Labs · MIT-licensed · Live on Base Mainnet.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Base Mainnet](https://img.shields.io/badge/Base-Mainnet-0052FF.svg)](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876)
[![AlertRegistry Verified](https://img.shields.io/badge/AlertRegistry-Verified-success.svg)](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code)
[![Whitepaper](https://img.shields.io/badge/Whitepaper-v0.1%20Lite-informational.svg)](./docs/WHITEPAPER-v0.1-SKELETON.md)
[![Base Batches 003](https://img.shields.io/badge/Base%20Batches-003%20Student%20Track-blueviolet.svg)](https://base-batches-student-track-3.devfolio.co/)

---

## Live

- **Mainnet contract**: [`AlertRegistry.sol`](./apps/contracts/src/AlertRegistry.sol) at [`0x79b5d74A301079c86D13eb71e2787852F403F876`](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876) — Verified on Basescan
- **Landing**: [oclixlabs.xyz](https://oclixlabs.xyz) (mirror: [oclix-sentinel-landing.pages.dev](https://oclix-sentinel-landing.pages.dev))
- **Lite Whitepaper v0.1**: [`docs/WHITEPAPER-v0.1-SKELETON.md`](./docs/WHITEPAPER-v0.1-SKELETON.md) (45 pages)
- **First on-chain alert** (alertId=0): [Basescan tx `0x6887b042…`](https://basescan.org/tx/0x6887b042a839ec4d1a2b1e936b4bd5c304ee9e2b0f4b9d17cb711d4e04338c09)

---

## Why this exists

Over the past 18 months, at least **nine oracle-composition or hardcoded-oracle failures** across Base-adjacent DeFi caused **≥$50M in cumulative losses** — most recently the Moonwell cbETH incident of February 2026 ($2.68M, 181 borrowers). Every one of these would have been detected in the same block by a multi-oracle cross-check at a 2% threshold. None of the existing tools provide that for retail.

| Existing tool | Coverage gap |
|---|---|
| **Chaos Labs** | 7-figure SLAs, protocol-side only |
| **Hypernative** | $40M Series B, enterprise only |
| **Forta Network** | Migrated to paid FORT-token subscription |
| **RWA.xyz** | $500/seat/month, no alerts |
| **Chainlink Proof-of-Reserve** | Publishes data, never warns |
| **OpenZeppelin Defender** | **Sunsetting July 2026** |

**Three structural forces converge through 2026** that make this build window time-sensitive:

1. **Base RWA TVL** — ~18× growth in 24 months (early 2024 ~$60M → L2Beat Dec 2025 ~$1.1B)
2. **OpenZeppelin Defender retirement (July 2026)** — leaves the retail-facing programmable monitoring slot structurally empty
3. **AI-accelerated contract development** — the Moonwell cbETH bug itself was AI-coauthored (`Co-Authored-By: Claude Opus 4.6` trailers in `moonwell-contracts-v2#578`), and AI-assisted contract output is now standard across DeFi

RWA Sentinel is the runtime safety net the AI-coding era requires: not a substitute for code review, but the only public mechanism that catches what review missed once code is live.

---

## How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare Edge                             │
│                                                                  │
│  Cron 1 min                                                      │
│      │                                                           │
│      ▼                                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. INGESTION (apps/poller)                                │  │
│  │    BTC/ETH/USDC/cbETH × Chainlink + Pyth + RedStone       │  │
│  │    USDO × Chainlink Proof-of-Reserve                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 2. CROSS-CHECK                                            │  │
│  │    Pairwise basis-point deviation per asset class         │  │
│  │    ±0.5% stable / ±2% LST / ±2% crypto / heartbeat-based  │  │
│  └───────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 3. ATTESTATION TRACKING (USDO PoR; Phase 2: cbBTC etc.)  │  │
│  │    Staleness + reserve-vs-supply delta                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 4. ALERT (apps/alert-writer)                              │  │
│  │    ├── D1 (audit log)                                     │  │
│  │    ├── Webhook subscribers (HMAC-signed)                  │  │
│  │    ├── Telegram bot (apps/telegram-bot)                   │  │
│  │    └── ON-CHAIN: AlertRegistry.logAlert(...)              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Public API (apps/api · Hono): GET /prices /alerts /subscribers │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                       ┌───────────────────────────┐
                       │      Base Mainnet          │
                       │   AlertRegistry.sol        │
                       │  (append-only · 157 LOC)   │
                       │  0x79b5d7…F403F876         │
                       └───────────────────────────┘
```

Detailed pipeline narrative + per-asset oracle coverage table + threshold rationale: [Whitepaper §3 Architecture](./docs/WHITEPAPER-v0.1-SKELETON.md#3-architecture).

---

## Phase 1 coverage (5 assets)

| Asset | Chainlink | Pyth | RedStone | Mechanism |
|---|---|---|---|---|
| BTC / USD | ✅ | ✅ | ✅ | triple-source price cross-check |
| ETH / USD | ✅ | ✅ | ✅ | triple-source price cross-check |
| USDC / USD | ✅ | ✅ | ✅ | triple-source price cross-check |
| cbETH / USD | ✅ | ✅ | ❌ | dual-source price cross-check (Moonwell replay target) |
| USDO | PoR feed | n/a | n/a | single-source attestation tracking |

Honest about cbETH dual-source limit. Phase 2 federation across independent operators on different infra is the structural answer to single-feed-pair risk.

---

## What makes this different

- **Multi-oracle cross-check + PoR attestation tracking** as two complementary detection mechanisms — not a single one-size-fits-all rule
- **Programmable alert hooks** (Phase 2 Premium feature) — `SentinelReceiver` interface lets subscribers register on-chain auto-actions (auto-withdraw, auto-pause, auto-migrate) triggered atomically in the same block as detection. CCIP destination-side execution pattern. Closes the "detect but can't act" gap created by 5-day governance timelocks.
- **Path I tokenomics** — zero team allocation, zero investor allocation, zero pre-launch token sale. Founders may participate as Phase 3 operators with 4-year vest + 1-year cliff + 5% cap. Phase 2 funding via Oclix Labs Inc USD-denominated equity, mirror of the Vercel / Apollo / Optimism Labs SaaS-on-public-good pattern. See [Whitepaper §4](./docs/WHITEPAPER-v0.1-SKELETON.md#4-tokenomics-framework-directional).
- **Composability** — Sentinel as a risk-event trigger primitive that other DeFi protocols compose on top of: insurance auto-payout, lending curator auto-pause, RWA issuer self-monitoring, DEX aggregator routing, wallet provider native warnings. See [Whitepaper §3.6](./docs/WHITEPAPER-v0.1-SKELETON.md#36-composability--sentinel-as-a-risk-event-trigger-primitive).
- **MIT-licensed forever** — the operator client, the contract, the public API. Free public alert tier is constitutionally guaranteed across all phases.

---

## Roadmap (Progressive Decentralization)

| Phase | Window | Decentralization | Funding | Token |
|---|---|---|---|---|
| **1** | 2026 Q2 | Centralized MVP — single team operates one poller | Base Batches 003 ($50K) | None |
| **2** | 2026 Q4 – 2027 Q1 | Federated — 2–3 independent operators with N-of-M consensus | Pre-seed ($1–2M USD-equity) | Designed, not issued |
| **3** | 2027 Q2+ | Permissionless — anyone stakes SENTINEL to run an operator; DAO governance | Seed/Series A ($5–10M) + token launch | **SENTINEL live** |

Full per-phase deliverables, success criteria, and funding plan: [`docs/ROADMAP.md`](./docs/ROADMAP.md) and [Whitepaper §7](./docs/WHITEPAPER-v0.1-SKELETON.md#7-roadmap).

---

## Threat model

Eight adversary classes mapped against Phase 1 vs Phase 3 surface and primary mitigation, plus a fork-resistance moat analysis (seven reasons why MIT licensing does not invite Coinbase / Chaos Labs / fast-follower forks). See [Whitepaper §6.2](./docs/WHITEPAPER-v0.1-SKELETON.md#62-threat-model) and [§10.8](./docs/WHITEPAPER-v0.1-SKELETON.md#108-fork-risk-and-competitive-moat-narrowness).

---

## Team

Four undergraduates from [Yonsei University's BAY Blockchain Society](https://yonsei-bay.xyz):

- **권상현 (Sanghyun Kwon)** — Team Lead + Smart Contracts ([@SangHyeonKwon](https://github.com/SangHyeonKwon))
- **모진영 (Jinyoung Mo)** — Core Engine + Backend + Infrastructure
- **이재근 (Jaegeun Lee)** — Marketing + Community + Frontend + Whitepaper
- **김현우 (Hyunwoo Kim)** — English + Research + Video + Documentation

Bios + GitHub + LinkedIn: [`docs/TEAM.md`](./docs/TEAM.md). Phase 2 advisor engagement targets named in [Whitepaper §9](./docs/WHITEPAPER-v0.1-SKELETON.md#9-team).

---

## Repository layout

```
.
├── apps/
│   ├── contracts/            # Foundry — AlertRegistry.sol on Base Mainnet
│   ├── poller/               # CF Worker — cron-driven multi-oracle ingestion
│   ├── alert-writer/         # CF Worker — Queue consumer, on-chain anchor, fan-out
│   ├── api/                  # CF Worker — public Hono REST API
│   ├── telegram-bot/         # CF Worker — subscriber alert delivery
│   ├── landing/              # Static landing (legacy fallback)
│   └── landing-next/         # Next.js 14 + Cloudflare Pages — primary landing
├── docs/
│   ├── WHITEPAPER-v0.1-SKELETON.md      # 45-page Lite Whitepaper v0.1
│   ├── ROADMAP.md                       # Progressive Decentralization 3-phase
│   ├── TOKENOMICS-OUTLINE.md            # Long-form Path I tokenomics spec
│   ├── ADDRESSES.md                     # On-chain deployment registry
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── TEAM.md
│   ├── MEMBER-TASKS.md
│   ├── APPLICATION-BM-DRAFTS.md         # Devfolio answers
│   ├── SSOT-INDEX.md                    # 🎯 agent / contributor entry point
│   ├── DECISIONS/                       # ADRs (0001–0007)
│   └── diagrams/                        # Mermaid + exported PNG/SVG
├── .research/                # External-reality SSOT (cite, don't copy)
│   ├── incident-forensics-moonwell.md   # 9 incidents / ≥$50M / 18 months
│   ├── competitor-architecture.md       # Chaos / Hypernative / Forta / etc.
│   └── oracle-inventory-base.md         # Base oracle feeds + PoR coverage
├── AGENTS.md                 # Primary rules for AI agents and contributors
├── CLAUDE.md                 # Claude Code-specific notes
├── CONTRIBUTING.md
└── LICENSE                   # MIT
```

---

## Local development

```bash
pnpm install

# Smart contracts (Foundry)
pnpm --filter @oclix/contracts test          # Unit tests
pnpm --filter @oclix/contracts gas:snapshot  # Gas baseline

# Off-chain workers (Cloudflare)
pnpm --filter @oclix/poller dev              # Local poller
pnpm --filter @oclix/api dev                 # Local public API
pnpm --filter @oclix/alert-writer dev        # Local alert-writer

# Landing
pnpm --filter @oclix/landing-next dev        # localhost:5174
pnpm --filter @oclix/landing-next build      # Static export

# Workspace-wide
pnpm lint                                    # Biome check
pnpm typecheck                               # tsc --noEmit, all workspaces
pnpm test                                    # Foundry + Vitest
```

Full environment setup, Cloudflare bindings, and contract deployment: [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md).

---

## Security

Vulnerabilities discovered before Phase 3 should be reported to **`security@oclixlabs.xyz`** with a 30-day coordinated disclosure window unless an extension is agreed in writing. Phase 3 transitions to Immunefi-managed disclosure with bounty payouts in SENTINEL.

Threat model + audit posture: [Whitepaper §6](./docs/WHITEPAPER-v0.1-SKELETON.md#6-security).

---

## Contributing

Open-source contributions welcome (MIT). See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch strategy (per [ADR 0004](./docs/DECISIONS/0004-branch-strategy.md)) and [`AGENTS.md`](./AGENTS.md) for AI-agent + human contributor rules.

For Phase 2 partnership / federation operator interest, reach out via the addresses in [Whitepaper §9](./docs/WHITEPAPER-v0.1-SKELETON.md#9-team).

---

## License

MIT — see [`LICENSE`](./LICENSE). The core code, the operator client, and the contract are MIT-licensed forever across all phases (per [Whitepaper §7.4](./docs/WHITEPAPER-v0.1-SKELETON.md#74-cross-phase-constants)).
