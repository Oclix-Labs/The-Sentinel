import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineWorkersConfig(async () => {
  // readD1Migrations runs in Node (config-time) and returns D1Migration[]. We pass it
  // as a binding so setup.ts can apply it inside workerd via applyD1Migrations (no
  // node:fs available in the worker runtime).
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
            kvNamespaces: ['PRICES'],
            d1Databases: ['DB'],
            bindings: { ENVIRONMENT: 'test', TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  };
});
