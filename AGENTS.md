# AGENTS.md — The Sentinel

> Primary rules for AI coding agents (Claude Code, Codex, Cursor, Copilot, Gemini CLI) and human contributors. Read `docs/SSOT-INDEX.md` before any substantive work.

---

## Project at a glance

- **Company**: Oclix Labs
- **Product**: RWA Sentinel — public-good watchdog for tokenized RWAs on Base
- **Phase 1 scope (locked)**: 5 assets (BTC/USD, ETH/USD, USDC/USD, cbETH/USD, USDO attestation). MVP ships by 2026-04-27.
- **Token (Phase 3)**: SENTINEL. Not issued in Phase 1 or 2.
- **Full roadmap**: `docs/ROADMAP.md`

## 🚦 Non-negotiable rules

### Branch & commit

- **Never push directly to `main` or `dev`** — use feature branches and PRs
- Feature branch naming: `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`
- Commit format: Conventional Commits — `type(scope): subject`
  - `feat(poller): add cbETH cross-check`
  - `fix(alert-writer): handle empty queue batches`
- Force push: **only on own feature branches**, never on `main` or `dev`
- Squash merge for `feat/* → dev`; regular merge commit for `dev → main`

### PR & review

- **PR target defaults to `dev`** (staging). Only `dev → main` PRs ship to production.
- `dev → main` PRs require **권상현 approval** — production gate
- `feat-* → dev` PRs require **at least 1 reviewer** (see CODEOWNERS for area → reviewer map)
- PR must pass CI: `pnpm typecheck && pnpm lint && pnpm test`
- **Urgent (`[URGENT]` label)**: self-merge allowed + post-merge review mandatory within 24h
- PR body: **what / why / how-tested** — three short paragraphs minimum

### Deploy

- `dev` push → GitHub Actions → `wrangler deploy --env staging` → `rwa-sentinel-staging.workers.dev`
- `main` push → GitHub Actions → `wrangler deploy --env production` → `rwa-sentinel.workers.dev`
- Contracts:
  - `dev` branch → **Base Sepolia** (dev network)
  - `main` branch → **Base Mainnet** (권상현 manual `make deploy-mainnet`)

### Code style

- **TypeScript strict mode** enforced (see `tsconfig.base.json`)
- Formatter + linter: **Biome** (`biome.json`); `pnpm lint` must pass
- No `any` — use `unknown` and narrow
- No `@ts-ignore` / `@ts-expect-error` without a `// reason:` comment
- **File ≤ 300 lines** — if it grows, split

### Secrets

- **Never commit** `.env`, `.dev.vars`, private keys, mnemonics, Cloudflare tokens
- Runtime secrets: `wrangler secret put <NAME>`
- Local dev secrets: `.dev.vars` (gitignored)
- Pre-commit hook runs `gitleaks protect --staged` — do not bypass with `--no-verify`

### Testing

- **Every PR that changes core logic adds at least 1 test** (vitest for TS, Forge for Solidity)
- **Do not mock Chainlink / Pyth / RedStone oracles in tests** — use real testnet endpoints for integration; fixtures only for pure logic tests
- Forge tests: `forge test -vvv` must pass with no warnings
- Cross-check correctness: tests MUST include Moonwell cbETH replay as a regression fixture

### On-chain changes

- **Never deploy to Base Mainnet from a non-main branch**
- Mainnet deploys require: (a) `dev` deploy tested on Sepolia for ≥24h, (b) 권상현 approval, (c) Basescan verification within 1h of deploy
- Contract addresses published to `docs/ADDRESSES.md` immediately after mainnet deploy

## 🧰 Stack (locked)

- Runtime: **Cloudflare Workers** (`nodejs_compat` flag ON)
- Language: **TypeScript** strict
- Web3 client: **viem** (EVM calls, contract interaction)
- Oracle adapters: `@pyth-network/pyth-evm-js` (Pyth) + Chainlink via viem + RedStone REST API
- HTTP: **Hono** (public API)
- Storage: **CF D1** (SQLite — alerts, subscriptions, price history) + **CF KV** (latest price cache) + **CF Queues** (alert fan-out)
- Scheduler: **CF Cron Trigger** — 1 minute interval (MVP). Upgradable to Durable Objects alarm for sub-minute later.
- Package manager: **pnpm workspace**
- Smart contracts: **Foundry** + Solidity `^0.8.20` + custom access control or OpenZeppelin AccessControl (see [`docs/DECISIONS/0006-custom-access-control.md`](./docs/DECISIONS/0006-custom-access-control.md))
- Deployment: **wrangler** (Workers) + `forge script` (contracts)
- CI: **GitHub Actions**
- Lint/format: **Biome**

See `docs/DECISIONS/0001-cf-workers.md` for rationale.

## 🗺️ File layout + ownership

| Area | Path | Owner | Reviewer |
|---|---|---|---|
| Smart contracts | `apps/contracts/` | 권상현 | 모진영 |
| Poller Worker | `apps/poller/` | 모진영 | 권상현 |
| Alert Writer Worker | `apps/alert-writer/` | 모진영 | 권상현 |
| Public API Worker | `apps/api/` | 모진영 | 권상현 |
| Landing + Frontend | `apps/landing/` (later) | 이재근 | 모진영 |
| Docs / specs | `docs/` | 김현우 + 이재근 | 권상현 |
| Research (SSOT) | `.research/` | 김현우 | 권상현 |
| CI / deploy | `.github/workflows/` | 모진영 | 권상현 |

See `.github/CODEOWNERS` for machine-enforced reviewer assignment.

## ⚙️ Commands cheat sheet

```bash
# Install
pnpm install

# Dev (run a specific app)
pnpm --filter poller dev
pnpm --filter api dev
pnpm --filter alert-writer dev

# Test
pnpm typecheck        # TS check across workspace
pnpm lint             # Biome lint + format check
pnpm test             # vitest for Workers
pnpm --filter contracts test   # Forge test

# Deploy (CI does this on push; rarely manual)
pnpm --filter poller deploy:staging
pnpm --filter poller deploy:prod    # only by 권상현

# Contracts
cd apps/contracts
forge build
forge test -vvv
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast
```

## 🧭 Task rules for AI agents

1. **Read `docs/SSOT-INDEX.md` before starting any work** — it lists every authoritative doc and where to find truth.
2. **Work on one issue at a time** (WIP limit 1 per agent). Link PR with `Closes #N`.
3. **Never edit `.research/*.md` files** — they are immutable external-reality snapshots. To update, create a new version file.
4. **Do not inline research findings into `SPEC.md` / `APPLICATION.md`** — link with file:line path instead. Enforces citation integrity.
5. **Before committing**, run:
   ```bash
   pnpm typecheck && pnpm lint && pnpm test
   ```
6. **For decisions**, add an ADR to `docs/DECISIONS/NNNN-<slug>.md` using the template. Do not bury decisions in code comments.
7. **For architectural changes**, update `docs/ARCHITECTURE.md` in the same PR.
8. **Do not touch `main` or `dev` without PR** — branch protection enforces this; do not request admin to bypass.
9. **Do not create new top-level files** (`TODO.md`, random `.md` at root) — extend existing SSOTs instead. Check `docs/SSOT-INDEX.md` first.

## 📝 Conventional commits + semver

Conventional commit types used:
- `feat:` — new user-visible feature → minor version
- `fix:` — bug fix → patch version
- `docs:` — docs only
- `chore:` — tooling, CI, dependencies
- `refactor:` — code restructure, no behavior change
- `test:` — tests added/changed
- `perf:` — performance improvement
- `style:` — formatting only (rare, usually handled by Biome)

Breaking changes: add `!` and `BREAKING CHANGE:` footer → major version.

## 🚨 What NOT to do

- ❌ Commit secrets (even test ones)
- ❌ Skip pre-commit hooks with `--no-verify`
- ❌ Mock oracle responses in integration tests
- ❌ Deploy directly to Mainnet without 권상현 sign-off
- ❌ Edit immutable docs (`.research/*.md`, accepted ADRs)
- ❌ Copy research findings into Spec (always cite)
- ❌ Create parallel versions of SSOT docs

## 🔗 Cross-references

- `docs/SSOT-INDEX.md` — master index of every SSOT
- `docs/ROADMAP.md` — 3-phase progressive decentralization
- `docs/MEMBER-TASKS.md` — D0-D8 per-member plan (Base Batches sprint)
- `docs/APPLICATION-BM-DRAFTS.md` — Devfolio submission drafts
- `.research/` — external-reality research (immutable)
- `docs/DECISIONS/` — architectural decision records

---

_Last updated: 2026-04-19. Review and update this file in `chore/*` PRs separately from feature work._
