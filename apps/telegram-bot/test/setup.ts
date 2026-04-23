import { applyD1Migrations, env, fetchMock } from 'cloudflare:test';
import { beforeAll, beforeEach } from 'vitest';

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  fetchMock.activate();
  fetchMock.disableNetConnect();
});

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM subscriptions').run();
  await env.DB.prepare('DELETE FROM alerts').run();
  await env.DB.prepare('DELETE FROM price_history').run();
  fetchMock.assertNoPendingInterceptors();
});
