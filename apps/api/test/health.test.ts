import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('GET /health', () => {
  it('returns 200 and echoes the environment', async () => {
    const res = await SELF.fetch('http://self/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; env: string };
    expect(body.status).toBe('ok');
    expect(body.env).toBe('test');
  });
});
