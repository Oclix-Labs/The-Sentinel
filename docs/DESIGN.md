---
name: Sentinel
version: alpha
description: Token system for the RWA Sentinel landing, dashboard, and future product pages. Format follows google-labs-code/design.md spec.
colors:
  primary: "#0052FF"
  on-primary: "#FFFFFF"
  primary-hover: "#0042CC"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#94A3B8"
  surface: "#FFFFFF"
  surface-alt: "#F8FAFC"
  surface-elevated: "#FFFFFF"
  border: "#E2E8F0"
  border-strong: "#CBD5E1"
  accent-success: "#10B981"
  accent-warning: "#F59E0B"
  accent-error: "#EF4444"
typography:
  display:
    fontFamily: "Source Serif 4"
    fontWeight: 600
    fontSize: 4.5rem
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: "Source Serif 4"
    fontWeight: 600
    fontSize: 3rem
    lineHeight: 1.1
    letterSpacing: -0.015em
  h2:
    fontFamily: "Source Serif 4"
    fontWeight: 600
    fontSize: 2.25rem
    lineHeight: 1.15
  h3:
    fontFamily: "Inter"
    fontWeight: 600
    fontSize: 1.5rem
    lineHeight: 1.25
  body-lg:
    fontFamily: "Inter"
    fontWeight: 400
    fontSize: 1.125rem
    lineHeight: 1.55
  body:
    fontFamily: "Inter"
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter"
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.5
  caption:
    fontFamily: "Inter"
    fontWeight: 500
    fontSize: 0.75rem
    lineHeight: 1.4
    letterSpacing: 0.06em
  mono:
    fontFamily: "JetBrains Mono"
    fontWeight: 500
    fontSize: 0.875rem
    lineHeight: 1.4
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 96px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  badge-live:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.caption}"
  badge-section:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.caption}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  stat-value:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.display}"
---

## Overview

Sentinel's visual identity is **"premium financial intelligence"** — Bloomberg Terminal / FT crypto desk in tone. Numbers and dates carry weight; ornament does not. The palette is restrained: Coinbase blue is the only chromatic accent, used sparingly for CTA and key highlights. Slate text on light surface communicates trust without coldness. Source Serif 4 for headlines (broadsheet gravitas), Inter for body, JetBrains Mono for numbers.

This spec is the SSOT for tokens used across `apps/landing-next` and any future product pages (`/protocols`, `/whitepaper-html`, dashboard polish). Tailwind config (`apps/landing-next/tailwind.config.ts`) consumes these tokens by 1:1 mapping.

## Colors

The palette is rooted in high-contrast neutrals plus a single accent.

- **Primary (`#0052FF`)** — Coinbase blue. Anchors CTA + key highlights. **Use sparingly.** Avoid as a content-area background; reserve for action and live signals.
- **Text-primary (`#0F172A`)** — Slate ink for body and headlines.
- **Text-secondary (`#475569`)** — Lower-emphasis text for sub-copy and metadata.
- **Text-muted (`#94A3B8`)** — Caption / disabled states.
- **Surface / Surface-alt** — White and the lightest slate (`#F8FAFC`) for striped section backgrounds.
- **Border (`#E2E8F0`)** — Hairline dividers between sections and cards.
- **Accent-success / warning / error** — Reserved for status badges (e.g., `onchainStatus='confirmed'` → success).

The primary blue should appear on:
- Primary CTA buttons (Hero, sticky-nav, footer-final-cta)
- Stats bar `alertCount` value
- Live indicator dots (e.g., `LIVE · Base Mainnet` badge dot)
- Section badges that need "LIVE" emphasis

It should NOT appear on:
- Section backgrounds
- Body text
- Card borders or dividers
- Mono number values (those use `text-primary`)

## Typography

Bloomberg/FT requires serif headlines paired with mono numbers — *display* type carries the broadsheet feel; *mono* numbers communicate financial precision.

- **Display (Source Serif 4 600)** — Hero title only. Tight tracking (`-0.02em`) for newspaper-density.
- **H1 / H2 (Source Serif 4 600)** — Section titles. Italic accent variant for emphasis spans (e.g., `*One block.*`).
- **H3 (Inter 600)** — Card titles, sub-section labels.
- **Body / body-lg (Inter 400)** — Default prose. `body-lg` for hero subtitle and section intros.
- **Caption (Inter 500 uppercase, tracking 0.06em)** — Section badges, labels, metadata. **Always uppercase**, applied via Tailwind `uppercase` class (not in font feature).
- **Mono (JetBrains Mono 500)** — All numerical values: prices, `alertCount`, addresses, deviationBps, dates. **Never use sans-serif for numbers.**

### Font loading

`app/layout.tsx` loads three families via `next/font/google`:
- Source Serif 4 (subset: latin)
- Inter (subset: latin, weights 400 + 500 + 600)
- JetBrains Mono (subset: latin, weight 500)

Korean copy (in `/ko` route) inherits Inter for body and adds `Pretendard` (or `system-ui` fallback) via CSS — Source Serif 4 is Latin-only and does not render Hangul. Hero title in Korean uses `Pretendard 600` at the same size as Source Serif 4 600 to maintain visual mass.

## Layout

- Container max-width: `1280px` (Tailwind `max-w-7xl`)
- Section vertical rhythm: `xl` (48px) for content padding, `xxl` (96px) for section breaks
- Hero pad-top: `160px` to account for sticky nav + visual anchor
- Mobile gutter: `24px` (Tailwind `px-6`)

## Elevation & Depth

Elevation is minimal. The Bloomberg/FT idiom uses hairline borders and subtle background shifts, not drop shadows.

- Cards: `1px solid {border}` only — no `box-shadow` by default
- Sticky nav on scroll: `1px solid {border}` bottom + opaque white background, no shadow
- Hover: increase border opacity (`{border-strong}`) — not shadow

## Shapes

- Cards: `rounded.lg` (12px)
- Buttons: `rounded.md` (8px)
- Badges: `rounded.sm` (4px)
- Three.js node geometry: rounded square (radius `rounded.md`) — matches the rest

## Components

See YAML front matter for tokens. Notes:

- `button-primary` is the canonical CTA. Same component renders Hero + sticky-nav + footer-final-cta. Variants: `button-primary-hover` for hover state.
- `badge-live` is reserved for live data signals (Hero `LIVE · Base Mainnet`, LivePreview `LIVE`, roadmap card 1 `LIVE NOW`). Other badges use `badge-section`.
- `card` is generic; section-specific variants (e.g., `stat-value` for stat numbers) inherit it with overrides.
- Variants (hover, active, disabled) are separate keys (e.g., `button-primary-hover`).

## Do's and Don'ts

**Do**:
- Use mono for every visible number, including dates and durations
- Reserve primary blue for action and live signals only
- Pair serif display with sans body (never serif body)
- Use uppercase tracking-wide caption for section badges
- Apply tight letter-spacing (`-0.02em`) to display headlines for newspaper density

**Don't**:
- Use primary blue as a background color for content areas
- Mix multiple chromatic accents on one page (e.g., do not introduce Optimism red, even though `#FF0420` was in the old palette)
- Use sans-serif for numerical values
- Use multiple section badge styles per page
- Animate primary text on first paint — motion only on user-triggered or live-data events
- Use drop shadows for card elevation — hairline borders only

## Versioning

This file is alpha. Breaking changes will be tracked in `CHANGELOG.md` with a `design:` prefix, similar to Conventional Commits scope. Adding new tokens (e.g., new component variants) is non-breaking; renaming or removing existing tokens IS breaking.

## References

- google-labs-code/design.md spec: https://github.com/google-labs-code/design.md
- Sister spec: [`docs/specs/2026-04-27-landing-redesign.md`](specs/2026-04-27-landing-redesign.md)
- Tailwind config consumer: `apps/landing-next/tailwind.config.ts`
