# SENTINEL Tokenomics — Framework Outline (v0.1 Directional)

> **Status**: Directional framework for Phase 3 (2027 Q2+). Specific percentages, supply total, and emission schedule are intentionally deferred to pre-launch community input and audit. This document is not a final token design — it is the guardrail within which Phase 2 operators and Phase 3 community will set parameters.
>
> **SSOT for genesis allocation & Phase 2 fundraising (2026-04-27+)**: [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) **§4.0** — no team or investor SENTINEL at genesis; Phase 2 capital is **USD equity into Oclix Labs Inc only** (no SAFT, no token warrants). Where this outline previously listed Team/Investor categories or SAFT launch options, treat those as **superseded**.

---

## 1. Purpose of the SENTINEL token

SENTINEL is a utility token designed to align incentives across the **four functional requirements** of a decentralized public-goods watchdog:

1. **Sybil resistance** on the operator network (staking)
2. **Service access** by subscribers (payment / stake-to-subscribe)
3. **Coordination** among stakeholders (governance)
4. **Sustained funding** of the public-goods layer (ecosystem fund)

Without a token, sustained open operator economics is not achievable at meaningful scale — the same reason Chainlink, The Graph, and Filecoin require tokens.

---

## 2. Utility (locked categories)

### 2.1 Operator Staking & Slashing

Operators must bond SENTINEL to participate in the cross-check network. Bond amount is governance-set and scales with the operator's asset coverage. Slashing triggers:

- **False alert published** (contradicted by ≥N independent operators) — linear slash
- **Missed alert** (failed to detect a deviation that ≥N other operators did) — linear slash
- **Downtime beyond SLA** — graduated slash

Slashed tokens flow to the Ecosystem Fund, not to other operators (prevents adversarial slashing).

### 2.2 Subscription Payment

Subscribers access Premium tiers either by:
- **Pay-per-period**: SENTINEL transferred each billing cycle
- **Stake-to-subscribe**: lock SENTINEL (no spend) for the subscription duration — unlocked on cancellation

This dual model preserves revenue flow for payers while incentivizing long-term alignment for stakers.

### 2.3 Governance

Token-weighted voting (with timelock) governs:
- Cross-check deviation thresholds per asset class
- Asset coverage additions / removals
- Slashing parameters
- Ecosystem Fund disbursements
- Future upgrades

Compound Bravo–style governance pattern, with a Security Council veto (5-of-7 multisig) for emergency pauses during Phase 3 bootstrap.

### 2.4 Ecosystem Fund

A DAO-controlled treasury funded by:
- Initial allocation (see §3)
- Slashed operator stakes
- Subscription-revenue share (parameter set by governance)

Disburses to: security audits, grants to asset-coverage contributors, bug bounties, legal reserves, marketing, integrations.

---

## 3. Allocation framework (percentages TBD)

> Final percentages require Phase 2 community input and independent economic audit. **Structural commitments in §4.0 of the Lite Whitepaper are firm**; ratios below are directional only.

**No Team category. No Investor category. No founder pre-mine.**

| Category | Direction | Vesting / mechanics | Purpose |
|---|---|---|---|
| **Operator Incentives** | largest (≈60–80%) | 10-year linear emission. Founder operator share **capped at 5%** of this category with **additional** 4-year vest / 1-year cliff. | Sustain operator network across Phase 3+ |
| **Community / Early Subscribers** | substantial (≈15–25%) | None or 6-month linear cliff. Airdrop to Phase 1–2 subscribers, contributors, operator candidates. | Bootstrap retail network effect |
| **Ecosystem Fund** | meaningful (≈5–15%) | DAO-controlled; also funded by slashed stakes + subscription-revenue share. | Audits, grants, legal reserves, integrations |

Phase 2 **pre-seed** and Phase 3 **Seed/Series A** flow into **Oclix Labs Inc equity** (SAFE or priced preferred). Investors receive **SaaS-company equity**, not genesis SENTINEL. Founders may earn operator emission only by operating under the same rules as external operators, subject to the 5% founder cap.

**Anti-patterns we avoid (§4.0):**
- Team or founder genesis allocation (Howey factor 4 + captured-launch optics)
- Investor token allocation in any form, including SAFT or warrants
- Immediate unlock for any stakeholder
- Pre-launch token sale to retail or accredited investors

---

## 4. Supply

Fixed total supply. Exact number set during Phase 3 pre-launch (direction: ~1B tokens, allowing fractional payments while avoiding meme-coin aesthetics).

No inflation beyond the 10-year operator emission schedule. At end of emission, subscription revenue + Ecosystem Fund disbursements become the sole token velocity sources.

---

## 5. Value capture

Four mechanisms tie token value to network success:

1. **Operator demand**: more assets monitored → more operators → more stake required
2. **Subscription demand**: more Premium users → more SENTINEL spent or staked
3. **Buy-back and burn** (if legal in applicable jurisdictions): a governance-set portion of subscription revenue buys SENTINEL on open market and burns
4. **Staker yield**: remainder of subscription revenue flows to stakers (operators + subscribers who stake)

Stakers are diluted during operator emission but compensated by subscription revenue. Equilibrium modeling is deferred to Phase 2.

---

## 6. Regulatory framing

SENTINEL is designed as a **utility token** with the following explicit properties:

- Token is functionally required for network participation (staking, subscription, governance)
- Token does not entitle holders to profit from issuer's managerial efforts (Howey-test factor 4)
- Consumption mechanism (subscription, slashing) exists from launch
- Governance rights are real, not cosmetic
- **No token sale to any party**; Phase 2 capital is equity-only into Oclix Labs Inc (§4.0)
- **Community airdrop** at Phase 3 genesis (no purchase consideration; eligibility snapshot published before claims)
- Continuous legal opinion review across US, Korea, Singapore, Cayman (airdrop for Korean residents under separate review per whitepaper §8)

Phase 1 & 2 operate **without any token** to avoid "token first, utility later" regulatory traps.

---

## 7. Launch mechanism (directional)

**Fair launch** at Phase 3 — no pre-sale of any kind (full detail in whitepaper §4.5):

1. **Operator Incentives pool** — emitted on 10-year linear schedule from `StakingManager`; founder operators under 5% cap + extra lock-up.
2. **Community airdrop** — Phase 1–2 subscribers, GitHub/research contributors, operator candidates (weighted by verifiable activity).
3. **Ecosystem Fund** — initial allocation to DAO treasury.
4. **Liquidity Bootstrapping Pool (LBP)** — small portion of Community pool reserved for price discovery; **founders, Oclix Labs Inc, and Phase 2 investors do not participate** as buyers or sellers.

**Does not happen at genesis:** SAFT, SAFE-with-token-warrant, OTC allocation, token-for-service swap, or investor genesis mint.

---

## 8. Parameters explicitly not set here

- Exact supply
- Exact category percentages
- Emission curve shape
- Slashing severity percentages
- Subscription-revenue share split between buyback and staker yield
- Governance quorum / voting threshold
- Security Council membership

All set during Phase 2 / early Phase 3 via community input and independent economic audit by firms experienced in token-economy design (e.g., Gauntlet, Delphi Digital, Chaos Labs-style engagement).

---

## 9. Open questions for community

Documented here for Phase 2 governance to address:

1. Should subscribers who stake-to-subscribe also vote in governance, or only operators?
2. Should slashed tokens burn or flow to Ecosystem Fund?
3. Should operator emission be based on assets-covered, uptime, alert quality, or weighted composite?
4. Should there be a circuit-breaker that pauses network on catastrophic slashing event?
5. How does governance handle bad-faith RWA issuers trying to vote against their own coverage?

---

## 10. References

- `docs/ROADMAP.md` — when each phase activates
- [`docs/WHITEPAPER-v0.1-SKELETON.md`](./WHITEPAPER-v0.1-SKELETON.md) — full treatment including security, governance, risks, and §4.0 founding principle
- Prior art: Chainlink LINK, The Graph GRT, Filecoin FIL, Helium HNT, Pocket Network POKT — reviewed for anti-patterns and design lessons
