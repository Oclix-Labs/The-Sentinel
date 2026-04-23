export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  /**
   * Bot username without the '@' prefix. Used to preset grammy's botInfo so it
   * doesn't issue getMe() on first update. In group chats, grammy strips
   * `/cmd@<username>` suffixes based on this value — a mismatch means the bot
   * silently ignores group-chat commands addressed to it. Defaults to a
   * placeholder if unset.
   */
  TELEGRAM_BOT_USERNAME?: string;
}

export interface CommandContext {
  db: D1Database;
  chatId: number;
}

export interface CommandResult {
  text: string;
  parseMode?: 'MarkdownV2';
}
