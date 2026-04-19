# Deployed Addresses

> Canonical, human + machine readable record of all deployed contract addresses and key oracle feed references. Updated in the same PR as deployment.

---

## The Sentinel — Oclix Labs deployments

### AlertRegistry

| Network | Address | Deployed | Block | Deployer |
|---|---|---|---|---|
| Base Sepolia | `0x_TBD_DEPLOY_D3` | — | — | 권상현 |
| Base Mainnet | `0x_TBD_DEPLOY_D5` | — | — | 권상현 |

After deploy, replace `_TBD_*` with real address + Basescan link + block number + deployer address.

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
