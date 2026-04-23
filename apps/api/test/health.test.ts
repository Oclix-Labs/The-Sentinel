import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('GET /', () => {
  it('returns project metadata', async () => {
    const res = await SELF.fetch('http://self/');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      name: string;
      env: string;
      company: string;
      docs: string;
    };
    expect(body.name).toBe('RWA Sentinel');
    expect(body.env).toBe('test');
    expect(body.company).toBe('Oclix Labs');
    expect(body.docs).toMatch(/github\.com\/Oclix-Labs\/The-Sentinel/);
  });

  it('emits permissive CORS headers for browser clients', async () => {
    const res = await SELF.fetch('http://self/', {
      headers: { Origin: 'https://oclixlabs.xyz' },
    });
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
  });
});

describe('GET /health', () => {
  it('returns ok + env', async () => {
    const res = await SELF.fetch('http://self/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; env: string };
    expect(body.status).toBe('ok');
    expect(body.env).toBe('test');
  });
});
