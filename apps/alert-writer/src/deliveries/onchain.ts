import { http, createPublicClient, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Chain, base, baseSepolia } from 'viem/chains';
import { hashAsset, hashEvidence, hashOraclePair } from '../canonical';
import type { AlertPayload, OnchainStatus } from '../types';

/**
 * Calls `AlertRegistry.logAlert` on Base Sepolia (staging) or Base Mainnet
 * (production). Chain is selected from `env.ENVIRONMENT` via `selectChain`.
 * Implements ADR 0007 §§1–6 canonical encoding via canonical.ts.
 *
 * Failure modes & status matrix:
 *   - env.ALERT_REGISTRY_ADDRESS === 0x0…0  → sentinel disabled, status `pending`,
 *     no network. Use this to roll back onchain writes without code revert.
 *   - writeContract throws (nonce, gas, RPC down) → status `failed`, zero txHash
 *   - waitForTransactionReceipt timeout → status `submitted` + real txHash
 *     (tx may still land; we kept observability)
 *   - receipt.status === 'reverted' → status `failed` + real txHash
 *   - happy path → status `confirmed` + real txHash
 *
 * Non-blocking contract: MUST return a status, never throw, so fanout.ts's
 * subscriber dispatch always runs even when onchain fails.
 */

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = `0x${'0'.repeat(64)}` as const;
const RECEIPT_TIMEOUT_MS = 30_000; // ~15 Base blocks @ 2s; fits CF Worker 30s CPU limit

/**
 * Selects the viem chain config for the onchain clients. Centralized + exported
 * so unit tests assert the mapping explicitly (production → base, everything
 * else → baseSepolia). Default-safe: any unknown/missing ENVIRONMENT falls
 * through to Sepolia, so a misconfigured Worker never accidentally writes to
 * Mainnet.
 */
export function selectChain(environment: string | undefined): Chain {
  return environment === 'production' ? base : baseSepolia;
}

const ALERT_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'logAlert',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'bytes32' },
      { name: 'oraclePair', type: 'bytes32' },
      { name: 'deviationBps', type: 'int128' },
      { name: 'evidenceHash', type: 'bytes32' },
      { name: 'alertType', type: 'uint32' },
    ],
    outputs: [{ name: 'alertId', type: 'uint256' }],
  },
] as const;

export interface OnchainEnv {
  ALERT_REGISTRY_ADDRESS: `0x${string}`;
  BASE_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY: string;
  ENVIRONMENT?: string;
}

export async function logAlertOnChain(
  payload: AlertPayload,
  env: OnchainEnv,
): Promise<{ txHash: string; status: OnchainStatus }> {
  if (env.ALERT_REGISTRY_ADDRESS === ZERO_ADDRESS) {
    console.warn('[alert-writer] onchain disabled: zero ALERT_REGISTRY_ADDRESS sentinel');
    return { txHash: ZERO_HASH, status: 'pending' };
  }

  const chain = selectChain(env.ENVIRONMENT);

  let txHash: `0x${string}`;
  try {
    const account = privateKeyToAccount(env.PUBLISHER_PRIVATE_KEY as `0x${string}`);
    const wallet = createWalletClient({
      account,
      chain,
      transport: http(env.BASE_RPC_URL),
    });

    txHash = await wallet.writeContract({
      address: env.ALERT_REGISTRY_ADDRESS,
      abi: ALERT_REGISTRY_ABI,
      functionName: 'logAlert',
      args: [
        hashAsset(payload.asset),
        hashOraclePair(payload.oraclePair),
        BigInt(payload.deviationBps),
        hashEvidence(payload.evidence),
        payload.alertType,
      ],
    });
  } catch (err) {
    console.error('[alert-writer] logAlert writeContract failed', err);
    return { txHash: ZERO_HASH, status: 'failed' };
  }

  try {
    const publicClient = createPublicClient({
      chain,
      transport: http(env.BASE_RPC_URL),
    });
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: RECEIPT_TIMEOUT_MS,
      confirmations: 1,
    });
    return {
      txHash,
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
    };
  } catch (err) {
    // Timeout or RPC read failure — tx was submitted but we can't confirm.
    // Preserve the hash for observability; status 'submitted' signals
    // "check later via Basescan". Not terminal, so the queue may retry and
    // re-emit a second tx — acceptable Phase-1 wart (documented in ADR 0007).
    console.warn('[alert-writer] receipt wait inconclusive, tx may still land', txHash, err);
    return { txHash, status: 'submitted' };
  }
}
