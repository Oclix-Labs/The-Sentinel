import type { SubscriberRow } from '../persistence';
import type { AlertPayload, DeliveryOutcome } from '../types';

interface TelegramEnv {
  TELEGRAM_BOT_TOKEN: string;
}

// MarkdownV2 reserved chars per https://core.telegram.org/bots/api#markdownv2-style
// Must escape these with a preceding backslash.
const MDV2_RESERVED = /[_*[\]()~`>#+\-=|{}.!\\]/g;

function escapeMd(value: string): string {
  return value.replace(MDV2_RESERVED, (m) => `\\${m}`);
}

function formatAlert(payload: AlertPayload): string {
  const pct = (payload.deviationBps / 100).toFixed(2);
  const lines = [
    `🚨 *${escapeMd(payload.asset)}* deviation alert`,
    `Sources: \`${escapeMd(payload.oraclePair)}\``,
    `Deviation: ${escapeMd(String(payload.deviationBps))} bps \\(${escapeMd(`${pct}%`)}\\)`,
    `Tick: ${escapeMd(String(payload.blockTimestamp))}`,
  ];
  return lines.join('\n');
}

export async function deliverTelegram(
  sub: SubscriberRow,
  payload: AlertPayload,
  env: TelegramEnv,
): Promise<DeliveryOutcome> {
  if (!sub.telegramChatId) {
    throw new Error(
      `deliverTelegram called with subscriber id=${sub.id} but telegramChatId is null`,
    );
  }

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body = JSON.stringify({
    chat_id: sub.telegramChatId,
    text: formatAlert(payload),
    parse_mode: 'MarkdownV2',
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    if (res.ok) {
      return {
        subscriptionId: sub.id,
        channel: 'telegram',
        status: 'ok',
        httpStatus: res.status,
      };
    }
    const text = await res.text();
    return {
      subscriptionId: sub.id,
      channel: 'telegram',
      status: 'error',
      httpStatus: res.status,
      error: text,
    };
  } catch (err) {
    return {
      subscriptionId: sub.id,
      channel: 'telegram',
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
