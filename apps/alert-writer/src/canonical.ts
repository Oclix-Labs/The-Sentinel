/**
 * Canonical encoding helpers for `AlertRegistry.logAlert` off-chain inputs.
 *
 * Implements the rules locked by docs/DECISIONS/0007-canonical-encoding.md:
 *   §1 asset       — keccak256(utf8(literal symbol from PHASE_1_ASSETS)), mixed case
 *   §2 oraclePair  — keccak256(utf8("<source_a>_vs_<source_b>")), alphabetical, lowercase
 *   §3 evidenceHash — keccak256(utf8(RFC 8785 canonical JSON))
 *
 * Phase-1 evidence keys are ASCII (see apps/poller/src/compare.ts), so the JS
 * string default-sort (UTF-16 code unit order) matches RFC 8785 §3.2.3's UCS
 * code-point order for the BMP. Non-ASCII keys are deferred — document if Phase
 * 2 introduces them.
 */

import { keccak256, stringToBytes } from 'viem';

function canonicalize(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) {
      throw new TypeError('canonical JSON: non-finite number not allowed');
    }
    return v.toString();
  }
  if (typeof v === 'bigint') {
    throw new TypeError('canonical JSON: bigint not allowed — stringify upstream per ADR 0007 §3');
  }
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalize).join(',')}]`;
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    const entries = Object.keys(obj)
      .sort()
      .filter((k) => obj[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
    return `{${entries.join(',')}}`;
  }
  throw new TypeError(`canonical JSON: unsupported type ${typeof v}`);
}

export function hashAsset(symbol: string): `0x${string}` {
  return keccak256(stringToBytes(symbol));
}

export function hashOraclePair(pair: string): `0x${string}` {
  return keccak256(stringToBytes(pair));
}

export function hashEvidence(obj: Record<string, unknown>): `0x${string}` {
  return keccak256(stringToBytes(canonicalize(obj)));
}

export const __canonicalize_for_tests = canonicalize;
