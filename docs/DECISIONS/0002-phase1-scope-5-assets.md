# ADR 0002: Phase 1 scope — 5 assets

**Status**: ACCEPTED
**Date**: 2026-04-19
**Deciders**: 권상현 (team lead), with team consensus

## Context

We must pick Phase 1 asset coverage for the 8-day build sprint ending 2026-04-27. `.research/oracle-inventory-base.md` §5 establishes that **exactly 3 assets are triple-sourced on Base** (BTC/USD, ETH/USD, USDC/USD), **~6 are dual-sourced** (including cbETH/USD), and **zero tokenized RWAs on Base have multi-oracle overlap** — RWAs must rely on attestation tracking instead of price cross-check.

Scope candidates were:

- A: 5 assets (minimum demo)
- B: 10 price + 3 attestations (balanced)
- C: 20+ assets (breadth)

## Decision

Ship Phase 1 with **5 assets**:

1. **BTC / USD** — triple-sourced price cross-check
2. **ETH / USD** — triple-sourced price cross-check
3. **USDC / USD** — triple-sourced price cross-check
4. **cbETH / USD** — dual-sourced price cross-check (**Moonwell Feb-2026 replay target**)
5. **USDO** — Chainlink Proof-of-Reserve attestation tracking (Base-native RWA)

## Consequences

### Positive
- Scope achievable in 8 days by 4-person team with substantial buffer
- Includes **cbETH** — enables direct replay of the Moonwell incident, the strongest "Why now" card in the pitch
- Includes a Base-native RWA (USDO) — validates the attestation-tracking path without depending on cross-chain CCIP
- Minimal edge cases (all 4 price assets have ≥2 on-chain oracles on Base)
- Operating cost at minimum ($40–60/mo expected)

### Negative / cost
- Demo Day headline of "5 assets monitored" is numerically modest vs 20+
- Does not include higher-profile tokenized RWAs like JTRSY, mTBILL, bIB01 — those require attestation-only path with more engineering (and bIB01 specifically needs CCIP Polygon→Base mirror, deferred to Phase 2)

### Neutral
- Scope is easily expandable in Phase 2 to the full 10-asset price cross-check set recommended in `.research/oracle-inventory-base.md` §8.4

## Alternatives considered

### Alternative B — 10 price + 3 attestations
- Pros: More impressive coverage number; Oracle research's recommended "Day 1 price set"
- Rejected because: 2–3× engineering load vs A (each new asset adds decimals/unit normalization edge cases); 8-day sprint with 4 undergraduates cannot sustain that without cutting quality

### Alternative C — 20+ assets
- Pros: "Looks serious" for Demo Day
- Rejected because: majority of target assets are single-source (e.g., POL, TRUMP) — cross-check is meaningless and the UX claim would be false; bIB01/bCSPX require Phase-2 CCIP work; the breadth would hide the depth

## Related research / prior decisions

- `.research/oracle-inventory-base.md` §5 (cross-oracle overlap matrix)
- `.research/oracle-inventory-base.md` §8 (Phase-1 feasibility verdict)
- `.research/incident-forensics-moonwell.md` §4 (cbETH replay feasibility)
- `docs/DECISIONS/0001-cf-workers-runtime.md` (runtime enables this scope)

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: Phase 2 scope ADR will supersede when it expands coverage
