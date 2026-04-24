import { env, fetchMock } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { processAlert } from '../src/fanout';
import { makeAlertPayload, seedSubscription } from './fixtures';

describe('processAlert', () => {
  it('inserts alert + delivers to all matching subs + returns {ok, alertId}', async () => {
    await seedSubscription({
      webhookUrl: 'https://hooks.example.com/sentinel',
      secret: 'sekret',
    });
    await seedSubscription({
      telegramChatId: '42',
      assetFilter: 'BTC/USD',
    });

    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(200, 'ok');
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, method: 'POST' })
      .reply(200, JSON.stringify({ ok: true }));

    const result = await processAlert(makeAlertPayload(), env);

    expect(result.ok).toBe(true);
    expect(result.alertId).toBeGreaterThan(0);

    const row = await env.DB.prepare(
      'SELECT onchain_status, delivery_summary, tx_hash FROM alerts WHERE id = ?',
    )
      .bind(result.alertId)
      .first<{ onchain_status: string; delivery_summary: string; tx_hash: string }>();
    expect(row?.onchain_status).toBe('pending');
    expect(row?.tx_hash).toBe(`0x${'0'.repeat(64)}`);
    const summary =
      row &&
      (JSON.parse(row.delivery_summary) as {
        attempts: number;
        outcomes: Array<{ channel: string; status: string }>;
      });
    expect(summary).toBeTruthy();
    if (!summary) throw new Error('unreachable');
    expect(summary.attempts).toBe(1);
    expect(summary.outcomes.map((o) => o.channel).sort()).toEqual(['telegram', 'webhook']);
    expect(summary.outcomes.every((o) => o.status === 'ok')).toBe(true);
  });

  it('returns {ok:false} when any delivery fails', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });

    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(503, 'down');

    const result = await processAlert(makeAlertPayload(), env);
    expect(result.ok).toBe(false);
    expect(result.alertId).toBeGreaterThan(0);

    const row = await env.DB.prepare('SELECT delivery_summary FROM alerts WHERE id = ?')
      .bind(result.alertId)
      .first<{ delivery_summary: string }>();
    const summary =
      row && (JSON.parse(row.delivery_summary) as { outcomes: Array<{ status: string }> });
    expect(summary?.outcomes[0]?.status).toBe('error');
  });

  it('skips fan-out when no subscribers match and still inserts alert', async () => {
    await seedSubscription({
      telegramChatId: '9',
      assetFilter: 'ETH/USD',
    });

    const result = await processAlert(makeAlertPayload({ asset: 'BTC/USD' }), env);
    expect(result.ok).toBe(true);
    expect(result.alertId).toBeGreaterThan(0);

    const row = await env.DB.prepare('SELECT delivery_summary FROM alerts WHERE id = ?')
      .bind(result.alertId)
      .first<{ delivery_summary: string }>();
    const summary =
      row && (JSON.parse(row.delivery_summary) as { attempts: number; outcomes: unknown[] });
    expect(summary?.attempts).toBe(1);
    expect(summary?.outcomes).toEqual([]);
  });

  it('is idempotent on redelivery of the same natural key', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });

    // Two processAlert calls → two POSTs. Register per-call (avoid .persist()).
    for (let i = 0; i < 2; i++) {
      fetchMock
        .get('https://hooks.example.com')
        .intercept({ path: '/sentinel', method: 'POST' })
        .reply(200, 'ok');
    }

    const first = await processAlert(makeAlertPayload(), env);
    const second = await processAlert(makeAlertPayload(), env);

    expect(second.alertId).toBe(first.alertId);

    const { results } = await env.DB.prepare(
      'SELECT COUNT(*) as c FROM alerts WHERE asset = ? AND oracle_pair = ? AND block_timestamp = ?',
    )
      .bind('BTC/USD', 'chainlink_vs_pyth', 1_700_000_000)
      .all<{ c: number }>();
    expect(results[0]?.c).toBe(1);
  });

  it('preserves confirmed onchain_status on redelivery (no regression to pending)', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });
    for (let i = 0; i < 2; i++) {
      fetchMock
        .get('https://hooks.example.com')
        .intercept({ path: '/sentinel', method: 'POST' })
        .reply(200, 'ok');
    }

    const first = await processAlert(makeAlertPayload(), env);
    // Simulate D4-pairing state: mark as confirmed out-of-band.
    await env.DB.prepare(
      "UPDATE alerts SET onchain_status = 'confirmed', tx_hash = '0xdeadbeef' WHERE id = ?",
    )
      .bind(first.alertId)
      .run();

    // Redeliver — processAlert must NOT overwrite confirmed status back to pending.
    await processAlert(makeAlertPayload(), env);

    const row = await env.DB.prepare('SELECT onchain_status, tx_hash FROM alerts WHERE id = ?')
      .bind(first.alertId)
      .first<{ onchain_status: string; tx_hash: string }>();
    expect(row?.onchain_status).toBe('confirmed');
    expect(row?.tx_hash).toBe('0xdeadbeef');
  });
});
