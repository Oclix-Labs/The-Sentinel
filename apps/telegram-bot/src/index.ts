/**
 * Telegram Bot Worker — receives Telegram webhook updates, dispatches commands.
 *
 * Setup (one-time operator action, post-deploy):
 *   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *        -d "url=https://rwa-sentinel-telegram-bot.workers.dev/webhook" \
 *        -d "secret_token=<YOUR_SECRET>"
 *
 * The secret_token you declare there must match env.TELEGRAM_WEBHOOK_SECRET
 * (wrangler secret put TELEGRAM_WEBHOOK_SECRET).
 *
 * Owner: 모진영. D1 schema shared with api + alert-writer.
 */

import { webhookCallback } from 'grammy';
import { Hono } from 'hono';
import { buildBot } from './bot';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

app.get('/health', (c) => c.json({ status: 'ok', env: c.env.ENVIRONMENT }));

app.post('/webhook', async (c) => {
  // Secret check MUST stay outside the error-swallowing try/catch. A 401 is a real
  // auth failure we want Telegram (or a probing attacker) to see.
  const token = c.req.header('x-telegram-bot-api-secret-token');
  if (token !== c.env.TELEGRAM_WEBHOOK_SECRET) {
    return c.text('unauthorized', 401);
  }

  // Grammy handler errors must NOT propagate as 5xx — Telegram retries 5xx with
  // backoff, which amplifies transient bugs (bad payload, DB blip, reply failure)
  // into duplicate alerts. Always ack 200 once the secret is verified; log the
  // error for operator triage.
  try {
    const bot = buildBot(c.env);
    const handle = webhookCallback(bot, 'hono');
    return await handle(c);
  } catch (err) {
    console.error('[telegram-bot] webhook handler error', err);
    return c.text('ok', 200);
  }
});

export default app;
