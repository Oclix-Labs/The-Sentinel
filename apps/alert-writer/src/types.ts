/**
 * Shared types for the alert-writer pipeline. AlertPayload MUST stay byte-compatible
 * with apps/poller/src/types.ts AlertPayload (Queue contract).
 */

export type OracleSource = 'chainlink' | 'pyth' | 'redstone';

export interface AlertPayload {
  asset: string;
  oraclePair: string;
  deviationBps: number;
  blockTimestamp: number;
  evidence: {
    chainlinkValue?: string;
    pythValue?: string;
    redstoneValue?: string;
    [extra: string]: unknown;
  };
  alertType: 0 | 1;
}

export type OnchainStatus = 'pending' | 'submitted' | 'confirmed' | 'failed';

export interface DeliveryOutcome {
  subscriptionId: number;
  channel: 'webhook' | 'telegram';
  status: 'ok' | 'error';
  httpStatus?: number;
  error?: string;
}

export interface DeliverySummary {
  attempts: number;
  outcomes: DeliveryOutcome[];
}
