import { Hono } from 'hono';

export interface Env {
  ENVIRONMENT: 'staging' | 'production' | 'test';
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/health', (c) => c.json({ status: 'ok', env: c.env.ENVIRONMENT }));

export default app;
