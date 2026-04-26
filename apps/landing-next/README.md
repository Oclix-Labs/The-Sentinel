# @oclix/landing-next

Next.js 14 + Tailwind + shadcn-style components rebuild of the Sentinel landing. Replaces (or runs alongside) `apps/landing/` static HTML.

## Stack

- **Next.js 14** App Router (Server Components by default)
- **Tailwind CSS** with palette matched to the static landing (`#0052FF` primary, `#FF0420` Optimism accent)
- **shadcn/ui pattern** — components hand-rolled in `components/ui/` using `cva` + `tailwind-merge` (no shadcn CLI dependency)
- **lucide-react** icons
- **i18n** — simple dictionary (`lib/i18n.ts`), locale via `?lang=ko` query param
- **API client** — `lib/api.ts` falls back to mock data when `NEXT_PUBLIC_SENTINEL_API_URL` is unset

## Routes

| Path | What it shows |
|---|---|
| `/` | Landing — hero, problem, solution, architecture, assets, roadmap, contracts callout, footer |
| `/?lang=ko` | Korean variant of the same |
| `/dashboard` | Live prices + alerts (mock data fallback) |
| `/dashboard?lang=ko` | Korean dashboard |

## Local dev

```bash
pnpm install
pnpm --filter @oclix/landing-next dev   # localhost:5174
```

To use real API data instead of mocks:

```bash
NEXT_PUBLIC_SENTINEL_API_URL=https://rwa-sentinel-api.workers.dev pnpm --filter @oclix/landing-next dev
```

## Cloudflare Pages deploy

```bash
pnpm --filter @oclix/landing-next pages:build
pnpm --filter @oclix/landing-next deploy:prod
```

This uses `@cloudflare/next-on-pages` to convert the Next.js build into a Pages-compatible static + edge worker bundle.

**One-time setup** (권상현 or whoever owns Cloudflare):

1. Create a Cloudflare Pages project named `oclix-sentinel-landing`
2. Add custom domain `oclixlabs.xyz` in the Pages project settings
3. Add DNS records (A or CNAME) pointing the domain to Cloudflare
4. Configure `wrangler.jsonc` (or use the Pages CI integration) with `NEXT_PUBLIC_SENTINEL_API_URL` env var

## Updating content

- **Marketing copy** — edit `lib/i18n.ts` (`dict.en` / `dict.ko`)
- **Address & links** — `lib/utils.ts` (single source of truth: `ALERT_REGISTRY_ADDRESS`, `BASESCAN_*`, `GITHUB_REPO`)
- **Layout / sections** — `app/page.tsx`
- **Dashboard data shape** — `lib/api.ts` (PriceRow, AlertRow types match `apps/api` Hono response)

## Relationship to `apps/landing/`

The static HTML in `apps/landing/` is preserved as a **fallback** for the Base Batches submission window in case the Next.js rebuild hits a deployment blocker. Once `apps/landing-next/` is verified live on `oclixlabs.xyz`, the static version can be deleted (or kept as `apps/landing-static/` for reference).

## What's intentionally not yet wired

- **Webhook / Telegram subscription form** — Phase 2 feature; current landing is read-only
- **Per-asset deep dive pages** — Phase 2; landing is single-page
- **Server-side i18n routing** (e.g., `/ko/...`) — using `?lang=ko` for v1; can migrate to next-intl later
- **Analytics** — pending decision (Plausible vs Cloudflare Web Analytics)
