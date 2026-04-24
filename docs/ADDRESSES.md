# Deployed Addresses

> Canonical, human + machine readable record of all deployed contract addresses and key oracle feed references. Updated in the same PR as deployment.

---

## The Sentinel — Oclix Labs deployments

### AlertRegistry

| Network | Address | Deployed | Block | Verified | Deployer |
|---|---|---|---|---|---|
| Base Sepolia | [`0x79b5d74A301079c86D13eb71e2787852F403F876`](https://sepolia.basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code) | 2026-04-24 | 40,619,999 | ✅ [source](https://sepolia.basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code) | `0x4F9EA9738Ee50b68FbE255CE6a1551C799dd47DB` |
| Base Mainnet | [`0x79b5d74A301079c86D13eb71e2787852F403F876`](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code) | 2026-04-24 | 45,121,958 | ✅ [source](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code) | `0x4F9EA9738Ee50b68FbE255CE6a1551C799dd47DB` |

_The Mainnet and Sepolia addresses are identical because CREATE is deterministic from `(deployer, nonce=0)` and the deployer's first transaction on each chain is the AlertRegistry deploy._

- **Base Sepolia deploy tx**: [`0x4d86042949af7ff02c01248c9fd7adaa98b88420b7b48a8708f73b2e03805915`](https://sepolia.basescan.org/tx/0x4d86042949af7ff02c01248c9fd7adaa98b88420b7b48a8708f73b2e03805915)
- **Base Mainnet deploy tx**: [`0xf0d9d831d07bbd6667cf72009bde0ad6956fe45652f4a46893cea2cf7d392ecd`](https://basescan.org/tx/0xf0d9d831d07bbd6667cf72009bde0ad6956fe45652f4a46893cea2cf7d392ecd) — 491,742 gas @ 0.005 gwei = 0.00000246 ETH (~$0.007).
- **First `AlertLogged` on-chain evidence** (D3 Sepolia smoke, alertId=0): [`0xeffe1780d012b2972c4599be49da725cd54c780d5c45e06d9db3766e7317eb8a`](https://sepolia.basescan.org/tx/0xeffe1780d012b2972c4599be49da725cd54c780d5c45e06d9db3766e7317eb8a) at block 40,620,070 — payload: `keccak256("cbETH/USD") × keccak256("chainlink_vs_pyth")`, deviationBps `-9995` (Moonwell-magnitude), evidenceHash `keccak256("d3-sepolia-smoke")`, alertType `0`.
- **First end-to-end staging alert** (D4 Sepolia smoke, alertId=1): canonical-encoded via `apps/alert-writer/src/canonical.ts`, injected through the Cloudflare Queue, picked up by the deployed `rwa-sentinel-alert-writer-staging` Worker, submitted via viem `writeContract`. D1 row readback confirms `onchain_status='confirmed'`. Proves ADR 0007 §§1-6 encoding is bit-identical on both sides (JS `keccak256(stringToBytes(...))` ≡ Solidity `keccak256(bytes(...))`).
- **First Mainnet `AlertLogged`** (D5 smoke, alertId=0 on Mainnet): [`0x6887b042a839ec4d1a2b1e936b4bd5c304ee9e2b0f4b9d17cb711d4e04338c09`](https://basescan.org/tx/0x6887b042a839ec4d1a2b1e936b4bd5c304ee9e2b0f4b9d17cb711d4e04338c09) at block 45,121,985 — payload: `keccak256("cbETH/USD") × keccak256("chainlink_vs_pyth")`, deviationBps `9995` (ADR 0007 §4 unsigned), evidenceHash `keccak256("mainnet-d5-first-alert")`, alertType `0`.
- **Basescan verified**: Sepolia 2026-04-24, Mainnet 2026-04-24 — both via `forge verify-contract` (Etherscan V2 unified API). Source + ABI public at each chain's `#code` tab.
- **Admin rotation**: deployer is currently also `admin` and `publisher` on both chains. Phase 2 will rotate admin to a multisig via 2-step `transferAdmin` → `acceptAdmin` flow.

---

## Upstream oracle references (Base Mainnet)

These are NOT our contracts — they are the oracle feeds we read. Kept here for traceability.

### Chainlink (Base Mainnet)

From [Chainlink Base feed list](https://docs.chain.link/data-feeds/price-feeds/addresses?network=base):

| Feed | Proxy address | Deviation | Heartbeat |
|---|---|---|---|
| BTC / USD | `0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F` | 0.1% | 20min |
| ETH / USD | `0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70` | 0.15% | 20min |
| USDC / USD | `0x7e860098F58bBFC8648a4311b374B1D669a2bc6B` | 0.3% | 86400s |
| cbETH / USD | `0xd7818272B9e248357d13057AAb0B417aF31E817d` | 0.15% | — |
| cbBTC PoR Reserves | `0x0F8E057D1D7b282EF968D26E9cB432617dF52519` | 0.5% | 86400s |
| USDO PoR Reserves | `0x5218Ebeb96bD2bAFe21F9b143f5672552629ba79` | 0.5% | — |

Full inventory: `.research/oracle-inventory-base.md` §2.

### Pyth Network (Base Mainnet)

- Main contract: `0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a`
- Sponsored feeds (push, 1% deviation, 1h heartbeat): ETH/USD, USDC/USD, CBETH/USD, WSTETH/USD, USDT/USD, SUI/USD, XRP/USD, WETH/USD, USR/USD, RLP/USD, WSTUSR/USR (12 total)

Full list + feed IDs: `.research/oracle-inventory-base.md` §3.

### RedStone (Base Mainnet)

| Feed | Address | Deviation | Heartbeat |
|---|---|---|---|
| BTC | `0x24eDD61cdA334bFf871A80DEB135073a7d7a9187` | 0.5% | 24h |
| ETH | `0xe8D9FbC10e00ecc9f0694617075fDAF657a76FB2` | 0.5% | 24h |
| USDC | `0xDd87FD0FD6F68AcB6897d05fCf31F3AB1165a49F` | 0.5% | 24h |

Full inventory: `.research/oracle-inventory-base.md` §4.

### Base-deployed tokenized RWAs we monitor

| Token | Address | Issuer |
|---|---|---|
| USDO | `0xaD55aebc9b8c03FC43cd9f62260391c13c23e7c0` | OpenEden |
| cUSDO (wrapper) | `0x83dB73EF5192de4B6a4c92bD0141Ba1a0Dc87c65` | OpenEden |

Full inventory: `.research/oracle-inventory-base.md` §6.

---

## Conventions

- All addresses checksummed (EIP-55).
- Every address has: Basescan link, deployer address, deploy block, deploy tx hash (commit after deploy).
- For upstream oracles: cite source (`.research/oracle-inventory-base.md#<section>`) so this table does not become stale vs upstream changes.
- If an address changes upstream, update here AND the relevant `.research/*` via new-version file with `supersedes` pointer.

---

_Owner: 권상현 (our deploys) + 김현우 (upstream references). Last updated: 2026-04-19 (pre-deploy stub)._
