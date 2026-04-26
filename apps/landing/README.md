# @oclix/landing

RWA Sentinel landing page — Base Batches 003 submission.

Single-file static HTML (TailwindCSS via CDN, i18n EN/KR). Migrated from the legacy `SangHyeonKwon/Base-Grants` repo and rewritten for the current Phase 1 scope (5 assets, Cloudflare Edge architecture, Oclix Labs progressive-decentralization roadmap).

## Local preview

```bash
pnpm --filter @oclix/landing dev
# Serves at http://localhost:5173 via python3 http.server
```

Or open `index.html` directly in a browser.

## Deploy

Static file — deploy targets are open:

- **Cloudflare Pages** (recommended, consistent with Workers stack): `npx wrangler pages deploy . --project-name=the-sentinel-landing`
- **GitHub Pages**: push to `gh-pages` branch
- **Vercel / Netlify**: drop the file, no config needed

Landing deployment is owned by 이재근 (see `AGENTS.md` ownership table).

## Content source of truth

All content is driven by the repo-level SSOTs:

- Phase 1 scope + 5 assets: `README.md` and `docs/ROADMAP.md`
- Oracle coverage research: `.research/oracle-inventory-base.md`
- Incident narrative (9 failures / Moonwell cbETH): `.research/incident-forensics-moonwell.md`
- Competitor positioning: `.research/competitor-architecture.md`
- Budget + team: `docs/APPLICATION-BM-DRAFTS.md`

When these change, update the `T.en` / `T.ko` i18n blocks in `index.html` — do not invent new figures.

## Known follow-ups

- Design redesign for Base Batches final submission (owner: 이재근)
- Split into separate `index.html` / `app.js` / `styles.css` files if the file grows past the `AGENTS.md` 300-line rule during the redesign
- Swap Tailwind CDN for a real build step if we add custom components
