import { fetchMock } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { deliverWebhook } from '../src/deliveries/webhook';
import { signHmacSha256 } from '../src/signing';
import { makeAlertPayload } from './fixtures';

describe('deliverWebhook', () => {
  it('POSTs the alert body and returns ok on 200', async () => {
    const payload = makeAlertPayload();

    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(200, 'ok');

    const outcome = await deliverWebhook(
      {
        id: 1,
        webhookUrl: 'https://hooks.example.com/sentinel',
        telegramChatId: null,
        secret: null,
      },
      payload,
    );

    expect(outcome).toEqual({
      subscriptionId: 1,
      channel: 'webhook',
      status: 'ok',
      httpStatus: 200,
    });
  });

  it('includes X-Sentinel-Signature when subscriber has a secret', async () => {
    const payload = makeAlertPayload();
    const body = JSON.stringify(payload);
    const expectedSig = `sha256=${await signHmacSha256('hunter2', body)}`;

    let capturedSig: string | undefined;
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(200, (opts) => {
        const headers = opts.headers as Record<string, string> | undefined;
        capturedSig = headers?.['x-sentinel-signature'];
        return 'ok';
      });

    await deliverWebhook(
      {
        id: 2,
        webhookUrl: 'https://hooks.example.com/sentinel',
        telegramChatId: null,
        secret: 'hunter2',
      },
      payload,
    );

    expect(capturedSig).toBe(expectedSig);
  });

  it('omits X-Sentinel-Signature when subscriber has no secret', async () => {
    const payload = makeAlertPayload();

    let capturedSig: string | undefined = 'present';
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(200, (opts) => {
        const headers = opts.headers as Record<string, string> | undefined;
        capturedSig = headers?.['x-sentinel-signature'];
        return 'ok';
      });

    await deliverWebhook(
      {
        id: 3,
        webhookUrl: 'https://hooks.example.com/sentinel',
        telegramChatId: null,
        secret: null,
      },
      payload,
    );

    expect(capturedSig).toBeUndefined();
  });

  it('returns error outcome on 5xx response', async () => {
    fetchMock
      .get('https://hooks.example.com')
      .intercept({ path: '/sentinel', method: 'POST' })
      .reply(503, 'service unavailable');

    const outcome = await deliverWebhook(
      {
        id: 4,
        webhookUrl: 'https://hooks.example.com/sentinel',
        telegramChatId: null,
        secret: null,
      },
      makeAlertPayload(),
    );

    expect(outcome.status).toBe('error');
    expect(outcome.httpStatus).toBe(503);
  });

  it('returns error outcome on network failure', async () => {
    fetchMock
      .get('https://down.example.com')
      .intercept({ path: '/x', method: 'POST' })
      .replyWithError(new Error('connection refused'));

    const outcome = await deliverWebhook(
      { id: 5, webhookUrl: 'https://down.example.com/x', telegramChatId: null, secret: null },
      makeAlertPayload(),
    );

    expect(outcome.status).toBe('error');
    expect(outcome.error).toMatch(/connection refused/);
  });

  it('throws if subscriber has no webhookUrl', async () => {
    await expect(
      deliverWebhook(
        { id: 6, webhookUrl: null, telegramChatId: '123', secret: null },
        makeAlertPayload(),
      ),
    ).rejects.toThrow(/webhookUrl/);
  });
});
