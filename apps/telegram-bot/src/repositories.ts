export interface TelegramSubscriptionRow {
  id: number;
  chatId: number;
  assetFilter: string | null;
}

/**
 * DB boundary note: the `subscriptions.telegram_chat_id` column is TEXT (schema
 * constraint + the CHECK predicate that enforces webhook_url XOR telegram_chat_id).
 * Callers pass chatId as a number (Telegram API type); all three functions below
 * convert to String() internally before binding. Do not bypass these helpers.
 */
export async function insertTelegramSubscription(
  db: D1Database,
  input: { chatId: number; assetFilter: string | null },
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO subscriptions (telegram_chat_id, asset_filter, active)
       VALUES (?, ?, 1)
       RETURNING id`,
    )
    .bind(String(input.chatId), input.assetFilter)
    .first<{ id: number }>();
  if (!result) throw new Error('insertTelegramSubscription: INSERT RETURNING yielded no row');
  return result.id;
}

interface DbSubscriptionRow {
  id: number;
  telegram_chat_id: string;
  asset_filter: string | null;
}

export async function listActiveForChat(
  db: D1Database,
  chatId: number,
): Promise<TelegramSubscriptionRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, telegram_chat_id, asset_filter
       FROM subscriptions
       WHERE telegram_chat_id = ? AND active = 1
       ORDER BY id ASC`,
    )
    .bind(String(chatId))
    .all<DbSubscriptionRow>();

  return results.map((row) => ({
    id: row.id,
    chatId: Number(row.telegram_chat_id),
    assetFilter: row.asset_filter,
  }));
}

export async function deactivateAllForChat(db: D1Database, chatId: number): Promise<number> {
  const result = await db
    .prepare('UPDATE subscriptions SET active = 0 WHERE telegram_chat_id = ? AND active = 1')
    .bind(String(chatId))
    .run();
  return result.meta.changes;
}
