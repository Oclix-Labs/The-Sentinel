# Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-tone, re-copy, and restructure `apps/landing-next` from "Devfolio submission shell" to a production crypto landing site matching the Bloomberg/FT financial intelligence tone, retail-Telegram-primary funnel, and Phase 3 SENTINEL airdrop snapshot trigger defined in `docs/specs/2026-04-27-landing-redesign.md`.

**Architecture:** Section component split — each of 8 sections becomes its own file under `components/sections/`, composed by a thin `landing-content.tsx`. Three.js scene (single, restrained) lives under `components/scenes/` with R3F + drei + dynamic({ssr:false}) and a static SVG fallback. Tailwind config consumes `docs/DESIGN.md` tokens 1:1. **Live data uses Client Components with `setInterval(5000)`, not Server Component `revalidate`**, because `next.config.mjs` declares `output: 'export'` (static-export) for Cloudflare Pages — server-time revalidate would only run at build.

**Tech Stack:** Next.js 14 App Router (static export), Tailwind CSS, shadcn-pattern UI (cva + tailwind-merge), Lucide icons, Inter + Source Serif 4 + JetBrains Mono fonts via `next/font/google`, `react-three-fiber` + `@react-three/drei` for the scene, `@google/design.md` lint for token validation.

---

## Open questions resolved with spec §11 defaults

| # | Question | Default applied (matches spec §11) |
|---|---|---|
| 1 | `alertCount` endpoint shape | Client-side compute via `alerts.length` from `fetchAlerts` result. No new endpoint. |
| 2 | Premium waitlist link target | `mailto:hello@oclixlabs.xyz?subject=Premium%20waitlist` placeholder. |
| 3 | Twitter / Farcaster / Discord URLs | Placeholder constants in `lib/utils.ts` with `// TODO: confirm with 이재근` comment, defaulting to `https://x.com/oclixlabs`, `https://warpcast.com/oclixlabs`, `https://discord.gg/sentinel`. Owner can swap once accounts confirmed. |
| 4 | `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` env binding | Read in `lib/utils.ts` via `process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? 'rwa_sentinel_bot'`. Add to Cloudflare Pages dashboard env vars in deploy step (PR 1 follow-up note). |
| 5 | Three.js scene art direction | 3 oracle nodes (Chainlink, Pyth, RedStone) on left → Sentinel hub center → AlertRegistry on right. Subtle pulsing edges, low-saturation off-white background, primary blue accents only on active edges. Static SVG fallback uses identical node layout. |

---

## File structure (PR 1 + PR 2 combined)

```
apps/landing-next/
├─ app/
│  ├─ layout.tsx                                MODIFY (font swap + meta polish)
│  ├─ page.tsx                                  unchanged (renders <LandingContent locale="en"/>)
│  ├─ ko/page.tsx                               unchanged
│  ├─ dashboard/page.tsx                        unchanged
│  ├─ ko/dashboard/page.tsx                     unchanged
│  └─ globals.css                               MODIFY (cleanup, add tokens via @theme)
├─ components/
│  ├─ landing-content.tsx                       REWRITE (composition only, ~30 lines)
│  ├─ dashboard-content.tsx                     MODIFY (tone polish — Badge variant, copy align)
│  ├─ site-nav.tsx                              REWRITE (sticky+shadow on scroll, Resources dropdown, CTA)
│  ├─ contracts-callout.tsx                     REPLACED by sections/TrustSignals.tsx (deleted file)
│  ├─ locale-switcher.tsx                       unchanged
│  ├─ section-badge.tsx                         CREATE (small reusable badge for section labels)
│  ├─ sections/
│  │  ├─ Hero.tsx                               CREATE
│  │  ├─ Stats.tsx                              CREATE (client, fetch+setInterval)
│  │  ├─ Problem.tsx                            CREATE
│  │  ├─ HowItWorks.tsx                         CREATE (static SVG in PR 1, R3F in PR 2)
│  │  ├─ LivePreview.tsx                        CREATE (PR 2 only — client, fetch+setInterval)
│  │  ├─ Roadmap.tsx                            CREATE
│  │  ├─ TrustSignals.tsx                       CREATE (replaces contracts-callout)
│  │  └─ FooterFinalCta.tsx                     CREATE
│  ├─ scenes/
│  │  ├─ OracleNetworkSvg.tsx                   CREATE (PR 1 — static SVG, used as PR1 placeholder + PR2 fallback)
│  │  └─ OracleNetworkScene.tsx                 CREATE (PR 2 — R3F + drei, dynamic SSR-off)
│  └─ ui/
│     ├─ button.tsx                             MODIFY (rounded-full → rounded-md, primary hover color)
│     ├─ card.tsx                               MODIFY (remove hover translate/shadow, hairline borders only)
│     └─ badge.tsx                              MODIFY (add 'live' variant + 'section' variant)
├─ lib/
│  ├─ i18n.ts                                   REWRITE (full en + ko dict for new sections)
│  ├─ utils.ts                                  MODIFY (add TELEGRAM_BOT_LINK, social link constants)
│  └─ api.ts                                    unchanged (existing fetchPrices / fetchAlerts reused)
├─ tailwind.config.ts                           REWRITE (DESIGN.md token sync)
├─ package.json                                 MODIFY in PR 2 (three, @react-three/fiber, @react-three/drei)
└─ next.config.mjs                              unchanged (`output: 'export'` retained)
```

---

# PHASE 1 — PR 1: Foundation + sections 1–4 + 6–8 + nav + DESIGN.md sync

**Branch:** `feat/landing-redesign-pr1`
**PR target:** `dev`
**Estimated time:** ~9.5h

## Task 1: Branch setup + DESIGN.md lint

**Files:** none modified yet (validation only)

- [ ] **Step 1:** Create feature branch from latest `dev`

```bash
git fetch origin
git checkout dev
git pull --ff-only
git checkout -b feat/landing-redesign-pr1
```

- [ ] **Step 2:** Validate DESIGN.md against google-labs-code/design.md spec

```bash
cd /Users/mojin-yeong/base-grant/The-Sentinel
npx @google/design.md@latest lint docs/DESIGN.md
```

Expected: `summary.errors == 0`. Warnings about contrast ratio are OK.

- [ ] **Step 3:** No commit yet — proceed to Task 2.

## Task 2: Tailwind config + globals.css token sync

Adapt Tailwind to consume DESIGN.md tokens 1:1. Drop the unused `op-red`, `dark`, `surface` (keep `surface-alt`).

**Files:**
- Modify: `apps/landing-next/tailwind.config.ts`
- Modify: `apps/landing-next/app/globals.css`

- [ ] **Step 1:** Replace `tailwind.config.ts` content

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Source: docs/DESIGN.md (1:1)
        primary: {
          DEFAULT: '#0052FF',
          hover: '#0042CC',
        },
        'on-primary': '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
        },
        'border-strong': '#CBD5E1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        // Tokens consumed via next/font CSS variables set in app/layout.tsx
        serif: ['var(--font-source-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        kohero: ['var(--font-pretendard)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: {
        // Source: docs/DESIGN.md typography
        display: '-0.02em',
        h1: '-0.015em',
        caps: '0.06em',
      },
      spacing: {
        // Names mirror DESIGN.md spacing scale
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '96px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2:** Replace `app/globals.css` content (drop blue-glow, hover translate cards)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white text-ink antialiased;
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 rounded-sm;
  }
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
    border-radius: 4px;
  }
}

@layer components {
  .prose-title {
    letter-spacing: -0.02em;
  }

  /* Hairline-only card. No hover translate, no shadow. */
  .card-hairline {
    @apply bg-white border border-slate-200 rounded-lg transition-colors hover:border-border-strong;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

- [ ] **Step 3:** Verify build still compiles

```bash
pnpm --filter @oclix/landing-next typecheck
pnpm --filter @oclix/landing-next exec next build 2>&1 | tail -20
```

Expected: typecheck exit 0; build may flag missing token references in current `landing-content.tsx` — that's fine because we'll rewrite it.

- [ ] **Step 4:** Commit

```bash
git add apps/landing-next/tailwind.config.ts apps/landing-next/app/globals.css
git commit -m "$(cat <<'EOF'
refactor(landing-next): sync Tailwind config to DESIGN.md tokens

- Replace ad-hoc palette (op-red, dark, surface, hover translate) with
  DESIGN.md token names (primary/hover, ink, surface, border-strong,
  success/warning/error).
- Add CSS variable hooks for next/font (--font-source-serif,
  --font-inter, --font-jetbrains-mono, --font-pretendard).
- Drop blue-glow and hover translate card styles — DESIGN.md mandates
  hairline-only elevation.
- Add named spacing scale (xs/sm/md/lg/xl/xxl) matching DESIGN.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

## Task 3: Font swap in layout.tsx

Switch from Newsreader / IBM Plex Mono via Google Fonts CSS link to Source Serif 4 / JetBrains Mono / Pretendard via `next/font/google` with CSS variables (already wired by Task 2).

**Files:**
- Modify: `apps/landing-next/app/layout.tsx`

- [ ] **Step 1:** Replace `app/layout.tsx`

```tsx
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  variable: '--font-source-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'RWA Sentinel — The public watchdog for tokenized RWAs on Base',
  description:
    'Cross-oracle deviation alerts for Base RWAs. Free Telegram alerts, on-chain proof, MIT open source. Live now on Base Mainnet.',
  openGraph: {
    title: 'RWA Sentinel — The public watchdog for tokenized RWAs on Base',
    description: 'Cross-oracle deviation alerts for Base RWAs. Free.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RWA Sentinel — Cross-oracle deviation alerts for Base RWAs',
    description: 'Free Telegram alerts. On-chain proof.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Pretendard via CDN for Korean hero (Source Serif 4 is Latin-only) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <style>{`:root { --font-pretendard: 'Pretendard Variable', 'Pretendard'; }`}</style>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2:** Verify

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/app/layout.tsx
git commit -m "refactor(landing-next): swap to Source Serif 4 + Inter + JetBrains Mono via next/font

DESIGN.md mandates Source Serif 4 for headlines, Inter for body,
JetBrains Mono for numerical values. Old Newsreader + IBM Plex Mono
are dropped. Pretendard added via CDN for Korean hero (Source Serif 4
is Latin-only).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 4: UI primitives — Card + Button + Badge polish

Drop hover translate / shadow on card (DESIGN.md: hairline only). Switch button rounded-full → rounded-md. Add `live` and `section` badge variants.

**Files:**
- Modify: `apps/landing-next/components/ui/card.tsx`
- Modify: `apps/landing-next/components/ui/button.tsx`
- Modify: `apps/landing-next/components/ui/badge.tsx`

- [ ] **Step 1:** Replace `components/ui/card.tsx`

```tsx
import { cn } from '@/lib/utils';
import * as React from 'react';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-slate-200 bg-white transition-colors hover:border-border-strong',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-3', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-sans font-semibold text-base text-ink', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-ink-secondary mt-1', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-3', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';
```

- [ ] **Step 2:** Replace `components/ui/button.tsx`

```tsx
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        outline: 'border border-slate-200 bg-white text-ink hover:border-border-strong',
        ghost: 'text-ink hover:bg-slate-100',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-10 px-5',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
```

- [ ] **Step 3:** Replace `components/ui/badge.tsx`

```tsx
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-mono font-medium uppercase tracking-caps',
  {
    variants: {
      variant: {
        live: 'bg-primary text-on-primary',
        section: 'bg-surface-alt text-ink-secondary',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        muted: 'bg-slate-100 text-ink-secondary',
      },
    },
    defaultVariants: { variant: 'section' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

- [ ] **Step 4:** Note that this changes the API for callers — `variant="primary"` (old) → `variant="live"` or `variant="section"` (new); `variant="amber"` → `variant="warning"`. Both `landing-content.tsx` (will be rewritten in Task 14) and `dashboard-content.tsx` (Task 22) consume Badge. We will update `dashboard-content.tsx` in Task 22 to keep PR 1 changes localized to landing.

For Phase 1 quick-fix to keep build green, run a one-off rename on `dashboard-content.tsx`:

```bash
sed -i '' 's/variant="amber"/variant="warning"/g; s/variant="primary"/variant="live"/g' \
  apps/landing-next/components/dashboard-content.tsx
```

- [ ] **Step 5:** Verify build

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 6:** Commit

```bash
git add apps/landing-next/components/ui/ apps/landing-next/components/dashboard-content.tsx
git commit -m "refactor(landing-next): align Card/Button/Badge with DESIGN.md tokens

- Card: hairline border only (no hover translate, no shadow). Use rounded-lg.
- Button: rounded-md (was rounded-full); primary uses primary-hover token.
- Badge: rename variants — primary→live, amber→warning, add 'section'.
  Switch to rounded-sm + tracking-caps + lower-emphasis 'section' look
  for non-live tags. Update dashboard-content.tsx call sites.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 5: lib/utils.ts — add Telegram + social link constants

**Files:**
- Modify: `apps/landing-next/lib/utils.ts`

- [ ] **Step 1:** Append constants to `lib/utils.ts`

```tsx
import type { Locale } from '@/lib/i18n';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ALERT_REGISTRY_ADDRESS = '0x79b5d74A301079c86D13eb71e2787852F403F876';

export const BASESCAN_MAINNET = `https://basescan.org/address/${ALERT_REGISTRY_ADDRESS}#code`;
export const BASESCAN_SEPOLIA = `https://sepolia.basescan.org/address/${ALERT_REGISTRY_ADDRESS}#code`;
export const GITHUB_REPO = 'https://github.com/Oclix-Labs/The-Sentinel';

// Telegram bot link — env-driven, fallback to default username.
const TELEGRAM_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? 'rwa_sentinel_bot';
export const TELEGRAM_BOT_LINK = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

// Premium waitlist placeholder — Phase 1.5 will replace with real form.
export const PREMIUM_WAITLIST_LINK =
  'mailto:hello@oclixlabs.xyz?subject=Premium%20waitlist';

// Social links — TODO: confirm with 이재근 once accounts are active.
export const TWITTER_URL = 'https://x.com/oclixlabs';
export const FARCASTER_URL = 'https://warpcast.com/oclixlabs';
export const DISCORD_URL = 'https://discord.gg/sentinel';

// Whitepaper / Docs / Research / Audit anchors.
// Docs/Research/Audit point to GitHub paths until separate sites exist.
export const WHITEPAPER_URL = `${GITHUB_REPO}/blob/main/docs/WHITEPAPER-v0.1-SKELETON.md`;
export const DOCS_URL = `${GITHUB_REPO}/tree/main/docs`;
export const RESEARCH_URL = `${GITHUB_REPO}/tree/main/.research`;
export const AUDIT_URL = `${GITHUB_REPO}/tree/main/docs#audit`; // Phase 2 placeholder anchor

export function shortenAddress(addr: string, chars = 6): string {
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}

export function localePath(locale: Locale, subpath = ''): string {
  const clean = subpath.replace(/^\//, '').replace(/\/$/, '');
  const base = locale === 'ko' ? '/ko' : '';
  if (!clean) return `${base}/`;
  return `${base}/${clean}/`;
}
```

- [ ] **Step 2:** Verify

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/lib/utils.ts
git commit -m "feat(landing-next): add Telegram bot + social + resource link constants

Pre-emptive constants for the redesign — TELEGRAM_BOT_LINK uses env
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME with 'rwa_sentinel_bot' fallback;
WHITEPAPER/DOCS/RESEARCH/AUDIT point to GitHub anchors; Twitter/
Farcaster/Discord placeholders flagged for 이재근 confirmation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 6: Rewrite lib/i18n.ts — full en + ko dict for new sections

**Files:**
- Modify: `apps/landing-next/lib/i18n.ts`

- [ ] **Step 1:** Replace `lib/i18n.ts` content

```tsx
export type Locale = 'en' | 'ko';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: Locale[] = ['en', 'ko'];

export type Dict = {
  nav: {
    dashboard: string;
    coverage: string;
    roadmap: string;
    resources: string;
    whitepaper: string;
    docs: string;
    research: string;
    audit: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: {
    failuresValue: string;
    failuresLabel: string;
    lostValue: string;
    lostLabel: string;
    alertsLabel: string;
    licenseValue: string;
    licenseLabel: string;
  };
  problem: { badge: string; title: string; body: string };
  howItWorks: {
    badge: string;
    titlePart1: string;
    titleAccent: string;
    body: string;
    nodes: { chainlink: string; pyth: string; redstone: string; sentinel: string; registry: string };
  };
  livePreview: {
    badge: string;
    title: string;
    subtitle: string;
    pricesTitle: string;
    alertsTitle: string;
    dashboardLink: string;
    noData: string;
  };
  roadmap: {
    badge: string;
    titlePart1: string;
    titleAccent1: string;
    titlePart2: string;
    cards: {
      tag: string;
      bullets: string[];
      disclaimer?: string;
    }[];
  };
  trust: {
    title: string;
    networkLabel: string;
    licenseLine: string;
    auditLine: string;
    githubCta: string;
  };
  footer: {
    finalCtaCopy: string;
    finalCtaButton: string;
    brandTagline: string;
    columnProduct: string;
    columnResources: string;
    columnNetwork: string;
    productLinks: { telegram: string; dashboard: string; premium: string };
    networkLinks: {
      mainnet: string;
      status: string;
      twitter: string;
      farcaster: string;
      discord: string;
    };
    rights: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    pricesTitle: string;
    alertsTitle: string;
    noData: string;
    asset: string;
    oracle: string;
    price: string;
    deviation: string;
    time: string;
    tx: string;
    refresh: string;
    mockBadge: string;
  };
};

export const dict: Record<Locale, Dict> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      coverage: 'Coverage',
      roadmap: 'Roadmap',
      resources: 'Resources',
      whitepaper: 'Whitepaper',
      docs: 'Docs',
      research: 'Research',
      audit: 'Audit',
      cta: 'Get Telegram alerts',
    },
    hero: {
      badge: 'LIVE · Base Mainnet',
      title: '$50M lost in 18 months across 9 oracle failures.',
      subtitle:
        'Sentinel saw all of them. Get Telegram alerts before the next one — free.',
      ctaPrimary: 'Get Telegram alerts',
      ctaSecondary: 'View live dashboard',
    },
    stats: {
      failuresValue: '9',
      failuresLabel: 'oracle failures · 18 months',
      lostValue: '$50M+',
      lostLabel: 'lost in those 9',
      alertsLabel: 'Sentinel alerts on Base Mainnet',
      licenseValue: 'MIT',
      licenseLabel: 'open-source forever',
    },
    problem: {
      badge: 'WHY',
      title: 'Nine oracle failures. Zero retail watchdogs.',
      body: "Over the past 18 months, at least nine oracle-composition or hardcoded-oracle failures have caused ≥$50M in losses across Base-adjacent DeFi. Moonwell's cbETH market lost $2.68M to a single hardcoded oracle — caught only after 181 borrowers were liquidated. Every failure would have been visible to a multi-oracle cross-check in the same block. None had one watching. Until now.",
    },
    howItWorks: {
      badge: 'HOW',
      titlePart1: 'Three oracles. ',
      titleAccent: 'One block.',
      body: "Sentinel polls Chainlink, Pyth, and RedStone every minute. When any pair deviates beyond the asset's threshold, an alert is published to a permanent on-chain log on Base — and to your Telegram, in seconds.",
      nodes: {
        chainlink: 'Chainlink',
        pyth: 'Pyth',
        redstone: 'RedStone',
        sentinel: 'Sentinel',
        registry: 'AlertRegistry · Base Mainnet',
      },
    },
    livePreview: {
      badge: 'LIVE',
      title: 'Live oracle data.',
      subtitle: 'Latest prices and alerts. Refreshed every 5 seconds.',
      pricesTitle: 'Latest prices',
      alertsTitle: 'Recent alerts',
      dashboardLink: 'View full dashboard',
      noData: 'No data yet — the network is healthy.',
    },
    roadmap: {
      badge: "WHAT'S NEXT",
      titlePart1: '',
      titleAccent1: 'Live',
      titlePart2: ' on Base. Federated next. Permissionless from 2027.',
      cards: [
        {
          tag: 'LIVE NOW · Q2 2026',
          bullets: [
            '5 assets cross-checked',
            'Mainnet AlertRegistry verified',
            'Free Telegram alerts',
          ],
        },
        {
          tag: 'Q4 2026 → Q1 2027',
          bullets: [
            '2–3 federated operators',
            '10–15 assets',
            'Premium SLA tier',
          ],
        },
        {
          tag: 'Q2 2027+',
          bullets: [
            'Permissionless DAO',
            'SENTINEL utility token',
            'Community airdrop snapshot includes Phase 1 subscribers',
          ],
          disclaimer:
            'Designed, not issued — token is conditional on Phase 3 launch with utility-token classification and legal opinion (multiple jurisdictions: US, KR, SG, KY).',
        },
      ],
    },
    trust: {
      title: 'Verified on Base Mainnet',
      networkLabel: 'AlertRegistry',
      licenseLine: 'MIT · Open source forever',
      auditLine: 'Audit scheduled Q1 2027',
      githubCta: 'View on GitHub',
    },
    footer: {
      finalCtaCopy: 'Get Telegram alerts before the next failure.',
      finalCtaButton: 'Get Telegram alerts',
      brandTagline: 'The public watchdog for tokenized RWAs on Base.',
      columnProduct: 'Product',
      columnResources: 'Resources',
      columnNetwork: 'Network',
      productLinks: {
        telegram: 'Get Telegram alerts',
        dashboard: 'Live dashboard',
        premium: 'Premium waitlist',
      },
      networkLinks: {
        mainnet: 'AlertRegistry on Basescan',
        status: 'Status',
        twitter: 'Twitter',
        farcaster: 'Farcaster',
        discord: 'Discord',
      },
      rights: '© 2026 Oclix Labs · MIT License',
    },
    dashboard: {
      title: 'Live dashboard',
      subtitle: 'Latest 5 prices and 5 alerts. Mock data shown when API is unavailable.',
      pricesTitle: 'Latest prices (per oracle)',
      alertsTitle: 'Recent alerts',
      noData: 'No data yet — the network is healthy.',
      asset: 'Asset',
      oracle: 'Oracle',
      price: 'Price',
      deviation: 'Deviation',
      time: 'Time',
      tx: 'Tx',
      refresh: 'Refresh',
      mockBadge: 'Showing mock data',
    },
  },
  ko: {
    nav: {
      dashboard: '대시보드',
      coverage: '커버리지',
      roadmap: '로드맵',
      resources: '리소스',
      whitepaper: '백서',
      docs: '문서',
      research: '리서치',
      audit: '감사',
      cta: '텔레그램 알림 받기',
    },
    hero: {
      badge: 'LIVE · Base 메인넷',
      title: '오라클 사고 9건. 18개월. 손실 $50M.',
      subtitle:
        'Sentinel은 전부 잡았습니다. 다음 사고 전 무료 텔레그램 알림을 받으세요.',
      ctaPrimary: '텔레그램 알림 받기',
      ctaSecondary: '라이브 대시보드 보기',
    },
    stats: {
      failuresValue: '9',
      failuresLabel: '오라클 사고 · 18개월',
      lostValue: '$50M+',
      lostLabel: '해당 9건의 손실',
      alertsLabel: 'Base 메인넷 Sentinel 알림',
      licenseValue: 'MIT',
      licenseLabel: '영구 오픈소스',
    },
    problem: {
      badge: '왜 만들었나',
      title: '오라클 사고 9건. 그러나 일반 사용자를 위한 감시견은 0.',
      body: '지난 18개월간 Base 인접 DeFi에서 발생한 오라클 구성 결함 또는 하드코딩 사고는 최소 9건, 손실 합계는 ≥$50M에 달합니다. 가장 최근 Moonwell cbETH 시장은 단일 하드코딩 오라클로 인해 $2.68M을 잃었고, 그 사고는 181명의 차용자가 청산된 후에야 인지됐습니다. 이 모든 사고는 같은 블록에서 멀티-오라클 cross-check 한 번이면 catch 가능했습니다. 하지만 누구도 그것을 보고 있지 않았습니다. 지금까지는.',
    },
    howItWorks: {
      badge: '작동 방식',
      titlePart1: '오라클 셋. ',
      titleAccent: '한 블록.',
      body: 'Sentinel은 Chainlink, Pyth, RedStone을 매분 polling합니다. 어느 쌍이라도 자산별 임계값을 넘어 deviation을 보이면, Base 위 영구 on-chain 로그에 alert가 기록되고 동시에 당신의 텔레그램으로 수 초 안에 알림이 갑니다.',
      nodes: {
        chainlink: 'Chainlink',
        pyth: 'Pyth',
        redstone: 'RedStone',
        sentinel: 'Sentinel',
        registry: 'AlertRegistry · Base 메인넷',
      },
    },
    livePreview: {
      badge: 'LIVE',
      title: '실시간 오라클 데이터.',
      subtitle: '최신 가격과 알림. 5초마다 갱신.',
      pricesTitle: '최신 가격',
      alertsTitle: '최근 알림',
      dashboardLink: '전체 대시보드 보기',
      noData: '데이터 없음 — 네트워크 정상.',
    },
    roadmap: {
      badge: '다음 단계',
      titlePart1: 'Base 위 ',
      titleAccent1: 'Live',
      titlePart2: '. 다음은 federated. 2027년부터 permissionless.',
      cards: [
        {
          tag: 'LIVE NOW · Q2 2026',
          bullets: [
            '5 자산 cross-check',
            '메인넷 AlertRegistry 검증 완료',
            '무료 텔레그램 알림',
          ],
        },
        {
          tag: 'Q4 2026 → Q1 2027',
          bullets: [
            '2–3 federated 오퍼레이터',
            '10–15 자산',
            'Premium SLA tier',
          ],
        },
        {
          tag: 'Q2 2027+',
          bullets: [
            'Permissionless DAO',
            'SENTINEL utility 토큰',
            'Phase 1 구독자/기여자 대상 커뮤니티 airdrop snapshot',
          ],
          disclaimer:
            '설계는 완료, 발행은 미정 — 토큰은 Phase 3 launch와 utility-token 분류 및 다수 법역(US/KR/SG/KY) legal opinion 조건부로만 발행됩니다.',
        },
      ],
    },
    trust: {
      title: 'Base 메인넷 검증 완료',
      networkLabel: 'AlertRegistry',
      licenseLine: 'MIT · 영구 오픈소스',
      auditLine: '2027 Q1 감사 예정',
      githubCta: 'GitHub에서 보기',
    },
    footer: {
      finalCtaCopy: '다음 사고 전 텔레그램 알림을 받으세요.',
      finalCtaButton: '텔레그램 알림 받기',
      brandTagline: 'Base 위 토큰화된 RWA를 위한 공공 감시견.',
      columnProduct: '제품',
      columnResources: '리소스',
      columnNetwork: '네트워크',
      productLinks: {
        telegram: '텔레그램 알림 받기',
        dashboard: '라이브 대시보드',
        premium: 'Premium 대기명단',
      },
      networkLinks: {
        mainnet: 'Basescan AlertRegistry',
        status: '상태',
        twitter: 'Twitter',
        farcaster: 'Farcaster',
        discord: 'Discord',
      },
      rights: '© 2026 Oclix Labs · MIT License',
    },
    dashboard: {
      title: '라이브 대시보드',
      subtitle: '최신 가격 5개 + 알림 5개. API 미가용 시 mock 데이터.',
      pricesTitle: '최신 가격 (오라클별)',
      alertsTitle: '최근 알림',
      noData: '데이터 없음 — 네트워크 정상.',
      asset: '자산',
      oracle: '오라클',
      price: '가격',
      deviation: '편차',
      time: '시간',
      tx: 'Tx',
      refresh: '새로고침',
      mockBadge: 'Mock 데이터 (API 미연결)',
    },
  },
};

export function getDict(locale: Locale): Dict {
  return dict[locale] ?? dict[DEFAULT_LOCALE];
}
```

- [ ] **Step 2:** Verify typecheck (current `landing-content.tsx` will fail — that's expected, will rewrite next)

```bash
pnpm --filter @oclix/landing-next typecheck 2>&1 | tail -30
```

Expected: errors only in `landing-content.tsx` — old keys (e.g., `t.solution`, `t.arch`, `t.contracts.label`) are gone. We'll fix this in Task 14 (composition).

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/lib/i18n.ts
git commit -m "refactor(landing-next): rewrite i18n dict for new section structure

Replaces old Devfolio-shaped dict (Overview/Architecture/Solution
narrative) with 8-section production structure per
docs/specs/2026-04-27-landing-redesign.md §5: hero / stats / problem /
howItWorks / livePreview / roadmap / trust / footer. Both en and ko
finalized to Bloomberg/FT financial intelligence tone (no exclamation
marks, no dev-meta jargon, mono numbers, dates as Q-prefixed).

landing-content.tsx will fail typecheck until Task 14 rewrites it as
composition.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 7: Section Badge primitive

A small reusable component used by every section.

**Files:**
- Create: `apps/landing-next/components/section-badge.tsx`

- [ ] **Step 1:** Create file

```tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SectionBadge({
  children,
  className,
  variant = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'section' | 'live';
}) {
  return (
    <Badge variant={variant} className={cn('mb-3', className)}>
      {children}
    </Badge>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/section-badge.tsx
git commit -m "feat(landing-next): add SectionBadge primitive for consistent section labels

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 8: Hero section

**Files:**
- Create: `apps/landing-next/components/sections/Hero.tsx`

- [ ] **Step 1:** Create the component

```tsx
import { Button } from '@/components/ui/button';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';
import { TELEGRAM_BOT_LINK, localePath } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale).hero;
  const isKo = locale === 'ko';

  return (
    <section className="relative pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionBadge variant="live" className="mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-on-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-primary" />
          </span>
          {t.badge}
        </SectionBadge>

        <h1
          className={`${isKo ? 'font-kohero' : 'font-serif'} text-5xl md:text-7xl font-semibold leading-[1.05] mb-6 tracking-display text-ink`}
        >
          {t.title}
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-ink-secondary mb-10 leading-relaxed">
          {t.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary">
              {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <Link href={localePath(locale, 'dashboard')}>
            <Button size="lg" variant="outline">
              {t.ctaSecondary}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/Hero.tsx
git commit -m "feat(landing-next): add Hero section

- Centered hero text with live badge (animated pulse) + dual CTA
- Korean uses font-kohero (Pretendard), English uses font-serif
  (Source Serif 4) — accommodates Korean Hangul which Source Serif 4
  doesn't render.
- Primary CTA links to TELEGRAM_BOT_LINK (env-driven), secondary to
  /dashboard.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 9: Stats section (client — fetch alertCount)

**Files:**
- Create: `apps/landing-next/components/sections/Stats.tsx`

- [ ] **Step 1:** Create file

```tsx
'use client';

import { fetchAlerts } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export function Stats({ locale }: { locale: Locale }) {
  const t = getDict(locale).stats;
  const [alertCount, setAlertCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const result = await fetchAlerts();
        if (cancelled) return;
        setAlertCount(result.alerts.length);
      } catch {
        if (cancelled) return;
        setAlertCount(null);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  const items = [
    { value: t.failuresValue, label: t.failuresLabel },
    { value: t.lostValue, label: t.lostLabel },
    {
      value: alertCount === null ? '—' : String(alertCount),
      label: t.alertsLabel,
    },
    { value: t.licenseValue, label: t.licenseLabel },
  ];

  return (
    <section className="py-12 border-y border-slate-100 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <div className="font-mono text-4xl md:text-5xl font-semibold text-primary">
              {item.value}
            </div>
            <div className="text-xs uppercase tracking-caps text-ink-muted mt-2 font-mono">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/Stats.tsx
git commit -m "feat(landing-next): add Stats section with live alertCount

Client component because next.config.mjs uses output: 'export' (static
export for Cloudflare Pages); Server Component revalidate would only
run at build. setInterval(5000) polls fetchAlerts() on the client and
renders alerts.length as the live alertCount stat.

Mono font for all 4 stats per DESIGN.md (numbers in mono).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 10: Problem section

**Files:**
- Create: `apps/landing-next/components/sections/Problem.tsx`

- [ ] **Step 1:** Create file

```tsx
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';

export function Problem({ locale }: { locale: Locale }) {
  const t = getDict(locale).problem;

  return (
    <section id="problem" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <SectionBadge>{t.badge}</SectionBadge>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-6 text-ink">
          {t.title}
        </h2>
        <p className="text-lg text-ink-secondary leading-relaxed">{t.body}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/Problem.tsx
git commit -m "feat(landing-next): add Problem section

Single max-w-4xl column. Bloomberg/FT body length — one paragraph
covering 9 incidents / Moonwell cbETH / 'Until now' close.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 11: OracleNetworkSvg (static, used as PR1 placeholder + PR2 fallback)

**Files:**
- Create: `apps/landing-next/components/scenes/OracleNetworkSvg.tsx`

- [ ] **Step 1:** Create file

```tsx
import type { Locale } from '@/lib/i18n';
import { getDict } from '@/lib/i18n';

export function OracleNetworkSvg({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks.nodes;
  return (
    <div
      className="rounded-xl border border-slate-200 bg-surface-alt p-8 md:p-12"
      role="img"
      aria-label="Three oracles feeding into Sentinel, then to Base Mainnet AlertRegistry"
    >
      <svg
        viewBox="0 0 800 280"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Edges */}
        <line x1="180" y1="60" x2="400" y2="140" stroke="#0052FF" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="180" y1="140" x2="400" y2="140" stroke="#0052FF" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="180" y1="220" x2="400" y2="140" stroke="#0052FF" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="400" y1="140" x2="640" y2="140" stroke="#0052FF" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Oracle nodes (left) */}
        <g>
          <rect x="80" y="40" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="170" y="65" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="14" fontWeight="500" fill="#0F172A">
            {t.chainlink}
          </text>
        </g>
        <g>
          <rect x="80" y="120" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="170" y="145" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="14" fontWeight="500" fill="#0F172A">
            {t.pyth}
          </text>
        </g>
        <g>
          <rect x="80" y="200" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="170" y="225" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="14" fontWeight="500" fill="#0F172A">
            {t.redstone}
          </text>
        </g>

        {/* Sentinel hub (center) */}
        <g>
          <rect x="340" y="115" width="120" height="50" rx="8" fill="#0052FF" />
          <text x="400" y="146" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="14" fontWeight="600" fill="#FFFFFF">
            {t.sentinel}
          </text>
        </g>

        {/* AlertRegistry (right) */}
        <g>
          <rect x="540" y="115" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#0052FF" strokeWidth="2" />
          <text x="640" y="146" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="12" fontWeight="500" fill="#0F172A">
            {t.registry}
          </text>
        </g>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/scenes/OracleNetworkSvg.tsx
git commit -m "feat(landing-next): add OracleNetworkSvg static scene

Static SVG showing 3 oracles → Sentinel hub → AlertRegistry pipeline.
Used as the PR 1 placeholder for the HowItWorks scene. In PR 2 it
becomes the reduced-motion / mobile fallback for the R3F scene.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 12: HowItWorks section (PR 1 — uses static SVG)

**Files:**
- Create: `apps/landing-next/components/sections/HowItWorks.tsx`

- [ ] **Step 1:** Create file

```tsx
import { OracleNetworkSvg } from '@/components/scenes/OracleNetworkSvg';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks;

  return (
    <section id="how-it-works" className="py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge>{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-6 text-ink">
            {t.titlePart1}
            <span className="italic text-primary">{t.titleAccent}</span>
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">{t.body}</p>
        </div>
        <OracleNetworkSvg locale={locale} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/HowItWorks.tsx
git commit -m "feat(landing-next): add HowItWorks section with static SVG scene

PR 1 uses the static SVG. PR 2 will replace with R3F + drei animated
scene (with this SVG as reduced-motion / mobile fallback).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 13: Roadmap section (timeline cards)

**Files:**
- Create: `apps/landing-next/components/sections/Roadmap.tsx`

- [ ] **Step 1:** Create file

```tsx
import { SectionBadge } from '@/components/section-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Locale, getDict } from '@/lib/i18n';

export function Roadmap({ locale }: { locale: Locale }) {
  const t = getDict(locale).roadmap;

  return (
    <section id="roadmap" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionBadge>{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-4 text-ink">
            {t.titlePart1}
            <span className="italic text-primary">{t.titleAccent1}</span>
            {t.titlePart2}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.cards.map((card, i) => (
            <Card key={card.tag} className={i === 2 ? 'border-primary/30' : ''}>
              <CardHeader>
                <Badge variant={i === 0 ? 'live' : 'section'} className="mb-3 w-fit">
                  {card.tag}
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-ink-secondary mb-4">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-primary mt-1 flex-shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {card.disclaimer && (
                  <p className="text-[11px] text-ink-muted leading-relaxed pt-3 border-t border-slate-100">
                    {card.disclaimer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/Roadmap.tsx
git commit -m "feat(landing-next): add Roadmap section with 3 timeline cards

Phase wording is dropped per spec §5.6 — uses 'LIVE NOW · Q2 2026' /
'Q4 2026 → Q1 2027' / 'Q2 2027+'. Card 3 is highlighted (border-primary/30)
and includes the securities-safe disclaimer about token issuance being
conditional on Phase 3 launch with utility-token classification and
legal opinion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 14: TrustSignals section (replaces ContractsCallout)

**Files:**
- Create: `apps/landing-next/components/sections/TrustSignals.tsx`
- Delete: `apps/landing-next/components/contracts-callout.tsx`

- [ ] **Step 1:** Create `sections/TrustSignals.tsx`

```tsx
import {
  ALERT_REGISTRY_ADDRESS,
  BASESCAN_MAINNET,
  GITHUB_REPO,
  shortenAddress,
} from '@/lib/utils';
import { type Locale, getDict } from '@/lib/i18n';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function TrustSignals({ locale }: { locale: Locale }) {
  const t = getDict(locale).trust;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-lg border border-slate-200 bg-surface-alt p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-caps text-primary">
                  {t.title}
                </span>
              </div>
              <div className="text-sm text-ink-secondary mb-1">
                <span className="font-mono">{t.networkLabel}</span>
                <span className="mx-2 text-ink-muted">·</span>
                <a
                  href={BASESCAN_MAINNET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-semibold text-ink hover:text-primary inline-flex items-center gap-1"
                >
                  {shortenAddress(ALERT_REGISTRY_ADDRESS)}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <div className="text-sm text-ink-secondary">{t.licenseLine}</div>
              <div className="text-sm text-ink-muted">{t.auditLine}</div>
            </div>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 bg-white text-sm font-semibold text-ink hover:border-border-strong"
            >
              {t.githubCta}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Delete `contracts-callout.tsx`

```bash
rm apps/landing-next/components/contracts-callout.tsx
```

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/components/sections/TrustSignals.tsx apps/landing-next/components/contracts-callout.tsx
git commit -m "feat(landing-next): replace ContractsCallout with TrustSignals section

TrustSignals consolidates: AlertRegistry mainnet address (with
Basescan link), MIT license line, audit Q1 2027 placeholder, GitHub
CTA. Drops the dual Mainnet/Sepolia tile pair (Sepolia is dev-meta
not user-facing). Single hairline-bordered box per DESIGN.md
(no shadow, no glow).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 15: FooterFinalCta section

**Files:**
- Create: `apps/landing-next/components/sections/FooterFinalCta.tsx`

- [ ] **Step 1:** Create file

```tsx
import { Button } from '@/components/ui/button';
import { type Locale, getDict } from '@/lib/i18n';
import {
  BASESCAN_MAINNET,
  DISCORD_URL,
  DOCS_URL,
  FARCASTER_URL,
  GITHUB_REPO,
  PREMIUM_WAITLIST_LINK,
  RESEARCH_URL,
  TELEGRAM_BOT_LINK,
  TWITTER_URL,
  WHITEPAPER_URL,
  AUDIT_URL,
  localePath,
} from '@/lib/utils';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function FooterFinalCta({ locale }: { locale: Locale }) {
  const t = getDict(locale).footer;

  return (
    <>
      {/* Final CTA strip */}
      <section className="py-16 bg-primary/5 border-t border-primary/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink">
            {t.finalCtaCopy}
          </h3>
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary">
              {t.finalCtaButton} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* 4-column footer */}
      <footer className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-on-primary" aria-hidden="true" />
                </div>
                <span className="font-semibold text-lg text-ink tracking-tight">
                  RWA <span className="text-primary">Sentinel</span>
                </span>
              </div>
              <p className="text-sm text-ink-secondary mb-4 leading-relaxed">{t.brandTagline}</p>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                GitHub Repository →
              </a>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnProduct}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li>
                  <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                    {t.productLinks.telegram}
                  </a>
                </li>
                <li>
                  <Link href={localePath(locale, 'dashboard')} className="hover:text-ink">
                    {t.productLinks.dashboard}
                  </Link>
                </li>
                <li>
                  <a href={PREMIUM_WAITLIST_LINK} className="hover:text-ink">
                    {t.productLinks.premium}
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnResources}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li><a href={WHITEPAPER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{getDict(locale).nav.whitepaper}</a></li>
                <li><a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{getDict(locale).nav.docs}</a></li>
                <li><a href={RESEARCH_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{getDict(locale).nav.research}</a></li>
                <li><a href={AUDIT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{getDict(locale).nav.audit}</a></li>
              </ul>
            </div>

            {/* Network */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnNetwork}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li><a href={BASESCAN_MAINNET} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t.networkLinks.mainnet}</a></li>
                <li><span className="text-ink-muted">{t.networkLinks.status}</span></li>
                <li><a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t.networkLinks.twitter}</a></li>
                <li><a href={FARCASTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t.networkLinks.farcaster}</a></li>
                <li><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t.networkLinks.discord}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 text-xs text-ink-muted font-mono">
            {t.rights}
          </div>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/sections/FooterFinalCta.tsx
git commit -m "feat(landing-next): add FooterFinalCta with 4-column footer

- Final CTA strip ('Get Telegram alerts before the next failure.')
  bridges the page to footer.
- 4-column footer: Brand / Product / Resources / Network. Drops the
  old 'Infrastructure' column that listed internal worker names
  (Poller Worker, AlertWriter Worker, Public API (Hono),
  AlertRegistry.sol) — those were dev-meta and now live in /docs.
- All external links open in new tabs with noreferrer; internal links
  use Next.js Link component.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 16: Site nav rewrite (sticky-with-shadow + Resources dropdown)

**Files:**
- Modify: `apps/landing-next/components/site-nav.tsx`

- [ ] **Step 1:** Replace `site-nav.tsx`

```tsx
'use client';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';
import type { Dict, Locale } from '@/lib/i18n';
import {
  AUDIT_URL,
  DOCS_URL,
  GITHUB_REPO,
  RESEARCH_URL,
  TELEGRAM_BOT_LINK,
  WHITEPAPER_URL,
  cn,
  localePath,
} from '@/lib/utils';
import { ChevronDown, Github, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SiteNav({ t, locale }: { t: Dict['nav']; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-colors',
        scrolled
          ? 'bg-white border-b border-slate-200'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href={localePath(locale)} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-on-primary" aria-hidden="true" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-ink">
            RWA <span className="text-primary">Sentinel</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
          <Link href={localePath(locale, 'dashboard')} className="hover:text-ink">
            {t.dashboard}
          </Link>
          <a href="#how-it-works" className="hover:text-ink">
            {t.coverage}
          </a>
          <a href="#roadmap" className="hover:text-ink">
            {t.roadmap}
          </a>
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-ink"
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
            >
              {t.resources} <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {resourcesOpen && (
              <div
                role="menu"
                className="absolute top-full left-0 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-sm py-2"
              >
                <a href={WHITEPAPER_URL} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-surface-alt" role="menuitem">
                  {t.whitepaper}
                </a>
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-surface-alt" role="menuitem">
                  {t.docs}
                </a>
                <a href={RESEARCH_URL} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-surface-alt" role="menuitem">
                  {t.research}
                </a>
                <a href={AUDIT_URL} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-surface-alt" role="menuitem">
                  {t.audit}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} />
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-secondary hover:text-ink hover:bg-surface-alt"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              {t.cta}
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add apps/landing-next/components/site-nav.tsx
git commit -m "refactor(landing-next): rewrite site-nav to spec

- Sticky nav now toggles between blurred-transparent and solid-white
  on scroll (>8px) per DESIGN.md hairline-only elevation.
- Center nav: Dashboard / Coverage / Roadmap / Resources (dropdown
  with Whitepaper / Docs / Research / Audit).
- Right side: locale switcher + GitHub icon + 'Get Telegram alerts'
  primary CTA (always visible on desktop).
- Old links (Overview / Architecture / Assets) dropped — they
  pointed to sections that no longer exist.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 17: Rewrite landing-content.tsx as composition only

**Files:**
- Modify: `apps/landing-next/components/landing-content.tsx`

- [ ] **Step 1:** Replace file content

```tsx
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Roadmap } from '@/components/sections/Roadmap';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { FooterFinalCta } from '@/components/sections/FooterFinalCta';
import { SiteNav } from '@/components/site-nav';
import { type Locale, getDict } from '@/lib/i18n';

export function LandingContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <SiteNav t={t.nav} locale={locale} />
      <main>
        <Hero locale={locale} />
        <Stats locale={locale} />
        <Problem locale={locale} />
        <HowItWorks locale={locale} />
        {/* LivePreview is added in PR 2 (between HowItWorks and Roadmap). */}
        <Roadmap locale={locale} />
        <TrustSignals locale={locale} />
      </main>
      <FooterFinalCta locale={locale} />
    </>
  );
}
```

- [ ] **Step 2:** Verify build + dev server

```bash
pnpm --filter @oclix/landing-next typecheck
pnpm --filter @oclix/landing-next exec next build 2>&1 | tail -30
```

Expected: typecheck exit 0, build success.

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/components/landing-content.tsx
git commit -m "refactor(landing-next): collapse landing-content to composition only

277-line monolithic component is now a 25-line composer that imports
each section in order. Section components own their layout, copy, and
data fetching. Future section additions (e.g., LivePreview in PR 2,
TraderPersona in Phase 1.5) plug in here.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 18: Manual smoke + lint sweep

- [ ] **Step 1:** Run dev server

```bash
pnpm --filter @oclix/landing-next dev
```

Open http://localhost:5174 — verify:
- hero copy renders, CTA buttons go to `t.me/...` and `/dashboard/`
- stats bar 4 metrics, alertCount shows mock value (length of MOCK_ALERTS = 1)
- problem section paragraph renders
- how it works renders SVG with 3 nodes + Sentinel + AlertRegistry
- roadmap shows 3 cards, card 3 has primary border + disclaimer text
- trust signals box shows mainnet contract + MIT + audit Q1 2027 + GitHub CTA
- footer shows 4 columns + final CTA strip
- nav scrolls and turns solid white at >8px scroll
- Resources dropdown opens on hover

Open http://localhost:5174/ko/ — verify Korean variant renders identical structure with translated copy.

- [ ] **Step 2:** Run lint

```bash
pnpm lint
```

Expected: 0 errors. Pre-existing warnings on poller / alert-writer console.log are OK (out of scope).

- [ ] **Step 3:** Run all workspace tests

```bash
pnpm test
```

Expected: pass (`landing-next` test = no-op).

- [ ] **Step 4:** Run typecheck across workspace

```bash
pnpm typecheck
```

Expected: exit 0 across all 4 workspaces.

## Task 19: Push branch + open PR 1

- [ ] **Step 1:** Push branch

```bash
git push -u origin feat/landing-redesign-pr1
```

- [ ] **Step 2:** Open PR

```bash
gh pr create --base dev --title "feat(landing-next): redesign hero/stats/problem/how-it-works/roadmap/trust/footer + DESIGN.md sync (PR 1/2)" --body "$(cat <<'EOF'
## What

Phase 1 of the landing redesign per
[`docs/specs/2026-04-27-landing-redesign.md`](../blob/dev/docs/specs/2026-04-27-landing-redesign.md).

- Sync Tailwind config + globals.css to DESIGN.md tokens (palette,
  typography variables, spacing scale, hairline-only elevation).
- Swap fonts to Source Serif 4 / Inter / JetBrains Mono via
  next/font (Pretendard via CDN for Korean hero).
- Refactor UI primitives (Card, Button, Badge) to match DESIGN.md.
- Rewrite i18n.ts with new 8-section dict (en + ko, financial
  intelligence tone).
- Add 7 of the 8 section components (Hero, Stats, Problem,
  HowItWorks, Roadmap, TrustSignals, FooterFinalCta) +
  SectionBadge primitive + OracleNetworkSvg static scene.
- Rewrite site-nav as sticky-with-shadow + Resources dropdown +
  primary CTA.
- Collapse landing-content.tsx to composition only.

## Why

Current landing-next reads as a Devfolio submission shell — internal
repo paths in copy, dev-meta in footer, Phase 1/2/3 sprint wording.
Spec re-tones to Bloomberg/FT financial intelligence with retail
Telegram-bot subscription as primary conversion and Phase 3 SENTINEL
airdrop snapshot as securities-safe trigger in Roadmap card 3.

## How tested

- `pnpm typecheck` exit 0 across all 4 workspaces
- `pnpm lint` 0 errors
- `pnpm --filter @oclix/landing-next exec next build` success
- Manual smoke at localhost:5174 (en + /ko/) — all 7 sections render,
  nav stickies on scroll, Resources dropdown opens, all CTAs link
  correctly
- DESIGN.md lint via `npx @google/design.md lint docs/DESIGN.md` — 0
  errors

## Follow-up (PR 2/2)

- Three.js scene (R3F + drei) replacing the static SVG in HowItWorks
- LivePreview section between HowItWorks and Roadmap (client-side
  setInterval polling)
- Dashboard tone polish

## Out of scope (unchanged)

- Backend / API
- B2B /protocols page (Phase 1.5)
- Premium tier signup form (Phase 2)
- Auto-deploy GitHub Actions workflow

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# PHASE 2 — PR 2: Three.js scene + LivePreview + dashboard polish

**Branch:** `feat/landing-redesign-pr2` (off `feat/landing-redesign-pr1` after PR 1 merges; if PR 1 not yet merged, off `feat/landing-redesign-pr1` to stack)
**PR target:** `dev`
**Estimated time:** ~6h

## Task 20: Branch + dependencies

**Files:**
- Modify: `apps/landing-next/package.json`

- [ ] **Step 1:** Branch off PR 1

```bash
# After PR 1 is merged to dev:
git checkout dev
git pull --ff-only
git checkout -b feat/landing-redesign-pr2

# OR if PR 1 not yet merged, stack:
git checkout feat/landing-redesign-pr1
git checkout -b feat/landing-redesign-pr2
```

- [ ] **Step 2:** Add three.js dependencies

```bash
pnpm --filter @oclix/landing-next add three@^0.169.0 @react-three/fiber@^8.17.0 @react-three/drei@^9.114.0
pnpm --filter @oclix/landing-next add -D @types/three@^0.169.0
```

- [ ] **Step 3:** Verify install

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 4:** Commit dep changes

```bash
git add apps/landing-next/package.json pnpm-lock.yaml
git commit -m "chore(landing-next): add three.js + @react-three/fiber + drei

For the HowItWorks scene. Bundle stays out of initial load via
Next.js dynamic({ ssr: false }) — see Task 22.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 21: OracleNetworkScene (R3F + drei)

**Files:**
- Create: `apps/landing-next/components/scenes/OracleNetworkScene.tsx`

- [ ] **Step 1:** Create file

```tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import type { Locale } from '@/lib/i18n';
import { getDict } from '@/lib/i18n';

const PRIMARY = '#0052FF';
const NEUTRAL = '#FFFFFF';
const BORDER = '#E2E8F0';
const TEXT = '#0F172A';

function NodeBox({
  position,
  label,
  filled,
}: { position: [number, number, number]; label: string; filled?: boolean }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.4, 0.5, 0.1]} radius={0.05}>
        <meshStandardMaterial color={filled ? PRIMARY : NEUTRAL} />
      </RoundedBox>
      {!filled && (
        <RoundedBox args={[1.42, 0.52, 0.09]} radius={0.05}>
          <meshBasicMaterial color={BORDER} wireframe />
        </RoundedBox>
      )}
      <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: filled ? '#FFFFFF' : TEXT,
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function PulsingEdge({
  from,
  to,
  delay,
}: { from: [number, number, number]; to: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!dotRef.current) return;
    const t = (state.clock.elapsedTime + delay) % 3 / 3; // loop every 3s
    dotRef.current.position.x = from[0] + (to[0] - from[0]) * t;
    dotRef.current.position.y = from[1] + (to[1] - from[1]) * t;
    dotRef.current.position.z = from[2] + (to[2] - from[2]) * t;
    const mat = dotRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.sin(t * Math.PI);
  });

  // Static line
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <>
      <line ref={ref}>
        <primitive object={lineGeom} attach="geometry" />
        <lineBasicMaterial color={PRIMARY} opacity={0.4} transparent />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={PRIMARY} transparent />
      </mesh>
    </>
  );
}

export default function OracleNetworkScene({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks.nodes;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ height: '320px', width: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 4]} intensity={0.6} />

      {/* 3 oracles on the left */}
      <NodeBox position={[-3.5, 1.3, 0]} label={t.chainlink} />
      <NodeBox position={[-3.5, 0, 0]} label={t.pyth} />
      <NodeBox position={[-3.5, -1.3, 0]} label={t.redstone} />

      {/* Sentinel hub center */}
      <NodeBox position={[0, 0, 0]} label={t.sentinel} filled />

      {/* AlertRegistry right */}
      <NodeBox position={[3.5, 0, 0]} label={t.registry} />

      {/* Animated edges */}
      <PulsingEdge from={[-2.8, 1.3, 0]} to={[-0.7, 0, 0]} delay={0} />
      <PulsingEdge from={[-2.8, 0, 0]} to={[-0.7, 0, 0]} delay={1} />
      <PulsingEdge from={[-2.8, -1.3, 0]} to={[-0.7, 0, 0]} delay={2} />
      <PulsingEdge from={[0.7, 0, 0]} to={[2.8, 0, 0]} delay={1.5} />
    </Canvas>
  );
}
```

- [ ] **Step 2:** Verify

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 3:** Commit

```bash
git add apps/landing-next/components/scenes/OracleNetworkScene.tsx
git commit -m "feat(landing-next): add R3F OracleNetworkScene

Restrained 3-node-→-hub-→-registry layout. Pulsing edges (3s loop,
staggered delays) animate data flow Chainlink/Pyth/RedStone →
Sentinel → AlertRegistry. Primary blue accent only on active dots
and the filled Sentinel hub. Drei RoundedBox for soft node corners,
Html drei helper for crisp labels (avoids texture-baked text).

Default-export so the consumer can dynamic-import it without
named-export ceremony.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 22: HowItWorks — replace static SVG with dynamic R3F + reduced-motion + mobile fallback

**Files:**
- Modify: `apps/landing-next/components/sections/HowItWorks.tsx`

- [ ] **Step 1:** Replace `HowItWorks.tsx`

```tsx
'use client';

import { OracleNetworkSvg } from '@/components/scenes/OracleNetworkSvg';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const OracleNetworkScene = dynamic(
  () => import('@/components/scenes/OracleNetworkScene'),
  {
    ssr: false,
    loading: () => <SceneSkeleton />,
  },
);

function SceneSkeleton() {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-surface-alt"
      style={{ height: '320px' }}
      aria-hidden="true"
    />
  );
}

function useShowFallback(): boolean {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setFallback(reducedMotion || mobile);
  }, []);

  return fallback;
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks;
  const showFallback = useShowFallback();

  return (
    <section id="how-it-works" className="py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge>{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-6 text-ink">
            {t.titlePart1}
            <span className="italic text-primary">{t.titleAccent}</span>
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">{t.body}</p>
        </div>

        {showFallback ? (
          <OracleNetworkSvg locale={locale} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-surface-alt overflow-hidden">
            <OracleNetworkScene locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Verify build + dev

```bash
pnpm --filter @oclix/landing-next typecheck
pnpm --filter @oclix/landing-next exec next build 2>&1 | tail -10
```

Expected: typecheck exit 0, build success. Note: bundle analyzer should show three.js code-split into a separate chunk (lazy-loaded on HowItWorks mount).

- [ ] **Step 3:** Manual smoke

```bash
pnpm --filter @oclix/landing-next dev
```

Open http://localhost:5174:
- desktop, no reduced-motion → R3F scene renders, edges pulse
- DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → reload → static SVG renders
- DevTools → Device → iPhone 12 → reload → static SVG renders

- [ ] **Step 4:** Commit

```bash
git add apps/landing-next/components/sections/HowItWorks.tsx
git commit -m "feat(landing-next): wire R3F scene into HowItWorks with reduced-motion + mobile fallback

- Dynamic import of OracleNetworkScene with ssr:false (Three.js can't
  render server-side; this also code-splits the ~600KB three bundle
  out of initial load).
- useShowFallback() returns true when prefers-reduced-motion: reduce
  OR viewport < md breakpoint — both cases render the static
  OracleNetworkSvg instead of the animated scene.
- SceneSkeleton placeholder during dynamic-import resolution prevents
  layout shift.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 23: LivePreview section (client — fetch+setInterval, prices grid + alerts feed)

**Files:**
- Create: `apps/landing-next/components/sections/LivePreview.tsx`

- [ ] **Step 1:** Create file

```tsx
'use client';

import { SectionBadge } from '@/components/section-badge';
import { Badge } from '@/components/ui/badge';
import { type AlertRow, type PriceRow, fetchAlerts, fetchPrices } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { localePath } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function formatTimestamp(ts: number, locale: Locale): string {
  return new Date(ts * 1000).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatBps(bps: number): string {
  const sign = bps > 0 ? '+' : '';
  return `${sign}${(bps / 100).toFixed(2)}%`;
}

export function LivePreview({ locale }: { locale: Locale }) {
  const t = getDict(locale).livePreview;
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const [p, a] = await Promise.all([fetchPrices(), fetchAlerts()]);
        if (cancelled) return;
        setPrices(p.prices);
        setAlerts(a.alerts.slice(0, 3));
        setLoaded(true);
      } catch {
        if (cancelled) return;
        setLoaded(true);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge variant="live">{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-3 text-ink">
            {t.title}
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prices */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="p-6 pb-3">
              <h3 className="font-sans font-semibold text-base text-ink">{t.pricesTitle}</h3>
            </div>
            <div className="p-6 pt-3">
              {!loaded ? (
                <p className="text-sm text-ink-muted font-mono">…</p>
              ) : prices.length === 0 ? (
                <p className="text-sm text-ink-secondary">{t.noData}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] font-mono uppercase tracking-caps text-ink-muted border-b border-slate-100">
                        <th className="py-2 pr-4">Asset</th>
                        <th className="py-2 pr-4">Oracle</th>
                        <th className="py-2 pr-4 text-right">Price</th>
                        <th className="py-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p, i) => (
                        <tr key={`${p.asset}-${p.oracle}-${i}`} className="border-b border-slate-50 last:border-0">
                          <td className="py-3 pr-4 font-mono font-semibold text-ink">{p.asset}</td>
                          <td className="py-3 pr-4 text-ink-secondary capitalize">{p.oracle}</td>
                          <td className="py-3 pr-4 text-right font-mono text-ink">${p.priceE18}</td>
                          <td className="py-3 text-right font-mono text-xs text-ink-muted">
                            {formatTimestamp(p.ts, locale)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="p-6 pb-3">
              <h3 className="font-sans font-semibold text-base text-ink">{t.alertsTitle}</h3>
            </div>
            <div className="p-6 pt-3">
              {!loaded ? (
                <p className="text-sm text-ink-muted font-mono">…</p>
              ) : alerts.length === 0 ? (
                <p className="text-sm text-ink-secondary">{t.noData}</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((a) => (
                    <div key={a.id} className="border border-slate-100 rounded-md p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-mono font-semibold text-ink">{a.asset}</div>
                        <Badge variant="warning" className="shrink-0">
                          {formatBps(a.deviationBps)}
                        </Badge>
                      </div>
                      <div className="text-xs text-ink-muted font-mono">
                        {a.oraclePair} · {formatTimestamp(a.blockTs, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={localePath(locale, 'dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t.dashboardLink} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Insert into composition (`landing-content.tsx`)

```tsx
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { LivePreview } from '@/components/sections/LivePreview';
import { Roadmap } from '@/components/sections/Roadmap';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { FooterFinalCta } from '@/components/sections/FooterFinalCta';
import { SiteNav } from '@/components/site-nav';
import { type Locale, getDict } from '@/lib/i18n';

export function LandingContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <SiteNav t={t.nav} locale={locale} />
      <main>
        <Hero locale={locale} />
        <Stats locale={locale} />
        <Problem locale={locale} />
        <HowItWorks locale={locale} />
        <LivePreview locale={locale} />
        <Roadmap locale={locale} />
        <TrustSignals locale={locale} />
      </main>
      <FooterFinalCta locale={locale} />
    </>
  );
}
```

- [ ] **Step 3:** Verify

```bash
pnpm --filter @oclix/landing-next typecheck
pnpm --filter @oclix/landing-next exec next build 2>&1 | tail -10
```

Expected: exit 0.

- [ ] **Step 4:** Manual smoke

```bash
pnpm --filter @oclix/landing-next dev
```

http://localhost:5174 — verify:
- LivePreview renders between HowItWorks and Roadmap
- prices grid shows mock 5 entries (since `NEXT_PUBLIC_SENTINEL_API_URL` is unset locally)
- alerts feed shows mock 1 entry
- dashboard link goes to `/dashboard/`
- copy refreshes every 5 seconds (open DevTools → Network → see fetch loop)

- [ ] **Step 5:** Commit

```bash
git add apps/landing-next/components/sections/LivePreview.tsx apps/landing-next/components/landing-content.tsx
git commit -m "feat(landing-next): add LivePreview section + insert into composition

- Client component (necessary because next.config.mjs declares
  output: 'export' — Server Component revalidate is build-time only).
- setInterval(5000) polls fetchPrices + fetchAlerts in parallel.
- Two-column grid: prices table (mono numbers + per-oracle rows) and
  alerts feed (3 most recent, colored deviation badge).
- Composition slot is between HowItWorks and Roadmap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 24: Dashboard tone polish

The dashboard is on `/dashboard/` — keep functionality, align tone (font-serif → font-sans for h1, badge variant matches, copy align with new dict keys).

**Files:**
- Modify: `apps/landing-next/components/dashboard-content.tsx`

- [ ] **Step 1:** Replace dashboard-content

```tsx
'use client';

import { SiteNav } from '@/components/site-nav';
import { Badge } from '@/components/ui/badge';
import { type AlertRow, type PriceRow, fetchAlerts, fetchPrices } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { localePath } from '@/lib/utils';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function formatTimestamp(ts: number, locale: Locale): string {
  return new Date(ts * 1000).toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatBps(bps: number): string {
  const sign = bps > 0 ? '+' : '';
  return `${sign}${(bps / 100).toFixed(2)}%`;
}

export function DashboardContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [pricesMock, setPricesMock] = useState(true);
  const [alertsMock, setAlertsMock] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const [p, a] = await Promise.all([fetchPrices(), fetchAlerts()]);
        if (cancelled) return;
        setPrices(p.prices);
        setPricesMock(p.mocked);
        setAlerts(a.alerts);
        setAlertsMock(a.mocked);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  const showingMock = pricesMock || alertsMock;

  return (
    <>
      <SiteNav t={t.nav} locale={locale} />

      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href={localePath(locale)}
            className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <Badge variant="live" className="mb-3">LIVE</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 text-ink">
                {t.dashboard.title}
              </h1>
              <p className="text-ink-secondary mt-2">{t.dashboard.subtitle}</p>
            </div>
            {!loading && showingMock && (
              <Badge variant="warning">{t.dashboard.mockBadge}</Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* PRICES */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="p-6 pb-3">
                <h3 className="font-sans font-semibold text-base text-ink">
                  {t.dashboard.pricesTitle}
                </h3>
              </div>
              <div className="p-6 pt-3">
                {loading ? (
                  <p className="text-sm text-ink-muted">…</p>
                ) : prices.length === 0 ? (
                  <p className="text-sm text-ink-secondary">{t.dashboard.noData}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] font-mono uppercase tracking-caps text-ink-muted border-b border-slate-100">
                          <th className="py-2 pr-4">{t.dashboard.asset}</th>
                          <th className="py-2 pr-4">{t.dashboard.oracle}</th>
                          <th className="py-2 pr-4 text-right">{t.dashboard.price}</th>
                          <th className="py-2 text-right">{t.dashboard.time}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prices.map((p, i) => (
                          <tr
                            key={`${p.asset}-${p.oracle}-${i}`}
                            className="border-b border-slate-50 last:border-0"
                          >
                            <td className="py-3 pr-4 font-mono font-semibold text-ink">{p.asset}</td>
                            <td className="py-3 pr-4 text-ink-secondary capitalize">{p.oracle}</td>
                            <td className="py-3 pr-4 text-right font-mono text-ink">${p.priceE18}</td>
                            <td className="py-3 text-right font-mono text-xs text-ink-muted">
                              {formatTimestamp(p.ts, locale)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* ALERTS */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="p-6 pb-3">
                <h3 className="font-sans font-semibold text-base text-ink">
                  {t.dashboard.alertsTitle}
                </h3>
              </div>
              <div className="p-6 pt-3">
                {loading ? (
                  <p className="text-sm text-ink-muted">…</p>
                ) : alerts.length === 0 ? (
                  <p className="text-sm text-ink-secondary">{t.dashboard.noData}</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div key={a.id} className="border border-slate-100 rounded-md p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-mono font-semibold text-ink">{a.asset}</div>
                          <Badge variant="warning" className="shrink-0">
                            {formatBps(a.deviationBps)}
                          </Badge>
                        </div>
                        <div className="text-xs text-ink-muted font-mono mb-2">
                          {a.oraclePair} · {formatTimestamp(a.blockTs, locale)}
                        </div>
                        {a.txHash && (
                          <a
                            href={`https://basescan.org/tx/${a.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                          >
                            {t.dashboard.tx} {a.txHash.slice(0, 10)}…
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2:** Verify

```bash
pnpm --filter @oclix/landing-next typecheck
```

Expected: exit 0.

- [ ] **Step 3:** Manual smoke

```bash
pnpm --filter @oclix/landing-next dev
```

http://localhost:5174/dashboard/ — verify:
- new font (Source Serif 4 h1)
- nav identical to landing
- mock data badge (warning variant) shows
- alerts and prices render
- 5s auto-refresh works

- [ ] **Step 4:** Commit

```bash
git add apps/landing-next/components/dashboard-content.tsx
git commit -m "refactor(landing-next): polish dashboard tone to match new design system

- Add 5s setInterval polling (was load-once on mount only)
- Switch to ink/ink-secondary/ink-muted color tokens
- Replace fancy Card hover translate with hairline-only border
- Match Badge variants (live + warning) to new variant set
- Use new dict keys (dashboard.pricesTitle, dashboard.mockBadge etc.)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

## Task 25: Lighthouse smoke + final QA

- [ ] **Step 1:** Production build + start

```bash
pnpm --filter @oclix/landing-next exec next build
pnpm --filter @oclix/landing-next exec next start -p 5174 &
sleep 3
```

- [ ] **Step 2:** Run Lighthouse via Chrome DevTools or `npx`

```bash
npx --yes lighthouse@latest http://localhost:5174 --only-categories=performance,accessibility,best-practices --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json
node -e "const r = require('/tmp/lh.json'); const cat = r.categories; console.log('Performance:', cat.performance.score * 100); console.log('A11y:', cat.accessibility.score * 100); console.log('Best practices:', cat['best-practices'].score * 100); console.log('LCP:', r.audits['largest-contentful-paint'].displayValue);"
```

Expected:
- Performance ≥ 85 (LCP target < 2.5s on desktop)
- Accessibility ≥ 95
- Best practices ≥ 90

If LCP > 2.5s, inspect: is three.js bundle blocking? (it should be code-split).

- [ ] **Step 3:** Stop dev server

```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 4:** Run full workspace verifications

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Expected: all exit 0.

- [ ] **Step 5:** Validate DESIGN.md (must still be 0 errors)

```bash
npx @google/design.md@latest lint docs/DESIGN.md
```

- [ ] **Step 6:** Commit Lighthouse results note (optional)

If Lighthouse output shows any regression worth recording, append a note to `CHANGELOG.md`:

```bash
git diff CHANGELOG.md
# (if no changes, skip this commit)
```

## Task 26: Push + open PR 2

- [ ] **Step 1:** Push

```bash
git push -u origin feat/landing-redesign-pr2
```

- [ ] **Step 2:** Open PR

```bash
gh pr create --base dev --title "feat(landing-next): Three.js HowItWorks scene + LivePreview + dashboard polish (PR 2/2)" --body "$(cat <<'EOF'
## What

Phase 2 of the landing redesign per
[`docs/specs/2026-04-27-landing-redesign.md`](../blob/dev/docs/specs/2026-04-27-landing-redesign.md).

- Add three.js + @react-three/fiber + @react-three/drei dependencies.
- Implement `OracleNetworkScene` (R3F + drei): Chainlink/Pyth/RedStone
  → Sentinel hub → AlertRegistry, with pulsing edges (3s loop).
- Wire scene into `HowItWorks` via `dynamic({ ssr: false })` for code
  splitting. `useShowFallback()` returns true on
  `prefers-reduced-motion: reduce` OR viewport <md → static SVG used
  instead.
- Add `LivePreview` section (Client Component, setInterval 5s) — prices
  table + 3 most recent alerts + dashboard link. Composition updates
  to insert it between HowItWorks and Roadmap.
- Polish dashboard-content tone (5s auto-refresh, new tokens, new
  Badge variants).

## Why

PR 1 shipped sections 1–4 + 6–8 with a static SVG placeholder for the
HowItWorks scene. This PR fulfills the spec §5.4 + §10 commitment of
the restrained Three.js scene + the live data section.

## How tested

- `pnpm typecheck` exit 0
- `pnpm lint` 0 errors
- `pnpm --filter @oclix/landing-next exec next build` success
  (three.js code-split visible in bundle output)
- Lighthouse: Performance ≥ 85, A11y ≥ 95, Best Practices ≥ 90
- Manual smoke at localhost:5174 — desktop renders R3F scene with
  pulsing edges; toggling DevTools 'Emulate
  prefers-reduced-motion: reduce' falls back to static SVG; mobile
  viewport falls back to static SVG.
- Dashboard at /dashboard/ — auto-refresh every 5s, new tone
  consistent with landing.

## Out of scope (left for future)

- Playwright smoke test (Phase 1.5)
- Visual regression (Percy/Chromatic) (Phase 2)
- B2B /protocols page (Phase 1.5)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Self-review

After writing this plan, fresh-eye check:

**1. Spec coverage** — every spec section addressed?

| Spec section | Implementation task |
|---|---|
| §1 Context | (acknowledged in plan header) |
| §2 Goals & non-goals | (acknowledged) |
| §3 Persona & tone | Tasks 6 (i18n) + 8 (Hero) — implicit via copy + font selection |
| §4 Architecture | Tasks 2–17 (file split) |
| §5.1 Hero | Task 8 |
| §5.2 Stats | Task 9 |
| §5.3 Problem | Task 10 |
| §5.4 HowItWorks | Tasks 11, 12, 21, 22 |
| §5.5 LivePreview | Task 23 |
| §5.6 Roadmap | Task 13 |
| §5.7 TrustSignals | Task 14 |
| §5.8 FooterFinalCta | Task 15 |
| §6 Site nav | Task 16 |
| §7 Data flow | Tasks 9 + 23 (corrected to client-side polling because of `output: 'export'`) |
| §8 Error handling | Tasks 9 + 23 (graceful `—` fallback baked in); Task 22 (reduced-motion + mobile fallback) |
| §9 Testing | Task 18 + 25 (manual smoke + Lighthouse). Playwright is Phase 1.5 follow-up. |
| §10 Implementation phases & ETA | PR 1 + PR 2 split honored |
| §11 Open questions (5) | Resolved with defaults at top of this plan |
| §12 References | (acknowledged) |

No gaps.

**2. Placeholder scan** — any "TBD"/"TODO"/"implement later" without code?

- "TODO: confirm with 이재근" in Task 5 — that's a sourcing note for placeholder URLs, not a missing implementation. The constants themselves have working values.

No problematic placeholders.

**3. Type consistency** — names match across tasks?

- `Locale`, `Dict`, `getDict` — used identically across all section files
- `fetchPrices`, `fetchAlerts`, `PriceRow`, `AlertRow` — consistent
- `localePath`, `TELEGRAM_BOT_LINK`, `BASESCAN_MAINNET` — defined in Task 5, consumed in Tasks 8/15/16/24
- Tailwind tokens (`text-ink`, `bg-surface-alt`, `tracking-caps`, `tracking-h1`, `tracking-display`) — defined in Task 2, consumed in Tasks 8–17, 22–24
- Badge variants (`live`, `section`, `warning`) — defined in Task 4, consumed in Tasks 7/13/24
- CSS variable `--font-source-serif`, `--font-inter`, `--font-jetbrains-mono`, `--font-pretendard` — set in Tasks 2 + 3, consumed via `font-serif`/`font-sans`/`font-mono`/`font-kohero` Tailwind class in Tasks 8/10/12/13

All consistent.

---

# Execution Handoff

**Plan complete and saved to `docs/specs/2026-04-27-landing-redesign-implementation-plan.md`.** Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration. Best for parallelizing independent tasks (e.g., Tasks 8/10/13/15 are independent section components).

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints for review.

Which approach?
