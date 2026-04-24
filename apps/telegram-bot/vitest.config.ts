import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineWorkersConfig(async () => {
  const migrations = await readD1Migrations(path.join(here, 'test/migrations'));
  return {
    test: {
      setupFiles: ['./test/setup.ts'],
      poolOptions: {
        workers: {
          singleWorker: true,
          main: './src/index.ts',
          miniflare: {
            compatibilityDate: '2026-04-01',
            compatibilityFlags: ['nodejs_compat'],
            d1Databases: ['DB'],
            bindings: {
              ENVIRONMENT: 'test',
              TEST_MIGRATIONS: migrations,
              TELEGRAM_BOT_TOKEN: 'test-bot-token-not-real',
              TELEGRAM_WEBHOOK_SECRET: 'test-webhook-secret',
            },
          },
        },
      },
    },
  };
});
