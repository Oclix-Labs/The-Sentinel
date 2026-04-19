# ADR 0005: SSOT organization — 4-layer model + cite-don't-copy protocol

**Status**: ACCEPTED
**Date**: 2026-04-19
**Deciders**: Team (consensus)

## Context

This project mixes several document types: external research (evidence), product decisions (spec / roadmap / tokenomics), task execution state, and runtime code/config. Without explicit structure these layers cross-contaminate: research findings get copy-pasted into Spec (then drift when research is updated); decisions get buried in code comments (lost on refactor); parallel `TODO.md` and `README.md` variants multiply.

This ADR defines a four-layer SSOT model with explicit **cite, don't copy** protocol to prevent staleness and decision cycles.

## Decision

Organize SSOTs into four layers:

1. **Context** (`.research/`) — external reality snapshots. **Immutable.** Front matter declares `researched_at`, `valid_until`, `confidence`. New version = new filename with `supersedes` pointer.

2. **Product intent** (`docs/*.md`, `docs/DECISIONS/*.md`) — decisions, specs, roadmap, whitepaper. Editable via PR (except accepted ADRs, which are immutable). ADRs follow `NNNN-<slug>.md` pattern with explicit `Supersedes / Superseded by`.

3. **Execution state** (GitHub Issues / Projects / Discussions / `CHANGELOG.md`) — live work. Not committed as `.md` files (except CHANGELOG).

4. **Runtime truth** (code in `apps/`, `packages/`, `wrangler.jsonc`, `foundry.toml`) — what actually runs.

**Index**: `docs/SSOT-INDEX.md` is the agent-readable entry point listing every SSOT.

**Citation protocol**: higher-layer docs (Spec, Application, ADR) reference lower-layer docs by `<file>#<section>` link. **Copy-pasting research findings into Spec is prohibited.**

**Anti-patterns** explicitly banned:
- `TODO.md` (use GitHub Issues)
- Multiple README.md at root (one root + one per package allowed)
- Decision-in-comment instead of ADR
- Research content inside Spec body
- Committing personal memory/preference

## Consequences

### Positive
- Single entry point (`docs/SSOT-INDEX.md`) for agents and humans
- Research updates flow through to Spec without Spec manual update (links still work)
- Decision history queryable via `docs/DECISIONS/` (git-searchable, immutable)
- Each SSOT has clear ownership (see AGENTS.md §File layout + ownership)

### Negative / cost
- Extra discipline required: "is this fact cited?" checks during reviews
- ADR creation overhead for decisions (mitigated by template + short form)

### Neutral
- Index requires maintenance on every new SSOT addition (one line in SSOT-INDEX.md)

## Alternatives considered

### Alternative — Flat `docs/` with no layer distinction
- Pros: simpler
- Rejected because: research and decisions commingle, staleness blind spot

### Alternative — ADRs in Notion / external tool
- Pros: rich editing
- Rejected because: git history is the canonical record; external tools break agent readability

## Related research / prior decisions

- `AGENTS.md` §Task rules for AI agents
- `docs/SSOT-INDEX.md` (implementation of this ADR)
- Patterns borrowed: `architecture-decision-records.github.io`, `GitHub Engineering` layered docs model

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —
