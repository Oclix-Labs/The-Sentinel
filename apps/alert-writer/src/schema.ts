import { z } from 'zod';

/**
 * Runtime schema for AlertPayload — validated at the queue boundary in src/index.ts
 * so malformed payloads never touch D1. Must stay in sync with src/types.ts AlertPayload,
 * which in turn is byte-compatible with apps/poller/src/types.ts AlertPayload.
 */
export const alertPayloadSchema = z.object({
  asset: z.string().min(1),
  oraclePair: z.string().min(1),
  deviationBps: z.number().int().nonnegative(),
  blockTimestamp: z.number().int().nonnegative(),
  evidence: z.record(z.unknown()),
  alertType: z.union([z.literal(0), z.literal(1)]),
});
