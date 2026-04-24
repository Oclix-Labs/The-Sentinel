import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import {
  findAlertByNaturalKey,
  insertAlert,
  listActiveSubscribersForAsset,
  updateAlertDelivery,
  updateAlertOnchain,
} from '../src/persistence';
import { makeAlertPayload, seedSubscription } from './fixtures';

describe('insertAlert', () => {
  it('creates a pending row and returns id', async () => {
    const id = await insertAlert(env.DB, makeAlertPayload());
    expect(id).toBeGreaterThan(0);

    const row = await env.DB.prepare(
      'SELECT asset, oracle_pair, onchain_status, tx_hash FROM alerts WHERE id = ?',
    )
      .bind(id)
      .first<{
        asset: string;
        oracle_pair: string;
        onchain_status: string;
        tx_hash: string | null;
      }>();
    expect(row).toEqual({
      asset: 'BTC/USD',
      oracle_pair: 'chainlink_vs_pyth',
      onchain_status: 'pending',
      tx_hash: null,
    });
  });

  it('round-trips evidence JSON', async () => {
    const payload = makeAlertPayload({
      evidence: { chainlinkValue: '123', pythValue: '456', extra: { nested: true } },
    });
    const id = await insertAlert(env.DB, payload);

    const row = await env.DB.prepare('SELECT evidence FROM alerts WHERE id = ?')
      .bind(id)
      .first<{ evidence: string }>();
    expect(row?.evidence).toBeDefined();
    expect(row && JSON.parse(row.evidence)).toEqual(payload.evidence);
  });
});

describe('findAlertByNaturalKey', () => {
  it('returns null when no matching row exists', async () => {
    const found = await findAlertByNaturalKey(
      env.DB,
      'BTC/USD',
      'chainlink_vs_pyth',
      1_700_000_000,
    );
    expect(found).toBeNull();
  });

  it('returns the row id + onchain_status for matching natural key', async () => {
    const id = await insertAlert(env.DB, makeAlertPayload());
    const found = await findAlertByNaturalKey(
      env.DB,
      'BTC/USD',
      'chainlink_vs_pyth',
      1_700_000_000,
    );
    expect(found).toEqual({ id, onchainStatus: 'pending' });
  });
});

describe('updateAlertOnchain', () => {
  it('records tx_hash and transitions status', async () => {
    const id = await insertAlert(env.DB, makeAlertPayload());
    await updateAlertOnchain(env.DB, id, '0xabcdef', 'submitted');

    const row = await env.DB.prepare('SELECT tx_hash, onchain_status FROM alerts WHERE id = ?')
      .bind(id)
      .first<{ tx_hash: string; onchain_status: string }>();
    expect(row).toEqual({ tx_hash: '0xabcdef', onchain_status: 'submitted' });
  });
});

describe('updateAlertDelivery', () => {
  it('merges delivery_summary as JSON', async () => {
    const id = await insertAlert(env.DB, makeAlertPayload());
    await updateAlertDelivery(env.DB, id, {
      attempts: 1,
      outcomes: [{ subscriptionId: 7, channel: 'webhook', status: 'ok', httpStatus: 200 }],
    });

    const row = await env.DB.prepare('SELECT delivery_summary FROM alerts WHERE id = ?')
      .bind(id)
      .first<{ delivery_summary: string }>();
    expect(row && JSON.parse(row.delivery_summary)).toEqual({
      attempts: 1,
      outcomes: [{ subscriptionId: 7, channel: 'webhook', status: 'ok', httpStatus: 200 }],
    });
  });
});

describe('listActiveSubscribersForAsset', () => {
  it('returns only active rows', async () => {
    await seedSubscription({ webhookUrl: 'https://a.example.com', active: 1 });
    await seedSubscription({ webhookUrl: 'https://b.example.com', active: 0 });

    const rows = await listActiveSubscribersForAsset(env.DB, 'BTC/USD');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ webhookUrl: 'https://a.example.com' });
  });

  it('includes subs with asset_filter containing the asset (CSV match)', async () => {
    await seedSubscription({ telegramChatId: '1', assetFilter: 'BTC/USD,ETH/USD' });
    await seedSubscription({ telegramChatId: '2', assetFilter: 'ETH/USD' });
    await seedSubscription({ telegramChatId: '3', assetFilter: null });

    const rows = await listActiveSubscribersForAsset(env.DB, 'BTC/USD');
    const chatIds = rows.map((r) => r.telegramChatId).sort();
    expect(chatIds).toEqual(['1', '3']);
  });

  it('tolerates whitespace around CSV entries', async () => {
    await seedSubscription({ telegramChatId: '1', assetFilter: ' BTC/USD , ETH/USD ' });
    const rows = await listActiveSubscribersForAsset(env.DB, 'BTC/USD');
    expect(rows.map((r) => r.telegramChatId)).toEqual(['1']);
  });

  it('rejects an empty asset_filter string (treated as empty allow-list)', async () => {
    await seedSubscription({ telegramChatId: '1', assetFilter: '' });
    await seedSubscription({ telegramChatId: '2', assetFilter: null });

    const rows = await listActiveSubscribersForAsset(env.DB, 'BTC/USD');
    // Empty string parses to [''], which does not include 'BTC/USD' — exclude sub 1.
    // NULL filter means all-assets — include sub 2.
    expect(rows.map((r) => r.telegramChatId)).toEqual(['2']);
  });

  it('ignores empty CSV entries from malformed filter strings', async () => {
    await seedSubscription({ telegramChatId: '1', assetFilter: 'BTC/USD,,ETH/USD' });
    const rows = await listActiveSubscribersForAsset(env.DB, 'BTC/USD');
    expect(rows.map((r) => r.telegramChatId)).toEqual(['1']);
  });
});
