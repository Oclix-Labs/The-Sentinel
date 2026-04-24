import { describe, expect, it } from 'vitest';
import { signHmacSha256 } from '../src/signing';

describe('signHmacSha256', () => {
  it('produces deterministic hex output for the same secret + body', async () => {
    const sig1 = await signHmacSha256('my-secret', '{"hello":"world"}');
    const sig2 = await signHmacSha256('my-secret', '{"hello":"world"}');
    expect(sig1).toBe(sig2);
    expect(sig1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes output when secret changes', async () => {
    const a = await signHmacSha256('secret-a', 'body');
    const b = await signHmacSha256('secret-b', 'body');
    expect(a).not.toBe(b);
  });

  it('changes output when body changes', async () => {
    const a = await signHmacSha256('secret', 'body-a');
    const b = await signHmacSha256('secret', 'body-b');
    expect(a).not.toBe(b);
  });

  it('matches RFC 4231 Test Case 1 (HMAC-SHA256)', async () => {
    // From RFC 4231 Test Case 1: key=0x0b × 20, data="Hi There".
    // Expected: b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7
    const key = '\x0b'.repeat(20);
    const got = await signHmacSha256(key, 'Hi There');
    expect(got).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
  });
});
