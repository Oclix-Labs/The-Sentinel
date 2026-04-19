# SENTINEL Tokenomics — Framework Outline (v0.1 Directional)

> **Status**: Directional framework for Phase 3 (2027 Q2+). Specific percentages, supply total, and emission schedule are intentionally deferred to pre-launch community input and audit. This document is not a final token design — it is the guardrail within which Phase 2 operators and Phase 3 community will set parameters.

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

> Final percentages require Phase 2 community input and independent economic audit. The categories below are locked; the ratios are directional.

| Category | Direction | Vesting | Purpose |
|---|---|---|---|
| **Team & Advisors** | modest | 4 years, 1-year cliff | Long-term commitment; standard crypto-native schedule |
| **Community / Early Subscribers** | substantial | None (claim-on-launch) or 6-month linear | Reward Phase 1-2 subscribers, GitHub contributors, research contributors; bootstrap decentralization narrative |
| **Operator Incentives** | largest | 10-year linear emission | Sustain operator network economics; emission curve set by governance |
| **Ecosystem Fund** | meaningful | DAO controlled | Ongoing audits, grants, emergency response |
| **Investors** | proportional to capital raised | 4 years, 1-year cliff | Pre-seed (Phase 2) + Seed/Series A (Phase 3) participants; SAFT + warrants |

**Anti-patterns we avoid:**
- Team + Investors combined >30% (bad decentralization optics)
- Immediate unlock for any stakeholder (signals rug-pull)
- VC allocation >Community (signals extractive launch)

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
- Sale structure (SAFT to accredited investors only + community airdrop) avoids retail public offering in US jurisdiction
- Continuous legal opinion review across US, Korea, Singapore, Cayman

Phase 1 & 2 operate **without any token** to avoid "token first, utility later" regulatory traps.

---

## 7. Launch mechanism (directional)

Options under consideration, selected by Phase 2 governance / investor input:

- **SAFT + warrants** to Phase 2 & 3 investors
- **Community airdrop** to Phase 1-2 subscribers based on activity / tenure / GitHub contributions
- **Liquidity Bootstrapping Pool (LBP)** for price discovery (Balancer or Fjord-style)
- **Fair launch**: no pre-sale, all via LBP + airdrop (high integrity, harder to fund further development)

Almost certainly a hybrid of SAFT + community airdrop + LBP.

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
- `docs/WHITEPAPER.md` — full treatment including security, governance, and risks
- Prior art: Chainlink LINK, The Graph GRT, Filecoin FIL, Helium HNT, Pocket Network POKT — reviewed for anti-patterns and design lessons
