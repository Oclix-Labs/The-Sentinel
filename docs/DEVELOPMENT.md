# Development Setup

> Local setup for The Sentinel. For project rules see [`AGENTS.md`](../AGENTS.md).

## Prerequisites

- **Node.js ≥ 20.11.0** (recommend latest LTS)
- **pnpm ≥ 9.0** (`npm i -g pnpm`)
- **Foundry** (for contracts): `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- **Wrangler** (Cloudflare CLI): comes with `pnpm install` (devDep)
- A **Cloudflare account** (free tier) with Workers + D1 + KV + Queues enabled
- A **Base RPC endpoint**: public (e.g., `https://mainnet.base.org`) OK for dev; add Alchemy / QuickNode for production if needed
- For contracts: **Base Sepolia ETH** from faucet + **Base Mainnet ETH** via L2 bridge (for mainnet deploys only)

## First-time clone

```bash
git clone git@github.com:Oclix-Labs/The-Sentinel.git
cd The-Sentinel
pnpm install
```

Install Foundry submodules for contracts:

```bash
cd apps/contracts
forge install
```

## Secrets

Never commit. Use one of:

**For Workers (runtime secrets)** — `wrangler secret put`:

```bash
cd apps/alert-writer
wrangler secret put PUBLISHER_PRIVATE_KEY --env staging
# paste value when prompted
wrangler secret put TELEGRAM_BOT_TOKEN --env staging
```

**For local dev** — `.dev.vars` file (gitignored):

```ini
# apps/poller/.dev.vars
BASE_RPC_URL=https://base-sepolia-rpc.publicnode.com
```

**For Foundry** — `.env` file in `apps/contracts/` (gitignored):

```ini
BASE_SEPOLIA_RPC_URL=
BASE_MAINNET_RPC_URL=
BASESCAN_API_KEY=
DEPLOYER_PRIVATE_KEY=
```

## Running locally

```bash
# Poller (1-minute cron only fires in production; use fetch to trigger manually in dev)
pnpm --filter @oclix/poller dev

# Alert writer (queue consumer — use wrangler tail to watch production traffic)
pnpm --filter @oclix/alert-writer dev

# Public API
pnpm --filter @oclix/api dev
# then: curl http://localhost:8787/health
```

## Running tests

```bash
pnpm typecheck            # TS check entire workspace
pnpm lint                 # Biome lint + format
pnpm test                 # vitest per package

cd apps/contracts
forge build
forge test -vvv
```

## Deploying (normally via CI)

```bash
# Staging (auto on dev branch push — don't normally do manually)
pnpm --filter @oclix/poller deploy:staging
pnpm --filter @oclix/api deploy:staging
pnpm --filter @oclix/alert-writer deploy:staging

# Production (auto on main branch push — 권상현 only)
pnpm --filter @oclix/poller deploy:prod
```

## D1 schema bootstrap (first time)

```bash
cd apps/alert-writer
wrangler d1 create rwa-sentinel-db-staging
# copy the returned database_id into wrangler.jsonc env.staging.d1_databases
wrangler d1 execute rwa-sentinel-db-staging --file=./schema.sql --env staging
```

(Repeat for `--env production` when ready.)

## Useful wrangler commands

```bash
wrangler whoami                    # confirm logged in to correct CF account
wrangler kv namespace list
wrangler d1 list
wrangler queues list
wrangler tail rwa-sentinel-poller-staging   # live logs
```

## Contract deploys

See [`apps/contracts/README.md`](../apps/contracts/README.md).

Mainnet deploy is 권상현 only (see ADR 0004). Before mainnet:
1. Sepolia deploy tested ≥ 24h without incident
2. Basescan verified
3. 권상현 approval on `dev → main` PR
4. Mainnet deploy + Basescan verify within 1h
5. Update `docs/ADDRESSES.md` with mainnet address in the same PR

## Troubleshooting

### `nodejs_compat` errors ("Buffer is not defined" etc)

Check `wrangler.jsonc` has `compatibility_flags: ["nodejs_compat"]` and `compatibility_date: "2026-04-01"` or later.

### viem "invalid opcode" during local test

You're using a non-compatible RPC — try `https://base-sepolia-rpc.publicnode.com`.

### Forge install fails on first run

```bash
cd apps/contracts
forge install foundry-rs/forge-std@v1.8.0 --no-commit
forge install openzeppelin/openzeppelin-contracts@v5.0.2 --no-commit
```

### Pre-commit hook blocks commit on `.env`

Good. Remove the file from staging and add to `.gitignore` if not already.

---

_Owner: 모진영. Update when setup changes._
