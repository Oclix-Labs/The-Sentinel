# Devfolio Application — BM Question Drafts

> Drafts for the three BM-heavy Devfolio questions. These leverage the Progressive Decentralization roadmap + SENTINEL token vision. 김현우 polishes to native English; 권상현 final reviews.

---

## Q: What is your unique insight or advantage that you have in the market you are building for?

Three insights shape RWA Sentinel:

**1. Pattern, not incident.** Over the past 18 months, at least nine oracle-composition or hardcoded-oracle failures across Base-adjacent DeFi have caused **≥$50M in losses** — a cadence of roughly one incident every two months, culminating in the Moonwell cbETH incident of February 2026 ($2.68M impacting ~181 borrowers). This is a systemic failure mode, not a one-off. **Composition-class** failures (e.g., Moonwell cbETH) are detectable within **seconds** via multi-oracle cross-check; **hardcoded-oracle depegs** need secondary-market comparison (Phase 2); see [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) §2.1.

**2. Coverage gap that enterprise tools cannot structurally close.** Every existing monitor serves protocols or institutions. Chaos Labs sells seven-figure risk engagements to Aave and Aave Horizon. Hypernative is enterprise-only (~250+ customers, pricing undisclosed). Forta migrated from free to paid FORT-token subscription. RWA.xyz charges $500/seat/month for Pro and has **no alert layer**. Chainlink Proof-of-Reserve publishes data but does not trigger alerts. **Zero prior art serves retail holders with free, RWA-tuned, real-time alerts.** Enterprise competitors cannot structurally match "free + public-good + MIT" without destroying their enterprise ACVs.

**3. Watchdog infrastructure must become a public good, and the only sustainable path is tokenized decentralization.** Just as oracles, RPC, and indexing evolved from centralized services into decentralized protocols, monitoring infrastructure for tokenized RWAs must follow the same path. Our advantage is the **progressive-decentralization thesis**: we build the centralized MVP first (Phase 1), federate independent operators in Phase 2, and launch a permissionless operator network with utility token (SENTINEL) in Phase 3. We will be **Base's first RWA-focused watchdog token economy** — distinct from Chainlink (oracle publisher, not watchdog), Chaos Labs (private consultant to protocols), and Forta (generic threat detection, not RWA-tuned).

---

## Q: Do you plan on raising capital from VCs? Additionally, do you plan to launch a token?

**Yes to both.** Our capital plan aligns with progressive decentralization:

**Phase 1 — 2026 Q2** (current): Apply to Base Batches ($50K investment via Base Ecosystem Fund). Use the capital to ship the centralized MVP (5 priority assets, 1 on-chain AlertRegistry on Base) and validate retail + small-issuer demand. Coinbase Ventures is a natural follow-on conversation.

**Phase 2 — 2026 Q4 – 2027 Q1**: Pre-seed **USD-denominated equity into Oclix Labs Inc only** ($1–2M target; SAFE or priced preferred) from crypto-native funds comfortable with equity-only protocol-adjacent SaaS (Variant, Paradigm, 1kx, Archetype, Dragonfly). **No SAFT, no token warrants, no protocol-token rights to investors** — per [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) §4.0. Deploy capital to federate 2–3 independent operators and launch Premium / Enterprise tiers.

**Phase 3 — 2027 Q2+**: Seed/Series A equity into Oclix Labs Inc ($5–10M target) **alongside** fair-launch **SENTINEL** utility token (permissionless operator network). Phase 2 investors receive **SaaS equity only**, not genesis SENTINEL; community airdrop to Phase 1–2 subscribers at token launch. Token design is directional in the Lite Whitepaper; legal review ongoing across US, KR, SG, Cayman.

**SENTINEL utility token (Phase 3) — designed for four functions:**
1. **Operator staking with slashing** for false or missed alerts — economic security layer
2. **Subscription payment** (stake-to-subscribe alternative to fiat / stablecoin)
3. **Governance voting** on threshold parameters, asset coverage additions, and slashing rules
4. **Ecosystem fund** controlled by token holders (grants, audits, emergency response)

Phase 1 and Phase 2 operate **without any token** — minimizing regulatory exposure until infrastructure maturity and legal clarity warrant launch. Full tokenomics framework is documented in [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) (on-site: `/whitepaper/`), with final parameters pending community input, independent audit, and jurisdiction-specific legal review.

---

## Q: What part of your product is onchain?

Two on-chain primitives anchor the architecture:

**Phase 1 (ships by end of Base Batches):**
- **`AlertRegistry` contract on Base Mainnet** — an append-only log of every detected deviation, written with `(asset, oracle_pair, deviation_bps, block_timestamp, evidence_hash)` tuples. The off-chain cross-check engine polls Chainlink, Pyth, and RedStone; when a deviation crosses threshold, the engine records the alert on-chain for permanent auditability. Anyone can read the registry to verify historical alert integrity without trusting our backend. MIT-licensed contract. Foundry repository. Base-exclusive.
- **Attestation hash tracking for tokenized RWAs** — Base-native RWA tokens with Chainlink Proof-of-Reserve feeds on Base (USDO, cbBTC, iBTC, dlcBTC, GLDY, TETH — 6 confirmed) are monitored on-chain by subscribing to `AnswerUpdated` events. Reserve-vs-supply deviations trigger alerts via `AlertRegistry`.

**Phase 2:**
- `OperatorRegistry` contract — operators register identity, post minimal collateral, and sign attestations of their cross-check observations. Multi-operator agreement threshold triggers alerts with higher confidence class.

**Phase 3 (SENTINEL token phase):**
- Staking + slashing contract, subscription payment router, governance voting contract, ecosystem fund treasury — full on-chain operation.

What is **NOT** on-chain in Phase 1:
- The cross-check computation itself (runs on Cloudflare Workers off-chain for cost efficiency — $55/mo vs $8,750/mo for fully on-chain per our research at `.research/oracle-inventory-base.md`)
- The public API (HTTP endpoints on edge)
- The webhook / Telegram alert delivery
- Subscription management (Phase 1 = simple webhook registration)

**Base-exclusive vs multi-chain split:** RWA Sentinel's **coverage scope** is Base-native (we monitor Base-deployed RWA tokens and oracle feeds). The **on-chain registry** is Base-exclusive (`AlertRegistry` deployed only on Base). The **oracle data sources** (Chainlink, Pyth, RedStone) are inherently multi-chain — we read their Base deployments.

---

## Supporting assets to reference in application

- `docs/WHITEPAPER.md` — Lite whitepaper v0.1 (tokenomics framework)
- `docs/ROADMAP.md` — Three-phase progressive decentralization timeline
- `docs/TOKENOMICS-OUTLINE.md` — Utility + allocation framework
- `.research/incident-forensics-moonwell.md` — 9-incident pattern with evidence
- `.research/competitor-architecture.md` — 8-competitor comparison and positioning
- `.research/oracle-inventory-base.md` — Base oracle feasibility + coverage list
- GitHub: `github.com/<org>/rwa-sentinel` (public by D7)
