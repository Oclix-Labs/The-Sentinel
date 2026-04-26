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

// Path-based locale prefix. EN is the default at root ("/"), KO lives under "/ko/".
export function localePath(locale: Locale, subpath = ''): string {
  const clean = subpath.replace(/^\//, '').replace(/\/$/, '');
  const base = locale === 'ko' ? '/ko' : '';
  if (!clean) return `${base}/`;
  return `${base}/${clean}/`;
}
