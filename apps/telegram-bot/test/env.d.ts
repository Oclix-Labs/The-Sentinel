import type { D1Migration } from '@cloudflare/vitest-pool-workers/config';

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    ENVIRONMENT: 'test';
    DB: D1Database;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_WEBHOOK_SECRET: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
