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
              // Zero sentinel: onchain path in src/deliveries/onchain.ts early-returns
              // with {pending, zero-hash}. Tests that need to exercise the real
              // writeContract path should override via per-test env or rely on the
              // Sepolia staging smoke described in the D4 PR body.
              ALERT_REGISTRY_ADDRESS: '0x0000000000000000000000000000000000000000',
              BASE_RPC_URL: 'http://127.0.0.1:0',
              PUBLISHER_PRIVATE_KEY: `0x${'11'.repeat(32)}`,
              TELEGRAM_BOT_TOKEN: 'test-bot-token-not-real',
            },
          },
        },
      },
    },
  };
});
