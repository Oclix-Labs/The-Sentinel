import type { AlertPayload, OnchainStatus } from '../types';

interface OnchainEnv {
  ALERT_REGISTRY_ADDRESS: `0x${string}`;
  PUBLISHER_PRIVATE_KEY?: string;
}

/**
 * Stub. Real implementation lands during D4 pair programming with 권상현
 * once apps/contracts/src/AlertRegistry.sol ABI + deploy address are final.
 *
 * Real version will:
 *   1. viem walletClient + createPublicClient for Base Mainnet via env.BASE_RPC_URL
 *   2. writeContract to ALERT_REGISTRY_ADDRESS — AlertRegistry.logAlert(...)
 *   3. await waitForTransactionReceipt (max 30s)
 *   4. Return { txHash, status: 'confirmed' | 'submitted' }
 */
export async function logAlertOnChain(
  _alert: AlertPayload,
  _env: OnchainEnv,
): Promise<{ txHash: string; status: OnchainStatus }> {
  console.warn(
    '[alert-writer] STUB: skipping onchain logAlert — ABI not yet locked (see docs/MEMBER-TASKS.md D4 권상현 pairing)',
  );
  return { txHash: `0x${'0'.repeat(64)}`, status: 'pending' };
}
