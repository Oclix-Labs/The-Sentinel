import type { D1Migration } from '@cloudflare/vitest-pool-workers/config';

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    ENVIRONMENT: 'test';
    DB: D1Database;
    PRICES: KVNamespace;
    TEST_MIGRATIONS: D1Migration[];
  }
}
