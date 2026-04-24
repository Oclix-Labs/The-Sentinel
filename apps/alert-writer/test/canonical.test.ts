import { describe, expect, it } from 'vitest';
import {
  __canonicalize_for_tests as canonicalize,
  hashAsset,
  hashEvidence,
  hashOraclePair,
} from '../src/canonical';

/**
 * Conformance suite for docs/DECISIONS/0007-canonical-encoding.md.
 * When any assertion fails, STOP — the hash surface is part of the public
 * verification contract and must not drift.
 *
 * Expected hex values cross-verified against `cast keccak "<input>"` to confirm
 * JS utf8 encoding matches Solidity keccak256(bytes(...)) — Foundry reference in
 * commit message of PR that flipped ADR to ACCEPTED.
 */

describe('hashAsset — ADR 0007 §1', () => {
  it('matches expected vector for BTC/USD', () => {
    expect(hashAsset('BTC/USD')).toBe(
      '0xee62665949c883f9e0f6f002eac32e00bd59dfe6c34e92a91c37d6a8322d6489',
    );
  });

  it('matches expected vector for ETH/USD', () => {
    expect(hashAsset('ETH/USD')).toBe(
      '0x0b43555ace6b39aae1b894097d0a9fc17f504c62fea598fa206cc6f5088e6e45',
    );
  });

  it('matches expected vector for USDC/USD', () => {
    expect(hashAsset('USDC/USD')).toBe(
      '0xff064b881a0c0fff844177f881a313ff894bfc6093d33b5514e34d7faa41b7ef',
    );
  });

  it('matches expected vector for cbETH/USD (preserves mixed case)', () => {
    // Same constant used in apps/contracts/test/AlertRegistry.t.sol:24
    // as CBETH_USD and in the D3 Sepolia smoke tx (block 40,620,070).
    expect(hashAsset('cbETH/USD')).toBe(
      '0x6ff7ab00bfc30fadf94e2141f6e4b8ef2ad332c4ff7c8ce76c3151137414d672',
    );
  });

  it('matches expected vector for USDO (non-price, no /USD suffix)', () => {
    expect(hashAsset('USDO')).toBe(
      '0x42afc1d5c054e4b693e255ffbcb6f93026230e00e557e26450701313e06fe7b7',
    );
  });

  it('differs between cbETH/USD and CBETH/USD (case-sensitive — regression guard)', () => {
    expect(hashAsset('cbETH/USD')).not.toBe(hashAsset('CBETH/USD'));
  });
});

describe('hashOraclePair — ADR 0007 §2', () => {
  it('matches expected vector for chainlink_vs_pyth', () => {
    // Same constant as AlertRegistry.t.sol:25 CHAINLINK_VS_PYTH and D3 smoke tx.
    expect(hashOraclePair('chainlink_vs_pyth')).toBe(
      '0x64455ea6882c26d977363c6b521963285797de745c08b0ecb9e3c0b30e5f8f09',
    );
  });

  it('matches expected vector for chainlink_vs_redstone', () => {
    expect(hashOraclePair('chainlink_vs_redstone')).toBe(
      '0x63e7d4799e78560552575650141e8b8a5a755dac2a069e848948e3a9b8e780cc',
    );
  });

  it('matches expected vector for pyth_vs_redstone', () => {
    expect(hashOraclePair('pyth_vs_redstone')).toBe(
      '0x07ae18a7f883686a18cd0bd02c1a730e8580c6b5624ece121a7d3f4082c3dab4',
    );
  });

  it('matches expected vector for chainlink_por (attestation, single source)', () => {
    expect(hashOraclePair('chainlink_por')).toBe(
      '0xdd5e08d81bd9be0b4b50c953bdc7e67ee3cc40ba88ac57910d0cef8349d23aa7',
    );
  });
});

describe('hashEvidence — ADR 0007 §3 (RFC 8785 canonical JSON)', () => {
  it('matches expected vector for the ADR example payload', () => {
    expect(
      hashEvidence({
        chainlinkValue: '77000000000000000000000',
        pythValue: '77100000000000000000000',
        chainlinkUpdatedAt: 1700000000,
        pythUpdatedAt: 1700000001,
      }),
    ).toBe('0x46b47a22696216c2900db4fe32d0358450c90f05e0a1d6b43bfe1096fe80be81');
  });

  it('is invariant to top-level key order (regression for JSON.stringify bug)', () => {
    const a = hashEvidence({ pythValue: '123', chainlinkValue: '456' });
    const b = hashEvidence({ chainlinkValue: '456', pythValue: '123' });
    expect(a).toBe(b);
  });

  it('is invariant to nested object key order (recursive sort)', () => {
    const a = hashEvidence({ evidence: { y: 1, x: 2 } });
    const b = hashEvidence({ evidence: { x: 2, y: 1 } });
    expect(a).toBe(b);
  });

  it('hashes empty object deterministically', () => {
    expect(hashEvidence({})).toBe(
      '0xb48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d',
    );
  });

  it('drops undefined keys (aligns with JSON.stringify semantics)', () => {
    const a = hashEvidence({ a: 1, b: undefined });
    const b = hashEvidence({ a: 1 });
    expect(a).toBe(b);
  });

  it('preserves array element order (arrays are ordered per RFC 8785)', () => {
    const a = hashEvidence({ tags: ['pyth', 'chainlink'] });
    const b = hashEvidence({ tags: ['chainlink', 'pyth'] });
    expect(a).not.toBe(b);
  });

  it('rejects non-finite numbers', () => {
    expect(() => hashEvidence({ x: Number.NaN })).toThrow(TypeError);
    expect(() => hashEvidence({ x: Number.POSITIVE_INFINITY })).toThrow(TypeError);
  });

  it('rejects bigint (per ADR §3 — values must be stringified upstream)', () => {
    expect(() => hashEvidence({ x: 1n })).toThrow(/bigint/);
  });
});

describe('canonicalize — internal shape', () => {
  it('serializes ADR example in the expected RFC 8785 form', () => {
    expect(
      canonicalize({
        chainlinkValue: '77000000000000000000000',
        pythValue: '77100000000000000000000',
        chainlinkUpdatedAt: 1700000000,
        pythUpdatedAt: 1700000001,
      }),
    ).toBe(
      '{"chainlinkUpdatedAt":1700000000,"chainlinkValue":"77000000000000000000000","pythUpdatedAt":1700000001,"pythValue":"77100000000000000000000"}',
    );
  });

  it('encodes null/true/false directly', () => {
    expect(canonicalize(null)).toBe('null');
    expect(canonicalize(true)).toBe('true');
    expect(canonicalize(false)).toBe('false');
  });
});
