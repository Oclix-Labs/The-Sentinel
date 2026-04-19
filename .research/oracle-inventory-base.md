# Oracle Inventory on Base Mainnet — RWA Sentinel Phase-1 Feasibility Research

_Last researched: 2026-04-19. All ticker/address claims were verified against primary docs (docs.chain.link / docs.pyth.network / docs.redstone.finance / project docs). Items that could not be cross-verified are tagged **⚠️ uncertain** with a URL to check._

## TL;DR

1. **Three oracles are live on Base mainnet**: Chainlink (~69 distinct feeds, ~113 counting SVR proxies), Pyth (~400+ pull-mode feeds permissionlessly available + 12 sponsored push feeds), and RedStone (only 3 push feeds — BTC, ETH, USDC — on Base; all other RedStone coverage requires pull/ERC-7412 integration).
2. **Multi-oracle overlap on Base is narrow**: only ~6 asset pairs have 2+ oracles with push-mode feeds (BTC/USD, ETH/USD, USDC/USD, cbETH/USD, wstETH/USD, and possibly USDT/USD). For everything else, a cross-check engine must fall back to Pyth pull (which changes the latency / tx-cost profile) or mark it single-source.
3. **A ±2% Chainlink-vs-Pyth cross-check engine IS viable on Base day-1** for the 5-10 core crypto majors and LSTs — but **multi-oracle cross-check for tokenized RWAs (USDY, USTB, OUSG, mTBILL, JTRSY, bIB01, bCSPX) is NOT viable** because those assets either (a) have no price oracle of any kind on Base, or (b) have only a single oracle. RWA coverage on Base has to lean on Chainlink Proof-of-Reserve feeds (5 of them live on Base) + attestation/governance change detection, not price cross-check.

---

## 2. Chainlink on Base

### 2.1 Price Feed Inventory (source: Chainlink RDD, `reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json`, and `data.chain.link/feeds/base/base/*`)

All feeds below return `decimals=8` for USD pairs and `decimals=18` for ETH-denominated Exchange Rates unless noted. "SVR" = Secure Value Recovery secondary proxy (available for feeds marked, same underlying aggregator, different liquidation-safe proxy address).

**Crypto majors (USD-denominated)**

| Asset pair | Proxy (standard) | Proxy (SVR) | Deviation | Heartbeat | Decimals |
|---|---|---|---|---|---|
| BTC / USD | `0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F` | `0x03Df23A32C83cA8cD9B1aAC0aF1c72924af7502b` | 0.1% | ⚠️ uncertain (likely 1200s / 20min per RDD derived) | 8 |
| ETH / USD | `0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70` | `0x1428C9E908e32dD2839F99D63C242c91329A58C0` | 0.15% | ⚠️ uncertain (likely 1200s) | 8 |
| SOL / USD | `0x975043adBb80fc32276CbF9Bbcfd4A601a12462D` | `0xDa5Fd22F9382e57534fEdA4fF544878aa1cf401f` | 0.5% | 86400 | 8 |
| LINK / USD | `0x17CAb8FE31E32f08326e5E27412894e49B0f9D65` | — | 0.5% | 86400 | 8 |
| AAVE / USD | `0x65B5d02E1Fff839b8B67Fa26F8540e5f11454316` | (SVR enabled) | 0.5% | 86400 | 8 |
| SNX / USD | `0xe3971Ed6F1A5903321479Ef3148B5950c0612075` | — | 0.5% | 86400 | 8 |
| DOGE / USD | — | `0x304adeae3041d6D0745249FD4583e8C542De67d6` | 0.5% | 86400 | 8 |
| ADA / USD | — | `0x5299a0e1e79BaebA0EAB96C10727DF35489aAA38` | 0.5% | 86400 | 8 |
| XRP / USD | — | `0xF35059FB4471333F81E4F39fA40260FF53Dc340b` | 0.5% | 86400 | 8 |
| LTC / USD | `0x206a34e47093125fbf4C75b7c7E88b84c6A77a69` | — | 0.5% | 86400 | 8 |
| BNB / USD | `0x4b7836916781CAAfbb7Bd1E5FDd20ED544B453b1` | — | 0.5% | 86400 | 8 |
| POL / USD | `0x5E988c11a4f92155C30D9fb69Ed75597f712B113` | — | 0.5% | 86400 | 8 |
| CBXRP / USD | `0xEEe1a9D5A0C36d99972C057Cb959267e88Ab9160` | — | 0.5% | 86400 | 8 |
| RSR / USD | `0xAa98aE504658766Dfe11F31c5D95a0bdcABDe0b1` | — | 0.5% | 86400 | 8 |
| RDNT / USD | `0xEf2E24ba6def99B5e0b71F6CDeaF294b02163094` | — | 0.5% | 86400 | 8 |
| MAVIA / USD | `0x979447581b39caCA33EF0CA8208592393D16cc13` | — | 0.5% | 86400 | 8 |
| TRUMP / USD | `0x7bAfa1Af54f17cC0775a1Cf813B9fF5dED2C51E5` | — | 0.5% | 86400 | 8 |
| AMP / USD | `0x1688e4B274a4CC9fD398EbA6Ae4dfb6528A9D2bc` | — | 0.5% | 86400 | 8 |
| AXL / USD | `0x676C4C6C31D97A5581D3204C04A8125B350E2F9D` | — | 0.5% | 86400 | 8 |
| AVNT / USD | `0x50997b806B574501cC34a2a6d845e4dc1Bd9Aa8c` | — | 0.5% | 86400 | 8 |
| MLN / USD | `0x122b5334A8b55861dBc6729c294451471FbF318D` | — | 0.5% | 86400 | 8 |
| XDC / USD | `0x237A94A594DD38DF7e50CeFDa0b8916a54d01ecC` | — | 0.5% | 86400 | 8 |
| WMTx / USD | `0x311681f6E0b34670Fb03e066cc08C6D09149a44c` | — | 0.5% | 86400 | 8 |
| USR / USD | `0x4a595E0a62E50A2E5eC95A70c8E612F9746af006` | — | 0.5% | 86400 | 8 |

**Stablecoins**

| Asset pair | Proxy (standard) | Proxy (SVR) | Deviation | Heartbeat |
|---|---|---|---|---|
| USDC / USD | `0x7e860098F58bBFC8648a4311b374B1D669a2bc6B` (confirmed `data.chain.link`) / RDD also lists `0x458138Fc0D67027E9A6778ef40a6ffC318c69061` | `0x1401Fd60F9ba4F718a2fE6149aadf3d1F0dB1b0A` | 0.3% | 86400 |
| USDT / USD | `0xf19d560eB8d2ADf07BD6D13ed03e1D11215721F9` | `0xb4b7ac939fB1ABA057D70Eb070254503777D8b1c` | 0.3% | 86400 |
| DAI / USD | `0x591e79239a7d679378eC8c847e5038150364C78F` | — | 0.3% | 86400 |
| USDS / USD | `0x2330aaE3bca5F05169d5f4597964D44522F62930` | — | 0.5% | 86400 |
| USDe / USD | `0x790181e93e9F4Eedb5b864860C12e4d2CffFe73B` | — | 0.5% | 86400 |
| DOLA / USD | `0x4aEE0164400FE35B6b400F2d767A618Bcb96a02D` | — | 0.5% | 86400 |
| GHO / USD | — | `0x1B5FEF61Ff9B690364359b03cC07E060b12Bd3C1` | 0.5% | 86400 |
| OUSDT / USD | `0x0E230b1077c663f8Fb5e68d84A8e3e33D97d7436` | — | 0.5% | 86400 |

**LSTs / LRTs (USD-denominated or ETH-denominated)**

| Asset pair | Proxy | Deviation | Heartbeat | Notes |
|---|---|---|---|---|
| cbETH / USD | `0xd7818272B9e248357d13057AAb0B417aF31E817d` | 0.15% | ⚠️ uncertain | Risk tier: Medium |
| cbETH / ETH | `0x806b4Ac04501c29769051e42783cF04dCE41440b` | 0.5% | 86400 | Risk tier: Medium |
| cbETH-ETH Exchange Rate | `0x868a501e68F3D1E89CfC0D22F6b22E8dabce5F04` | 0.5% | 86400 | PoR-style exchange-rate feed |
| wstETH / ETH | `0x43a5C292A453A3bF3606fa856197f09D7B74251a` | 0.5% | 86400 | — |
| wstETH-ETH Exchange Rate | `0xa669E5272E60f78299F4824495cE01a3923f4380` | — | 86400 | — |
| wstETH-stETH Exchange Rate | `0xB88BAc61a4Ca37C43a3725912B1f472c9A5bc061` | 1e-7 | 86400 | PoR-style feed |
| stETH / ETH | `0xf586d0728a47229e747d824a939000Cf21dEF5A0` | — | 86400 | — |
| rETH / ETH | `0xf397BF97280B488cA19ee3093E81C0a77F02e9a5` | 0.5% | 86400 | Risk tier: Very High |
| rETH / ETH Exchange Rate | `0x1E6A29666288a310326B37d823Fe4Ea3937424D2` | 1e-7 | 86400 | PoR-style feed |
| weETH / eETH Exchange Rate | `0xd71cdcAaea1Ce61146CD7257BE65412007a62819` | 0.5% | 86400 | — |
| rswETH / ETH Exchange Rate | `0x97b770B0200CCe161907a9cbe0C6B177679f8F7C` | 0.5% | 86400 | — |
| ezETH / ETH Exchange Rate | `0xC4300B7CF0646F0Fe4C5B2ACFCCC4dCA1346f5d8` | 0.5% | 86400 | — |
| LsETH / ETH Exchange Rate | `0x2621897C993fdE08873Ef58dA1453aEE49a70144` | 1e-7 | 86400 | PoR-style |
| inETH / ETH Exchange Rate | `0x83ac12dBb5Bd7Fa597ab2FFEc9F2F13DeDdFe163` | 0.5% | 86400 | — |
| inwstETH / wstETH | `0xb58c5C550Ba19c4CEeE071F8CeeB58f8770e6978` | 1e-7 | 86400 | — |
| yETH / ETH | `0xaE95742Cf839529798Bcd1610c6E0AFEBA0cBC03` | 0.05% | 86400 | — |
| ynETHx / ETH | `0x4e7dB2f9a28348AB48a968dd4217D565D1F15Ba4` | 1e-7 | 86400 | — |
| ultraETHs / ETH | `0xbb9786e37D54251477EbC1325b04ACdCA18C2254` | 0.5% | 86400 | — |

**BTC derivatives / wrapped BTC**

| Asset pair | Proxy | Deviation | Heartbeat |
|---|---|---|---|
| cbBTC / USD | `0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D` | — | 86400 |
| LBTC / USD | `0x9e07546c9Fe8868855CD04B26051a26D1599E270` | — | 86400 |
| LBTC / BTC | `0x1E6c22AAA11F507af12034A5Dc4126A6A25DC8d2` | — | 86400 |

**Exchange-rate / stablecoin internal**

| Asset pair | Proxy | Deviation | Heartbeat |
|---|---|---|---|
| sUSDe / USDe Exchange Rate | `0xdEd37FC1400B8022968441356f771639ad1B23aA` | 0.5% | 86400 |
| sUSDz / USDz Exchange Rate | `0xD89c7fFB39C44b17EAecd8717a75A36c19C07582` | 0.5% | 86400 |
| sUSDai / USDai Exchange Rate | `0x1a42ec779Ed3e5249d9b83Ad6B51492953080Ad9` | 0.05% | 86400 |

**FX / commodities / macro**

| Asset pair | Proxy | Deviation | Heartbeat |
|---|---|---|---|
| EUR / USD | `0xc91D87E81faB8f93699ECf7Ee9B44D11e1D53F0F` | 0.1% | 3600 |
| EURC / USD | `0xDAe398520e2B67cd3f27aeF9Cf14D93D927f8250` or RDD `0x9867186e52d2F1C2c565CDA6E747101Fa56501e0` | 0.3% (docs) / 0.1% (RDD) ⚠️ | 3600 |
| GBP / USD | `0xCceA6576904C118037695eB71195a5425E69Fa15` | 0.5% | 86400 |
| CHF / USD | `0x3A1d6444fb6a402470098E23DaD0B7E86E14252F` | 0.5% | 86400 |
| SGD / USD | `0x81575495532fB311Efc5C993B612564274F0949b` | 0.5% | 86400 |
| ZAR / USD | `0x2ecc8A8B370fC6a217166b2782a35339bEBEe98B` | 0.5% | 86400 |
| IDR / USD | `0x05A6cF213EcC5501A11a08EBefA4A8a60313ef97` | 0.5% | 86400 |
| XAU / USD (gold) | `0x5213eBB69743b85644dbB6E25cdF994aFBb8cF31` | 0.5% | 86400 |
| XAG / USD (silver) | `0x7dBC779B2A6F9B9AaB83a2dED78A2F7E9e203f0c` | 0.5% | 86400 |
| PCE Price Index Level | `0x18A3fcA54FaC5B05837205bA4b823fc56191F793` | — | — |

**Operational / infrastructure**

| Feed | Proxy | Notes |
|---|---|---|
| L2 Sequencer Uptime Status | `0xBCF85224fc0756B9Fa45aA7892530B47e10b6433` | Standard Base sequencer uptime feed |

**Total distinct Base Chainlink price feeds counted: ~69** (113 if SVR dual-proxy variants are counted separately per RDD).

### 2.2 Chainlink Proof-of-Reserve (PoR) on Base

**⚠️ The proposal's assumption that "PoR is Polygon-only" is outdated.** As of 2026-04, Base mainnet DOES have multiple PoR / Reserves feeds live:

| PoR Feed | Aggregator | Proxy | Deviation | Heartbeat | Source type |
|---|---|---|---|---|---|
| **cbBTC Reserves** (Coinbase BTC) | `0x2ADeE6721025a7DFFdbAd64E3fF7A2E69C7ca5e0` | `0x0F8E057D1D7b282EF968D26E9cB432617dF52519` | 0.5% | 86400 | Self-attested wallet manager (Coinbase) |
| **USDO Reserves** (OpenEden) | — | `0x5218Ebeb96bD2bAFe21F9b143f5672552629ba79` | 0.5% | ⚠️ uncertain (docs show `...`) | Self-attested cross-chain manager (LedgerLens stack) |
| **iBTC Proof of Reserves** | `0x01947080Cc567312f7e1ff744Dc5d1186d32C554` | `0x7FCED5198e43ec93Ef2179DFC70a8dcf494DcB80` | 1e-7 | 86400 | Third-party attestation |
| **dlcBTC Proof of Reserves** | `0x518788cC82BfE8b89BF205daeb71072389F2b52F` | `0x30A76F4E688Cf52f4A06D7AAd987A7037f3Ae6f7` | 1e-7 | 86400 | Third-party attestation |
| **GLDY Reserves** | `0x032973836d41234a0959661FAd3c7f5a447c8635` | `0xf488FA1B4Ac8210bf0b2d212176ca28c48F86708` | 1e-7 | 86400 | Third-party |
| **TETH Reserves** (21Shares Eth ETP?) | `0x1AF6f3bDD9DC16C770e61FF950b09B2EB51955cb` | `0x0b68ac37a1668DAaab1882543368E076C38C40e9` | 1e-7 | 86400 | Third-party |

**Key implication for RWA Sentinel**: five of Base's six PoR feeds are BTC-related (cbBTC, iBTC, dlcBTC, TETH, GLDY) + one stablecoin (USDO). The "tokenized-treasury PoR on Base" story is USDO only. For Backed's bIB01/bCSPX, Ondo's OUSG/USDY, and Superstate's USTB, PoR is still Polygon/Ethereum-only (bIB01 PoR: Polygon `0xad4395fc414Fc1575A7a38C20B0Bfdbdb09ee41A`; bCSPX PoR: Polygon `0x55e75d35c44A9EE1A5b05416640965EbcA4a8D33`).

**Polygon PoR feeds for Backed** (non-Base but documented here since the proposal mentioned them):

| PoR Feed | Proxy | Chain | Deviation |
|---|---|---|---|
| bIB01 Reserves | `0xad4395fc414Fc1575A7a38C20B0Bfdbdb09ee41A` | Polygon | 10% |
| bCSPX Reserves | `0x55e75d35c44A9EE1A5b05416640965EbcA4a8D33` | Polygon | 10% |
| bIBTA Reserves | ⚠️ unknown, verify at data.chain.link/feeds | Polygon | — |

### 2.3 CCIP — mirroring Polygon PoR to Base

Both Polygon and Base are supported by Chainlink CCIP (60+ chains total). The **practical pattern** to mirror a Polygon PoR feed into Base:

1. Deploy a CCIP-compatible receiver contract on Base that stores `(answer, updatedAt)` payloads.
2. On Polygon, deploy a Keeper/Automation-triggered messenger that reads the `latestRoundData()` from the Polygon PoR aggregator and sends it via CCIP to the Base receiver.
3. The Base receiver exposes a minimal AggregatorV3 interface that RWA Sentinel can poll.

**Caveats**: (a) adds end-to-end latency (typical CCIP finality 20min+ Polygon→Base), (b) CCIP fee per message ~$0.50–$2 depending on payload + destination gas, (c) the "mirror" is authenticated by the sender DON rather than being a native Chainlink report on Base — i.e. one layer of indirection that must be documented for auditors. It's a reasonable Phase-2 pattern but is NOT the same as a native-on-Base PoR feed.

---

## 3. Pyth Network on Base

### 3.1 Pyth contract + model

- **Main Pyth contract on Base**: `0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a` (verified on BaseScan; EIP-1967 transparent proxy; implementation `0x41c9e39574f40ad34c79f1c99b66a45efb830d4c`).
- **Launch**: August 2023.
- **Total feed IDs permissionlessly callable on Base**: 400-500+ price feed IDs (same universal Pyth ID space as all Pyth-supported chains). Pyth's catalog includes crypto, US equities, FX, ETFs, commodities, rates, macro.
- **Model**: **pull-based**. Price data is published off-chain to Pythnet → Hermes relay. To use a price on Base, caller must fetch signed price update from Hermes and submit `updatePriceFeeds(...)` on the Pyth contract before reading via `getPriceNoOlderThan(...)`. Update fee: historically 1 wei per feed update (though governance may change this); caller pays calldata + gas. A single update for one feed on Base typically costs 50k–80k gas + update fee.

### 3.2 Pyth sponsored push feeds on Base

Pyth Data Association "sponsors" feeds by pushing updates on a schedule so consumers don't have to. On Base mainnet, **12 sponsored feeds** are live (source: `docs.pyth.network/price-feeds/core/push-feeds/evm`), all with **1h heartbeat / 1% deviation**:

| Asset | Feed ID (truncated) |
|---|---|
| USDC/USD | `eaa020...c94a` |
| ETH/USD | `ff6149...0ace` (matches canonical Pyth ETH/USD) |
| WETH/USD | `9d4294...60f6` |
| CBETH/USD | `15ecdd...5717` |
| WSTETH/USD | `6df640...e784` |
| SUI/USD | `23d731...5744` |
| XRP/USD | `ec5d39...a1c8` |
| USR/USD | `10b013...7f9c` |
| USR/USD.RR | `512a79...8a52` |
| RLP/USD | `7265d5...823d` |
| RLP/USD.RR | `796bcb...a839` |
| WSTUSR/USR.RR | `b74c2b...b706` |

The rest of the Pyth catalog (BTC, SOL, LINK, FX, equities, USDY, etc.) is available on Base but as **pull-mode only** — callers must pay and push the update.

### 3.3 Pyth RWA feeds

Pyth has published per-asset price feeds for several tokenized-RWAs but these are price-of-token feeds from Pyth publishers, NOT PoR:

- **USDY/USD**: announced (Pyth × Ondo partnership, 2024). Feed ID ⚠️ uncertain, verify at `hermes.pyth.network/v2/price_feeds?query=USDY`.
- **ONDO/USD**: live (Pyth launch Jan 2024). Not RWA, governance token.
- **Other RWAs (OUSG, USTB, USDTB, bCSPX, bIB01, JTRSY, mTBILL)**: **no Pyth feeds found** as of 2026-04 on primary docs. Confirm via Pyth Symbols API: `https://pyth.dourolabs.app/v1/symbols?query=<ticker>`.

### 3.4 Pull-vs-push implications for a cross-check engine

| Aspect | Chainlink (push) | Pyth (pull, non-sponsored) |
|---|---|---|
| On-chain state continuously fresh? | Yes (push on heartbeat+deviation) | No — stale until someone calls `updatePriceFeeds` |
| Cost per read | 1 SLOAD (~2.1k gas when cold) | ~50–80k gas + 1 wei fee per updated feed |
| Cross-check cadence every 30s | Read directly | Must pay to push fresh, OR rely on someone else pushing (e.g. Morpho, Aerodrome) |
| Sponsored-feed overlap with Chainlink | N/A | 12 feeds only |

**Concrete implication for RWA Sentinel**: For non-sponsored Pyth feeds, the cross-check engine either (a) pays to push Pyth updates every 30s (expensive), (b) reads the last-pushed on-chain state and accepts that it may be hours stale (defeats the 30s-cadence promise), or (c) runs the entire comparison off-chain by calling Hermes REST API for Pyth and calling a Chainlink RPC for the aggregator — off-chain compare, on-chain alert emit only when deviation > 2%. **Option (c) is the only economically viable Phase-1 pattern.**

---

## 4. RedStone on Base

### 4.1 Push-mode feeds on Base mainnet

Per `app.redstone.finance/push-feeds` filtered to Base, **only 3 push feeds are live**:

| Ticker | Feed address | Deviation | Heartbeat |
|---|---|---|---|
| BTC | `0x24eDD61cdA334bFf871A80DEB135073a7d7a9187` | 0.5% | 24h |
| ETH | `0xe8D9FbC10e00ecc9f0694617075fDAF657a76FB2` | 0.5% | 24h |
| USDC | `0xDd87FD0FD6F68AcB6897d05fCf31F3AB1165a49F` | 0.5% | 24h |

This is RedStone's entire Base push-mode footprint. Everything else (wstETH, weETH, ezETH, rsETH, cbETH, USDe, sUSDe, USDY, USDTB, etc.) that RedStone advertises is only available via:

- **Pull mode / Classic**: signed payloads fetched from RedStone nodes, attached to user tx calldata, validated on-chain via `@redstone-finance/evm-connector`. Asset-agnostic — any of RedStone's 1,300+ assets can be read this way on Base.
- **ERC-7412 hybrid**: allows a contract to request fresh pull updates mid-call.
- **RedStone Bolt**: zero-latency same-block data (deployed chains ⚠️ unclear if Base is supported for Bolt specifically, verify at `blog.redstone.finance`).

### 4.2 RedStone RWA-specific on Base

Per primary docs and community docs, RedStone has NOT deployed RWA-specific push feeds on Base. RedStone does advertise LRT/LST (weETH, ezETH, rsETH) and Ethena (USDe/sUSDe) coverage, but those are on other chains (mostly Ethereum, Arbitrum, BNB). ⚠️ **Uncertain** — no definitive "no" was found in docs; the absence is inferred from the 3-feed push-mode list and the lack of Base entries in `app.redstone.finance/app/feeds/?network=base`.

### 4.3 Model implications

RedStone pull mode is **technically viable as a cross-check source on Base** but:

1. It requires the verifier contract (or off-chain engine) to fetch signed payloads from RedStone's gateway, which is a separate data pipeline from Chainlink and Pyth (different publisher set, different aggregation, different signing keys — true independence).
2. Off-chain, RedStone also publishes REST endpoints (`api.redstone.finance/prices?symbols=ETH,BTC`) that any Phase-1 off-chain cross-check engine can poll at no gas cost.
3. Like Pyth, continuous on-chain staleness is the cost of the pull model.

---

## 5. Cross-Oracle Overlap Matrix (core RWA Sentinel scope)

**Methodology**: "Available" means a dedicated on-chain feed exists on Base mainnet that RWA Sentinel can read today without off-chain relays. Pyth sponsored = counted as on-chain available. Pyth pull-only = counted as "pull" (viable if the engine is willing to pay for updates or compare off-chain via Hermes). RedStone pull is similarly counted as "pull" via the REST API or on-chain adapter.

| Asset | Chainlink on Base | Pyth on Base | RedStone on Base | Overlap (push+pull) |
|---|---|---|---|---|
| **BTC/USD** | ✅ `0x64c911...848F` (push) | ✅ sponsored push + pull | ✅ `0x24eDD6...9187` push | **3 (TRIPLE)** |
| **ETH/USD** | ✅ `0x710412...Bb70` (push) | ✅ sponsored push + pull | ✅ `0xe8D9Fb...6FB2` push | **3 (TRIPLE)** |
| **USDC/USD** | ✅ `0x458138...9061` (push) | ✅ sponsored push + pull | ✅ `0xDd87FD...a49F` push | **3 (TRIPLE)** |
| **cbETH/USD** | ✅ `0xd78182...817d` (push) | ✅ sponsored push + pull | ❌ (pull via REST) | **2+ (cross-checkable)** |
| **wstETH/USD** | ❌ (only wstETH/ETH feeds) | ✅ sponsored push + pull | ❌ (pull via REST) | **1–2** (synthetic USD via wstETH/ETH × ETH/USD) |
| **USDT/USD** | ✅ `0xf19d56...21F9` (push) | ✅ pull (non-sponsored) | ❌ | **2** (push + pull) |
| **DAI/USD** | ✅ `0x591e79...C78F` (push) | ✅ pull | ❌ | **2** |
| **USDS/USD** | ✅ `0x2330aa...2930` (push) | ⚠️ pull ⚠️ | ❌ | **1–2** |
| **USDe/USD** | ✅ `0x790181...e73B` (push) | ✅ pull (Ethena universal) | ✅ pull via REST | **1 push + 2 pull = 3 possible** |
| **EURC/USD** | ✅ `0xDAe398...8250` (push) | ✅ pull | ❌ | **2** |
| **cbBTC/USD** | ✅ `0x07DA0E...9f9D` (push) + PoR | ✅ pull | ❌ | **2** |
| **LBTC/USD** | ✅ `0x9e0754...e270` (push) | ⚠️ pull | ❌ | **1–2** |
| **rETH/ETH** | ✅ `0xf397BF...e9a5` (push) | ⚠️ pull for rETH/USD | ❌ | **1–2** |
| **sDAI** | ❌ not deployed on Base | ❌ no feed | ❌ | **0** (token itself not on Base) |
| **USDY/USD** | ❌ no feed on Base | ⚠️ pull (via Ondo×Pyth partnership) | ⚠️ pull unclear | **1 pull max** |
| **USDTB/USD** | ❌ | ❌ | ❌ | **0** |
| **OUSG/USD** | ❌ | ❌ | ❌ | **0** (+ token not confirmed on Base) |
| **USTB/USD** | ❌ | ❌ | ❌ | **0** (+ token on Base ⚠️ unconfirmed) |
| **bIB01/USD** | ❌ (Polygon-only) | ❌ | ❌ | **0 on Base** |
| **bCSPX/USD** | ❌ (Polygon-only) | ❌ | ❌ | **0 on Base** |
| **JTRSY/USD** | ❌ | ❌ | ❌ | **0** (but token confirmed on Base: `0x8c213e...4b86`) |
| **mTBILL/USD** | ❌ | ❌ | ❌ | **0** |
| **mBASIS/USD** | ❌ | ❌ | ❌ | **0** |

### Summary counts

- **Triple-sourced (push-mode on all 3 oracles)**: 3 pairs — BTC/USD, ETH/USD, USDC/USD.
- **Cross-checkable via two push-mode oracles (Chainlink + Pyth sponsored)**: ~2–3 more — cbETH/USD, wstETH/USD (partial, via exchange-rate), SUI/USD, XRP/USD.
- **Cross-checkable via Chainlink push + Pyth pull (off-chain compare)**: ~20 pairs — USDT, DAI, USDS, USDe, EURC, cbBTC, LBTC, AAVE, LINK, SOL, DOGE, ADA, XRP (if not already counted), SNX, POL, BNB, gold/silver, FX majors.
- **Single-source (Chainlink only) on Base**: ~40 pairs — especially LSTs on ETH denomination (rETH/ETH, wstETH/ETH exchange rates, ezETH, rsETH, ultraETHs, etc.) and the exotic crypto assets (TRUMP, MAVIA, WMTx, RDNT, AVNT, MLN, AMP, AXL, etc.).
- **Zero-source for RWA proposal scope**: USDTB, OUSG, USTB (if deployed on Base), bIB01/bCSPX (Polygon-only), JTRSY (token on Base, no oracle), mTBILL (token on Base, no oracle), sDAI (not on Base).

---

## 6. Tokenized RWAs Deployed on Base (token-level, regardless of oracle availability)

### 6.1 Confirmed on Base mainnet (ERC-20 tokens live)

| Token | Issuer | Base mainnet address | Underlying | Attestation source | Oracle on Base? |
|---|---|---|---|---|---|
| **USDO** | OpenEden Digital | `0xaD55aebc9b8c03FC43cd9f62260391c13c23e7c0` | Short-dated USTs | Chainlink PoR `0x5218Ebeb96bD2bAFe21F9b143f5672552629ba79` (self-attested) | PoR only, no price feed |
| **cUSDO** (compounding wrapper) | OpenEden Digital | `0x83dB73EF5192de4B6a4c92bD0141Ba1a0Dc87c65` | USDO | Inherits USDO PoR | Inherits USDO |
| **USDY** | Ondo Finance | ⚠️ Ondo docs show Eth/Arb/Mantle/Solana/Sui/Aptos/Noble/Stellar/Plume/Sei — **Base NOT officially listed** in `docs.ondo.finance/addresses`. A contract at `0x96F6eF951840721AdBF46Ac996b59E0235CB985C` exists on Base per BaseScan and is the same checksum as Ondo Ethereum USDY, which likely indicates either a bridged representation (LayerZero OFT) or a cross-deploy with same address. **⚠️ Verify via `docs.ondo.finance/addresses` before relying.** | Short-term USTs | Off-chain (no Chainlink PoR on Base; PoR exists on Ethereum via `data.chain.link/feeds/ethereum/mainnet/usdy-por`) | None native to Base |
| **JTRSY** (Janus Henderson Anemoy Treasury Fund, LTF) | Anemoy / Centrifuge V3 | `0x8c213ee79581Ff4984583C6a801e5263418C4b86` | US Treasuries | Off-chain NAV attestation (Anemoy / Centrifuge hub-and-spoke) | None on Base |
| **mTBILL** | Midas | `0xDD629E5241CbC5919847783e6C96B2De4754e438` (address documented as deployed on Base in Midas docs) | US T-bills | Off-chain | None on Base |
| **mBASIS** | Midas | `0x1c2757c1fef1038428b5bef062495ce94bbe92b2` (per BaseScan) — also `0x2a8c22E3b10036f3AEF5875d04f8441d4188b656` referenced; ⚠️ **verify primary address** | Basis-trade strategy | Off-chain | None on Base |

### 6.2 Not deployed on Base (as of 2026-04 primary docs check)

- **OUSG** (Ondo) — deployments: Ethereum, Polygon, Solana, XRPL. Not on Base per `docs.ondo.finance/addresses`.
- **USTB / USCC** (Superstate) — Ethereum-only per Superstate docs; Base not listed.
- **USDTB** (Ethena tokenized bills) — ⚠️ uncertain, verify. Not found on Base.
- **bIB01 / bCSPX / bC3M / bIBTA** (Backed) — Backed's first Base security was bIB01 in 2023 + bCOIN in 2025 per Backed news, but primary contract addresses on Base were not found in the research (Backed's docs endpoint `docs.backedfi.com/resources/deployed-contracts` was unreachable during this research — ⚠️ verify). Safe assumption: at least bIB01 and bCOIN exist on Base; others may not.
- **sDAI** (Spark / MakerDAO) — Ethereum-only natively. DAI exists on Base (`0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`), sDAI does not.
- **USYC** (Hashnote/Circle) — "deployed on Base" claimed in Hashnote docs narrative but specific Base address not confirmed in this research. ⚠️ **verify via Basescan search for "USYC"**.

### 6.3 Morpho / Moonwell markets with RWA collateral on Base

- **First institutional RWA market on Base**: launched August 2024, curated by Steakhouse Financial and Re7 Labs, accepting collateral from Centrifuge (Anemoy LTF / JTRSY), Midas (mTBILL), and Hashnote (USYC).
- **Steakhouse USDC vault**: `0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183`
- **Steakhouse sUSDS vault**: `0xB17B070A56043e1a5a1AB7443AfAFDEbcc1168D7`
- **Collateral oracle source in these vaults**: uses Chainlink Exchange Rate feeds (for wstETH/stETH-style assets) and protocol-specific NAV pricing for the RWA collateral (NOT a generic oracle — each tokenized RWA reads its own NAV). This means RWA Sentinel cannot cross-verify the RWA collateral price against Chainlink, because Chainlink does not price the RWA collateral on Base.

---

## 7. Gas Cost + Infra Implications

Base gas price assumed ~0.05 gwei (typical mid-2025 — ⚠️ verify current via `base.blockscout.com/gas-tracker`). ETH assumed $3,500.

### 7.1 Per-read costs

| Operation | Gas | Cost at 0.05 gwei / $3,500 ETH |
|---|---|---|
| Chainlink `latestRoundData()` (view call, off-chain RPC) | 0 gas (RPC call) | ~$0 (only RPC request cost) |
| Chainlink `latestRoundData()` on-chain (from another contract) | ~25k gas (cold SLOADs + ABI) | $0.0044 |
| Pyth `getPriceNoOlderThan()` view call | 0 gas | ~$0 |
| Pyth `updatePriceFeeds()` on-chain update (1 feed) | ~55k gas + 1 wei fee | $0.0096 |
| Pyth `updatePriceFeeds()` batched (10 feeds) | ~200k gas + 10 wei | $0.035 |
| RedStone pull-mode signed-calldata verification (1 feed) | ~110k gas (includes signature checks) | $0.019 |
| RedStone pull-mode batched (10 feeds) | ~350k gas | $0.061 |

### 7.2 Monthly polling cost, 50 feeds every 30 seconds

Every 30s = 2,880 cycles/day = 86,400 cycles/month.

| Scenario | Calc | Monthly cost |
|---|---|---|
| **Off-chain only** (poll Chainlink RPC + Hermes + RedStone REST, compare in Node/Go) | 86,400 × 3 HTTP calls × 50 feeds — only RPC/bandwidth costs (negligible on public RPCs; ~$30–100/mo Alchemy/QuickNode) | **$30–100/mo** |
| **On-chain compare** (Chainlink read + Pyth pull push + RedStone pull verify, 50 feeds, 30s cadence) | 86,400 × (25k + 200k + 350k gas) = ~5e10 gas × 0.05 gwei = ~2.5 ETH | **~$8,750/mo** (prohibitive) |
| **Hybrid**: off-chain compare, emit on-chain alert only when deviation > 2% (expected ~1–10 alerts/day) | Alerts: ~300/mo × 50k gas = ~0.0008 ETH + RPC ~$50 | **~$55/mo** |

**Verdict**: the **hybrid pattern (off-chain cross-check, on-chain alert emit)** is the only economically sensible Phase-1 design. The alternative of continuously pushing Pyth and RedStone pull updates on-chain costs ~150× more and buys nothing for the monitoring use case.

---

## 8. Feasibility Verdict for RWA Sentinel Phase 1

### 8.1 Is a ±2% cross-check engine viable day-1?

**Yes — for a specific, small set of crypto majors and LSTs. No — for tokenized RWAs.**

### 8.2 Which RWA-specific feeds are multi-sourced on Base?

**None.** Every tokenized RWA deployed on Base (USDO, JTRSY, mTBILL, mBASIS, USDY-if-bridged) has either zero oracles or a single oracle/attestation source on Base. A pure price cross-check is impossible.

### 8.3 Recommended fallback pattern for single-source RWA feeds

For each tokenized RWA deployed on Base, Phase-1 RWA Sentinel should monitor:

1. **Issuer self-attestation hash tracking** — watch the URL/CID of the latest PoR attestation document for a change (e.g. OpenEden publishes a Chainlink-PoR-backed attestation; compare the raw value from `AggregatorV3.latestRoundData()` against the ERC-20 `totalSupply()` of USDO on Base at the same block height — flag if (supply − reserves)/supply > 0.5%).
2. **Governance change detection** — watch admin keys / ProxyAdmin owner / timelock queue on the token contract; alert on any `upgradeTo`, `setImplementation`, `grantRole`, or admin-key transfer.
3. **Reserve-vs-supply divergence alert** — for PoR-backed tokens (USDO, cbBTC), subscribe to the aggregator's `AnswerUpdated` event + the token's `Transfer` events and re-compute backing ratio each block; alert when ratio deviates > user-set threshold.
4. **Cross-chain attestation-consistency check** — for tokens like bIB01 whose PoR lives on Polygon but whose token lives on Base, use CCIP or a lightweight relay (off-chain listener) to pull the Polygon PoR answer every hour and compare against the Base-side `totalSupply()`.
5. **Peer-comparison baseline** — compare the Base RWA's reported NAV to Chainlink's ETH/USD or USDC/USD drift (sanity check) rather than a true price cross-check.

### 8.4 Recommended Day-1 coverage list (5–10 assets with genuinely meaningful cross-checks)

For the proposal's "±2% deviation alerts" engine, ship Phase-1 with:

1. **BTC / USD** — triple-sourced (Chainlink + Pyth sponsored + RedStone push). Cross-check Chainlink vs Pyth vs RedStone, flag if any pair deviates > 0.5%.
2. **ETH / USD** — triple-sourced. Same pattern.
3. **USDC / USD** — triple-sourced. Same pattern (tighter threshold, 0.2%).
4. **cbETH / USD** — Chainlink + Pyth sponsored. ±0.5%.
5. **wstETH / USD** (synthetic from wstETH/ETH × ETH/USD) — Chainlink exchange rate + Pyth sponsored. Exchange-rate sanity check against on-chain Lido `getPooledEthByShares`.
6. **USDT / USD** — Chainlink + Pyth pull (off-chain). ±0.3%.
7. **DAI / USD** — Chainlink + Pyth pull (off-chain). ±0.3%.
8. **EURC / USD** — Chainlink + Pyth pull (off-chain). ±0.3%.
9. **USDe / USD** — Chainlink + Pyth pull + RedStone REST (off-chain). ±0.5%.
10. **cbBTC / USD** + **cbBTC Reserves PoR** — price cross-check (Chainlink + Pyth pull) PLUS Chainlink PoR reserve-vs-supply monitor.

For the "RWA attestation" engine, ship Phase-1 with:

- **USDO** (reserves PoR + totalSupply on Base)
- **JTRSY** (off-chain NAV from Centrifuge API + on-chain totalSupply)
- **mTBILL** (off-chain NAV from Midas + totalSupply)
- Cross-chain mirror of Polygon PoR for **bIB01** and **bCSPX** (if Backed's Base-side bIB01 token is confirmed live)

This split — price cross-check for Base-native majors, attestation monitoring for tokenized RWAs — honors the proposal's thesis while being honest about the oracle-overlap limits on Base.

---

## Confidence Table

| Section | Confidence | Why |
|---|---|---|
| 2.1 Chainlink Base price feeds | **High** | Two independent sources (docs.chain.link per-feed pages + reference-data-directory JSON) agreed on proxy addresses and deviation. Heartbeats shown as `...` on many `data.chain.link` pages — defaulted to 86400 based on RDD sample. |
| 2.2 Chainlink PoR on Base | **High** | Five PoR feeds confirmed via RDD + USDO PoR confirmed on `data.chain.link/feeds/base/base/usdo-por`. Conclusion "PoR exists on Base" supersedes the proposal's Polygon-only claim. |
| 2.3 CCIP mirror pattern | **Medium** | Pattern is well-known but no official Chainlink doc describes a "PoR-over-CCIP" recipe. Latency/cost numbers are estimates. |
| 3.1 Pyth contract + model | **High** | Address verified on BaseScan; model documented in Pyth docs. |
| 3.2 Pyth sponsored push feeds | **High** | Full list of 12 from docs.pyth.network. |
| 3.3 Pyth RWA feed IDs | **Low** | USDY launch confirmed by Pyth blog but actual feed-ID hex not verified in primary docs during this research. Need to query Hermes API. |
| 4.1 RedStone push on Base | **High** | Only 3 push feeds confirmed via `app.redstone.finance` and `redstone.finance/price-feeds`. Multiple queries agree. |
| 4.2 RedStone RWA on Base | **Medium-Low** | Negative finding (no RWA push on Base) inferred from the small push-feed list; RedStone's RWA pull coverage exists but no Base-specific adapter contracts confirmed. |
| 5 Cross-oracle overlap matrix | **Medium-High** | Based on 2.1 + 3 + 4. Subject to corrections if Pyth USDY feed ID or RedStone pull-on-Base is formally confirmed. |
| 6 Tokenized RWA token inventory on Base | **Medium** | USDO, JTRSY, mTBILL, mBASIS confirmed. USDY on Base via LayerZero OFT is strongly implied but Ondo's canonical address page doesn't list Base — needs direct-from-issuer confirmation. Backed contracts on Base: unreachable docs. |
| 7 Gas cost estimates | **Medium** | Per-op gas numbers are typical rather than measured on Base — should be re-measured with hardhat fork + gas reporter in Phase-0. |
| 8 Phase-1 feasibility verdict | **High** | The conclusion rests on overlap count (3 triple-sourced, ~6 dual-push-sourced) which is well-established. |

---

## Primary sources used

- https://docs.chain.link/data-feeds/price-feeds/addresses?network=base
- https://data.chain.link/feeds/base/base/* (per-feed pages for ETH/USD, BTC/USD, USDC/USD, USDT/USD, DAI/USD, EURC/USD, LINK/USD, cbETH/USD, cbETH/ETH, wstETH/ETH, rETH/ETH, usdo-por)
- https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json (Chainlink RDD JSON for Base)
- https://data.chain.link/feeds/polygon/mainnet/bib01-por and /bcspx-por
- https://docs.pyth.network/price-feeds/core/contract-addresses/evm
- https://docs.pyth.network/price-feeds/sponsored-feeds/evm and /core/push-feeds/evm
- https://docs.pyth.network/price-feeds/core/how-pyth-works/fees
- https://www.pyth.network/blog/pyth-launches-price-oracles-on-base
- https://www.pyth.network/blog/ondo-and-pyth-unlock-institutionalized-assets
- https://docs.redstone.finance/docs/dapps/redstone-push/
- https://docs.redstone.finance/docs/dapps/redstone-pull/
- https://www.redstone.finance/price-feeds
- https://app.redstone.finance/push-feeds
- https://blog.redstone.finance/2025/01/16/blockchain-oracles-comparison-chainlink-vs-pyth-vs-redstone-2025/
- https://docs.ondo.finance/addresses
- https://basescan.org/token/0xaD55aebc9b8c03FC43cd9f62260391c13c23e7c0 (USDO on Base)
- https://basescan.org/token/0x8c213ee79581ff4984583c6a801e5263418c4b86 (JTRSY on Base)
- https://backed.fi/news-updates/backed-issues-the-first-tokenized-security-on-base
- https://centrifuge.io/blog/liquidity-pools-rwa
- https://morpho.org/blog/the-morpho-rwa-playbook-make-tokenized-rwas-productive-via-defi-lending/
- https://openeden.com/news/openeden-chainlink-partner-stablecoin-usdo-interoperability/
- https://docs.midas.app/resources/smart-contracts-addresses
- https://chain.link/cross-chain and https://docs.chain.link/ccip

---

_End of inventory._
