# ADR 0003: Progressive decentralization + SENTINEL utility token (Phase 3)

**Status**: ACCEPTED
**Date**: 2026-04-19
**Deciders**: Team (consensus: "반대 없어")

## Context

Devfolio's Base Batches 003 form asks three BM-critical questions:

1. *"What is your unique insight or advantage...?"*
2. *"Do you plan on raising capital from VCs?"*
3. *"Do you plan to launch a token?"*

A pure **Hybrid C** answer (MIT core + Premium SaaS tier, no token) positioned Oclix Labs as a Grant candidate but weak for **investment** — which is what Base Batches delivers ($50K via Base Ecosystem Fund, dilutive). Crypto-native VCs (Variant, Paradigm, 1kx, Archetype) generally require a token path or strong roadmap-to-token narrative for upside.

## Decision

Adopt a **three-phase progressive decentralization roadmap** alongside the Hybrid C tier model:

1. **Phase 1 (2026 Q2)** — Centralized MVP. Oclix Labs runs single poller + AlertRegistry on Base. **No token.** Funding: Base Batches $50K.
2. **Phase 2 (2026 Q4 – 2027 Q1)** — Federated operators. 2–3 independent operators + on-chain `OperatorRegistry`. Pre-seed $1–2M. Token designed but not issued.
3. **Phase 3 (2027 Q2+)** — Permissionless network + **SENTINEL utility token launch**. Full on-chain staking / subscription / governance / ecosystem fund. Seed/Series A $5–10M.

SENTINEL utility (four pillars):
1. Operator staking + slashing (sybil resistance)
2. Subscription payment (pay or stake-to-subscribe)
3. Governance voting (thresholds, coverage, slashing rules)
4. Ecosystem fund (DAO-controlled)

## Consequences

### Positive
- Three BM questions upgraded from "weak" → "strong" answers (see `docs/APPLICATION-BM-DRAFTS.md`)
- Investor alignment: crypto-native VC preferred path (equity + token warrants)
- Public-good narrative preserved — no token until infrastructure maturity
- Phase 1 and Phase 2 operate with zero token regulatory exposure
- Roadmap mirrors Chainlink / Uniswap / Compound patterns — familiar to judges

### Negative / cost
- Whitepaper v0.1 Lite becomes required deliverable (~8–10 pages)
  - Added to 8-day sprint; co-owned by 이재근 + 김현우
- Added regulatory risk surface Phase 3 (utility-token status review across US, KR, SG, Cayman)
- Community branding load: Oclix Labs + RWA Sentinel (product) + SENTINEL (token) = three names to manage
- Scope mismatch risk: early token commitment constrains roadmap flexibility

### Neutral
- Phase 1 MVP scope (ADR 0002) unchanged by this decision — token framework lives in docs, not code.

## Alternatives considered

### Alternative — Pure Hybrid C, no token
- Pros: Simplest, zero regulatory exposure
- Rejected because: BM question 3 ("Do you plan to launch a token?") weak answer materially hurts Batches investment narrative; 크립토 VC plan is vague without upside

### Alternative — Immediate Phase-3 token launch (C option earlier)
- Pros: Strongest token-economy story
- Rejected because: 8-day sprint cannot implement operator network; token-first without product would signal "money grab"; legal review infeasible in 8 days

## Related research / prior decisions

- `.research/competitor-architecture.md` §Defensibility (public-good stance as moat)
- `docs/ROADMAP.md` (detailed three-phase plan)
- `docs/TOKENOMICS-OUTLINE.md` (SENTINEL utility + allocation framework)
- `docs/WHITEPAPER-v0.1-SKELETON.md`
- `docs/APPLICATION-BM-DRAFTS.md`
- `docs/DECISIONS/0002-phase1-scope-5-assets.md` (Phase 1 scope untouched by this decision)

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —
