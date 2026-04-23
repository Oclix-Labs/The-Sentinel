# Oclix Labs — Member Task Plan (D0–D8)

> 각 멤버별 태스크 리스트 (D0 = today 2026-04-19 / D8 = submission 2026-04-27). 카톡방 공지용 + 진행 추적용. Day별 체크박스 체크하며 운영.
>
> **공통 규칙**: 모두 오늘 밤 22시 Google Meet standup. 매일 아침 카톡에 전일/금일/blocker 3줄 포스트. 2시간 룰 (막히면 2h 후 카톡에 공유).

---

## 👨‍💻 권상현 — Team Lead + Smart Contract

### D0 즉시 (오늘 밤)
- [ ] GitHub org `oclixlabs` 생성 + 4명 member 초대
- [ ] GitHub repo `oclixlabs/rwa-sentinel` 생성 (private)
- [ ] 도메인 `oclixlabs.xyz` 확인 + 구매 (선점되어 있으면 `oclix.xyz`)
- [ ] Google Meet 고정 링크 생성 (standup용)
- [ ] Devfolio 로그인 → Apply 진입 → **Category 드롭다운 스샷** 카톡방 공유
- [ ] `hello@basebatches.xyz` **incorporation 문의 메일** 발송
- [ ] Claude가 준비한 scaffold 파일 일괄 커밋 (별도 요청 시 제공)

### D1 (4/20 Sun)
- [ ] Foundry 프로젝트 부트스트랩 (`apps/contracts`)
- [ ] `AlertRegistry.sol` 인터페이스 설계 (`logAlert`, events, access control)
- [ ] 팀 PR 리뷰 대기열 초기화

### D2 (4/21 Mon)
- [ ] `AlertRegistry.sol` 구현 초안 + unit tests (Foundry)
- [ ] Access control 확정 — custom mapping 유지 ([ADR 0006](./DECISIONS/0006-custom-access-control.md))
- [ ] Gas-optimization 1-pass

### D3 (4/22 Tue)
- [ ] `AlertRegistry.sol` 테스트 전체 green
- [ ] **Base Mainnet ETH ~$30-40 pre-fund** (거래소 → Base L2 bridge 또는 Coinbase Wallet swap)
- [ ] Base Sepolia 배포 + 테스트 tx emit

### D4 (4/23 Wed) — 🔴 Mid-sprint gate
- [ ] 모진영과 15분 pair programming (viem으로 `AlertRegistry.logAlert()` 호출 코드)
- [ ] Mid-sprint checkpoint 회의 주도 (D5 gate 판정)
- [ ] MVP DoD 10개 중 몇 개 달성 가능한지 판정

### D5 (4/24 Thu)
- [ ] **Base Mainnet 배포** (`AlertRegistry`)
- [ ] Basescan verified 확인
- [ ] 테스트 알림 1건 emit (on-chain evidence)
- [ ] PR 리뷰 (집중)

### D6 (4/25 Fri)
- [ ] Founder video 촬영 참여 (brief 8s cut)
- [ ] Application 전필드 검토 (김현우 draft 리뷰)
- [ ] Whitepaper Section 5 (Governance) + 6 (Security) 퀵 리뷰

### D7 (4/26 Sat)
- [ ] **Repo public 전환**
- [ ] README 최종 + 배지 + 스크린샷
- [ ] gitleaks 히스토리 통과 확인
- [ ] 최종 통합 테스트 지휘

### D8 (4/27 Sun) — 제출일
- [ ] Devfolio 최종 제출 (계정 보유자)
- [ ] 제출 반나절 전 (점심까지) 완료 목표

---

## 👨‍💻 모진영 — Core Engine + Backend + Infra

### D0 즉시 (오늘 밤)
- [ ] Cloudflare 계정 생성 (free tier)
- [ ] `wrangler` CLI 설치 + 로그인
- [ ] D1, KV, Queues feature enable 확인
- [ ] Base RPC endpoint 확보 (`base.llamarpc.com` 또는 Alchemy/QuickNode 무료)

### D1 (4/20 Sun)
- [ ] pnpm workspace 셋업 (`apps/poller`, `apps/alert-writer`, `apps/api`)
- [ ] `wrangler.jsonc` env 분리 (staging / production)
- [ ] 의존성 설치: `viem`, `@pyth-network/pyth-evm-js`, `hono`, `zod`
- [ ] Hello world: cron 1분 + Chainlink BTC/USD 읽기 + console.log
- [ ] `nodejs_compat` 플래그 활성화 확인

### D2 (4/21 Mon)
- [ ] Poller Worker 실구현: 5 asset × 3 oracle fetch 함수 분리
- [ ] Off-chain deviation 계산 로직 (±2% threshold, per-asset tunable)
- [ ] D1 schema 설계 + migration (alerts, subscriptions, price_history)
- [ ] KV bindings (latest_prices)

### D3 (4/22 Tue)
- [ ] Poller 완성 + staging 배포 + 로컬 1시간 관찰
- [ ] AlertWriter Worker 시작 (Queue consumer)
- [ ] Hono API skeleton (`GET /alerts`, `GET /prices`, `POST /subscribers`)

### D4 (4/23 Wed)
- [ ] AlertWriter: D1 insert + Queue publish 완성
- [ ] 권상현 pair: viem으로 `AlertRegistry.logAlert()` 호출부 작성 (3h)
- [ ] Public API 3개 endpoint 구현 완료
- [ ] Mid-sprint checkpoint 참여

### D5 (4/24 Thu)
- [ ] Public API 완성 + 자체 E2E 테스트
- [ ] Telegram bot 구현 (grammy 또는 node-telegram-bot-api)
- [ ] Webhook subscription + 전송 기능
- [ ] 이재근 pair: API 스펙 설명 (15min)

### D6 (4/25 Fri)
- [ ] 통합 테스트: Poller → Cross-check → Queue → AlertWriter → 컨트랙트 + Telegram + Webhook
- [ ] Staging URL 24h 안정성 확인
- [ ] Founder video 촬영: 제품 화면 녹화 데모 (8s)

### D7 (4/26 Sat)
- [ ] **Production deployment** (`main` branch → rwa-sentinel.workers.dev)
- [ ] 24/7 모니터링 시작 (MVP DoD #3)
- [ ] 통합 버그 수정 (발견되는 대로)

### D8 (4/27 Sun)
- [ ] 최종 QA (down 없이 유지)
- [ ] 제출 전 Grafana-like screenshot 찍어 application에 반영

---

## 👨‍🎨 이재근 — Marketing + Frontend + Landing + Whitepaper (co)

### D0 즉시 (오늘 밤)
- [ ] Twitter/X `@oclixlabs` 선점 (또는 대안)
- [ ] Farcaster 계정 `@oclixlabs` 선점
- [ ] (선택) Lens Protocol 계정
- [ ] 간단한 bio + 프로필 사진 준비 (공개는 D7)

### D1 (4/20 Sun)
- [ ] 아키텍처 다이어그램 1장 (Figma / Excalidraw / Miro) — 4단 파이프라인
- [ ] Progressive Decentralization 3-phase 다이어그램
- [ ] 랜딩 페이지 와이어프레임 (Figma)

### D2 (4/21 Mon)
- [ ] 랜딩 페이지 scaffold (Next.js + shadcn/ui on Cloudflare Pages 또는 Vercel)
- [ ] 섹션: Header / Problem / Solution / Team / Why Base / CTA
- [ ] 모바일 반응형 기본
- [ ] **Whitepaper 작업 시작** (담당 섹션 3, 4, 8, Appendix A)

### D3 (4/22 Tue)
- [ ] 미니 대시보드 (최신 알림 5개 + 최신 가격 5개)
- [ ] API mock 데이터로 UI 먼저 완성
- [ ] Whitepaper Section 3 (Architecture narrative) 초안

### D4 (4/23 Wed)
- [ ] 모진영 pair: Public API 연결 (15min)
- [ ] Landing + Dashboard API 실연결
- [ ] Whitepaper Section 4 (Tokenomics narrative) 초안

### D5 (4/24 Thu)
- [ ] 랜딩 폴리싱 + 카피 검토 (김현우 영어 체크)
- [ ] 도메인 연결 (`oclixlabs.xyz` → 랜딩)
- [ ] Whitepaper Section 8 (Regulatory framing) 초안

### D6 (4/25 Fri)
- [ ] Founder video 촬영 (brief 8s cut)
- [ ] Video 편집 지원 (CapCut 세팅, b-roll 준비, 음악 선정)
- [ ] Whitepaper Appendix A (Glossary) 작성

### D7 (4/26 Sat)
- [ ] 랜딩 최종 + Mainnet AlertRegistry 주소 반영
- [ ] **X thread 초안** 작성 (D7 public 전환 발표용, 10 tweets)
- [ ] Video 편집 마무리 지원 (김현우 주도)
- [ ] Whitepaper 최종 리뷰 (이재근 + 김현우 cross-check)

### D8 (4/27 Sun)
- [ ] 제출 후 X thread 공개 시점 대기
- [ ] 커뮤니티 대응 (댓글 / DM) 시작

---

## 🎙️ 김현우 — English + Research + Video + Docs + Whitepaper (co)

### D0 즉시 (오늘 밤)
- [ ] BAY 포트폴리오/수상 기록 정리 시작 (BAY 학회 운영진에게 요청)
- [ ] 팀원 LinkedIn + GitHub + 이메일 수집 (카톡 템플릿 활용)
- [ ] Devfolio application form 영문 필드 정확히 재확인 (글자수 limits 등)

### D1 (4/20 Sun)
- [ ] `docs/TEAM.md` 작성 (4명 영문 bio 50-100 단어씩)
- [ ] Application 전체 필드 영문 초안 시작 (`docs/APPLICATION-BM-DRAFTS.md` 기반)
- [ ] Whitepaper 담당 섹션 스케줄링 (1, 2, 7, 9, 10)

### D2 (4/21 Mon)
- [ ] Application 초안 v1 완성 (전필드: 50자 / UVP / onchain / Base 사용 / Stage / Why Base Batches / 기타)
- [ ] Whitepaper Section 1 (Abstract) 작성
- [ ] Whitepaper Section 9 (Team) 작성 (bio 영문화)

### D3 (4/22 Tue)
- [ ] Application 팀 리뷰 받아 v2 수정
- [ ] Whitepaper Section 2 (Problem) 완성 — `.research/incident-forensics-moonwell.md` 인용
- [ ] Whitepaper Section 7 (Roadmap) 시작

### D4 (4/23 Wed)
- [ ] Whitepaper Section 7 완성
- [ ] Mid-sprint checkpoint 참여
- [ ] **Founder video 스크립트 v1** 작성 (영어, 1분)

### D5 (4/24 Thu)
- [ ] Video 스크립트 v2 확정 (전팀 리뷰 후)
- [ ] Application 전필드 최종 검토
- [ ] Whitepaper Section 10 (Risks) 작성
- [ ] 이재근과 Whitepaper cross-section 조율 (narrative flow)

### D6 (4/25 Fri)
- [ ] **Founder video 촬영** (메인 presenter + 다른 founder cut 디렉팅)
- [ ] 각자 대사 테이크 3-5번 (리허설 포함 총 3-4시간)
- [ ] 촬영 완료 후 편집 시작

### D7 (4/26 Sat)
- [ ] **Video 편집 주도** (CapCut)
- [ ] 자막/타이포/BGM
- [ ] YouTube unlisted 업로드 + URL 확보
- [ ] Whitepaper v0.1 최종 리뷰 + PDF export

### D8 (4/27 Sun)
- [ ] Application 최종 문구 검토 (권상현과 cross-check)
- [ ] Video URL 확보 후 제출 지원

---

## 🗓 공통 일정

| Day | 공통 이벤트 |
|---|---|
| D0 (오늘) | 22시 Google Meet — 미팅 wrap-up + D0 액션 확인 |
| D1-D3 | 매일 22시 15분 standup voice + 아침 async 카톡 포스트 |
| **D4 (4/23 Wed) 저녁** | **🔴 Mid-sprint gate 30분 회의** — MVP DoD 10개 중 달성 가능 개수 판정 → Stage 답변 유지/하향 결정 |
| D5-D7 | standup 유지 + Day 7에 repo public 전환 + video 업로드 |
| **D8 (4/27 Sun) 오전** | **제출 드레스리허설**: 모든 링크 정상 동작 + staging=production sync 확인 |
| D8 (4/27 Sun) 오후 | 권상현 Devfolio 최종 제출 (반나절 버퍼 확보) |

---

## 🚦 MVP DoD 10개 (D4 gate에서 체크)

(출처: `docs/`+회의록)

1. [ ] GitHub public repo (D7)
2. [ ] CF Workers production 배포
3. [ ] Cron 24/7 가동
4. [ ] 5 assets 모니터링 (BTC/ETH/USDC/cbETH + USDO)
5. [ ] AlertRegistry Base **Mainnet** 배포 + verified
6. [ ] 테스트 알림 1건+ on-chain emit
7. [ ] Public API endpoints 접근 가능
8. [ ] Webhook 실제 전송 테스트 통과
9. [ ] Telegram bot live 알림
10. [ ] Landing page at oclixlabs.xyz

**D4 시점 달성 예상 < 7개 시 → Stage를 "Prototype"으로 하향. AlertRegistry는 Sepolia로.**

---

## 📎 참고 문서

- `docs/APPLICATION-BM-DRAFTS.md` — Devfolio 답안 영문 draft
- `docs/ROADMAP.md` — Progressive Decentralization 3-phase
- `docs/TOKENOMICS-OUTLINE.md` — SENTINEL 유틸리티
- `docs/WHITEPAPER-v0.1-SKELETON.md` — Whitepaper 스켈레톤 (이재근 + 김현우 채우기)
- `.research/incident-forensics-moonwell.md` — 9 incidents $50M 증거
- `.research/oracle-inventory-base.md` — Oracle feeds + PoR on Base
- `.research/competitor-architecture.md` — 경쟁자 분석

---

_Last updated: 2026-04-19 by Claude assistant during kickoff meeting. Individual owners update own checkboxes at standup._
