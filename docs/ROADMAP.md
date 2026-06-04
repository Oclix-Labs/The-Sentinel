# RWA Sentinel — Progressive Decentralization Roadmap

> Three-phase path from centralized MVP to permissionless token-governed operator network. Follows the Chainlink / Uniswap / Compound progressive-decentralization pattern. Last updated: 2026-04-19.

---

## Executive summary

| Phase | Window | Decentralization | Funding | Token |
|---|---|---|---|---|
| **1** | 2026 Q2 | Centralized MVP (team runs single poller) | Base Batches $50K | None |
| **2** | 2026 Q4 – 2027 Q1 | Federated (2–3 independent operators cross-verify) | Pre-seed $1–2M | Designed, not issued |
| **3** | 2027 Q2+ | Permissionless (anyone stakes to run operator; DAO governance) | Seed/Series $5–10M + token | **SENTINEL live** |

---

## Phase 1 — Centralized MVP (2026 Q2)

**Goal**: Ship a working public-good watchdog with provable on-chain alert history for 5 core assets.

### Deliverables
- **On-chain**: `AlertRegistry.sol` deployed to Base Mainnet; append-only log of detected deviations
- **Off-chain infrastructure**: Cloudflare Workers poller, cross-check engine, alert writer, public REST API (Hono)
- **Coverage**: BTC/USD, ETH/USD, USDC/USD, cbETH/USD (Moonwell demo replay target) + USDO attestation tracking
- **Alert delivery**: Webhook + Telegram (first channels); Discord + email follow
- **Tiering**: MIT free tier (WebSocket alerts public); Premium placeholder (real-time SLA + historical + custom thresholds) live by end of Base Batches
- **Documentation**: Full architecture in repo, MIT-licensed codebase, research SSOT open to public

### Team org
- 4 co-founders (Yonsei University BAY blockchain society)
- Single entity runs all infrastructure
- No external operators

### Funding
- Base Ecosystem Fund: $50K via Base Batches 003 Student Track
- Target applied: Builder Grants (retroactive 1–5 ETH after shipping) + OP Retro Funding (post-deployment public-goods application)

### Token
- **None issued. None planned for Phase 1.** This minimizes regulatory exposure during infrastructure validation.

### Success criteria (end of Phase 1)
- 5 assets monitored continuously, >99% uptime
- AlertRegistry live on Base Mainnet with ≥10 detected deviations logged
- Replay demo: given Moonwell cbETH historical data, Sentinel detects deviation within one block
- ≥1,000 free-tier subscribers (webhook + Telegram combined)
- ≥30 daily active webhook deliveries successfully consumed downstream
- **Premium tier alpha**: ≥5 paying customers and ≥$100 MRR (paid USDC against an actual SLA — not waitlist signups; aligns with [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) §7.1)
- Public API documented, SDK usable by external developers

---

## Phase 2 — Federated Operators (2026 Q4 – 2027 Q1)

**Goal**: Decentralize cross-check execution across 2–3 independent operators to reduce single-point-of-failure and build the decentralization narrative.

### Deliverables
- **`OperatorRegistry.sol`** — operators register identity + collateral; governance approves
- **Off-chain**: each operator runs identical poller code (open-source); submits signed attestations
- **Consensus layer**: off-chain aggregator (later migrated on-chain in Phase 3) requires N-of-M operator agreement before publishing a high-confidence alert
- **Coverage expansion**: 10–15 assets, including wstETH / USDT / DAI / EURC / cbBTC / LBTC / USDe
- **Asset class expansion**: cross-chain attestation mirroring for Backed Finance (bIB01, bCSPX) via Chainlink CCIP from Polygon PoR feeds
- **Premium tier GA**: launched revenue stream, >$5K MRR target

### Operators (target 2–3)
1. Core team node (권상현 operated)
2. Research partner (e.g., Anthias Labs, Steakhouse Financial, a Morpho/Moonwell risk team member)
3. Community operator via grant program (Base ecosystem partner)

### Funding
- Pre-seed equity round: $1–2M target — **USD-denominated equity into Oclix Labs Inc only** (SAFE or priced preferred)
- **No SAFT, no token warrants, no protocol-token rights to investors** — per [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) §4.0; investors receive SaaS-company equity, not SENTINEL
- Investors: Crypto-native VCs comfortable with equity-only protocol-adjacent SaaS (Variant, Paradigm, 1kx, Archetype, Dragonfly)
- Coinbase Ventures follow-on (if Phase 1 metrics satisfy)

### Token
- **Designed, not issued.** Full tokenomics specification in whitepaper v1.0.
- Community airdrop allocation registry begins: subscribers / GitHub contributors / operator candidates

### Success criteria (end of Phase 2)
- 3 operators running in production, 99.9% uptime
- Multi-operator consensus alerts outperform single-operator alerts (measured false-positive rate)
- 10–15 assets covered with price cross-check; 6+ tokenized RWAs with attestation tracking
- $5K+ MRR from Premium tier
- Third-party security audit completed (Trail of Bits, ChainSecurity, or Halborn)
- Whitepaper v1.0 published
- Pre-seed closed

---

## Phase 3 — Permissionless Network + SENTINEL Token (2027 Q2+)

**Goal**: Open operator network to anyone who stakes SENTINEL; transition governance to token-weighted DAO; launch token economy.

### Deliverables
- **Full on-chain stack**:
  - `StakingManager.sol` — operator bonding + slashing
  - `SubscriptionRouter.sol` — stake-to-subscribe or pay-per-use
  - `Governance.sol` — Compound Bravo–style timelock governance
  - `EcosystemFund.sol` — DAO-controlled treasury
- **SENTINEL token launch**: utility token live on Base (with CCIP extensions to Ethereum and Optimism)
- **DAO formation**: parameter changes (thresholds, heartbeats, asset coverage) transferred to token-weighted voting
- **Community airdrop**: distributed to Phase 1 & 2 subscribers, GitHub contributors, operator candidates
- **Permissionless operator onboarding**: any address can stake → run operator → earn rewards
- **Broad RWA coverage**: 30+ tokenized assets monitored, including newly emerging Base RWA issuers

### Token utility (see `docs/TOKENOMICS-OUTLINE.md`)
1. **Staking & Slashing**: operators stake SENTINEL to participate; slashed for false / missed alerts
2. **Subscription payment**: pay in SENTINEL or stake-to-subscribe (stake locked, no spend)
3. **Governance**: vote on thresholds, asset coverage, slashing rules, fund allocation
4. **Ecosystem fund**: DAO deploys SENTINEL for audits, grants, emergency response

### Funding
- Seed / Series A: $5–10M
- Possible public token sale (format TBD: fair launch, Liquidity Bootstrapping Pool, or existing-holder airdrop extension)
- Subscription revenue begins fund buyback-and-burn (if legal in jurisdiction) or staker yield pass-through

### Legal readiness
- Utility token designation with legal opinion (multiple jurisdictions: US, Korea, Singapore, Cayman)
- Howey-test analysis documented
- Registration filed where required

### Success criteria
- 10+ permissionless operators
- >$100K MRR + substantial token-paid subscriptions
- DAO governance has made ≥5 material parameter changes via on-chain votes
- Token trading on at least one Tier-1 venue (Coinbase, Kraken, Binance)
- Bug bounty program via Immunefi live

---

## Cross-phase constants

### Open source
- MIT-licensed core code throughout all phases
- All alert data remains publicly queryable
- Core operator client is open-source forever

### Base-native identity
- Primary deployment on Base across all phases
- Superchain (OP Stack chains) expansion in Phase 3 only
- Integration with Base-ecosystem products (Coinbase Wallet, Farcaster, Basename)

### Retail-first principle
- Free public alerts never degrade regardless of Premium / token adoption
- Public dashboard always open
- Alert latency < 60 seconds in all phases

---

## What this roadmap does NOT include

- **Phase 1 MVP changes**: Phase 1 scope (5 assets, centralized) is locked; this roadmap does not alter the 8-day build sprint.
- **Specific token numbers**: supply, emission curve, allocation percentages are deferred to Phase 2 community input.
- **Chain expansion beyond Superchain**: Ethereum mainnet or non-EVM chains are future-phase considerations, not committed.

---

## References

- Research: `.research/competitor-architecture.md` — why retail-facing free watchdog is defensible
- Research: `.research/incident-forensics-moonwell.md` — 9-incident pattern motivating Phase 1 coverage choices
- Research: `.research/oracle-inventory-base.md` — why Phase 1 coverage is these specific 5 assets
- Whitepaper: `docs/WHITEPAPER.md` — full token economics and network design
- Tokenomics: `docs/TOKENOMICS-OUTLINE.md` — utility + allocation framework
