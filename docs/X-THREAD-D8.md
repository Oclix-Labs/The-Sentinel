# X (Twitter) Launch Threads — D8 Base Batches 003 Submission

> Copy-paste ready. Each block below is one tweet, all under the 280-character limit.
> Owner: 이재근. Account: `@oclixlabs`.

---

## Timing

- **English thread**: post immediately after 권상현 confirms Devfolio submission.
- **Korean thread**: post ~24h after the English thread (next-day Korean morning, 9–10 KST).
- **1번 트윗 이미지 (both threads)**: footer architecture diagram screenshot from `oclixlabs.xyz`, or `docs/diagrams/architecture-pipeline.png` once PR #28 lands.

---

## English thread (10 tweets)

### 1/10 — attach image (footer diagram or §3.1 architecture PNG)

```
On Feb 2026, a single oracle misconfiguration cost Moonwell users $2.68M across 181 borrower accounts.

A multi-oracle cross-check would have caught it in the same block.

We built the public-good service that does exactly that. 🛡️
```

### 2/10

```
Meet RWA Sentinel — a free, open-source watchdog for tokenized RWAs on @base.

Every minute we cross-check Chainlink, Pyth, and RedStone for 5 core Base assets.

Every detected deviation is anchored to an append-only log on Base Mainnet. No backend trust required.
```

### 3/10

```
The pattern, not the incident:

→ 9 oracle-composition failures across Base-adjacent DeFi in 18 months
→ ≥$50M in cumulative losses
→ Roughly one incident every two months

Systemic, not bad luck.
```

### 4/10

```
The retail coverage gap:

• Chaos Labs — 7-figure SLAs, protocols only
• Hypernative — enterprise only
• Forta — paid FORT subscription
• RWA.xyz — $500/seat/mo, no alerts
• Chainlink PoR — issuer self-attestation, no alerts

Retail had nothing. Until now.
```

### 5/10

```
Phase 1 stack, live today:

• Cloudflare Workers — poller, cross-check, alert-writer, API
• Hono + viem + zod, all TypeScript
• Cloudflare D1 / KV / Queues
• AlertRegistry.sol on Base Mainnet, MIT, Foundry-tested

~$55/mo at scale. ~60s alert latency.
```

### 6/10

```
The on-chain anchor:

AlertRegistry.sol lives at 0x79b5d7…F403F876 on Base Mainnet AND Sepolia (same address by CREATE determinism, deployer nonce 0).

Verified on Basescan. Append-only. Anyone can replay our entire detection history forever.
```

### 7/10

```
Phase 1 coverage — 5 assets where Base oracle overlap is verified:

• BTC / ETH / USDC (triple-sourced)
• cbETH (dual-sourced — Moonwell replay target)
• USDO (Chainlink PoR attestation tracking)

Honest about the cbETH dual-source limit. Still catches the Moonwell-style misconfig.
```

### 8/10

```
Progressive decentralization — Chainlink/Uniswap/Compound pattern:

• Phase 1 (2026 Q2) — Centralized MVP, no token. Today.
• Phase 2 (2026 Q4–2027 Q1) — Federated 2–3 operators, $5K MRR Premium.
• Phase 3 (2027 Q2+) — Permissionless + SENTINEL utility token.

Zero team/investor allocation.
```

### 9/10

```
Why Base?

• Lowest tx cost for high-frequency on-chain alert anchoring (~$0.007/alert)
• Largest emerging RWA issuer base (USDO live; cbBTC, Backed coming)
• Coinbase Wallet + Farcaster + Basenames = native retail distribution

Base-native, not chain-portable.
```

### 10/10

```
Built by 4 Yonsei BAY co-founders for @basebatches 003.

→ Repo: github.com/Oclix-Labs/The-Sentinel (MIT)
→ Live: oclixlabs.xyz
→ Whitepaper: 45-page lite v0.1

If you hold or build with tokenized RWAs on Base, follow @oclixlabs.

🛡️
```

---

## Korean thread (10 tweets)

### 1/10 — attach image (동일)

```
2026년 2월, Base의 Moonwell에서 cbETH 가격이 단 한 줄의 오류로 $2,200 → $1.12로 잘못 계산됐습니다.

181명 차주가 4일 안에 $2.68M을 잃었어요.

다중 오라클 교차검증이 있었으면 그 블록 안에 잡혔을 사고입니다.

우리가 그걸 만들었어요. 🛡️
```

### 2/10

```
RWA Sentinel — Base 위 토큰화 RWA를 위한 무료 공공재 감시 레이어.

매분 Chainlink · Pyth · RedStone를 교차검증.
탐지된 편차는 Base Mainnet의 추가 전용 컨트랙트에 영구 기록.

백엔드 신뢰 없이 모든 사용자가 검증 가능합니다.
```

### 3/10

```
패턴이지 우연이 아닙니다.

→ 18개월간 Base 인근 DeFi 9건의 오라클 사고
→ 누적 손실 ≥$50M
→ 약 2개월에 1건 꼴

cbETH · USDC · USDO 보유 중이라면 다음 사고에서 손해 볼 사람일 수 있습니다.
```

### 4/10

```
기존 감시자들의 사각지대:

• Chaos Labs — 프로토콜 전용, 7자리 SLA
• Hypernative — 엔터프라이즈 only
• Forta — paid FORT 구독
• RWA.xyz — $500/월/seat, 알림 없음
• Chainlink PoR — 데이터만, 알림 없음
• OpenZeppelin Defender — 2026년 7월 종료

retail은 어디로? 우리에게.
```

### 5/10

```
Phase 1 스택, 오늘 라이브:

• Cloudflare Workers (poller / cross-check / alert-writer / API)
• Hono + viem + zod, 전부 TypeScript
• Cloudflare D1 / KV / Queues
• AlertRegistry.sol — Base Mainnet, MIT, Foundry 테스트

규모 시 ~$55/월. 알림 지연 ~60초.
```

### 6/10

```
온체인 앵커:

AlertRegistry.sol은 0x79b5d7…F403F876에 라이브.
Base Mainnet + Sepolia 모두 같은 주소 (CREATE 결정성, deployer nonce 0).

Basescan 검증 완료. 추가 전용. 누구나 탐지 이력 영구 검증 가능.
```

### 7/10

```
Phase 1 커버리지 — Base에서 오라클 중복이 검증된 5자산:

• BTC / ETH / USDC (3-source)
• cbETH (2-source — Moonwell 리플레이 타깃)
• USDO (Chainlink PoR attestation 추적)

cbETH 2-source 한계 솔직히 인정. 단 Moonwell-style 사고는 99.95% 편차라 충분히 잡습니다.
```

### 8/10

```
점진적 탈중앙화 — Chainlink/Uniswap/Compound 패턴:

• Phase 1 (2026 Q2) — 중앙화 MVP, 토큰 없음. 오늘.
• Phase 2 (2026 Q4–2027 Q1) — 2-3 페더레이션 운영자, $5K MRR Premium.
• Phase 3 (2027 Q2+) — 퍼미션리스 + SENTINEL 유틸리티 토큰.

팀+투자자 토큰 0%. (백서 §4.0)
```

### 9/10

```
왜 Base?

• 가장 낮은 tx 비용 — alert anchoring ~$0.007 (다른 L2의 1/2-1/3)
• 가장 큰 신흥 RWA 발행자 base (USDO 라이브, cbBTC + Backed)
• Coinbase Wallet + Farcaster + Basenames = 네이티브 retail distribution

한국 입장: Korean retail RWA 진입 시작점.
```

### 10/10

```
연세대 BAY 4명 공동창업 @basebatches 003 응모.

→ Repo: github.com/Oclix-Labs/The-Sentinel (MIT)
→ Live: oclixlabs.xyz
→ 백서: 45p lite v0.1

Base에서 토큰화 RWA 보유/빌드하시면 @oclixlabs 팔로우.

🛡️
```

---

## Post-publication checklist

- [ ] Pin the 1/10 tweet of the English thread on `@oclixlabs`.
- [ ] Reply to the 10/10 tweet with: Devfolio submission link + whitepaper PDF link.
- [ ] First 24h: monitor replies / DMs, respond to substantive engineering questions.
- [ ] After Korean thread: reply to 10/10 with `@OclixSentinelKR` (Telegram bot link) once 모진영 ships the bot.
