# Landing Redesign — Production Crypto Site Reorientation

> Spec for re-tone + re-copy of `apps/landing-next` from "Devfolio submission shell" to a production crypto landing site that matches a retail-primary funnel and a Bloomberg/FT financial-intelligence tone.
>
> **Author**: 모진영 (assisted by Claude via `superpowers:brainstorming`)
> **Date**: 2026-04-27
> **Status**: Draft (pending user review at §11 gate)
> **Sister doc**: [`docs/DESIGN.md`](../DESIGN.md) — token system

---

## 1. Context

`apps/landing-next` shipped via PR #19/#21 (D6 work) brought the codebase from static HTML to **Next.js 14 + Tailwind + shadcn pattern + i18n (en/ko)**. The tech stack is sound. The *content*, however, still reads as a Base Batches submission artifact, not a production product:

- internal repo paths surface in user-facing copy (e.g., `.research/oracle-inventory-base.md` literal in the Coverage section, `apps/landing-next/components/landing-content.tsx:152`)
- footer "Infra" column lists internal worker names (`Poller Worker · AlertWriter Worker · Public API (Hono) · AlertRegistry.sol`, `landing-content.tsx:245-249`)
- "Phase 1 / 2 / 3" wording reads as "build sprint in progress"
- stats bar is incident-stats-only — no live product proof, no trust signal
- hero CTA is `see architecture` / `GitHub` — both fail to deliver retail value

The redesign **keeps the tech stack and adapts the rest**: re-copy + re-tone + restructure within the existing Next.js framework, plus a project-wide `docs/DESIGN.md` token system as SSOT.

## 2. Goals & non-goals

### Goals

1. Convert the site from "Devfolio shell" to "production crypto retail site"
2. Make retail Telegram-bot subscription the *primary* conversion goal
3. Embed Phase 3 SENTINEL token narrative as a natural conversion trigger (airdrop snapshot for Phase 1 subscribers) without ICO feel — securities-safe carrying ROADMAP language verbatim
4. Establish `docs/DESIGN.md` token system as SSOT for current and future pages (`/protocols`, `/whitepaper-html`, dashboard polish, etc.)
5. Tone: cold reporter / financial intelligence (Bloomberg Terminal / FT crypto desk). Absent: ICO hype, dev-meta jargon, breathless marketing. Present: numbers, dates, names, restraint, premium broadsheet feel.

### Non-goals (this spec)

- B2B `/protocols` or `/enterprise` page (Phase 1.5 follow-up)
- Backend / API changes — frontend-only
- New on-chain functionality
- Authentication / Premium tier signup form (Phase 2)
- Three.js complexity beyond a single, restrained How-It-Works scene
- Auto-deploy GitHub Actions workflow (deferred — see Issue #18 follow-up; out of scope here)

## 3. Target persona & tone

### Primary persona

Retail DeFi user holding BTC / ETH / USDC who deposits in lending protocols (Aave, Moonwell, Morpho on Base) and wants alerts before being liquidated by an oracle failure. Crypto-native, reads CoinDesk / The Block, has a Telegram, may already follow Sentinel adjacent accounts (Chainlink Labs, Pyth, Coinbase, Base).

### Secondary personas (Phase 1.5+)

- DeFi protocol risk teams (route via `/protocols`)
- Crypto researchers / pre-seed-stage investors (route via Whitepaper page)

### Tone

**Cold reporter / financial intelligence.** Reference: Bloomberg Terminal, Financial Times crypto desk, Chronicle Labs blog, Velodrome operational notes. Absent: ICO hype, dev-meta jargon, "growth-hacking" copy, breathless marketing. Present: numbers, dates, names, restraint, premium broadsheet feel.

Stylistic rules for copy:
- Numbers always in mono font with explicit units (`$50M`, `9 incidents`, `18 months`, never "many")
- Dates as `Q2 2026`, `Q4 2026`, `2027+` — not "soon", not "later this year"
- Section badges in caps: `LIVE`, `WHY`, `HOW`, `WHAT'S NEXT` — single-word, terse
- No exclamation marks. No emoji.
- Italic accents on display text only (e.g., `*One block.*`)

## 4. Architecture overview

```
apps/landing-next/
├─ app/
│  ├─ layout.tsx              fonts (Source Serif 4, Inter, JetBrains Mono), theme tokens
│  ├─ page.tsx                /          → <LandingContent locale="en" />
│  ├─ ko/page.tsx             /ko        → <LandingContent locale="ko" />
│  ├─ dashboard/page.tsx      polish only — match new tone
│  └─ ko/dashboard/page.tsx
├─ components/
│  ├─ landing-content.tsx     composition only — imports sections in order
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ Stats.tsx            Server, revalidate 5s
│  │  ├─ Problem.tsx
│  │  ├─ HowItWorks.tsx       Server text + dynamic Client R3F scene
│  │  ├─ LivePreview.tsx      Server, revalidate 5s
│  │  ├─ Roadmap.tsx
│  │  ├─ TrustSignals.tsx     ContractsCallout refactor
│  │  └─ FooterFinalCta.tsx   final CTA strip + 4-col footer
│  ├─ scenes/
│  │  └─ OracleNetworkScene.tsx  R3F + drei, dynamic({ ssr: false })
│  ├─ site-nav.tsx            sticky + Resources dropdown + Get Telegram alerts CTA
│  └─ ui/                     existing shadcn components
├─ lib/
│  ├─ i18n.ts                 rewritten en + ko dict
│  ├─ api.ts                  existing fetch helpers
│  └─ utils.ts                existing constants (ALERT_REGISTRY_ADDRESS, GITHUB_REPO)
└─ tailwind.config.ts         updated to consume docs/DESIGN.md tokens
```

### Implementation approach

**Section component split** — each of the 8 sections becomes its own file under `components/sections/`. The existing `landing-content.tsx` (currently 277 lines) becomes a thin composition file (~25 lines) that imports and orders the sections. Rationale:
- Keeps file under 300 lines (project rule, AGENTS.md)
- New elements (live ticker, Three.js scene) are isolated components, can be lazy-loaded individually
- Re-usable for Phase 1.5 `/protocols` page (e.g., reuse `Stats`, `TrustSignals`, `FooterFinalCta`)

### Three.js integration

`react-three-fiber` + `@react-three/drei` + Next.js `dynamic({ ssr: false })`. Single restrained scene in HowItWorks section showing 3-oracle data flow (Chainlink + Pyth + RedStone → Sentinel → Mainnet AlertRegistry).

**Performance budget**:
- Initial bundle excludes three.js (lazy-loaded on HowItWorks mount)
- `prefers-reduced-motion: reduce` → static SVG fallback
- Mobile fallback (≤ md breakpoint) → static SVG
- LCP target: < 1.5s on mid-range mobile

### Live data integration

Server Components with `next: { revalidate: 5 }`. Stats and LivePreview both consume `/prices` and `/alerts` endpoints; they share the Next.js cache (same fetch, both sections render from one round-trip per 5s window).

## 5. Section-by-section spec

Order is fixed (matches `landing-content.tsx` import order). All copy is final unless flagged.

### 5.1 Hero

**Layout**: centered hero text + dual CTA + small live signal. Not asymmetric (P4 decision).

**English copy**:
- badge: `LIVE · Base Mainnet`
- title: `$50M lost in 18 months across 9 oracle failures.`
- subtitle: `Sentinel saw all of them. Get Telegram alerts before the next one — free.`
- CTA primary: `Get Telegram alerts →`
- CTA secondary: `View live dashboard`

**Korean copy**:
- badge: `LIVE · Base 메인넷`
- title: `오라클 사고 9건. 18개월. 손실 $50M.`
- subtitle: `Sentinel은 전부 잡았습니다. 다음 사고 전 무료 텔레그램 알림을 받으세요.`
- CTA primary: `텔레그램 알림 받기 →`
- CTA secondary: `라이브 대시보드 보기`

**CTA links**:
- primary → `https://t.me/<TELEGRAM_BOT_USERNAME>` (env-driven)
- secondary → `localePath(locale, 'dashboard')`

### 5.2 Stats bar (4 metrics)

**Layout**: 4-column grid (1 col mobile, 4 col desktop). Each metric is `display` value + `caption` label.

**English**:
1. `9` · `oracle failures · 18 months`
2. `$50M+` · `lost in those 9`
3. `{alertCount}` · `Sentinel alerts on Base Mainnet` (live, server-fetched)
4. `MIT` · `open-source forever`

**Korean**:
1. `9` · `오라클 사고 · 18개월`
2. `$50M+` · `해당 9건의 손실`
3. `{alertCount}` · `Base 메인넷 Sentinel 알림`
4. `MIT` · `영구 오픈소스`

**Data source**: `alertCount` derived from `GET /alerts?limit=1` (length of result array OR a future explicit count endpoint). On fetch failure → render `—`.

### 5.3 Problem

**Layout**: single max-width-4xl column, badge + title + body paragraph.

**English**:
- badge: `WHY`
- title: `Nine oracle failures. Zero retail watchdogs.`
- body: `Over the past 18 months, at least nine oracle-composition or hardcoded-oracle failures have caused ≥$50M in losses across Base-adjacent DeFi. Moonwell's cbETH market lost $2.68M to a single hardcoded oracle — caught only after 181 borrowers were liquidated. Every failure would have been visible to a multi-oracle cross-check in the same block. None had one watching. Until now.`

**Korean**:
- badge: `왜 만들었나`
- title: `오라클 사고 9건. 그러나 일반 사용자를 위한 감시견은 0.`
- body: `지난 18개월간 Base 인접 DeFi에서 발생한 오라클 구성 결함 또는 하드코딩 사고는 최소 9건, 손실 합계는 ≥$50M에 달합니다. 가장 최근 Moonwell cbETH 시장은 단일 하드코딩 오라클로 인해 $2.68M을 잃었고, 그 사고는 181명의 차용자가 청산된 후에야 인지됐습니다. 이 모든 사고는 같은 블록에서 멀티-오라클 cross-check 한 번이면 catch 가능했습니다. 하지만 누구도 그것을 보고 있지 않았습니다. 지금까지는.`

### 5.4 How it works

**Layout**: badge + title + body + Three.js scene below body (full-bleed within max-w-7xl container).

**English**:
- badge: `HOW`
- title: `Three oracles. *One block.*`
- body: `Sentinel polls Chainlink, Pyth, and RedStone every minute. When any pair deviates beyond the asset's threshold, an alert is published to a permanent on-chain log on Base — and to your Telegram, in seconds.`

**Korean**:
- badge: `작동 방식`
- title: `오라클 셋. *한 블록.*`
- body: `Sentinel은 Chainlink, Pyth, RedStone을 매분 polling합니다. 어느 쌍이라도 자산별 임계값을 넘어 deviation을 보이면, Base 위 영구 on-chain 로그에 alert가 기록되고 동시에 당신의 텔레그램으로 수 초 안에 알림이 갑니다.`

**Three.js scene**: 3-oracle data flow.
- 3 oracle nodes (Chainlink, Pyth, RedStone) on the left
- Sentinel hub in the center
- Base Mainnet AlertRegistry on the right
- Animated edges (data lines) flowing left → right with subtle pulses on detection
- Scene is restrained: low-saturation, off-white background, primary blue accents only on active edges
- Reduced-motion fallback: static SVG with same node layout

### 5.5 Live preview

**Layout**: badge + title + subtitle + 2-column body (prices grid left, recent alerts feed right) + dashboard link.

**English**:
- badge: `LIVE`
- title: `Live oracle data.`
- subtitle: `Latest prices and alerts. Refreshed every 5 seconds.`
- prices grid: 4–5 cards (`BTC/USD`, `ETH/USD`, `USDC/USD`, `cbETH/USD`, `USDO`), each card shows asset symbol + per-oracle prices + timestamp
- alerts feed: 3 most recent alerts, each row shows `alertId · asset · oracle pair · deviationBps · onchain status badge`
- link: `View full dashboard →`

**Korean**:
- badge: `LIVE`
- title: `실시간 오라클 데이터.`
- subtitle: `최신 가격과 알림. 5초마다 갱신.`
- link: `전체 대시보드 보기 →`

**Data sources**: `/prices` and `/alerts?limit=3` both with `revalidate: 5`. Component renders gracefully when partial (e.g., Chainlink rate-limit shows `—` for chainlink column — see Issue #18 for separate fix).

### 5.6 Roadmap (timeline cards)

**Layout**: 3-card grid (1 col mobile, 3 col desktop). Each card: status badge + date + bullets. Phase 3 card includes small disclaimer footer.

**English**:
- section badge: `WHAT'S NEXT`
- section title: `*Live* on Base. Federated next. Permissionless from 2027.`

Card 1 — `LIVE NOW · Q2 2026`:
- 5 assets cross-checked
- Mainnet AlertRegistry verified
- Free Telegram alerts

Card 2 — `Q4 2026 → Q1 2027`:
- 2–3 federated operators
- 10–15 assets
- Premium SLA tier

Card 3 — `Q2 2027+`:
- Permissionless DAO
- SENTINEL utility token
- Community airdrop snapshot includes Phase 1 subscribers and contributors
- *(disclaimer)* `Designed, not issued — token is conditional on Phase 3 launch with utility-token classification and legal opinion (multiple jurisdictions: US, KR, SG, KY).`

**Korean**:
- section badge: `다음 단계`
- section title: `Base 위 *Live*. 다음은 federated. 2027년부터 permissionless.`

Card 1 — `LIVE NOW · Q2 2026`:
- 5 자산 cross-check
- 메인넷 AlertRegistry 검증 완료
- 무료 텔레그램 알림

Card 2 — `Q4 2026 → Q1 2027`:
- 2–3 federated 오퍼레이터
- 10–15 자산
- Premium SLA tier

Card 3 — `Q2 2027+`:
- Permissionless DAO
- SENTINEL utility 토큰
- Phase 1 구독자/기여자 대상 커뮤니티 airdrop snapshot
- *(disclaimer)* `설계는 완료, 발행은 미정 — 토큰은 Phase 3 launch와 utility-token 분류 및 다수 법역(US/KR/SG/KY) legal opinion 조건부로만 발행됩니다.`

**Citation rule**: all roadmap claims cite `docs/ROADMAP.md` per `docs/SSOT-INDEX.md` §Citation protocol.

### 5.7 Trust signals (ContractsCallout refactor)

**Layout**: full-width box above footer. Existing `ContractsCallout.tsx` component is refactored — same position, expanded content.

**English**:
- title: `Verified on Base Mainnet`
- AlertRegistry address: `0x79b5d74A301079c86D13eb71e2787852F403F876` · [Basescan ✓](https://basescan.org/address/0x79b5d74A301079c86D13eb71e2787852F403F876#code)
- `MIT · Open source forever`
- `Audit scheduled Q1 2027`
- `View on GitHub →` (link to `GITHUB_REPO`)

**Korean**:
- title: `Base 메인넷 검증 완료`
- AlertRegistry: same address with same Basescan link
- `MIT · 영구 오픈소스`
- `2027 Q1 감사 예정`
- `GitHub에서 보기 →`

**Sources**:
- AlertRegistry address: `lib/utils.ts` `ALERT_REGISTRY_ADDRESS` (existing constant)
- Audit timeline: `docs/ROADMAP.md` §Phase 2 Success Criteria (`Trail of Bits, ChainSecurity, or Halborn`)

### 5.8 Footer final-CTA + 4-column footer

**Layout**: large CTA strip across full width, then 4-column footer below, then 1-line legal at the very bottom.

**English**:

CTA strip:
- copy: `Get Telegram alerts before the next failure.`
- button: `Get Telegram alerts →` (same primary CTA component)

Footer columns:
| Column | Content |
|---|---|
| Brand | Logo + `The public watchdog for tokenized RWAs on Base.` + `GitHub Repository →` |
| Product | Get Telegram alerts · Live dashboard · Premium waitlist (placeholder link) |
| Resources | Whitepaper · Docs · Research · Audit |
| Network | AlertRegistry on Basescan · Status · Twitter · Farcaster · Discord |

Bottom strip:
- `© 2026 Oclix Labs · MIT License`

**Korean**:

CTA strip:
- copy: `다음 사고 전 텔레그램 알림을 받으세요.`
- button: `텔레그램 알림 받기 →`

Footer columns:
| Column | Content |
|---|---|
| Brand | Logo + `Base 위 토큰화된 RWA를 위한 공공 감시견.` + `GitHub Repository →` |
| Product | 텔레그램 알림 받기 · 라이브 대시보드 · Premium 대기명단 |
| Resources | 백서 · 문서 · 리서치 · 감사 |
| Network | Basescan AlertRegistry · 상태 · Twitter · Farcaster · Discord |

Bottom strip:
- `© 2026 Oclix Labs · MIT License`

**Removed from current footer** (cleanup):
- `Poller Worker · AlertWriter Worker · Public API (Hono) · AlertRegistry.sol` Infra column (internal component names)
- `BTC / USD · ETH / USD · USDC / USD · cbETH / USD · USDO (attestation)` Eco column (redundant with Live preview section)

## 6. Site nav

**Layout**: sticky top nav. Becomes white-with-shadow on scroll.

- Left: Sentinel logo + name → `/`
- Center: `Dashboard` · `Coverage` (in-page anchor `#coverage` — section §5.5) · `Roadmap` (in-page anchor `#roadmap` — section §5.6) · `Resources` (dropdown: Whitepaper / Docs / Research / Audit)
- Right: 🌐 locale switcher (`EN`/`KO`) · GitHub icon · primary CTA `Get Telegram alerts`

**Mobile**: hamburger expands center nav as full-screen overlay; right-side CTA always visible in nav bar.

## 7. Data flow

```
Server (Next.js, revalidate: 5s)
  ├─ fetch /alerts → Stats.alertCount, LivePreview.alerts (shared cache)
  └─ fetch /prices → LivePreview.prices grid

Client (interactions only)
  - locale switcher → router.push('/' or '/ko')
  - CTA click → external Telegram link
  - dashboard link → /dashboard route
  - sticky nav transitions on scroll

Three.js (client-only)
  - dynamic({ ssr: false }) on HowItWorks mount
  - prefers-reduced-motion: reduce → SVG fallback
  - matchMedia('(max-width: 768px)') → SVG fallback
```

## 8. Error handling

| Failure mode | Behavior |
|---|---|
| `/prices` fetch fails | LivePreview prices grid shows `—`. No error UI. |
| `/alerts` fetch fails | LivePreview alerts feed and Stats.alertCount show `—`. No error UI. |
| Chainlink rate-limit (Issue #18) | LivePreview prices grid shows `—` for chainlink column only — Pyth + RedStone render normally. **Frontend is agnostic; fix is poller-side**. |
| Three.js bundle fails to load | HowItWorks renders SVG fallback. |
| `prefers-reduced-motion: reduce` | HowItWorks renders SVG fallback (no animation). |
| Mobile (≤ md) | HowItWorks renders SVG fallback (perf + battery). |
| Locale dict key missing | TypeScript catch at build (i18n strict mode) — no runtime missing-key. |

No global error boundary required for landing — if a section throws, it should be caught at the section level and rendered as zero-state. The hero (text-only, no fetch) is guaranteed to render.

## 9. Testing

Visual landing has historically been "no-op test" (`apps/landing-next/package.json`: `"test": "echo 'no-op: visual landing'"`). This redesign maintains that posture for unit tests but adds **one Playwright smoke test** as a Phase 1.5 follow-up:

```ts
// apps/landing-next/tests/smoke.e2e.ts (Phase 1.5)
test('hero renders + CTA click + locale switch + dashboard nav', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('$50M lost in 18 months')).toBeVisible()
  await expect(page.getByRole('link', { name: /Get Telegram alerts/ })).toHaveAttribute('href', /t\.me/)
  await page.getByRole('link', { name: 'KO' }).click()
  await expect(page.getByText('오라클 사고 9건')).toBeVisible()
  await page.getByRole('link', { name: /라이브 대시보드/ }).click()
  await expect(page).toHaveURL(/\/dashboard/)
})
```

Smoke alone — no per-component test. Visual regression (Percy / Chromatic) is a Phase 2 consideration.

## 10. Implementation phases & ETA

Single-developer sequence, optimistic rough budget:

1. **Section split refactor** (mechanical) — 1.5h
2. **Tailwind config update** to consume `docs/DESIGN.md` tokens — 0.5h
3. **i18n.ts rewrite** (en + ko, all 8 sections) — 1.5h
4. **Section copy + layout** for each section — 3h
5. **Three.js scene** (R3F + drei, 3-oracle data flow + SVG fallback) — 4h
6. **Site nav update** (sticky behavior, Resources dropdown, CTA) — 1h
7. **Live data fetch + revalidate** (Stats, LivePreview) — 1h
8. **`prefers-reduced-motion` + mobile SVG fallback wiring** — 1h
9. **Visual polish + responsive QA** — 2h

Total: **~15.5 hours** for one developer. Suggested split into 2 PRs:
- **PR 1** — sections 1–4 + nav + footer + DESIGN.md (no Three.js yet, scene placeholder = static SVG)
- **PR 2** — Three.js scene + LivePreview live data + final polish

## 11. Open questions

1. **`alertCount` exposure**: current `/alerts` API returns array. Add explicit `count` field, or compute client-side via `length`? Decision: compute client-side until `/alerts/count` endpoint exists.
2. **Premium waitlist link target**: footer Product column says `Premium waitlist` — does the form exist? **No** (Phase 1.5). For now: `mailto:hello@oclixlabs.xyz?subject=Premium%20waitlist` placeholder.
3. **Twitter / Farcaster / Discord URLs**: do we have these accounts active? Footer currently has them; need owner (이재근?) to confirm or remove.
4. **`TELEGRAM_BOT_USERNAME` env binding**: currently set on Cloudflare worker; landing needs it as `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` — Cloudflare Pages env var. Add to deploy checklist.
5. **Three.js scene art direction**: this spec sets layout (3 nodes → hub → AlertRegistry) but not visual style. Visual companion / mockup pass needed before implementation. **Defer to PR 2 kickoff.**

## 12. References

- `docs/ROADMAP.md` — Phase 1/2/3 timeline (cited verbatim in §5.6)
- `docs/DESIGN.md` — token system (sister doc; written same session)
- `docs/SSOT-INDEX.md` — index updated with this spec + DESIGN.md
- `.research/incident-forensics-moonwell.md` — Moonwell incident (Problem section claim source)
- `.research/oracle-inventory-base.md` — oracle feed inventory (HowItWorks claim source)
- ADR `docs/DECISIONS/0007-canonical-encoding.md` — alert evidence encoding (already accepted)
- Issue #18 — poller Chainlink rate-limit fix (referenced in §8 error handling)
- PR #19 + #21 — landing-next scaffold (predecessor work by 이재근)

---

_End of spec. User review gate: see §11 open questions before implementation kickoff._
