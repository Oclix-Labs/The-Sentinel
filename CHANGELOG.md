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
- **AlertRegistry deployed on Base Sepolia** (D3): `0x79b5d74A301079c86D13eb71e2787852F403F876` — deploy tx [`0x4d86042949...7b48a8708f73b2e03805915`](https://sepolia.basescan.org/tx/0x4d86042949af7ff02c01248c9fd7adaa98b88420b7b48a8708f73b2e03805915) at block 40,619,999 (gas used 491,754 @ 0.006 gwei). Basescan verification deferred to D5 (pending `BASESCAN_API_KEY`). First `AlertLogged` on-chain evidence emitted at block 40,620,070 — tx [`0xeffe1780d0...3766e7317eb8a`](https://sepolia.basescan.org/tx/0xeffe1780d012b2972c4599be49da725cd54c780d5c45e06d9db3766e7317eb8a)

### Changed
- `AlertRegistry.Alert` struct packed from 6 → 4 storage slots (`int128 deviationBps`, reordered fields) — `logAlert` median gas 147K → 123K
- `transferAdmin` is now 2-step: step 1 records `pendingAdmin`, step 2 requires `acceptAdmin()` from the new address. Typo-safe rotation, matches OpenZeppelin `Ownable2Step` semantics without the import. Removes the "unrecoverable typo" cost flagged in ADR 0006 §Consequences.
- `AlertLogged` event + `logAlert` param `deviationBps` narrowed from `int256` to `int128` (±1.7e38 bps — still well beyond any historical oracle deviation)

---

_v0.1 (MVP) target: 2026-04-27 (Base Batches 003 submission)._
