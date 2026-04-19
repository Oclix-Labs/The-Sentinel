# SSOT Index — The Sentinel

> **🎯 Read this file before starting any substantive work.** It lists every authoritative document in the repository. If a concept already has an SSOT here, update that file — never create a parallel one.

---

## Layer 1: Context (external reality — immutable)

These files snapshot external reality at a point in time. They are not edited; new versions supersede.

| Path | Contents | Researched |
|---|---|---|
| [`.research/incident-forensics-moonwell.md`](../.research/incident-forensics-moonwell.md) | Moonwell cbETH (Feb 2026, $2.68M) + 8 related oracle incidents totaling ≥$50M | 2026-04-19 |
| [`.research/oracle-inventory-base.md`](../.research/oracle-inventory-base.md) | Chainlink / Pyth / RedStone feed inventory + cross-overlap matrix on Base | 2026-04-19 |
| [`.research/competitor-architecture.md`](../.research/competitor-architecture.md) | Chaos Labs / Hypernative / Chronicle / Forta / Chainlink PoR / RWA.xyz positioning | 2026-04-19 |

Rules: **immutable**. To update, create `<topic>-v2.md` and link `supersedes` in front matter.

---

## Layer 2: Product intent (decisions, specs, plans)

| Path | Purpose | Owner |
|---|---|---|
| [`docs/ROADMAP.md`](./ROADMAP.md) | Three-phase progressive decentralization timeline | 권상현 |
| [`docs/TOKENOMICS-OUTLINE.md`](./TOKENOMICS-OUTLINE.md) | SENTINEL utility framework (directional, percentages TBD) | 이재근 + 김현우 |
| [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) | Lite Whitepaper v0.1 (8-10p target) | 이재근 + 김현우 |
| [`docs/APPLICATION-BM-DRAFTS.md`](./APPLICATION-BM-DRAFTS.md) | Devfolio Base Batches 003 submission drafts | 김현우 |
| [`docs/MEMBER-TASKS.md`](./MEMBER-TASKS.md) | D0–D8 per-member plan for Base Batches sprint | 팀 전원 |
| [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture (Phase 1) detail | 모진영 |
| [`docs/ADDRESSES.md`](./ADDRESSES.md) | Deployed contract + oracle feed addresses | 권상현 |
| [`docs/TEAM.md`](./TEAM.md) | Team bios (English, for whitepaper & application) | 김현우 |
| [`docs/DECISIONS/`](./DECISIONS/) | Architectural Decision Records (ADRs) — immutable once accepted | decision author |
| [`docs/DEVELOPMENT.md`](./DEVELOPMENT.md) | Local setup, wrangler, secrets, deploys | 모진영 |

---

## Layer 3: Execution state (live)

| Venue | Purpose |
|---|---|
| GitHub Issues | Active tasks, bugs, small enhancements. D1-D14 sprint issues. |
| GitHub Projects (Kanban) | Backlog / Todo / In Progress / Review / Done |
| GitHub Discussions | Open conversations — ideas, Q&A, announcements |
| `CHANGELOG.md` | Release-level user-facing changes |
| `.planning/` (gitignored) | Personal / agent planning scratch — never committed |

---

## Layer 4: Runtime (code + config)

| Path | Contents |
|---|---|
| `apps/poller/` | Cron polling Worker |
| `apps/alert-writer/` | Queue consumer Worker |
| `apps/api/` | Public HTTP API (Hono) |
| `apps/contracts/` | Foundry — AlertRegistry.sol |
| `packages/` | Shared utilities (later) |
| `wrangler.jsonc` | CF Workers root config (shared compat) |
| `biome.json`, `tsconfig.base.json` | Lint / typecheck config |

---

## Meta-layer: Rules

| Path | Purpose |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | Primary rules for AI agents + humans |
| [`CLAUDE.md`](../CLAUDE.md) | Claude Code-specific notes (thin pointer to AGENTS.md) |
| [`README.md`](../README.md) | Project intro (humans) |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Human contributor guide |
| [`.github/CODEOWNERS`](../.github/CODEOWNERS) | Auto-assign reviewers by path |

---

## Citation protocol

SPEC / APPLICATION / ADR that make a factual claim MUST link the `.research/` source by file path + section. Example:

> Bad: *"Moonwell lost $2.68M."*
> Good: *"Moonwell lost $2.68M — see [`.research/incident-forensics-moonwell.md`](../.research/incident-forensics-moonwell.md#incident-summary)."*

No copy-pasting research content into Spec docs. Link-only. Rationale in [`docs/DECISIONS/0005-ssot-organization.md`](./DECISIONS/0005-ssot-organization.md).

---

## Staleness policy

- Layer 1 docs (`.research/`) ≥ 6 months old → re-research recommended. Each file's front matter declares `valid_until`.
- Layer 2 docs — owner reviews monthly during active sprint.
- Layer 4 (runtime) — CI enforces; no staleness check needed.

---

_Last updated: 2026-04-19. Update this file whenever a new SSOT is added._
