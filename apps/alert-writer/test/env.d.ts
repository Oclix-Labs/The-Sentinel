import type { D1Migration } from '@cloudflare/vitest-pool-workers/config';

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    ENVIRONMENT: 'test';
    DB: D1Database;
    ALERT_REGISTRY_ADDRESS: `0x${string}`;
    TELEGRAM_BOT_TOKEN: string;
    PUBLISHER_PRIVATE_KEY?: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
