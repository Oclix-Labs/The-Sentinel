import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('harness', () => {
  it('applies migrations so D1 tables exist', async () => {
    const result = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
    ).all<{ name: string }>();
    const tableNames = result.results.map((r) => r.name);
    expect(tableNames).toContain('alerts');
    expect(tableNames).toContain('subscriptions');
    expect(tableNames).toContain('price_history');
  });

  it('env has the binding values declared in vitest.config.ts', () => {
    expect(env.ENVIRONMENT).toBe('test');
    expect(env.ALERT_REGISTRY_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(env.TELEGRAM_BOT_TOKEN).toBe('test-bot-token-not-real');
  });
});
