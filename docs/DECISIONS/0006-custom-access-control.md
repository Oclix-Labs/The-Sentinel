# ADR 0006: AlertRegistry access control — custom mapping over OpenZeppelin AccessControl

**Status**: ACCEPTED
**Date**: 2026-04-20
**Deciders**: 권상현 (Lead + SC)

## Context

`AlertRegistry.sol` needs permissioned writes: only authorized publisher addresses may append alerts to the on-chain log, and an admin may rotate the publisher set. The initial scaffold (committed 2026-04-19) implements this with a hand-rolled `mapping(address => bool) isPublisher` plus a single `admin` address variable, using two `require`-style custom errors (`NotAdmin`, `NotPublisher`).

`AGENTS.md §Stack` originally prescribed `OpenZeppelin AccessControl`, which would instead grant `DEFAULT_ADMIN_ROLE` and a user-defined `PUBLISHER_ROLE` via role hashes and `hasRole` / `onlyRole` checks. This ADR resolves the discrepancy between the prescribed stack and the shipped implementation.

Phase 1 (ships 2026-04-27) runs a **single publisher** — the Oclix Labs operator key signed by the `AlertWriter` Worker. Phase 2 (`docs/ROADMAP.md` §Phase 2) introduces federated operators, which is when multi-role enumeration and event introspection become genuinely useful.

## Decision

Keep the current custom access control in `AlertRegistry.sol` (single `admin` + `mapping(address => bool) isPublisher`). Do **not** refactor to inherit `AccessControl`. Update `AGENTS.md §Stack` to read *"custom access control or OpenZeppelin AccessControl (see this ADR)"* so the rule matches reality.

Re-evaluate at the start of Phase 2 when federated operator consensus is added — by then the role-enumeration, event hooks, and admin-renouncement semantics of OZ `AccessControl` likely pay back their overhead.

## Consequences

### Positive
- Smaller attack surface: AlertRegistry runtime code is **1,534 bytes** (23,042-byte margin), no external import paths, audit-scope contained within one ~130-line file.
- Lower deploy cost on Base Mainnet (each inherited contract adds bytecode + storage slots).
- `logAlert` gas path stays a single `SLOAD` on `isPublisher[msg.sender]` vs two SLOADs through `_checkRole` in `AccessControl`.
- No submodule / remapping for `@openzeppelin/contracts` needed in Phase 1.

### Negative / cost
- Divergence from a well-audited pattern. Mitigations: Moonwell 9-incident replay fixture in `test/AlertRegistry.t.sol` exercises the role boundary, `NotPublisher` / `NotAdmin` revert paths have explicit tests (`test_logAlert_revertsIfNotPublisher`, `test_setPublisher_revertsIfNotAdmin`).
- `setPublisher` emits a custom `PublisherSet` event rather than OZ's `RoleGranted` / `RoleRevoked`. Indexers (Subgraph, etc.) built against OZ conventions need to map the custom event explicitly.
- Admin rotation is a single-step `transferAdmin`, not OZ's two-step `renounceRole` + `grantRole` pattern. A typo'd admin is unrecoverable. Accepted: Phase 1 admin key is operator-controlled and under the same multisig rotation process as other operator secrets.

### Neutral
- Both patterns satisfy the MVP DoD #5 (Base Mainnet deploy + verified). Basescan verification is orthogonal to access-control library choice.

## Alternatives considered

### Alternative A — Inherit OpenZeppelin `AccessControl`
- What: `contract AlertRegistry is AccessControl { bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE"); ... }` with `_grantRole(DEFAULT_ADMIN_ROLE, admin)` and `onlyRole(PUBLISHER_ROLE)` on `logAlert`.
- Rejected because: adds ~2-3 KB of inherited bytecode and a `@openzeppelin/contracts` submodule for a single role boundary that can be expressed in five lines. Phase 1 has no multi-role surface.

### Alternative B — Inherit OZ `Ownable` + keep publisher mapping
- What: `is Ownable` for admin, custom `isPublisher` mapping unchanged.
- Rejected because: trades no meaningful safety for added dependency — `Ownable` is 30 lines of logic wrapped in an import that still leaves the publisher path hand-rolled. Either fully commit to OZ or stay entirely custom.

## Related research / prior decisions

- ADR 0002 (`docs/DECISIONS/0002-phase1-scope-5-assets.md`) — Phase 1 scope lock that establishes "single publisher" assumption
- ADR 0003 (`docs/DECISIONS/0003-progressive-decentralization.md`) — Phase 2 federated operator model; revisit trigger for this decision
- Code: `apps/contracts/src/AlertRegistry.sol` (current implementation)
- Tests: `apps/contracts/test/AlertRegistry.t.sol` (boundary coverage)

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —

---

_Revisit at Phase 2 kickoff (post-2026-04-27 sprint) when federated operators enter scope._
