import { describe, expect, it } from 'vitest';
import { alertsQuerySchema, subscriptionCreateSchema } from '../src/schemas';

describe('alertsQuerySchema', () => {
  it('parses empty query with defaults', () => {
    const parsed = alertsQuerySchema.parse({});
    expect(parsed.limit).toBe(50);
    expect(parsed.asset).toBeUndefined();
    expect(parsed.since).toBeUndefined();
  });

  it('coerces limit from string and clamps to [1,100]', () => {
    expect(alertsQuerySchema.parse({ limit: '10' }).limit).toBe(10);
    expect(() => alertsQuerySchema.parse({ limit: '0' })).toThrow();
    expect(() => alertsQuerySchema.parse({ limit: '101' })).toThrow();
  });

  it('coerces since from string unix seconds', () => {
    expect(alertsQuerySchema.parse({ since: '1700000000' }).since).toBe(1700000000);
  });
});

describe('subscriptionCreateSchema', () => {
  it('accepts webhookUrl only', () => {
    const s = subscriptionCreateSchema.parse({ webhookUrl: 'https://example.com/hook' });
    expect(s.webhookUrl).toBe('https://example.com/hook');
    expect(s.telegramChatId).toBeUndefined();
  });

  it('accepts telegramChatId only', () => {
    const s = subscriptionCreateSchema.parse({ telegramChatId: '12345' });
    expect(s.telegramChatId).toBe('12345');
    expect(s.webhookUrl).toBeUndefined();
  });

  it('rejects payload with neither channel', () => {
    expect(() => subscriptionCreateSchema.parse({})).toThrow();
  });

  it('rejects payload with both channels', () => {
    expect(() =>
      subscriptionCreateSchema.parse({
        webhookUrl: 'https://example.com/hook',
        telegramChatId: '12345',
      }),
    ).toThrow();
  });

  it('rejects non-URL webhookUrl', () => {
    expect(() => subscriptionCreateSchema.parse({ webhookUrl: 'not-a-url' })).toThrow();
  });
});
