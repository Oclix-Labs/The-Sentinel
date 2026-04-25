export type Locale = "en" | "ko";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "ko"];

export type Dict = {
  nav: {
    overview: string;
    architecture: string;
    assets: string;
    roadmap: string;
    dashboard: string;
    cta: string;
  };
  hero: {
    badge: string;
    title_part1: string;
    title_accent: string;
    title_part2: string;
    desc: string;
    cta_primary: string;
    cta_secondary: string;
  };
  stats: { failures: string; lost: string; assets: string; watchdogs: string };
  problem: { label: string; title: string; desc: string };
  solution: { label: string; title: string; desc: string };
  arch: {
    label: string;
    title_part1: string;
    title_accent: string;
    desc: string;
    stages: { id: string; title: string; desc: string }[];
  };
  contracts: { label: string; title: string; desc: string };
  roadmap: {
    label: string;
    title_part1: string;
    title_accent: string;
    sub: string;
    phases: { tag: string; title: string; bullets: string[] }[];
  };
  team: { label: string; title: string };
  footer: { desc: string; infra: string; eco: string; rights: string };
  dashboard: {
    title: string;
    subtitle: string;
    prices_title: string;
    alerts_title: string;
    no_data: string;
    asset: string;
    oracle: string;
    price: string;
    deviation: string;
    time: string;
    tx: string;
    refresh: string;
  };
};

export const dict: Record<Locale, Dict> = {
  en: {
    nav: {
      overview: "Overview",
      architecture: "Architecture",
      assets: "Assets",
      roadmap: "Roadmap",
      dashboard: "Dashboard",
      cta: "View Submission",
    },
    hero: {
      badge: "Base Batches 003 · Student Track · MVP Ships 2026-04-27",
      title_part1: "The Public Watchdog for",
      title_accent: "Tokenized RWAs",
      title_part2: "on Base",
      desc: "RWA Sentinel cross-checks Chainlink, Pyth, and RedStone for 5 core Base assets every minute, and writes detected deviations to an append-only on-chain log. Free and open-source, retail-facing, Base-exclusive.",
      cta_primary: "Explore Architecture",
      cta_secondary: "View on GitHub",
    },
    stats: {
      failures: "Oracle failures (18mo)",
      lost: "Lost to oracle issues",
      assets: "Phase 1 assets",
      watchdogs: "Free RWA watchdogs on Base",
    },
    problem: {
      label: "01 — Problem",
      title: "A pattern, not an incident",
      desc: "Over the past 18 months, at least nine oracle-composition or hardcoded-oracle failures across Base-adjacent DeFi have caused ≥$50M in losses — roughly one incident every two months. The most recent is the Moonwell cbETH incident of February 2026 ($2.68M impacting ~181 borrowers) caused by an OEV wrapper misconfiguration. Every single one would have been caught by a multi-oracle ±2% cross-check in the same block it occurred.",
    },
    solution: {
      label: "02 — Solution",
      title: "The Sentinel solution",
      desc: "An always-on cross-check of Chainlink, Pyth, and RedStone for 5 core Base assets on a 1-minute cadence. When deviation exceeds ±2%, the event is queued, fanned out to Telegram and webhook subscribers, and written to AlertRegistry on Base Mainnet as an append-only record. Every line of code is MIT-licensed; every alert is publicly verifiable on-chain.",
    },
    arch: {
      label: "03 — Architecture",
      title_part1: "Edge Workers + ",
      title_accent: "On-Chain Registry",
      desc: "Cross-check runs on Cloudflare Workers (~$55/mo at scale vs ~$8.7K/mo fully on-chain). Alerts are delivered off-chain for speed and anchored on-chain for auditability.",
      stages: [
        { id: "01", title: "Poller Worker", desc: "Cron 1 min · 5 assets × 3 oracles · viem + Pyth + RedStone" },
        { id: "02", title: "Cross-Check", desc: "Pairwise ±2% deviation · per-asset tunable" },
        { id: "03", title: "AlertWriter", desc: "Queue consumer · D1 + on-chain + webhook + Telegram" },
        { id: "04", title: "AlertRegistry", desc: "Append-only Solidity log · Base Mainnet · verified" },
      ],
    },
    contracts: {
      label: "Live on Base Mainnet · Verified",
      title: "AlertRegistry.sol",
      desc: "Append-only on-chain alert log. Same address on Sepolia and Mainnet via CREATE determinism (deployer nonce 0).",
    },
    roadmap: {
      label: "08 — Roadmap",
      title_part1: "Progressive ",
      title_accent: "Decentralization",
      sub: "Centralized MVP → Federated operators → Permissionless network + SENTINEL token.",
      phases: [
        {
          tag: "Phase 1 · 2026 Q2",
          title: "Centralized MVP · Base Batches 003",
          bullets: [
            "5 assets monitored: BTC, ETH, USDC, cbETH, USDO",
            "AlertRegistry.sol deployed to Base Mainnet",
            "Telegram + webhook alerts; Public API (Hono)",
            "Moonwell cbETH replay as regression test",
            "No token issued",
          ],
        },
        {
          tag: "Phase 2 · 2026 Q4 – 2027 Q1",
          title: "Federated Operators · Pre-seed",
          bullets: [
            "2–3 independent operators with N-of-M consensus",
            "10–15 assets incl. wstETH, USDT, DAI, EURC, cbBTC",
            "Premium tier GA — target >$5K MRR",
            "Third-party security audit",
            "Token designed, not issued",
          ],
        },
        {
          tag: "Phase 3 · 2027 Q2+",
          title: "Permissionless + SENTINEL Token",
          bullets: [
            "StakingManager + Governance + Treasury contracts",
            "SENTINEL utility token live on Base (CCIP to ETH/OP)",
            "DAO-governed thresholds, coverage, slashing",
            "30+ assets monitored",
            "Community airdrop to Phase 1–2 subscribers",
          ],
        },
      ],
    },
    team: { label: "Team", title: "Built by 4 Yonsei BAY co-founders" },
    footer: {
      desc: "Public-good watchdog for tokenized RWAs on Base. By Oclix Labs.",
      infra: "Infrastructure",
      eco: "Phase 1 Assets",
      rights: "© 2026 Oclix Labs. RWA Sentinel is a public good for Base.",
    },
    dashboard: {
      title: "Live Dashboard",
      subtitle: "Latest 5 prices and 5 alerts. Mock data shown when API is unavailable.",
      prices_title: "Latest Prices (per oracle)",
      alerts_title: "Recent Alerts",
      no_data: "No data yet — the network is healthy.",
      asset: "Asset",
      oracle: "Oracle",
      price: "Price",
      deviation: "Deviation",
      time: "Time",
      tx: "Tx",
      refresh: "Refresh",
    },
  },
  ko: {
    nav: {
      overview: "개요",
      architecture: "아키텍처",
      assets: "자산",
      roadmap: "로드맵",
      dashboard: "대시보드",
      cta: "제출물 보기",
    },
    hero: {
      badge: "Base Batches 003 · Student Track · MVP 2026-04-27 출시",
      title_part1: "Base 위 토큰화 RWA를 위한",
      title_accent: "퍼블릭 감시 레이어",
      title_part2: "",
      desc: "RWA Sentinel은 Base 위 5개 핵심 자산에 대해 Chainlink · Pyth · RedStone 오라클 피드를 1분마다 교차 검증하고, 탐지된 편차를 추가 전용 온체인 로그에 기록합니다. 무료 · 오픈소스 · 리테일 친화 · Base 전용.",
      cta_primary: "아키텍처 탐색",
      cta_secondary: "GitHub에서 보기",
    },
    stats: {
      failures: "18개월 내 오라클 장애",
      lost: "오라클 이슈로 인한 손실",
      assets: "Phase 1 출시 자산",
      watchdogs: "Base 전용 무료 RWA 감시자",
    },
    problem: {
      label: "01 — 문제",
      title: "사고가 아니라 패턴",
      desc: "지난 18개월간 Base 인근 DeFi에서 최소 9건의 오라클 구성/하드코딩 실패로 ≥$50M 손실이 발생했습니다 — 약 2개월에 한 건 꼴. 가장 최근은 2026년 2월 Moonwell cbETH 사고 ($2.68M, ~181명 차주 영향), OEV 래퍼 미스컨피그가 원인. 모든 사고는 다중 오라클 ±2% 교차검증으로 발생 블록 내 탐지 가능했습니다.",
    },
    solution: {
      label: "02 — 솔루션",
      title: "Sentinel의 해법",
      desc: "Base 위 5개 핵심 자산에 대해 Chainlink · Pyth · RedStone을 1분 주기로 상시 교차검증. ±2% 초과 편차 발생 시 이벤트를 큐에 넣고, Telegram · 웹훅 구독자에게 팬아웃하며, Base Mainnet AlertRegistry에 추가 전용으로 기록. 모든 코드는 MIT, 모든 알림은 온체인 공개 검증 가능.",
    },
    arch: {
      label: "03 — 아키텍처",
      title_part1: "엣지 워커 + ",
      title_accent: "온체인 레지스트리",
      desc: "교차검증은 Cloudflare Workers에서 실행 (대규모 ~$55/월 vs 풀 온체인 ~$8,700/월). 알림은 속도를 위해 오프체인으로 전달하고 감사를 위해 온체인에 앵커.",
      stages: [
        { id: "01", title: "Poller Worker", desc: "Cron 1분 · 5자산 × 3오라클 · viem + Pyth + RedStone" },
        { id: "02", title: "Cross-Check", desc: "Pairwise ±2% 편차 · 자산별 조정 가능" },
        { id: "03", title: "AlertWriter", desc: "큐 컨슈머 · D1 + 온체인 + 웹훅 + Telegram" },
        { id: "04", title: "AlertRegistry", desc: "추가 전용 Solidity 로그 · Base Mainnet · verified" },
      ],
    },
    contracts: {
      label: "Base Mainnet 라이브 · Verified",
      title: "AlertRegistry.sol",
      desc: "추가 전용 온체인 알림 로그. CREATE 결정성(deployer nonce 0)에 의해 Sepolia · Mainnet 동일 주소.",
    },
    roadmap: {
      label: "08 — 로드맵",
      title_part1: "점진적 ",
      title_accent: "탈중앙화",
      sub: "중앙화 MVP → 페더레이션 운영자 → 퍼미션리스 네트워크 + SENTINEL 토큰.",
      phases: [
        {
          tag: "Phase 1 · 2026 Q2",
          title: "중앙화 MVP · Base Batches 003",
          bullets: [
            "5자산 모니터링: BTC, ETH, USDC, cbETH, USDO",
            "AlertRegistry.sol Base Mainnet 배포",
            "Telegram + 웹훅 알림; Public API (Hono)",
            "Moonwell cbETH 리플레이 회귀 테스트",
            "토큰 발행 없음",
          ],
        },
        {
          tag: "Phase 2 · 2026 Q4 – 2027 Q1",
          title: "페더레이션 운영자 · Pre-seed",
          bullets: [
            "2–3개 독립 운영자 N-of-M 합의",
            "10–15자산 (wstETH, USDT, DAI, EURC, cbBTC 포함)",
            "Premium 정식 출시 — 목표 >$5K MRR",
            "제3자 보안 감사",
            "토큰 설계 완료, 미발행",
          ],
        },
        {
          tag: "Phase 3 · 2027 Q2+",
          title: "퍼미션리스 + SENTINEL 토큰",
          bullets: [
            "StakingManager + Governance + Treasury 컨트랙트",
            "SENTINEL 유틸리티 토큰 Base 출시 (CCIP via ETH/OP)",
            "DAO 거버넌스 임계값/커버리지/슬래싱",
            "30+ 자산 모니터링",
            "Phase 1–2 구독자 커뮤니티 에어드랍",
          ],
        },
      ],
    },
    team: { label: "팀", title: "연세대 BAY 출신 4인 공동창업" },
    footer: {
      desc: "Base 위 토큰화 RWA를 위한 공공재 감시 레이어. Oclix Labs 제공.",
      infra: "인프라",
      eco: "Phase 1 자산",
      rights: "© 2026 Oclix Labs. RWA Sentinel은 Base의 공공재입니다.",
    },
    dashboard: {
      title: "라이브 대시보드",
      subtitle: "최신 가격 5개 + 알림 5개. API 미가용 시 mock 데이터.",
      prices_title: "최신 가격 (오라클별)",
      alerts_title: "최근 알림",
      no_data: "데이터 없음 — 네트워크 정상.",
      asset: "자산",
      oracle: "오라클",
      price: "가격",
      deviation: "편차",
      time: "시간",
      tx: "Tx",
      refresh: "새로고침",
    },
  },
};

export function getDict(locale: Locale): Dict {
  return dict[locale] ?? dict[DEFAULT_LOCALE];
}
