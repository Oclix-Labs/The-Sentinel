import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import {
  deactivateAllForChat,
  insertTelegramSubscription,
  listActiveForChat,
} from '../src/repositories';
import { seedTelegramSubscription } from './fixtures';

describe('insertTelegramSubscription', () => {
  it('inserts an active row with telegram_chat_id stored as string', async () => {
    const id = await insertTelegramSubscription(env.DB, {
      chatId: 42,
      assetFilter: 'BTC/USD',
    });
    expect(id).toBeGreaterThan(0);

    const row = await env.DB.prepare(
      'SELECT telegram_chat_id, asset_filter, active FROM subscriptions WHERE id = ?',
    )
      .bind(id)
      .first<{ telegram_chat_id: string; asset_filter: string; active: number }>();
    expect(row).toEqual({
      telegram_chat_id: '42',
      asset_filter: 'BTC/USD',
      active: 1,
    });
  });

  it('accepts NULL asset_filter for the "all" case', async () => {
    const id = await insertTelegramSubscription(env.DB, { chatId: 7, assetFilter: null });
    const row = await env.DB.prepare('SELECT asset_filter FROM subscriptions WHERE id = ?')
      .bind(id)
      .first<{ asset_filter: string | null }>();
    expect(row?.asset_filter).toBeNull();
  });
});

describe('listActiveForChat', () => {
  it('returns empty array when no subscriptions exist', async () => {
    const rows = await listActiveForChat(env.DB, 42);
    expect(rows).toEqual([]);
  });

  it('returns only active rows for the specified chat', async () => {
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'BTC/USD' });
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'ETH/USD' });
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'cbETH/USD', active: 0 });
    await seedTelegramSubscription({ chatId: 99, assetFilter: 'BTC/USD' });

    const rows = await listActiveForChat(env.DB, 42);
    expect(rows).toHaveLength(2);
    const filters = rows.map((r) => r.assetFilter).sort();
    expect(filters).toEqual(['BTC/USD', 'ETH/USD']);
  });

  it('returns NULL filter as null in the typed object', async () => {
    await seedTelegramSubscription({ chatId: 7, assetFilter: null });
    const rows = await listActiveForChat(env.DB, 7);
    expect(rows[0]?.assetFilter).toBeNull();
  });

  it('does NOT return webhook-url-only rows (different telegram_chat_id OR null)', async () => {
    // A webhook-only subscription created via the API's POST /subscribers will
    // have telegram_chat_id=NULL, so listActiveForChat(anyChatId) must not match.
    await env.DB.prepare(
      "INSERT INTO subscriptions (webhook_url, active) VALUES ('https://hook.example.com/x', 1)",
    ).run();

    const rows = await listActiveForChat(env.DB, 42);
    expect(rows).toEqual([]);
  });
});

describe('deactivateAllForChat', () => {
  it('sets active=0 for every row belonging to the chat and returns affected count', async () => {
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'BTC/USD' });
    await seedTelegramSubscription({ chatId: 42, assetFilter: 'ETH/USD' });
    await seedTelegramSubscription({ chatId: 99, assetFilter: 'BTC/USD' });

    const affected = await deactivateAllForChat(env.DB, 42);
    expect(affected).toBe(2);

    const rows42 = await listActiveForChat(env.DB, 42);
    const rows99 = await listActiveForChat(env.DB, 99);
    expect(rows42).toEqual([]);
    expect(rows99).toHaveLength(1);
  });

  it('returns 0 when no rows match', async () => {
    const affected = await deactivateAllForChat(env.DB, 1234);
    expect(affected).toBe(0);
  });
});
