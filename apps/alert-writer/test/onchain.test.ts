import { env } from 'cloudflare:test';
import { base, baseSepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { logAlertOnChain, selectChain } from '../src/deliveries/onchain';
import { makeAlertPayload } from './fixtures';

/**
 * Coverage note: this file asserts the rollback-sentinel path and env wiring.
 * The viem writeContract + receipt-polling path is proven end-to-end by the
 * Sepolia staging smoke sequence documented in the D4 PR body — mocking viem
 * cleanly through the Cloudflare Workers test pool is painful because vi.mock
 * doesn't interpose on the Worker-side module graph. We keep the real-path
 * coverage empirical rather than synthetic.
 */

const SENTINEL_ENV = {
  ALERT_REGISTRY_ADDRESS: '0x0000000000000000000000000000000000000000',
  BASE_RPC_URL: env.BASE_RPC_URL,
  PUBLISHER_PRIVATE_KEY: env.PUBLISHER_PRIVATE_KEY,
} as const;

describe('logAlertOnChain — zero-address rollback sentinel', () => {
  it('returns pending + zero txHash when ALERT_REGISTRY_ADDRESS is the zero sentinel', async () => {
    const result = await logAlertOnChain(makeAlertPayload(), SENTINEL_ENV);
    expect(result.status).toBe('pending');
    expect(result.txHash).toBe(`0x${'0'.repeat(64)}`);
  });

  it('does not throw and does not touch the network in sentinel mode', async () => {
    // fetchMock.disableNetConnect() is active in setup — a real RPC call would
    // throw. Sentinel path exits before viem touches http().
    await expect(logAlertOnChain(makeAlertPayload(), SENTINEL_ENV)).resolves.toBeDefined();
  });
});

describe('env wiring', () => {
  it('exposes the onchain env bindings required by logAlertOnChain', () => {
    expect(env.ALERT_REGISTRY_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(env.BASE_RPC_URL).toBeTruthy();
    expect(env.PUBLISHER_PRIVATE_KEY).toMatch(/^0x[0-9a-fA-F]{64}$/);
  });
});

describe('selectChain — env-gated Mainnet vs Sepolia', () => {
  it("returns base (Mainnet) when ENVIRONMENT === 'production'", () => {
    expect(selectChain('production')).toBe(base);
  });

  it("returns baseSepolia when ENVIRONMENT === 'staging'", () => {
    expect(selectChain('staging')).toBe(baseSepolia);
  });

  it("returns baseSepolia when ENVIRONMENT === 'test'", () => {
    expect(selectChain('test')).toBe(baseSepolia);
  });

  it('defaults to baseSepolia when ENVIRONMENT is undefined (fail-safe: never accidental Mainnet)', () => {
    expect(selectChain(undefined)).toBe(baseSepolia);
  });

  it('defaults to baseSepolia for unknown ENVIRONMENT strings', () => {
    expect(selectChain('preview')).toBe(baseSepolia);
    expect(selectChain('')).toBe(baseSepolia);
    // Guard against case mismatch — 'PRODUCTION' must NOT route to Mainnet.
    expect(selectChain('PRODUCTION')).toBe(baseSepolia);
  });
});
