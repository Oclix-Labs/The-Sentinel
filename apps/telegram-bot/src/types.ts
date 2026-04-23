export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
}

export interface CommandContext {
  db: D1Database;
  chatId: number;
}

export interface CommandResult {
  text: string;
  parseMode?: 'MarkdownV2';
}
