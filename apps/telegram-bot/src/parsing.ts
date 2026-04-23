/**
 * Normalizes user-supplied /subscribe arguments into the stable `<TICKER>/USD`
 * form that apps/poller writes into alerts.asset (and that alert-writer's
 * listActiveSubscribersForAsset filter matches against).
 */

export type ParsedSubscribeArg =
  | { kind: 'all' }
  | { kind: 'asset'; value: string }
  | { kind: 'invalid' };

const USD_SUFFIX = /(\/USD|-USD|_USD)$/i;
const TICKER_CHARS = /^[A-Z0-9]+$/;

/**
 * Mixed-case canonicalization for Phase-1 assets whose poller-written symbol
 * is NOT all-uppercase. alert-writer matches subscriptions via exact string
 * equality on `alerts.asset`, so a /subscribe cbeth that normalizes to
 * `CBETH/USD` would silently never match alerts written as `cbETH/USD`.
 * Keep in sync with apps/poller/src/config.ts PHASE_1_ASSETS.
 */
const CANONICAL_CASE: Record<string, string> = {
  CBETH: 'cbETH',
};

export function normalizeAsset(raw: string): ParsedSubscribeArg {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { kind: 'invalid' };
  if (trimmed.toLowerCase() === 'all') return { kind: 'all' };
  if (/\s/.test(trimmed)) return { kind: 'invalid' };

  const upper = trimmed.toUpperCase();
  const ticker = upper.replace(USD_SUFFIX, '');
  if (ticker.length === 0 || !TICKER_CHARS.test(ticker)) {
    return { kind: 'invalid' };
  }
  const canonical = CANONICAL_CASE[ticker] ?? ticker;
  return { kind: 'asset', value: `${canonical}/USD` };
}
