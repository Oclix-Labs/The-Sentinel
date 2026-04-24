import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import {
  handleHelp,
  handleList,
  handleStart,
  handleSubscribe,
  handleUnsubscribe,
} from '../src/commands';
import type { CommandContext } from '../src/types';
import { seedTelegramSubscription } from './fixtures';

function ctx(chatId: number): CommandContext {
  return { db: env.DB, chatId };
}

describe('handleStart', () => {
  it('returns a welcome message mentioning the commands', async () => {
    const res = await handleStart(ctx(42));
    expect(res.text).toMatch(/Welcome/i);
    expect(res.text).toContain('/subscribe');
    expect(res.text).toContain('/unsubscribe');
    expect(res.text).toContain('/list');
  });
});

describe('handleHelp', () => {
  it('lists every command with a one-line description', async () => {
    const res = await handleHelp(ctx(42));
    expect(res.text).toContain('/start');
    expect(res.text).toContain('/help');
    expect(res.text).toContain('/subscribe');
    expect(res.text).toContain('/unsubscribe');
    expect(res.text).toContain('/list');
  });
});

describe('handleSubscribe', () => {
  it('creates a subscription for a valid asset ticker', async () => {
    const res = await handleSubscribe(ctx(42), 'BTC');
    expect(res.text).toMatch(/subscribed.*BTC\/USD/i);

    const { results } = await env.DB.prepare(
      'SELECT asset_filter, active FROM subscriptions WHERE telegram_chat_id = ?',
    )
      .bind('42')
      .all<{ asset_filter: string; active: number }>();
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ asset_filter: 'BTC/USD', active: 1 });
  });

  it('subscribes to all assets when arg is "all"', async () => {
    await handleSubscribe(ctx(42), 'all');
    const row = await env.DB.prepare(
      'SELECT asset_filter FROM subscriptions WHERE telegram_chat_id = ?',
    )
      .bind('42')
      .first<{ asset_filter: string | null }>();
    expect(row?.asset_filter).toBeNull();
  });

  it('returns a usage message and inserts nothing when arg is missing', async () => {
    const res = await handleSubscribe(ctx(42), '');
    expect(res.text).toMatch(/usage/i);

    const { results } = await env.DB.prepare(
      'SELECT COUNT(*) as c FROM subscriptions WHERE telegram_chat_id = ?',
    )
      .bind('42')
      .all<{ c: number }>();
    expect(results[0]?.c).toBe(0);
  });

  it('returns a usage message when arg is invalid (multi-token)', async () => {
    const res = await handleSubscribe(ctx(42), 'BTC ETH');
    expect(res.text).toMatch(/usage/i);
  });
});

describe('handleUnsubscribe', () => {
  it("deactivates all of the chat's active subscriptions and reports the count", async () => {
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'BTC/USD' });
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'ETH/USD' });
    await seedTelegramSubscription({ chatId: 99, assetFilter: 'BTC/USD' });

    const res = await handleUnsubscribe(ctx(42));
    expect(res.text).toMatch(/2/);

    const { results: for42 } = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM subscriptions WHERE telegram_chat_id = '42' AND active = 1",
    ).all<{ c: number }>();
    const { results: for99 } = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM subscriptions WHERE telegram_chat_id = '99' AND active = 1",
    ).all<{ c: number }>();
    expect(for42[0]?.c).toBe(0);
    expect(for99[0]?.c).toBe(1);
  });

  it('reports "no active subscriptions" when the chat has none', async () => {
    const res = await handleUnsubscribe(ctx(42));
    expect(res.text).toMatch(/no active/i);
  });
});

describe('handleList', () => {
  it('lists all active subscriptions for the chat', async () => {
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'BTC/USD' });
    await seedTelegramSubscription({ chatId: 42, assetFilter: null });

    const res = await handleList(ctx(42));
    expect(res.text).toContain('BTC/USD');
    expect(res.text).toMatch(/all/i);
  });

  it('says "no subscriptions" when the chat has none', async () => {
    const res = await handleList(ctx(42));
    expect(res.text).toMatch(/no subscriptions/i);
  });
});
