# ADR 0007: Canonical encoding for `asset`, `oraclePair`, and `evidenceHash` in `AlertRegistry.logAlert`

**Status**: ACCEPTED
**Date**: 2026-04-23 (proposed) / 2026-04-24 (accepted at D4 pairing)
**Deciders**: 모진영 (proposer) + 권상현 (approver)

## Context

`apps/contracts/src/AlertRegistry.sol` (introduced in PR #1) stores each alert as a struct with three `bytes32` hash fields:

- `asset` — keccak256 of an asset symbol (e.g. `cbETH/USD`)
- `oraclePair` — keccak256 of an oracle pair identifier (e.g. `chainlink_vs_pyth`)
- `evidenceHash` — keccak256 of the off-chain evidence payload (feed values, upstream tx hashes)

The contract does not enforce any particular canonical form; it accepts any 32 bytes. Off-chain components (`apps/poller`, `apps/alert-writer`, future federation operators, external verifiers) must each decide how to hash the source data, and any divergence silently breaks the public verification promise documented in `AlertRegistry.sol:4` ("anyone can read historical alerts without trusting our backend") and in `docs/DECISIONS/0003-progressive-decentralization.md` Phase 2 federation model.

This ADR was triggered by a cross-PR review of PR #1 (agent `a5774d73d0aeb568b`) that flagged two D4-blocker-level gaps:

1. `PHASE_1_ASSETS` in `apps/poller/src/config.ts` stores mixed-case literals (`'cbETH/USD'`). A naive off-chain re-hasher that uppercases would produce `keccak256('CBETH/USD')` — a different 32-byte value for the same logical asset.
2. `AlertPayload.evidence` in `apps/poller/src/types.ts` is an open-shape object (`{chainlinkValue?, pythValue?, redstoneValue?, [extra]: unknown}`). `JSON.stringify({a:1,b:2}) !== JSON.stringify({b:2,a:1})` — key order affects the resulting keccak256.

The same review also surfaced two minor ambiguities worth pinning in this ADR: sign convention for `deviationBps`, and semantics of `blockTimestamp`.

## Decision

Define canonical encoding rules for every input to `AlertRegistry.logAlert(...)`. All off-chain implementations MUST follow these rules; non-conforming implementations produce alerts that cannot be cross-verified.

### 1. `asset: bytes32`

- Canonical form: the **literal string** in `apps/poller/src/config.ts` `PHASE_1_ASSETS[*].symbol` — mixed case preserved (`cbETH/USD`, not `CBETH/USD`).
- Separator: `/` (forward slash). Never `-`, `_`, or `:`.
- Encoding: `keccak256(utf8Bytes(symbol))` where `utf8Bytes` is UTF-8 without BOM, no trailing newline.
- Non-price assets (e.g. USDO attestation): use the plain symbol `USDO` (no `/USD` suffix; the `alertType` field disambiguates).

**Phase-1 canonical table:**

| Canonical symbol | keccak256 (hex) |
|---|---|
| `BTC/USD` | *computed at build time — see test vectors* |
| `ETH/USD` | *as above* |
| `USDC/USD` | *as above* |
| `cbETH/USD` | *as above* |
| `USDO` | *as above* |

### 2. `oraclePair: bytes32`

- Canonical form: `<source_a>_vs_<source_b>` where `source_a` and `source_b` are drawn from the closed set `{chainlink, pyth, redstone}` (all lowercase).
- Ordering: **alphabetical** — `chainlink_vs_pyth`, not `pyth_vs_chainlink`. Enforced by `apps/poller/src/compare.ts:buildAlerts` which already sorts.
- Attestation alerts (no pair): use the single source name, e.g. `chainlink_por`.
- Encoding: `keccak256(utf8Bytes(pair))`.

### 3. `evidenceHash: bytes32`

- Canonical form: **RFC 8785 canonical JSON** — recursive key sort, no whitespace, no trailing comma, numeric literals in shortest-roundtrip form, escape sequences lowercase.
- Implementation: use a small deterministic-stringify helper in `apps/alert-writer/src/canonical.ts`; JS `JSON.stringify(data, Object.keys(data).sort())` is NOT sufficient because it only sorts the top level and uses the alphabetic key order of the replacer array, which is brittle. A recursive sort-keys pass is required.
- Encoding: `keccak256(utf8Bytes(canonicalJson))`.
- Required fields in `evidence` (per `AlertPayload`):
  - `chainlinkValue?: string` — `priceE18.toString()` as decimal integer
  - `pythValue?: string` — same
  - `redstoneValue?: string` — same
  - `<source>UpdatedAt?: number` — unix seconds from each oracle's own clock
- Extra keys allowed. The canonicalization rule ensures extras don't affect hash reproducibility as long as the re-verifier has the full serialized evidence.

### 4. `deviationBps: int256`

- Phase 1: **always non-negative** — the unsigned midpoint-based basis-points magnitude computed by `apps/poller/src/compare.ts:deviationBps`.
- Negative values are reserved for Phase 2 with explicit semantics (`reported_below_reference` vs `reported_above_reference`). Phase-1 alerts that set negative are protocol errors; downstream consumers may treat as unsigned magnitude.
- The test fixture `apps/contracts/test/AlertRegistry.t.sol:test_logAlert_byPublisher_appendsAlert` currently uses a negative value (`-9995 * 10`); retain the fixture but rename the intent or flip the sign in a PR #1 follow-up.

### 5. `blockTimestamp: uint64`

- **Semantic choice**: this field is **L2 block time** (`uint64(block.timestamp)`), NOT observer time.
- Rationale: L2 block time is the canonical "when did this get committed" anchor; observer time varies by off-chain implementation and cannot be enforced.
- Observer-side detection time is captured in `evidence.<source>UpdatedAt` — subscribers who need the poll-tick time read evidence, not the struct field.
- Fix in PR #1 follow-up: update `AlertRegistry.sol:30` NatSpec to read **"L2 block time at which this alert was committed (NOT observer detection time — see evidence payload)"**.

### 6. `alertType: uint32`

- `0` — price cross-check (Phase 1 default; evidence contains oracle readings)
- `1` — attestation expiry / PoR staleness (USDO, cbBTC reserves; evidence contains PoR snapshot + staleness delta)
- `2+` — reserved for Phase 2 (governance change, cross-chain mirror failure, etc.)

## Consequences

### Positive

- Every off-chain implementation (Oclix Labs Phase 1, Phase 2 federation operators, independent third-party verifiers) produces **identical `bytes32` values** for the same logical alert. The "anyone can verify historical alerts" promise becomes mechanically verifiable.
- Future federation nodes (`docs/DECISIONS/0003-progressive-decentralization.md` Phase 2) can submit alerts without coordination meetings — the wire format is documented.
- Test vectors (see below) provide a concrete conformance suite.

### Negative / cost

- Soft spec: the contract does NOT enforce these rules on-chain (too expensive). Conformance depends on off-chain implementer discipline. A rogue publisher can publish alerts with arbitrary hashes; nothing stops them, but they cannot be cross-verified.
- RFC 8785 canonical JSON implementation: not in the standard library for either TS or Solidity. We ship a ~50-line helper in `apps/alert-writer/src/canonical.ts` with test vectors. Small but non-trivial maintenance surface.
- Migration cost: existing `apps/alert-writer/src/deliveries/onchain.ts` stub currently returns a zero tx hash; the D4 pairing commit that replaces it must adopt this ADR's helpers.

### Neutral

- The `evidenceHash` pre-image (the canonical JSON) must be recoverable to verify. We publish it alongside the on-chain alert via the public API (`GET /alerts` already returns `evidence: Record<string, unknown>` — the API re-serializes from D1). Third-party verifiers fetch from the API and re-canonicalize; they do NOT need access to the original poller process.

## Alternatives considered

### Alternative A — ABI-encoded struct for evidence
- What: define a fixed Solidity struct for evidence; use `keccak256(abi.encode(...))` (analogous to EIP-712 typed data).
- Rejected because: alerts can originate from cross-check (3-valued) or attestation (1-valued) payloads. A union struct either bloats the spec or requires per-alertType variants, both of which add version-compatibility cost at Phase 2 when new alert types land.

### Alternative B — Single SHA-256 of the raw queue payload
- What: skip canonicalization; hash the raw JSON string the poller sent on the queue.
- Rejected because: the poller Worker is a trusted component today but not in Phase 2. A third-party verifier has no access to the raw queue payload; they only see the D1-stored representation. Two different D1 re-serializations of the same logical alert would produce two hashes.

### Alternative C — `string` fields on-chain, no hashing
- What: store `asset`, `oraclePair`, and canonical-JSON `evidence` as `string` directly on-chain.
- Rejected because: gas cost on Base Mainnet. Strings incur ~20k gas per 32-byte word stored; a typical evidence payload of ~200 bytes would cost ~200k gas per alert (~$0.02 at current Base gas). At 1-10 alerts/day this is manageable but it shifts the Phase-1 gas budget from "~$55/mo hybrid pattern" (`.research/oracle-inventory-base.md` §6) into multi-hundred-dollar territory.

## Related research / prior decisions

- Research: `.research/oracle-inventory-base.md` §5 (asset matrix — source of canonical symbol names), §6 (gas budget rationale)
- ADR: `docs/DECISIONS/0002-phase1-scope-5-assets.md` (locks the Phase-1 asset set whose symbols this ADR canonicalizes)
- ADR: `docs/DECISIONS/0003-progressive-decentralization.md` (Phase 2 federation — the ultimate consumer of these canonical rules)
- ADR: `docs/DECISIONS/0006-custom-access-control.md` (AlertRegistry access control — sets the contract boundary this ADR encodes into)
- Code: `apps/poller/src/config.ts:PHASE_1_ASSETS` (source of `symbol` literals)
- Code: `apps/poller/src/compare.ts:buildAlerts` (produces `oraclePair` in alphabetical form; already conforms)
- Code: `apps/alert-writer/src/deliveries/onchain.ts` (D4 pairing target — adopts this ADR)
- External: [RFC 8785 — JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)

## Implementation checklist (D4 pairing)

To accept this ADR, the D4 pairing commit must:

1. Add `apps/alert-writer/src/canonical.ts` with `hashAsset(symbol)`, `hashOraclePair(pair)`, `hashEvidence(evidence)` — each returns `` `0x${string}` ``.
2. Add `apps/alert-writer/test/canonical.test.ts` with at least these test vectors:
   - `hashAsset('cbETH/USD')` → specific keccak256 hex
   - `hashAsset('BTC/USD')` → specific hex
   - `hashOraclePair('chainlink_vs_pyth')` → specific hex
   - `hashEvidence({pythValue: '123', chainlinkValue: '456'})` === `hashEvidence({chainlinkValue: '456', pythValue: '123'})` (order invariance)
   - Nested object key-sort: `hashEvidence({a: {y: 1, x: 2}})` === `hashEvidence({a: {x: 2, y: 1}})`
3. Replace `onchain.ts` stub with real `viem.writeContract` call using the canonical helpers.
4. Update `apps/contracts/src/AlertRegistry.sol` NatSpec on `Alert.blockTimestamp` per §5 above. Add a `@dev` block on `logAlert` pointing to this ADR for encoding rules.
5. Flip the fixture sign in `apps/contracts/test/AlertRegistry.t.sol:test_logAlert_byPublisher_appendsAlert` per §4 above.

## Test vectors

(Computed values filled in at implementation time via `apps/alert-writer/test/canonical.test.ts`. Reviewers: if the values below differ from your independent computation, STOP and reconcile before merging.)

```
// Asset hashes (lowercase hex, leading 0x)
hashAsset("BTC/USD")     = 0xee62665949c883f9e0f6f002eac32e00bd59dfe6c34e92a91c37d6a8322d6489
hashAsset("ETH/USD")     = 0x0b43555ace6b39aae1b894097d0a9fc17f504c62fea598fa206cc6f5088e6e45
hashAsset("USDC/USD")    = 0xff064b881a0c0fff844177f881a313ff894bfc6093d33b5514e34d7faa41b7ef
hashAsset("cbETH/USD")   = 0x6ff7ab00bfc30fadf94e2141f6e4b8ef2ad332c4ff7c8ce76c3151137414d672
hashAsset("USDO")        = 0x42afc1d5c054e4b693e255ffbcb6f93026230e00e557e26450701313e06fe7b7

// Oracle pair hashes
hashOraclePair("chainlink_vs_pyth")      = 0x64455ea6882c26d977363c6b521963285797de745c08b0ecb9e3c0b30e5f8f09
hashOraclePair("chainlink_vs_redstone")  = 0x63e7d4799e78560552575650141e8b8a5a755dac2a069e848948e3a9b8e780cc
hashOraclePair("pyth_vs_redstone")       = 0x07ae18a7f883686a18cd0bd02c1a730e8580c6b5624ece121a7d3f4082c3dab4
hashOraclePair("chainlink_por")          = 0xdd5e08d81bd9be0b4b50c953bdc7e67ee3cc40ba88ac57910d0cef8349d23aa7

// Evidence hash example — canonical JSON form:
//   {"chainlinkUpdatedAt":1700000000,"chainlinkValue":"77000000000000000000000","pythUpdatedAt":1700000001,"pythValue":"77100000000000000000000"}
hashEvidence({chainlinkValue: "77000000000000000000000", pythValue: "77100000000000000000000", chainlinkUpdatedAt: 1700000000, pythUpdatedAt: 1700000001})
= 0x46b47a22696216c2900db4fe32d0358450c90f05e0a1d6b43bfe1096fe80be81

// Empty object reference
hashEvidence({}) = 0xb48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d
```

Cross-verified against `cast keccak "<input>"` — JS utf8 encoding in
`apps/alert-writer/src/canonical.ts` produces identical bytes32 values to
Solidity `keccak256(bytes(...))`. The D3 Sepolia smoke tx (block 40,620,070,
tx `0xeffe1780...`) emitted `asset=hashAsset("cbETH/USD")` and
`oraclePair=hashOraclePair("chainlink_vs_pyth")` already matching these
values — retroactive conformance confirmed.

These values become immutable on ADR acceptance. A change to any canonicalization rule supersedes this ADR with a new one.

## Supersedes / Superseded by

- Supersedes: —
- Superseded by: —

---

_Status transitioned to ACCEPTED at D4 pairing (2026-04-24) after all six decisions confirmed and test vectors computed. alert-writer's onchain stub is now unblocked and replaced in the same PR._
