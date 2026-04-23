import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { logAlertOnChain } from '../src/deliveries/onchain';
import { makeAlertPayload } from './fixtures';

describe('logAlertOnChain (stub)', () => {
  it('returns a deterministic zero tx hash marked as pending', async () => {
    const result = await logAlertOnChain(makeAlertPayload(), env);
    expect(result.txHash).toBe(`0x${'0'.repeat(64)}`);
    expect(result.status).toBe('pending');
  });

  it('does not make any outbound network requests', async () => {
    // fetchMock.disableNetConnect() is active in setup — any fetch() would throw.
    // The stub must not reach network. Absence of error here is the assertion.
    await logAlertOnChain(makeAlertPayload(), env);
  });
});
