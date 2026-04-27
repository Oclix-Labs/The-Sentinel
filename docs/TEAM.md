# Team — Oclix Labs

> Four-person founding team building The Sentinel. All undergraduates at Yonsei University, members of BAY Blockchain Society.

---

## 권상현 (Kwon Sanghyun) — Team Lead + Smart Contract

- **Role**: Team Lead, Smart Contract Engineer, Devfolio submission owner
- **Responsibilities**: AlertRegistry design + Foundry development + Base deploy, external communications, final decision authority
- **Department**: _[TODO: 본인 채우기]_
- **Year**: _[TODO: 본인 채우기]_
- **Email**: _[TODO: 본인 채우기]_
- **LinkedIn**: _[TODO: 본인 채우기]_
- **GitHub**: [@SangHyeonKwon](https://github.com/SangHyeonKwon)

> Sanghyun leads smart contract architecture and deployment for RWA Sentinel. He designed and shipped `AlertRegistry.sol` — a 157-line MIT-licensed Foundry contract — to Base Mainnet at `0x79b5d74A301079c86D13eb71e2787852F403F876`, executing a hardening pass that packed the `Alert` struct from 6 to 4 storage slots (~24K gas saved per call) and replaced single-step admin transfer with a two-step `transferAdmin` → `acceptAdmin` rotation. He authored the project's Architecture Decision Records (ADR 0006 custom access control, ADR 0007 RFC 8785 canonical encoding) and serves as Devfolio submission owner and final approval authority. At Yonsei BAY Blockchain Society, his prior work focuses on EVM smart-contract security and gas optimization.

---

## 모진영 (Mo Jinyoung) — Core Engine + Backend + Infra

- **Role**: Core Engine Engineer, Backend, Infrastructure
- **Responsibilities**: Cloudflare Workers (poller, alert-writer, api, telegram-bot), cross-check engine, D1 / KV / Queues, wrangler CI/CD
- **Department**: _[TODO: 본인 채우기]_
- **Year**: _[TODO: 본인 채우기]_
- **Email**: _[TODO: 본인 채우기]_
- **LinkedIn**: _[TODO: 본인 채우기]_
- **GitHub**: _[TODO: 본인 채우기]_

> Jinyoung architects and operates the off-chain pipeline that powers RWA Sentinel. He shipped four Cloudflare Workers (`apps/poller` for cron-driven multi-oracle ingestion, `apps/alert-writer` for queue-consumer fan-out across D1 + on-chain + webhook + Telegram, `apps/api` for the public Hono REST surface, and `apps/telegram-bot` for subscriber alert delivery) and configured the Cloudflare D1 / KV / Queues bindings + wrangler staging→production CI promotion (per ADR 0004). At Yonsei BAY Blockchain Society, his focus is edge compute, cross-checking pipelines, and TypeScript-first crypto infrastructure.

---

## 이재근 (Lee Jaegeun) — Marketing + Community + Frontend + Landing

- **Role**: Marketing, Community, Frontend, Landing page, Whitepaper co-author
- **Responsibilities**: Landing page (Next.js + Cloudflare Pages, EN/KR), architecture diagrams, Korean retail community + global Twitter/Farcaster presence, Whitepaper authoring (initially §3 / §4 / §8 / Appendix A; expanded to §1 / §2 / §5 / §6 / §7 / §9 / §11 on D8)
- **Department**: Computer Science
- **Year**: 3rd year
- **Email**: ljk90409550@gmail.com
- **LinkedIn**: [재근 이](https://www.linkedin.com/in/%EC%9E%AC%EA%B7%BC-%EC%9D%B4-3bb176406/)
- **GitHub**: [leejk206](https://github.com/leejk206)

> Jaegeun leads the product narrative, retail-facing surfaces, and whitepaper authoring for RWA Sentinel. He shipped the project landing page (Next.js 14 + Tailwind + Cloudflare Pages, with EN/KR i18n at `oclixlabs.xyz`), the Mermaid architecture diagrams, and co-authored the v0.1 lite whitepaper (45 pages) — covering the Phase 1/2/3 architecture, the directional tokenomics framework with the §4.0 founding principle (zero team and zero investor genesis allocation), the multi-jurisdiction regulatory framing, the §3.6 composability primitive thesis, the §10.8 fork-resistance moat analysis, and the §11 vision. He runs Korean retail community distribution and bilingual product positioning. At Yonsei BAY Blockchain Society, his focus is the intersection of crypto product strategy, public-good narrative design, and the Korean retail RWA market.

---

## 김현우 (Kim Hyunwoo) — English + Research + Video + Docs

- **Role**: Native English speaker (Founder video main presenter), Research lead, Video production, Documentation, Whitepaper co-author
- **Responsibilities**: Founder video script + recording + editing, Devfolio application English drafts, Whitepaper English review + cross-section narrative consistency, primary research (`.research/incident-forensics-moonwell.md`, `.research/competitor-architecture.md`)
- **Department**: _[TODO: 본인 채우기]_
- **Year**: _[TODO: 본인 채우기]_
- **Email**: _[TODO: 본인 채우기]_
- **LinkedIn**: _[TODO: 본인 채우기]_
- **GitHub**: _[TODO: 본인 채우기]_

> Hyunwoo serves as RWA Sentinel's research lead, native-English communicator, and founder video main presenter. He authored the primary research SSOT — including the forensic analysis of nine oracle composition failures totaling ≥$50M across Base-adjacent DeFi over 18 months (`.research/incident-forensics-moonwell.md`) and the competitive architecture mapping that establishes Sentinel's retail-public-good gap (`.research/competitor-architecture.md`). He drives Devfolio English drafting, whitepaper English polish + cross-section narrative consistency, and the Founder video. At Yonsei BAY Blockchain Society, his focus is DeFi risk research, cross-source forensics, and English-first communication for crypto-native audiences.

---

## Team origin

All four members met through **Yonsei University's BAY Blockchain Society** — a student-run organization focused on blockchain research, development, and community engagement. The team has worked together on prior projects through BAY's cohort structure rather than as a hackathon ad-hoc formation, which means individual roles, decision-making patterns, and communication conventions were established before RWA Sentinel began. Individual prior projects within BAY are detailed on each member's GitHub (linked above).

## Advisors / research engagement

Phase 1 is operated solely by the founding team. Advisor engagement is planned post-Base Batches 003 acceptance. Engagement targets named in Whitepaper §3.3 and §9 include:

- **Anthias Labs** — Moonwell risk manager, first public detector of the Feb 2026 cbETH incident referenced in Whitepaper §2.1; natural Phase 2 federated operator candidate.
- **Steakhouse Financial** — DeFi risk research, RWA-specific.
- **BAY faculty mentors** — pending department-level confirmation post-acceptance.
- **Base ecosystem partners** — wallet-side and issuer-side relationships pursued post-Batches.

The advisor seats described in Whitepaper §5.1 (Phase 2 governance) are intentionally drawn from operators, RWA risk firms, and Base ecosystem stakeholders rather than from investors.

---

_Bio drafts auto-generated 2026-04-27 by Claude assistant from verifiable contributions in git log + Whitepaper §3 / §4 / §8 / §11. Personal information fields ([TODO] markers) are filled by each member before Whitepaper v0.1 PDF release. Bios may be edited by individual members at any time._
