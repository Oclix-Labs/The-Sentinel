import { createExecutionContext, env, fetchMock, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';
import type { AlertPayload } from '../src/types';
import { makeAlertPayload, seedSubscription } from './fixtures';

function makeBatch(payloads: AlertPayload[]): {
  batch: MessageBatch<AlertPayload>;
  acks: number[];
  retries: number[];
} {
  const acks: number[] = [];
  const retries: number[] = [];
  const messages = payloads.map((body, i) => ({
    id: `m${i}`,
    timestamp: new Date(),
    body,
    attempts: 1,
    ack: () => acks.push(i),
    retry: () => retries.push(i),
  }));
  const batch: MessageBatch<AlertPayload> = {
    queue: 'rwa-sentinel-alerts-test',
    messages,
    metadata: { metrics: { backlogCount: 0, backlogBytes: 0 } },
    ackAll: () => {
      for (let i = 0; i < messages.length; i++) acks.push(i);
    },
    retryAll: () => {
      for (let i = 0; i < messages.length; i++) retries.push(i);
    },
  };
  return { batch, acks, retries };
}

describe('queue handler', () => {
  it('acks each message on successful fan-out', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });
    // Two messages → two POSTs. Register per-call (avoid .persist() — it leaks across
    // tests because assertNoPendingInterceptors treats persisted as "not pending").
    for (let i = 0; i < 2; i++) {
      fetchMock
        .get('https://hooks.example.com')
        .intercept({ path: '/sentinel', method: 'POST' })
        .reply(200, 'ok');
    }

    const { batch, acks, retries } = makeBatch([
      makeAlertPayload({ blockTimestamp: 1_700_000_000 }),
      makeAlertPayload({ blockTimestamp: 1_700_000_001 }),
    ]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(acks.sort((a, b) => a - b)).toEqual([0, 1]);
    expect(retries).toEqual([]);
  });

  it('retries a message on fan-out failure', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(503, 'down');

    const { batch, acks, retries } = makeBatch([makeAlertPayload()]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(acks).toEqual([]);
    expect(retries).toEqual([0]);
  });

  it('retries the specific failed message in a mixed batch', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });
    // First call succeeds, second fails.
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(200, 'ok');
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(500, 'boom');

    const { batch, acks, retries } = makeBatch([
      makeAlertPayload({ blockTimestamp: 1_700_000_000 }),
      makeAlertPayload({ blockTimestamp: 1_700_000_001 }),
    ]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(acks).toEqual([0]);
    expect(retries).toEqual([1]);
  });

  it('acks and drops a message whose body fails AlertPayload schema (permanent failure)', async () => {
    await seedSubscription({ webhookUrl: 'https://hooks.example.com/sentinel' });
    // No fetchMock interceptor — parsing fails before any fetch.

    // Deliberately malformed body: missing required fields, alertType out of range.
    // biome-ignore lint/suspicious/noExplicitAny: constructing an invalid body for boundary test.
    const bad = { asset: 123, deviationBps: 'not-a-number', alertType: 9 } as any;
    const { batch, acks, retries } = makeBatch([bad]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(acks).toEqual([0]);
    expect(retries).toEqual([]);

    // No D1 row should have been inserted.
    const { results } = await env.DB.prepare('SELECT COUNT(*) as c FROM alerts').all<{
      c: number;
    }>();
    expect(results[0]?.c).toBe(0);
  });

  it('retries a message when the handler surfaces a network error as delivery error', async () => {
    // No fetchMock interceptor registered — fetchMock.disableNetConnect() makes the
    // fetch throw. deliverWebhook catches and returns {status:'error'}, so the alert
    // comes back ok=false and the handler calls msg.retry().
    await seedSubscription({ webhookUrl: 'https://never-registered.example.com/hook' });

    const { batch, acks, retries } = makeBatch([makeAlertPayload()]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(acks).toEqual([]);
    expect(retries).toEqual([0]);
  });
});
