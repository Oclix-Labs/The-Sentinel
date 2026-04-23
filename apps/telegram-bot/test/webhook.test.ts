import { env, fetchMock, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

interface TelegramUpdate {
  update_id: number;
  message: {
    message_id: number;
    from: { id: number; is_bot: boolean; first_name: string };
    chat: { id: number; type: 'private' };
    date: number;
    text: string;
    entities?: Array<{ offset: number; length: number; type: 'bot_command' }>;
  };
}

function update(chatId: number, text: string): TelegramUpdate {
  const commandMatch = /^\/[a-zA-Z]+/.exec(text);
  const entities = commandMatch
    ? [{ offset: 0, length: commandMatch[0].length, type: 'bot_command' as const }]
    : undefined;
  return {
    update_id: Math.floor(Math.random() * 1_000_000),
    message: {
      message_id: 1,
      from: { id: chatId, is_bot: false, first_name: 'Test' },
      chat: { id: chatId, type: 'private' },
      date: Math.floor(Date.now() / 1000),
      text,
      entities,
    },
  };
}

/**
 * Intercepts one Telegram Bot API sendMessage POST and captures the text payload.
 * Returns a getter that resolves to the captured text.
 */
function captureReply(): { getText: () => string | undefined } {
  let captured: string | undefined;
  fetchMock
    .get('https://api.telegram.org')
    .intercept({ path: `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, method: 'POST' })
    .reply(200, (opts) => {
      const body = opts.body as string | undefined;
      if (body) {
        const parsed = JSON.parse(body) as { text?: string };
        captured = parsed.text;
      }
      return JSON.stringify({ ok: true });
    });
  return { getText: () => captured };
}

describe('POST /webhook', () => {
  it('rejects requests missing the secret header with 401', async () => {
    const res = await SELF.fetch('http://self/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(update(42, '/start')),
    });
    expect(res.status).toBe(401);
  });

  it('rejects requests with an incorrect secret header', async () => {
    const res = await SELF.fetch('http://self/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-telegram-bot-api-secret-token': 'wrong-secret',
      },
      body: JSON.stringify(update(42, '/start')),
    });
    expect(res.status).toBe(401);
  });

  it('accepts a valid /start and replies with a welcome message', async () => {
    const reply = captureReply();

    const res = await SELF.fetch('http://self/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-telegram-bot-api-secret-token': env.TELEGRAM_WEBHOOK_SECRET,
      },
      body: JSON.stringify(update(42, '/start')),
    });
    expect(res.status).toBe(200);

    expect(reply.getText()).toMatch(/Welcome/i);
  });

  it('persists a subscription row on /subscribe BTC', async () => {
    const reply = captureReply();

    const res = await SELF.fetch('http://self/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-telegram-bot-api-secret-token': env.TELEGRAM_WEBHOOK_SECRET,
      },
      body: JSON.stringify(update(42, '/subscribe BTC')),
    });
    expect(res.status).toBe(200);

    expect(reply.getText()).toContain('BTC/USD');

    const row = await env.DB.prepare(
      'SELECT telegram_chat_id, asset_filter, active FROM subscriptions WHERE telegram_chat_id = ?',
    )
      .bind('42')
      .first<{ telegram_chat_id: string; asset_filter: string; active: number }>();
    expect(row).toEqual({
      telegram_chat_id: '42',
      asset_filter: 'BTC/USD',
      active: 1,
    });
  });

  it('/unsubscribe deactivates all rows for the chat', async () => {
    await env.DB.prepare(
      "INSERT INTO subscriptions (telegram_chat_id, asset_filter, active) VALUES ('42', 'BTC/USD', 1), ('42', 'ETH/USD', 1)",
    ).run();

    const reply = captureReply();

    const res = await SELF.fetch('http://self/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-telegram-bot-api-secret-token': env.TELEGRAM_WEBHOOK_SECRET,
      },
      body: JSON.stringify(update(42, '/unsubscribe')),
    });
    expect(res.status).toBe(200);

    expect(reply.getText()).toMatch(/2/);

    const { results } = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM subscriptions WHERE telegram_chat_id = '42' AND active = 1",
    ).all<{ c: number }>();
    expect(results[0]?.c).toBe(0);
  });
});
