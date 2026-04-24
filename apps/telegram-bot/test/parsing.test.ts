import { describe, expect, it } from 'vitest';
import { type ParsedSubscribeArg, normalizeAsset } from '../src/parsing';

describe('normalizeAsset', () => {
  it("returns {kind:'all'} for the literal 'all' case-insensitive", () => {
    const cases: ParsedSubscribeArg[] = [
      normalizeAsset('all'),
      normalizeAsset('ALL'),
      normalizeAsset('All'),
    ];
    for (const c of cases) {
      expect(c).toEqual({ kind: 'all' });
    }
  });

  it('uppercases bare tickers and appends /USD', () => {
    expect(normalizeAsset('btc')).toEqual({ kind: 'asset', value: 'BTC/USD' });
    expect(normalizeAsset('BTC')).toEqual({ kind: 'asset', value: 'BTC/USD' });
    expect(normalizeAsset('eth')).toEqual({ kind: 'asset', value: 'ETH/USD' });
  });

  it('strips trailing /USD, -USD, _USD (case-insensitive) before re-appending', () => {
    expect(normalizeAsset('BTC/USD')).toEqual({ kind: 'asset', value: 'BTC/USD' });
    expect(normalizeAsset('btc-usd')).toEqual({ kind: 'asset', value: 'BTC/USD' });
    expect(normalizeAsset('BTC_USD')).toEqual({ kind: 'asset', value: 'BTC/USD' });
  });

  it('canonicalizes cbETH case to match poller PHASE_1_ASSETS symbol', () => {
    // Poller writes alerts.asset as literal 'cbETH/USD' (mixed case). alert-writer
    // uses exact string equality on asset_filter. If we stored 'CBETH/USD', a
    // user's /subscribe cbETH would silently never receive alerts.
    expect(normalizeAsset('cbeth')).toEqual({ kind: 'asset', value: 'cbETH/USD' });
    expect(normalizeAsset('CBETH')).toEqual({ kind: 'asset', value: 'cbETH/USD' });
    expect(normalizeAsset('cbETH')).toEqual({ kind: 'asset', value: 'cbETH/USD' });
    expect(normalizeAsset('cbeth/usd')).toEqual({ kind: 'asset', value: 'cbETH/USD' });
    expect(normalizeAsset('CBETH-USD')).toEqual({ kind: 'asset', value: 'cbETH/USD' });
  });

  it('rejects empty / whitespace / multi-token input', () => {
    expect(normalizeAsset('')).toEqual({ kind: 'invalid' });
    expect(normalizeAsset('   ')).toEqual({ kind: 'invalid' });
    expect(normalizeAsset('BTC ETH')).toEqual({ kind: 'invalid' });
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeAsset('  BTC  ')).toEqual({ kind: 'asset', value: 'BTC/USD' });
  });

  it('rejects tickers with internal non-alphanumerics (after suffix strip)', () => {
    expect(normalizeAsset('BT!C')).toEqual({ kind: 'invalid' });
    expect(normalizeAsset('B@C/USD')).toEqual({ kind: 'invalid' });
  });
});
