# Moonwell cbETH Oracle Incident — Forensic SSOT

**Prepared:** 2026-04-19 · **Purpose:** Evidence base for RWA Sentinel "Why now" in Base Batches 003 application.

## TL;DR

1. On **15 Feb 2026 18:01 UTC**, Moonwell executed governance proposal **MIP-X43**, which enabled Chainlink OEV wrapper contracts on Base + Optimism with a misconfigured cbETH oracle that priced cbETH at ~**$1.12** instead of ~$2,200 (missing an ETH/USD multiplier).[^1][^2][^3]
2. Over a ~4-day window (14–18 Feb 2026), liquidation bots seized **1,096.317 cbETH** and opened cascading over-borrows, producing **$1,779,044.83 protocol bad debt** and **~$2.68M in net losses across ~181 borrowers**; the remediation is still in governance as of late Feb 2026.[^1][^4][^5]
3. A multi-oracle cross-check with **any** second reputable cbETH/USD feed at ≥±2% deviation would have flagged this within the first liquidation block (seconds), because the reported price was **99.95% below market** — an unambiguous signal that no single-oracle protocol actually checked.[^2][^3]

---

## Incident summary

| Field | Value | Source |
|---|---|---|
| Date (UTC, exact) | **15 Feb 2026, 18:01 UTC** (MIP-X43 execution); monitoring detected anomaly by **18:05 UTC** (~4 min later per post-mortem) | [^1][^3] |
| Full damage window | **14–18 Feb 2026** (liquidations persisted until caps took effect; governance timelock delayed full fix ~5 days) | [^4][^6] |
| Protocol | **Moonwell** (Compound v2 fork, Base + Optimism deployments; Base is the primary market) | [^2][^7] |
| Asset mispriced | **cbETH** (Coinbase Wrapped Staked ETH) | [^2] |
| Chain | **Base** (primary impact) and Optimism (MIP-X43 enabled on both) | [^1][^2] |
| Protocol bad debt | **$1,779,044.83** total across multiple debt assets, cbETH-denominated majority ($1,033,393.71) | [^1] |
| Net borrower losses | **~$2.68M across ~181 borrowers** (onchain review of all liquidations during affected period) | [^4][^5] |
| cbETH liquidated | **1,096.317 cbETH** | [^1][^2] |
| Cause class | **Oracle misconfiguration** via governance upgrade — not a smart-contract exploit or private-key compromise; also not a classic market-manipulation oracle attack | [^1][^2][^3] |
| Code origin | **PR #578** in `moonwell-contracts-v2`; commits co-authored by Anthropic **Claude Opus 4.6** per `Co-Authored-By` trailers; merged after internal review + Halborn audit scope | [^3][^7][^8] |
| Harmed parties | **Borrowers** (seized cbETH collateral far in excess of debt repaid), **Moonwell protocol treasury** (bad debt), **Apollo DAO treasury** (compensation source ~$310K), LPs indirectly through TVL decline | [^1][^4] |
| Beneficiaries | Liquidation / MEV bots (legitimate-role), plus opportunistic over-borrowers who used the $1.12 oracle to supply trivial collateral and borrow cbETH at nominal USD prices | [^1][^3] |

---

## Precise timeline

Block numbers/tx hashes are listed where verifiably cited. Approximate times use "~" where the post-mortem is imprecise.

| Phase | Time (UTC) | Event | Evidence |
|---|---|---|---|
| T-N (normal) | up to 15 Feb 2026 18:00 | cbETH priced at ~$2,200 via pre-existing Chainlink feed (legacy configuration pre-MIP-X43). Moonwell TVL materially lower than peak: ~$380M in Aug 2025 → ~$90M by Feb 2026, with the Nov 2025 rsETH incident (see §5) already a pressure point.[^8][^9] | [^8][^9] |
| T-0 | **15 Feb 2026 18:01 UTC** | **MIP-X43 executed** on Base + Optimism, enabling Chainlink OEV wrapper contracts. One configuration derives cbETH/USD from raw cbETH/ETH feed (~1.12) without ETH/USD multiplier ⇒ reported price ≈ **$1.12** (market ≈ $2,200). | [^1][^2][^3] |
| T+~0 (seconds–minutes) | 15 Feb 2026, same block onward | Liquidation bots detect the now-"under-water" cbETH collateral positions (every cbETH worth ≈$1.12 in protocol's view vs multi-thousand-dollar debts) and begin repaying trivial amounts of debt to seize large amounts of cbETH. | [^1][^2] |
| T+~0 | 15 Feb 2026 | Example liquidation transactions cited in governance forum: `0x959506491470cbc751194c591b151086a812f56515a80527fc42234024851e92` and `0x2147b0975fb574dc1ac933116a3e1d9e1888be8b2a2deeeb76453336ca56a9df`. ⚠️ uncertain: block numbers not published in forum; these two hashes appear in community post on forum page 2 — not authoritatively attributed by Moonwell core team. Verify directly on basescan.org before citing. | [^6] |
| T+4 min | **15 Feb 2026 ~18:05 UTC** | Moonwell monitoring systems detect the oracle discrepancy (per post-mortem). | [^1] |
| T+~hours | 15 Feb 2026 late UTC | Risk manager Anthias Labs (`@anthiasxyz`) moves to reduce cbETH **borrow cap to 0.01** and **supply cap to 0.01** on the Base market to contain risk; however, **governance timelock (~5 days)** delays the full fix. Liquidations continue into the window while caps only prevent *new* exposures. | [^4][^6][^10] |
| T+1 day | **16 Feb 2026** | Anthias Labs publishes the first public forum post identifying the oracle misconfiguration root cause — first publicly documented detection signal. | [^10] |
| T+2–3 days | 17–18 Feb 2026 | X/Twitter discussion escalates — images of MIP-X43 pull request showing `Co-Authored-By: Claude` trailers circulate, security auditor Krum Pashov (pashov.net) characterizes the "vibe-coded" aspect. Mainstream crypto press (CoinDesk, The Block, Decrypt, Cointelegraph) publishes on **18 Feb 2026**. | [^2][^3][^8][^11] |
| T+3 days | **18 Feb 2026** | Coindesk publishes "Ether briefly priced at $1 after glitch on DeFi app…" — the timing-of-record for mainstream awareness. | [^2] |
| T+4 days | **19 Feb 2026** | Moonwell publishes Recovery Plan proposal ("Recovery Plan: cbETH Incident and Moonwell Apollo Onboarding"): **$2.68M net losses across ~181 borrowers**; **~$310K immediate pro-rata from Apollo Treasury**; remainder (~$2.37M) repaid via future protocol revenue including OEV; MFAM→stkWELL conversion at 1:1.5 folded in. | [^4][^5][^12] |
| T+4–5 days | ~19–20 Feb 2026 | MIP-X43 cbETH Oracle Incident Summary post-mortem published on governance forum (thread 2068). | [^1] |

**⚠️ uncertain:**
- No authoritative block number for MIP-X43 execution has been published in sources surveyed; basescan verification needed.
- Community-supplied tx hashes above (from forum user "Meadiac") are not formally endorsed in Moonwell's post-mortem summary; treat as leads, not facts.
- The "460 cbETH exploited by an unauthorized party" figure from forum page 2 (framed as over-borrow attacks distinct from liquidations) is a community claim; Moonwell's official numbers remain **1,096.317 cbETH liquidated** and **$1,779,044.83 bad debt**.[^1][^6]

---

## Root cause analysis

### Primary cause — oracle derivation bug in a governance upgrade

The MIP-X43 proposal introduced Chainlink's **OEV (Oracle Extractable Value) wrapper** contracts across Moonwell's Base and Optimism core markets. One of the new oracle configurations computed the USD price of cbETH *incorrectly*:

- **Intended math:** `cbETH/USD = (cbETH/ETH) × (ETH/USD)` — cbETH/ETH feed reports ~1.12 (cbETH accrues staking yield vs ETH), ETH/USD feed reports ~$1,960. Product ≈ $2,195.
- **Actual math shipped:** `cbETH/USD = (cbETH/ETH)` — the raw ~1.12 ratio, interpreted as **$1.12 USD**.
- **Observed consequence:** oracle reports cbETH at ≈$1.12. Any borrower with cbETH collateral sees their LTV ratio math implode; positions become liquidatable at near-zero repayment cost.

This is a basic unit/dimensional-analysis failure (forgetting to multiply a ratio by a USD quote), not an exploit of a bug in Chainlink feeds themselves. Chainlink's underlying cbETH/ETH and ETH/USD feeds functioned normally.[^1][^2][^3]

### Contributing factors

1. **AI-generated code path:** The pull request merged into `moonwell-contracts-v2` (PR **#578**, submitted by contributor `anajuliabit`) contains commits with `Co-Authored-By: Claude Opus 4.6` trailers. Security auditor **Krum Pashov** observed publicly: "This could have been caught with an integration test, a proper one, integrating with the blockchain." He softened the "AI caused it" framing to "even a senior Solidity developer could have made [this]", but emphasized insufficient validation.[^3][^8][^11]
2. **Audit scope gap:** Moonwell had commissioned a Halborn audit; the team also stated it had unit and integration tests in a separate PR. The audit + tests in scope did not exercise the full USD-derivation codepath for cbETH on-chain against live feeds — i.e., no end-to-end sanity check of the quoted USD price.[^3][^8]
3. **No independent oracle sanity check on-chain:** The protocol did not implement a deviation-threshold revert against a secondary feed (Pyth, RedStone, Coinbase's own cbETH price APIs) before accepting the reported USD price. A price of $1.12 for a ~$2,200 asset is a **99.95% deviation** — trivially detectable.[^1][^2]
4. **Governance timelock cut both ways:** Moonwell's ~5-day timelock on parameter changes meant that once the faulty config went live, caps could be reduced but the actual oracle configuration could not be quickly rolled back, prolonging the liquidation window.[^6][^8]
5. **Not a smart-contract exploit; not oracle manipulation:** The Chainlink feeds themselves were never "manipulated" by an attacker. This was a *consumer-side* misconfiguration of how feeds were composed. This distinction matters: Chainlink's own reliability didn't fail; Moonwell's composition of Chainlink primitives did.[^2][^3]
6. **Not a missing Proof-of-Reserve or attestation issue:** cbETH's own reserve backing at Coinbase was never in question during this event. The underlying cbETH/ETH ratio feed was accurate; what broke was the USD conversion.[^2]

### Moonwell's own attribution (from the MIP-X43 post-mortem summary)

> "One oracle configuration incorrectly derived the USD value of cbETH by using only the raw cbETH/ETH exchange rate rather than multiplying it by the ETH/USD price feed. As a result, cbETH was reported at approximately $1.12 — reflecting the cbETH/ETH ratio — instead of its intended market value of roughly $2,200."[^1]

### Independent analyses

- **Anthias Labs** (Moonwell's risk manager) led the forum post-mortem and remediation dashboard.[^10]
- **Pashov Audit Group** (Krum Pashov publicly) — framed as testing/validation failure more than "AI caused it".[^3]
- ⚠️ I could not confirm a **Chaos Labs** or **Gauntlet** public write-up specific to this cbETH Moonwell incident (Chaos Labs published prominently on the separate **Aave wstETH CAPO** incident of 11 Mar 2026[^13][^14]). Llama Risk was not surfaced in sources reviewed. **Finding: independent third-party risk-firm coverage on this specific incident is thin beyond Anthias Labs.**

---

## "Would RWA Sentinel have caught it?" analysis

RWA Sentinel's design has three detection primitives: (a) multi-oracle cross-check (Chainlink/Pyth/RedStone ±2%), (b) reserve-ratio / attestation tracking, (c) anomaly detection (reserve drops, mass redemptions).

| Signal | Would it have caught cbETH mispricing? | Lead time | Rationale |
|---|---|---|---|
| **(a) Multi-oracle cross-check (±2%)** | **YES — emphatically.** | **Seconds (same block) to <1 minute.** | Chainlink, Pyth, and RedStone **all** expose cbETH/USD price feeds on Base or via cross-chain reads. Moonwell's misconfigured feed reported **$1.12 vs a true ~$2,200** — a deviation of ~99.95%, 5,000× a 2% threshold. Any external reference at block-time would have triggered a critical alert in the same block Moonwell began accepting the bad price. This is the canonical case the design is built for. ⚠️ Caveat: the trigger is a *detection* alert for operators/end-users, not an automatic rollback of Moonwell's own oracle; Sentinel can't fix the protocol, but a borrower subscribed to alerts could have repaid/repositioned within minutes. |
| **(b) Reserve ratio drop anomaly** | **NO / partial.** | N/A for this incident's root cause, but YES for follow-on symptom. | cbETH is fully collateralized 1:1 by ETH staked at Coinbase. Its **Proof-of-Reserve attestation did not change** during this incident; the issue was an on-protocol *pricing* error, not a reserve event. However, the **cascade symptom** (cbETH supply in Moonwell market crashing from normal levels to zero as liquidation bots drained it) would have registered as an anomalous TVL / reserve-ratio shock on Moonwell's own market — detectable within minutes. This is a *secondary* signal, useful for correlation/confirmation. |
| **(c) Mass redemption anomaly** | **YES — partially.** | Minutes. | The burst of liquidation transactions against cbETH collateral within a single block and the subsequent minutes is exactly the kind of "abnormal onchain flow" Sentinel flags. But this is a *lagging* signal vs the oracle cross-check — by the time a redemption cluster is detected, material loss has already occurred. It is additive corroboration, not a leading indicator. |
| **(d) Attestation expiry (Centrifuge/Backed 14-day)** | **N/A for cbETH.** | N/A | cbETH is not a Centrifuge/Backed-style legal-wrapper RWA with dated attestation PDFs. It's an LST (liquid staking token) with on-chain conversion math. The attestation-expiry signal does not apply, but **this is worth calling out explicitly in the pitch**: cbETH falls in the broader "pegged-or-ratio-bearing asset" category that Sentinel is designed to monitor alongside true RWAs (tokenized treasuries, credit). The same multi-oracle cross-check that would have caught cbETH would also catch sDAI, USDY, OUSG mispricing — *provided a second oracle exists*. |

### Honest limitations

- **If a protocol ignores the alert, Sentinel can't liquidate-prevent.** Sentinel is a detection + alerting layer, not a circuit-breaker. The pitch should sell to **(i) protocols as risk tooling, (ii) borrowers/lenders as a self-hosted alerting + auto-unwind trigger, (iii) curators** on Morpho/Euler-style permissionless lending.
- **Cross-oracle availability:** For lesser-traded RWAs, a Pyth or RedStone reference may not exist. The signal degrades to "compare oracle vs DEX TWAP" or "compare vs off-chain NAV oracle (e.g., Chronicle for MakerDAO RWAs)". This is a real scoping constraint, not a show-stopper for the cbETH case (multiple feeds existed) but will affect long-tail coverage.
- **Governance timelock problem is orthogonal.** Even with instant detection, Moonwell's own remediation was capped by its governance timelock. Sentinel's value in this case is to give *users* (not the protocol) the few minutes they need to self-rescue — withdraw, repay, or transfer collateral before liquidation bots arrive.

---

## Comparable incidents on Base / RWAs (2024 – Apr 2026)

Ordered roughly chronologically; included to establish market-level frequency.

| # | Date | Protocol | Asset / feed | Root cause | Loss | Detection lag | Notes |
|---|---|---|---|---|---|---|---|
| 1 | **13 Oct 2024** | Morpho Blue (Base/Ethereum) | PAXG/USDC tokenized-gold market | Oracle misconfiguration: BASE and QUOTE decimals both set to 8; USDC has 6, PAXG has 18 → 10^12 price inflation, PAXG valued at ~$2.6T | **~$230K** | Hours | Attacker supplied ~$350 in PAXG to borrow $230K in USDC. Structurally identical "unit error" class as Moonwell cbETH. No second oracle check. | [^15][^16] |
| 2 | **~9 Jan 2025** | Morpho (MEV Capital vault) / Usual Protocol USD0++ | USD0++ stablecoin | Hardcoded oracle at $1.00; Usual unilaterally lowered redemption floor to $0.87 → secondary market to $0.89 → lenders trapped at 100% utilization | Lender-specific, protocol-wide tens of millions at risk across curator vaults | Minutes to hours for market; days for remediation | First "hardcoded-oracle of depeggable asset" case in the 14-month pattern. | [^17][^18] |
| 3 | **March 2025** | Morpho (Re7 vault, Base) | cbETH via Pyth cbETH/USD vs ETH/USD | Pyth cbETH/USD feed *frozen* for 7 min while ETH/USD updated — liquidations triggered because ratio-derived cbETH/USD value diverged from ETH/USD even though real cbETH/ETH never moved | **~14 ETH** per user (~$30K–$40K) | 7 minutes (duration of feed staleness) | Foreshadows the same Feb 2026 Moonwell issue: cbETH priced by composition of feeds, any desync or mistake breaks the composition. | [^19][^20] |
| 4 | **25 May 2025** | Morpho | cUSDO/USDC Aerodrome AMM LP | AMM LP oracle manipulation | ~$49K (fully covered internally, no persistent bad debt) | Hours | Aerodrome is a Base-native DEX. | [^21] |
| 5 | **4 Nov 2025** | **Moonwell** (Base + Optimism) | **rsETH** via rsETH/ETH off-chain feed | Off-chain oracle reported wrstETH at ~$5.8M per token (vs actual <$3,500); attacker deposited 0.02 wrstETH to borrow ~$116K; 7 exploit cycles over ~3 hours extracted ~292 ETH | **~$1.01M (~292 ETH)** | ~BlockSec Phalcon detection within ~30 seconds of first cycle; protocol pause hours after | **Direct precedent to the Feb 2026 cbETH incident on the same protocol** — oracle composition/feed-failure on LST on Base. Moonwell TVL fell ~$55M in 24h ($268M→$213M); WELL token -12%. | [^22][^23][^24] |
| 6 | **4 Nov 2025** | Stream Finance xUSD (via Morpho, Euler, Silo, Gearbox, Lista DAO) | xUSD stablecoin | External fund-manager misappropriation of $93M; multiple lending protocols had hardcoded xUSD/USD = $1.00 oracles that didn't update when xUSD fell to $0.26 | **Up to $285M at risk**, $93M directly misappropriated; Elixir deUSD collapsed 98% via contagion | Many hours to days for hardcoded-oracle venues | Structural contagion — curators on Morpho/Euler used hardcoded oracles "to prevent mass liquidations"; the result was lenders held worthless collateral with no liquidation path. | [^25][^26][^27] |
| 7 | **15 Feb 2026** | **Moonwell** (Base + Optimism) | **cbETH** | MIP-X43 oracle misconfig (this report) | **$1.78M bad debt / $2.68M borrower net losses / 181 users** | ~4 min protocol detection; 1 day to public forum post; 3 days mainstream press; 4 days recovery plan | Subject of this report. | [^1][^2][^4] |
| 8 | **11 Mar 2026** | **Aave V3** (Ethereum Core + Prime) | **wstETH / stETH CAPO** | Chaos Labs' Correlated Asset Price Oracle (CAPO) snapshotRatio and snapshotTimestamp updated desynchronously, causing allowed wstETH/stETH rate to lag 2.85% below real; 34 accounts forcibly liquidated | **~$27M forcibly liquidated** ($21.2M Core + $5.7M Prime); ~$875K liquidator profit | Minutes — Chaos Labs identified and reimbursed (up to ~345 ETH cap) | Not on Base, but same "LST oracle composition failure" class; same month as Moonwell recovery plan push. Independent case for "oracle risk is the open wound of DeFi in 2026." | [^13][^14] |
| 9 | **22 Mar 2026** | Resolv USR / Morpho + Fluid + Euler + Venus | wstUSR / USR stablecoin | (a) Single-EOA minting key compromise → 80M unbacked USR minted from $200K USDC; (b) Morpho/Fluid curators had hardcoded USR and wstUSR oracles at $1.00–$1.13 while market went to $0.025–$0.63 | **~$25M attacker proceeds; ~$21–38M combined bad debt** across DeFi (~$5.95M Morpho, $15–25M Fluid estimated) | Re7 Labs internal monitoring: ~25 min from first unbacked mint to alert; caps zeroed ~40 min in | **4th "hardcoded oracle for yield-bearing stable" failure in 14 months** — Usual, Stream, Moonwell rsETH, Resolv USR pattern. | [^28][^29][^30] |

**Pattern.** The cbETH incident is the 7th of at least 9 oracle-composition or hardcoded-oracle failures in ~18 months across Base and closely adjacent venues (Morpho, Aave, Moonwell, Fluid, Euler), collectively destroying or endangering **≥$50M in user + protocol funds**. Every single one of them would have been flagged by a real-time ±2% multi-oracle cross-check against an independent reference in the **first block to first hour**. This is the "why now" evidence.

---

## Detection latency budget

Synthesis: for each incident class, here is the minimum alert latency that would have been **materially useful** (i.e., either prevented loss or enabled user self-rescue).

| Incident class | Attack/loss unfolds over | Useful alert latency | Rationale |
|---|---|---|---|
| **Instant oracle misconfiguration** (Moonwell cbETH, Moonwell rsETH, Morpho PAXG) | Seconds (first liquidation tx clears in same block as bad price; bots batch within 1–2 blocks = ~4 sec on Base) | **< 30 seconds** end-to-end from bad oracle write → subscriber notification | Below 30s means a subscriber with a pre-set "protect-my-position" automation (withdraw / repay / bridge) can act in the same 15-sec user-reaction window; above 60s and MEV has already captured the bulk. |
| **Stale / frozen oracle** (Morpho cbETH Pyth 7-min freeze Mar 2025) | Minutes | **< 60 seconds** | The staleness itself is the signal; heartbeat checks plus cross-oracle ±2% catch it within one feed period. |
| **Hardcoded oracle + off-chain asset depeg** (USD0++, xUSD, USR, potentially sDAI/USDY/OUSG if ever depegged) | Hours (secondary market drifts first, then lending contagion) | **< 5 minutes** from secondary-market deviation threshold breach | The asset trades off-peg in DEX/CEX well before lending protocols reprice; a DEX-TWAP-vs-oracle check catches it on the order of a block window. |
| **CAPO / composed oracle timestamp bug** (Aave wstETH Mar 2026) | Minutes | **< 60 seconds** | Two-parameter misalignment shows up as >±2% deviation vs pure stETH/ETH feed immediately after update. |
| **Reserve / PoR drift on wrapped assets** (tokenized Treasuries, gold) | Hours to days | **< 15 minutes** from attestation staleness or reserve-ratio drop ≥ defined threshold | Slower-moving domain; daily attestation cadence makes minute-level response sufficient. |
| **Attestation expiry (Centrifuge/Backed 14-day)** | Days | **< 1 hour from expiry watermark** | Batched daily-granularity is enough; the hard constraint is operator lead-time to replace attestation, not blockchain reaction. |

### SLA recommendation for RWA Sentinel

- **Critical path (oracle cross-check):** target **P50 < 10s, P95 < 30s, P99 < 60s** from on-chain price update to subscriber webhook/push. Below this, the product is differentiated against "we noticed an hour later" competitors.
- **Hardcoded oracle + secondary-market deviation:** **< 2 min** polling cadence against CEX / DEX references.
- **Attestation / reserve:** **< 1 hour** polling is sufficient; operator-facing.
- **Alert delivery diversity:** webhook + email + SMS + (optional) on-chain trigger for auto-unwind. The Moonwell case shows that borrower-side auto-unwind is the highest-value wedge.

---

## Sources

[^1]: **Moonwell Governance Forum — "MIP-X43 cbETH Oracle Incident Summary" (official post-mortem thread, page 1).** https://forum.moonwell.fi/t/mip-x43-cbeth-oracle-incident-summary/2068 — primary authoritative source for execution time, root cause, bad-debt totals, and initial detection timestamp.
[^2]: **CoinDesk — "Ether briefly priced at $1 after glitch on DeFi app Moonwell, triggering $1.8M in bad debt" (18 Feb 2026).** https://www.coindesk.com/tech/2026/02/18/ether-briefly-priced-at-usd1-on-defi-app-moonwell-glitch-triggering-usd1-8m-in-bad-debt — mainstream press timing of record.
[^3]: **Cointelegraph — "$1.78M 'Vibe-Coded' Oracle Bug Puts AI-Coauthored Contracts Under Scrutiny".** https://cointelegraph.com/news/moonwell-exploit-cbeth-oracle-misprice-ai-commits-testing-audits — Pashov analysis, Halborn audit reference, AI-code context.
[^4]: **Moonwell Governance Forum — "Recovery Plan: cbETH Incident and Moonwell Apollo Onboarding" (proposal thread).** https://forum.moonwell.fi/t/recovery-plan-cbeth-incident-and-moonwell-apollo-onboarding/2084 — official $2.68M figure, 181 borrowers, compensation math, MFAM→stkWELL 1:1.5.
[^5]: **MEXC News — "Moonwell Proposes $2.68M Recovery Plan After cbETH Liquidation Incident Harms 181 Borrowers on Base".** https://www.mexc.com/news/749411 — corroborates $2.68M / 181 borrowers figure independently.
[^6]: **Moonwell Governance Forum — MIP-X43 post-mortem thread, page 2.** https://forum.moonwell.fi/t/mip-x43-cbeth-oracle-incident-summary/2068?page=2 — source of community-supplied liquidation tx hashes `0x9595…1e92`, `0x2147…a9df` (⚠️ treat as leads, not officially endorsed) and the ~5-day governance timelock context.
[^7]: **QuillAudits (X/Twitter), 3 Nov 2025 context tweet.** https://x.com/QuillAudits_AI/status/1985654917898649840 — "4th major incident in 3 years" framing for Moonwell; Compound v2 fork architectural context.
[^8]: **Protos — "DeFi, meet Claude: Moonwell's 'vibe-coded' oracle in $1.8M blowup".** https://protos.com/defi-meet-claude-moonwells-vibe-coded-oracle-in-1-8m-blowup/ — PR #578 attribution to `anajuliabit`; "over 1,000 commits in a single week" observation; TVL trajectory $380M (Aug 2025) → ~$90M.
[^9]: **Crypto Economy — "Moonwell Suffers $1.8M Loss After Oracle Glitch, With Claude Opus 4.6 Cited in Faulty Output".** https://crypto-economy.com/moonwell-oracle-glitch-ai-linked-1-8m-loss/
[^10]: **Anthias Labs forum profile / risk parameter posts.** https://forum.moonwell.fi/t/anthias-labs-risk-parameter-recommendations/1759 — context for Anthias's role as Moonwell risk manager and first public detector/reporter on 16 Feb 2026.
[^11]: **Decrypt — "Oracle Error Leaves DeFi Lender Moonwell With $1.8 Million in Bad Debt".** https://decrypt.co/358374/oracle-error-leaves-defi-lender-moonwell-1-8-million-bad-debt — Pashov characterization; quotation of Moonwell's statements on cap reductions.
[^12]: **CryptoTimes — "Moonwell Outlines Recovery Plan After cbETH Fallout" (19 Feb 2026).** https://www.cryptotimes.io/2026/02/19/moonwell-outlines-recovery-plan-after-cbeth-fallout/
[^13]: **Protos — "Oracle error adds to turmoil at DeFi giant Aave".** https://protos.com/oracle-error-adds-to-turmoil-at-defi-giant-aave/ — Aave wstETH CAPO incident 11 Mar 2026, $27M.
[^14]: **BlockBeats — "Oracle 'Outage': Aave Faces $27 Million Irregular Liquidation".** https://en.theblockbeats.news/news/61511 — independent corroboration of Aave CAPO math (snapshotRatio / snapshotTimestamp desync), 34 accounts, 10,938 wstETH.
[^15]: **QuillAudits Medium — "Decoding MorphoBlue's $230K Exploit".** https://medium.com/coinmonks/decoding-morphoblues-230k-exploit-6296565ced40 — PAXG/USDC decimal misconfig forensics, 13 Oct 2024.
[^16]: **TheDefiant — "Morpho User Exploits Oracle Error To Turn $350 Into $230K".** https://thedefiant.io/news/defi/morpho-user-exploits-oracle-error-to-turn-usd350-into-usd230k
[^17]: **Leviathan News — "Collateral Damage: USD0++ Depeg Leaves Farmers in the Red".** https://leviathannews.substack.com/p/collateral-damage-usd0-depeg-leaves — Usual USD0++ hardcoded oracle context.
[^18]: **The Block — "Usual Money's protocol update sparks community concern as USD0++ drops below 92 cents".** https://www.theblock.co/post/333995/usual-money-protocol-update
[^19]: **Blockworks — "Who's responsible when something breaks in DeFi?".** https://blockworks.com/news/defi-accountability-morpho-pyth — March 2025 Morpho cbETH/Pyth desync incident.
[^20]: (Corroborating reference in Three Sigma "2024 Most Exploited DeFi Vulnerabilities".) https://threesigma.xyz/blog/exploit/2024-defi-exploits-top-vulnerabilities
[^21]: **Morpho Governance Forum — "Post Mortem - Aerodrome cUSDO/USDC AMM LP Oracle Manipulation on Morpho Lending Market" (Clearstar Labs).** https://forum.morpho.org/t/post-mortem-aerodrome-cusdo-usdc-amm-lp-oracle-manipulation-on-morpho-lending-market/1794
[^22]: **Coinfomania — "$1 Million Vanishes! Moonwell Hit by Oracle Exploit on Base and Optimism".** https://coinfomania.com/moonwell-oracle-exploit-base-optimism/ — Nov 4, 2025 rsETH incident.
[^23]: **BitcoinEthereumNews / Odaily — BlockSec Phalcon alert summary.** https://www.odaily.news/en/newsflash/455239
[^24]: **COINOTAG — "Moonwell's $1M Oracle Exploit Raises DeFi Security Concerns, WELL Token Falls 12%".** https://en.coinotag.com/moonwells-1m-oracle-exploit-raises-defi-security-concerns-well-token-falls-12/ — TVL $268M→$213M; 7 exploit cycles / 3 hours / 292 ETH.
[^25]: **BlockEden.xyz — "Anatomy of a $285M DeFi Contagion: The Stream Finance xUSD Collapse".** https://blockeden.xyz/blog/2025/11/08/m-defi-contagion/
[^26]: **DL News — "Stream Finance founders sue business partner, allege $93m used to cover personal losses".** https://www.dlnews.com/articles/defi/stream-finance-founders-sue-partner-over-alleged-93m-loss/
[^27]: **HTX Insights — "$93 Million Casually Misappropriated? The Truth Behind the Stream Finance Collapse".** https://www.htx.com/news/Project%20Updates-4NfKiUET/
[^28]: **BingX / BlockBeats — "DeFi's hardcoded-oracle failure strikes again: fourth repeat in 14 months".** https://bingx.com/en/flash-news/post/resolv-exploit-mints-m-usr-as-hardcoded-oracle-prices-depegged-wstusr-at-triggering-m-fluid-bad-debt — "four-times-in-14-months" framing.
[^29]: **TheDefiant — "DeFi Has Seen Resolv's $25M USR Exploit Many Times Before".** https://thedefiant.io/news/hacks/defi-has-seen-resolv-s-usd25m-usr-exploit-many-times-before
[^30]: **Resolv USR Exploit post-mortem site.** https://resolv-usr-exploit.vercel.app/ — timeline 02:21–03:02 UTC, bad-debt distribution, Morpho `supplyOnBehalf` bypass detail.

Additional corroborating sources used (not separately footnoted; redundant coverage of same facts): The Block[^a], FinanceFeeds[^b], Yahoo Finance[^c], Metaverse Post[^d], gncrypto[^e], Cryptonomist[^f], FailSafe[^g], Halborn "Explained: The Resolv Hack (March 2026)"[^h], MEXC/Phemex/99bitcoins rsETH coverage[^i].

[^a]: https://www.theblock.co/post/390302/defi-lending-protocol-moonwell-hit-with-1-8-million-bad-debt-after-oracle-misconfiguration
[^b]: https://financefeeds.com/moonwell-exploited-for-1-78-million-after-cbeth-oracle-mispricing/
[^c]: https://finance.yahoo.com/news/oracle-error-leaves-defi-lender-054600752.html
[^d]: https://mpost.io/moonwell-lost-1-78m-after-smart-contract-bug-linked-to-ai-generated-code/
[^e]: https://www.gncrypto.news/news/moonwell-oracle-error-cbeth-misprice-leaves-18m-bad-debt/
[^f]: https://en.cryptonomist.ch/2026/02/19/moonwell-recovery-cbeth-compensation/
[^g]: https://getfailsafe.com/moonwell-defi-exploit-investigation
[^h]: https://www.halborn.com/blog/post/explained-the-resolv-hack-march-2026
[^i]: https://99bitcoins.com/news/altcoins/moonwell-hack-1m-lost-after-chainlink-flaw-well-crypto-slumps-to-2025-lows/

---

## Confidence table

| Section | Confidence | Reason |
|---|---|---|
| 1. Incident summary | **HIGH** | Loss amounts, date, cause, affected asset corroborated by ≥5 independent sources + Moonwell's official governance forum post-mortem. |
| 2. Timeline — MIP-X43 execution time (18:01 UTC, 15 Feb 2026) | **HIGH** | Direct quote from Moonwell forum post-mortem, corroborated by Cointelegraph, FinanceFeeds, Decrypt. |
| 2. Timeline — detection time (~18:05 UTC, +4 min) | **MEDIUM** | Stated in post-mortem summary but I did not fetch the raw unabridged post — minute-level precision should be re-verified against the forum text directly. |
| 2. Timeline — community tx hashes | **LOW** | Forum-user sourced; not officially endorsed by Moonwell core; verification on basescan.org strongly recommended before citing in pitch/spec. Block numbers absent from all sources surveyed. |
| 2. Timeline — Anthias Labs first-public-signal on 16 Feb 2026 | **MEDIUM-HIGH** | Corroborated by gncrypto article and Anthias's forum presence, but exact timestamp of the Anthias forum post not captured. |
| 3. Root cause (oracle misconfig; ETH/USD multiplier missing) | **HIGH** | Direct quote from Moonwell post-mortem; corroborated everywhere. |
| 3. AI code / PR #578 / `anajuliabit` / Halborn audit | **HIGH** | PR number attested in Protos; Halborn audit attested in Cointelegraph; AI co-authorship attested in multiple sources including Pashov's public analysis. |
| 3. No Chaos Labs / Gauntlet / Llama Risk independent write-up confirmed | **MEDIUM** | Absence-of-evidence rather than evidence-of-absence; I checked for it but could have missed a paywalled / gated report. |
| 4. "Would RWA Sentinel have caught it?" analysis | **HIGH** for multi-oracle cross-check claim (deviation is 99.95%, trivially detectable) | Deviation math is self-evident; cbETH has multiple independent feeds on Base. Remaining honest-limitations caveats stated. |
| 5. Comparable incidents (9 total) | **HIGH** for each incident's existence and basic facts (dates, losses, root causes all cross-checked); **MEDIUM** for precise detection-lag figures | Each incident has at least one primary / post-mortem source cited. Detection-lag numbers depend on sources which may round. |
| 6. Detection latency budget | **MEDIUM** | Recommended SLAs synthesized from incident characteristics; they're defensible but not derived from a formal study. Good enough for a spec / pitch but should be refined by engineering before committing to a public SLA. |
| 7. Sources | **HIGH** | 30 primary footnotes + 9 corroborating. All URLs captured; no fabricated links. |

### Known gaps worth closing before pitch day

1. **Basescan verification of at least one liquidation tx hash and the MIP-X43 execution tx hash** — currently cited from forum-user; getting a verified hash + block number greatly hardens the "On-chain evidence" card.
2. **Halborn audit report URL** — referenced as commissioned but I did not locate the actual published audit document. Worth finding if it exists publicly.
3. **Exact Anthias Labs first-post timestamp on 16 Feb 2026** — tighten the T+n hours figure.
4. **Moonwell PR #578 GitHub URL and merge timestamp** — currently referenced through secondary Protos coverage; direct GitHub link would be cleaner evidence.
5. **Whether any Moonwell oracle config consumed *two* Chainlink feeds** (e.g., Chainlink cbETH/ETH + Chainlink ETH/USD) *or* just one — the post-mortem implies one feed was read and the multiplier omitted; a reader of the MIP-X43 code diff could confirm exactly. Relevant because it determines whether the fix is "read both feeds" vs "add a sanity-check against an independent source".
