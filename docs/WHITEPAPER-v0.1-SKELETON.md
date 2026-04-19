# SENTINEL — Lite Whitepaper v0.1

> 🚧 **DRAFT skeleton**. Sections marked `[FILL]` are for 김현우 + 모진영 to complete before 2026-04-27. Sections marked `[DIRECTIONAL]` are intentionally not final — subject to Phase 2 community input and independent audit.
>
> **Target**: 8–10 pages PDF after fill-in. Written for a crypto-native investor audience who knows DeFi, oracles, and basic tokenomics patterns.
>
> **Last updated**: 2026-04-19

---

## 1. Abstract

> **[FILL]** — 1 paragraph, ~150 words.
>
> Structure hint: RWA Sentinel is a progressively-decentralized public-goods watchdog for tokenized real-world assets on Base. In Phase 1, a centralized MVP monitors 5 priority assets with multi-oracle cross-checks and publishes alerts via an MIT-licensed API. In Phase 2, cross-check execution federates across 2–3 independent operators. In Phase 3, a permissionless operator network backed by the SENTINEL utility token opens participation to anyone and governs network parameters via token-weighted voting. This whitepaper introduces the problem (9 oracle incidents / ≥$50M / 18 months), the architecture, the token design, and the regulatory framing.

---

## 2. Problem

### 2.1 Pattern of oracle failures (leverages `.research/incident-forensics-moonwell.md`)

> **[FILL]** — Reuse the 9-incident table from the research doc. Cite specifically Moonwell cbETH (Feb 2026, $2.68M, 99.95% price deviation = 5,000× a 2% threshold) and Stream xUSD (Nov 2025, $93M contagion across Morpho/Euler/Silo/Gearbox).
>
> End with: "Every one of these incidents could have been detected in the same block via multi-oracle cross-check — but no existing public service performs this check."

### 2.2 Retail coverage gap (leverages `.research/competitor-architecture.md`)

> **[FILL]** — Summarize the competitor table: Chaos Labs enterprise-only (Aave $3M/yr engagements), Hypernative enterprise-only ($40M Series B but no retail), Forta migrated to paid FORT token subscription, RWA.xyz $500/seat/month with no alert layer, Chainlink PoR publishes data with no alert layer.
>
> Conclusion: **zero prior art serves retail holders with free, RWA-tuned, real-time alerts.**

### 2.3 Infrastructure without public-goods economics

> **[FILL]** — Argue that monitoring infrastructure must evolve like oracles did (from centralized services to decentralized token-coordinated networks). Reference the Chainlink → LINK pattern. Show that without a token, operator economics break at scale.

---

## 3. Architecture

### 3.1 Four-stage pipeline

> **[FILL]** — Include the ASCII diagram from `docs/ROADMAP.md` or a Mermaid diagram of: **Ingestion → Cross-check → Attestation → Alert + API**.
>
> Explain each stage:
> 1. **Ingestion**: poll Chainlink, Pyth (sponsored + pull via Hermes), RedStone (push + REST) for Phase 1 coverage set
> 2. **Cross-check**: off-chain deviation computation; ±2% threshold default, per-asset tunable
> 3. **Attestation tracking**: Chainlink PoR subscriptions on Base (cbBTC, USDO, iBTC, dlcBTC, GLDY, TETH); cross-chain mirror for Backed (bIB01/bCSPX on Polygon → Base via CCIP in Phase 2)
> 4. **Alert + API**: webhook + Telegram (Phase 1); WebSocket + Discord + email (Phase 2); Premium tier features

### 3.2 Phase 1 — Centralized MVP

> **[FILL]** — Reference `docs/ROADMAP.md#Phase-1`. Include contract architecture diagram of `AlertRegistry`.
>
> On-chain: `AlertRegistry.sol` on Base Mainnet
> Off-chain: Cloudflare Workers (TypeScript + Hono + viem), D1 + KV + Queues

### 3.3 Phase 2 — Federated Operators

> **[FILL]** — Reference `docs/ROADMAP.md#Phase-2`. Add diagram showing multi-operator consensus flow.
>
> New on-chain: `OperatorRegistry.sol` for identity + minimal collateral

### 3.4 Phase 3 — Permissionless Network

> **[FILL]** — Reference `docs/ROADMAP.md#Phase-3`.
>
> Full on-chain: `StakingManager`, `SubscriptionRouter`, `Governance`, `EcosystemFund`

---

## 4. Tokenomics framework **[DIRECTIONAL]**

> **[FILL]** — Full content lives in `docs/TOKENOMICS-OUTLINE.md`. This section condenses that to ~1.5 pages.
>
> Must cover:
> - Utility (4 pillars: staking, subscription, governance, ecosystem fund)
> - Allocation framework (categories locked; percentages TBD)
> - Supply (fixed; direction ~1B)
> - Vesting (Team 4yr/1yr cliff, Investors same; Community claim-on-launch or 6mo linear)
> - Value capture (operator demand, subscription demand, buy-back/burn, staker yield)

---

## 5. Governance

> **[FILL]**
>
> - Compound Bravo–style timelock governance in Phase 3
> - Security Council multisig (5-of-7) with emergency-pause veto during bootstrap
> - Governable parameters: deviation thresholds, heartbeat requirements, asset coverage additions, slashing severity, ecosystem fund disbursements
> - Governance migration timeline: Phase 1 = team multisig, Phase 2 = team + advisor council, Phase 3 = token-weighted DAO

---

## 6. Security

> **[FILL]**
>
> - Phase 1: Public repo, self-audit, community review
> - Phase 2: Third-party security audit (Trail of Bits / ChainSecurity / Halborn or equivalent)
> - Phase 3: Immunefi bug bounty program + ongoing audits
> - Economic audit (token design): Gauntlet, Delphi Digital, or equivalent before Phase 3 launch
> - Oracle manipulation resistance: multi-source design inherently hardens against single-oracle attacks
> - Alert-delivery DoS resistance: rate limits, signature verification for webhook authenticity

---

## 7. Roadmap

> **[FILL]** — Reference `docs/ROADMAP.md`. 1 page timeline with Phase 1/2/3 milestones and success criteria.

---

## 8. Regulatory considerations

> **[FILL]** — 0.5 page.
>
> Points to cover:
> - SENTINEL designed as utility token under active legal review
> - Phase 1 and Phase 2 operate without token (reduces regulatory surface)
> - Continuous legal opinion across US, Korea, Singapore, Cayman Islands
> - Howey-test analysis (factor-by-factor) deferred to pre-launch legal document
> - No token sale to US retail via this whitepaper; SAFT-only to accredited investors in US jurisdiction
> - Airdrop design pending legal review for Korean resident eligibility

---

## 9. Team

> **[FILL]** — 0.5 page.
>
> - 4 co-founders from Yonsei University BAY Blockchain Society
> - Individual bios (see `docs/TEAM.md`)
> - Advisory / research partners (Anthias Labs, BAY faculty mentor if applicable — TBD)

---

## 10. Risks & Disclaimers

### 10.1 Regulatory uncertainty
The legal status of digital assets varies by jurisdiction and continues to evolve. SENTINEL is designed as a utility token for network participation, staking, and governance. Nothing in this document constitutes an offer to sell or a solicitation to buy any security. Token-related activities described in Phase 3 are contingent on favorable legal review in relevant jurisdictions.

### 10.2 Technical risk
Smart contracts are subject to bugs, economic attacks, and oracle failures. The project will commission third-party audits prior to Phase 2 and Phase 3 contract deployments. Users should understand that no security guarantees are absolute.

### 10.3 Execution risk
The roadmap spans multiple years. Market, team, and regulatory conditions may force material changes. Phase 3 features (permissionless operator network, token launch) are aspirational and require successful completion of Phase 1 and Phase 2 milestones.

### 10.4 Token value risk
Where issued, SENTINEL token value may fluctuate significantly. Purchasers should have a long-term horizon and understand that no price stability is implied. Historical performance of similar protocol tokens does not predict future outcomes.

### 10.5 No investment advice
This document is informational. Prospective participants should consult qualified legal, tax, and financial advisors.

### 10.6 Team liability limitations
Individual team members, including founders, shall not be personally liable for network operations once decentralized control transitions to the DAO.

---

## Appendix A: Glossary

> **[FILL]** — Define terms that non-crypto-native readers might not know: Oracle, Proof-of-Reserve, MEV, Tokenized RWA, Progressive Decentralization, SAFT, LBP, etc.

## Appendix B: Deferred parameters

> Section 4 (Tokenomics) and Section 8 (Regulatory) include explicit lists of parameters intentionally not set in v0.1. These appendices consolidate those for Phase 2 governance reference.

---

## References

- `docs/ROADMAP.md`
- `docs/TOKENOMICS-OUTLINE.md`
- `docs/APPLICATION-BM-DRAFTS.md`
- `.research/incident-forensics-moonwell.md`
- `.research/competitor-architecture.md`
- `.research/oracle-inventory-base.md`

---

## Review & approval workflow

- **Drafting (primary)**: **이재근 + 김현우** (co-authors)
  - **김현우**: Sections 1 (Abstract), 2 (Problem — cites `.research/`), 7 (Roadmap), 9 (Team), 10 (Risks)
  - **이재근**: Sections 3 (Architecture narrative), 4 (Tokenomics narrative), 8 (Regulatory framing), Appendix A (Glossary)
- **Technical input** (quick reviews, not drafting): 권상현 (Sections 5 Governance, 6 Security) + 모진영 (Section 3 technical accuracy, Section 4 value-capture mechanism)
- **Final approval**: 권상현 before any public release
- **Public release**: committed to repo + linked from `README.md` after Base Batches submission
