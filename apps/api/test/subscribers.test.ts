import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('POST /subscribers', () => {
  it('accepts webhookUrl only and persists the row', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ webhookUrl: 'https://example.com/hook' }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { id: number; createdAt: number };
    expect(body.id).toBeGreaterThan(0);
    expect(body.createdAt).toBeGreaterThan(0);

    const row = await env.DB.prepare(
      'SELECT webhook_url, telegram_chat_id, active FROM subscriptions WHERE id = ?',
    )
      .bind(body.id)
      .first<{ webhook_url: string | null; telegram_chat_id: string | null; active: number }>();
    expect(row).not.toBeNull();
    expect(row!.webhook_url).toBe('https://example.com/hook');
    expect(row!.telegram_chat_id).toBeNull();
    expect(row!.active).toBe(1);
  });

  it('accepts telegramChatId only', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ telegramChatId: '42' }),
    });
    expect(res.status).toBe(201);
  });

  it('serializes assetFilter as CSV in storage', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        telegramChatId: '42',
        assetFilter: ['BTC/USD', 'ETH/USD'],
      }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { id: number };

    const row = await env.DB.prepare('SELECT asset_filter FROM subscriptions WHERE id = ?')
      .bind(body.id)
      .first<{ asset_filter: string }>();
    expect(row!.asset_filter).toBe('BTC/USD,ETH/USD');
  });

  it('rejects payload with neither channel', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('rejects payload with both channels', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ webhookUrl: 'https://x.com/h', telegramChatId: '1' }),
    });
    expect(res.status).toBe(400);
  });

  it('rejects non-URL webhookUrl', async () => {
    const res = await SELF.fetch('http://self/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ webhookUrl: 'not-a-url' }),
    });
    expect(res.status).toBe(400);
  });
});
