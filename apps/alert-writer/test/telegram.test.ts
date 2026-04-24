import { env, fetchMock } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { deliverTelegram } from '../src/deliveries/telegram';
import { makeAlertPayload } from './fixtures';

describe('deliverTelegram', () => {
  it('POSTs to the Bot API sendMessage endpoint with chat_id + formatted text', async () => {
    let capturedBody: string | undefined;
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, method: 'POST' })
      .reply(200, (opts) => {
        capturedBody = opts.body as string | undefined;
        return JSON.stringify({ ok: true });
      });

    const outcome = await deliverTelegram(
      { id: 1, webhookUrl: null, telegramChatId: '42', secret: null },
      makeAlertPayload({ asset: 'cbETH/USD', deviationBps: 9995 }),
      env,
    );

    expect(outcome).toEqual({
      subscriptionId: 1,
      channel: 'telegram',
      status: 'ok',
      httpStatus: 200,
    });
    expect(capturedBody).toBeDefined();
    const parsed = JSON.parse(capturedBody ?? '') as {
      chat_id: string;
      text: string;
      parse_mode: string;
    };
    expect(parsed.chat_id).toBe('42');
    expect(parsed.parse_mode).toBe('MarkdownV2');
    expect(parsed.text).toContain('cbETH');
    expect(parsed.text).toContain('9995');
  });

  it('returns error outcome on Telegram API error', async () => {
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, method: 'POST' })
      .reply(400, JSON.stringify({ ok: false, description: 'chat not found' }));

    const outcome = await deliverTelegram(
      { id: 2, webhookUrl: null, telegramChatId: '99', secret: null },
      makeAlertPayload(),
      env,
    );

    expect(outcome.status).toBe('error');
    expect(outcome.httpStatus).toBe(400);
    expect(outcome.error).toMatch(/chat not found/);
  });

  it('throws if subscriber has no telegramChatId', async () => {
    await expect(
      deliverTelegram(
        { id: 3, webhookUrl: 'https://x.com', telegramChatId: null, secret: null },
        makeAlertPayload(),
        env,
      ),
    ).rejects.toThrow(/telegramChatId/);
  });

  it('escapes MarkdownV2 reserved chars in pair field', async () => {
    let capturedText: string | undefined;
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, method: 'POST' })
      .reply(200, (opts) => {
        const body = JSON.parse((opts.body as string) ?? '') as { text: string };
        capturedText = body.text;
        return JSON.stringify({ ok: true });
      });

    await deliverTelegram(
      { id: 4, webhookUrl: null, telegramChatId: '42', secret: null },
      makeAlertPayload({ oraclePair: 'chainlink_vs_pyth' }),
      env,
    );

    // '_' MUST be escaped in MarkdownV2 — otherwise Telegram interprets as italics.
    expect(capturedText).toContain('chainlink\\_vs\\_pyth');
  });
});
