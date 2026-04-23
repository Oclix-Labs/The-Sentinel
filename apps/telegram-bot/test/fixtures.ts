import { env } from 'cloudflare:test';

export async function seedTelegramSubscription(row: {
  chatId: number;
  assetFilter?: string | null;
  active?: number;
}): Promise<number> {
  const result = await env.DB.prepare(
    `INSERT INTO subscriptions (telegram_chat_id, asset_filter, active)
     VALUES (?, ?, ?)
     RETURNING id`,
  )
    .bind(String(row.chatId), row.assetFilter ?? null, row.active ?? 1)
    .first<{ id: number }>();
  if (!result) throw new Error('seedTelegramSubscription: no row returned');
  return result.id;
}
