# Changelog

All notable changes to The Sentinel will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and Conventional Commits.

## [Unreleased]

### Added
- Initial repository scaffold (AGENTS.md, CLAUDE.md, README, LICENSE, Biome config, tsconfig, wrangler)
- Docs: ROADMAP, TOKENOMICS-OUTLINE, WHITEPAPER-v0.1-SKELETON, APPLICATION-BM-DRAFTS, MEMBER-TASKS, SSOT-INDEX
- Research SSOT: `.research/incident-forensics-moonwell.md`, `.research/oracle-inventory-base.md`, `.research/competitor-architecture.md`
- ADRs 0001–0005 documenting foundational decisions
- GitHub issue + PR templates, CODEOWNERS, CI workflow
- AlertRegistry Foundry project: forge-std submodule, `remappings.txt`, `script/Deploy.s.sol`, `.env.example`, workspace `package.json`
- ADR 0006: custom access control for AlertRegistry (vs OpenZeppelin)
- `apps/contracts/.gas-snapshot` captured as regression baseline
- `acceptAdmin` + `cancelAdminTransfer` functions + `AdminTransferInitiated` event + `NotPendingAdmin` error

### Changed
- `AlertRegistry.Alert` struct packed from 6 → 4 storage slots (`int128 deviationBps`, reordered fields) — `logAlert` median gas 147K → 123K
- `transferAdmin` is now 2-step: step 1 records `pendingAdmin`, step 2 requires `acceptAdmin()` from the new address. Typo-safe rotation, matches OpenZeppelin `Ownable2Step` semantics without the import. Removes the "unrecoverable typo" cost flagged in ADR 0006 §Consequences.
- `AlertLogged` event + `logAlert` param `deviationBps` narrowed from `int256` to `int128` (±1.7e38 bps — still well beyond any historical oracle deviation)

---

_v0.1 (MVP) target: 2026-04-27 (Base Batches 003 submission)._
