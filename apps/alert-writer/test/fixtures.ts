import { env } from 'cloudflare:test';
import type { AlertPayload } from '../src/types';

export function makeAlertPayload(overrides: Partial<AlertPayload> = {}): AlertPayload {
  return {
    asset: 'BTC/USD',
    oraclePair: 'chainlink_vs_pyth',
    deviationBps: 500,
    blockTimestamp: 1_700_000_000,
    evidence: { chainlinkValue: '77000', pythValue: '77350' },
    alertType: 0,
    ...overrides,
  };
}

export async function seedSubscription(row: {
  webhookUrl?: string;
  telegramChatId?: string;
  assetFilter?: string | null;
  secret?: string | null;
  active?: number;
}): Promise<number> {
  const result = await env.DB.prepare(
    `INSERT INTO subscriptions (webhook_url, telegram_chat_id, asset_filter, secret, active)
     VALUES (?, ?, ?, ?, ?)
     RETURNING id`,
  )
    .bind(
      row.webhookUrl ?? null,
      row.telegramChatId ?? null,
      row.assetFilter ?? null,
      row.secret ?? null,
      row.active ?? 1,
    )
    .first<{ id: number }>();
  if (!result) throw new Error('seedSubscription: no row returned');
  return result.id;
}
