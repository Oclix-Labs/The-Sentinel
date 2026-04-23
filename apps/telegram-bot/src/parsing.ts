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
  return { kind: 'asset', value: `${ticker}/USD` };
}
