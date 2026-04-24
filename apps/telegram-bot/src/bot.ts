import { Bot } from 'grammy';
import {
  handleHelp,
  handleList,
  handleStart,
  handleSubscribe,
  handleUnsubscribe,
} from './commands';
import type { Env } from './types';

/**
 * Preset bot identity. grammy's webhookCallback internally calls `bot.init()` on the
 * first update, which issues a `getMe` API request — that would hang indefinitely in
 * tests where fetchMock.disableNetConnect() blocks outbound. Presetting botInfo lets
 * init() skip the API call entirely. Safe to use a placeholder id because we never
 * use these fields in command logic.
 *
 * In production, the real bot token identifies us correctly; this preset only affects
 * grammy's own heuristics (e.g. stripping `@username` from group-chat command texts).
 * Username is env-configurable so the group-chat parser matches the real bot handle.
 */
function makeBotInfo(username: string) {
  return {
    id: 1,
    is_bot: true as const,
    first_name: 'RWA Sentinel',
    username,
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
    can_connect_to_business: false,
    has_main_web_app: false,
    can_manage_bots: false,
    has_topics_enabled: false,
    allows_users_to_create_topics: false,
  };
}

export function buildBot(env: Env): Bot {
  const username = env.TELEGRAM_BOT_USERNAME ?? 'rwa_sentinel_bot';
  const bot = new Bot(env.TELEGRAM_BOT_TOKEN, { botInfo: makeBotInfo(username) });

  bot.command('start', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;
    const res = await handleStart({ db: env.DB, chatId });
    await ctx.reply(res.text);
  });

  bot.command('help', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;
    const res = await handleHelp({ db: env.DB, chatId });
    await ctx.reply(res.text);
  });

  bot.command('subscribe', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;
    const res = await handleSubscribe({ db: env.DB, chatId }, ctx.match);
    await ctx.reply(res.text);
  });

  bot.command('unsubscribe', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;
    const res = await handleUnsubscribe({ db: env.DB, chatId });
    await ctx.reply(res.text);
  });

  bot.command('list', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;
    const res = await handleList({ db: env.DB, chatId });
    await ctx.reply(res.text);
  });

  return bot;
}
