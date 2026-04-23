import { normalizeAsset } from './parsing';
import {
  deactivateAllForChat,
  insertTelegramSubscription,
  listActiveForChat,
} from './repositories';
import type { CommandContext, CommandResult } from './types';

const WELCOME = `Welcome to RWA Sentinel!

Commands:
  /subscribe <asset>  — get alerts for one asset (e.g. /subscribe BTC)
  /subscribe all       — get alerts for every Phase-1 asset
  /unsubscribe         — stop all alerts
  /list                — show your active subscriptions
  /help                — show this message`;

const HELP = `RWA Sentinel commands:

  /start               — welcome message
  /help                — this message
  /subscribe <asset>   — subscribe to one asset (BTC, ETH, USDC, cbETH, or any ticker)
  /subscribe all       — subscribe to every asset
  /unsubscribe         — deactivate all your subscriptions
  /list                — show your active subscriptions

Tickers are normalized: btc, BTC, BTC/USD, BTC-USD all mean BTC/USD.`;

export async function handleStart(_ctx: CommandContext): Promise<CommandResult> {
  return { text: WELCOME };
}

export async function handleHelp(_ctx: CommandContext): Promise<CommandResult> {
  return { text: HELP };
}

export async function handleSubscribe(
  ctx: CommandContext,
  args: string,
): Promise<CommandResult> {
  const parsed = normalizeAsset(args);
  if (parsed.kind === 'invalid') {
    return {
      text:
        'Usage: /subscribe <asset>\n\nExamples:\n  /subscribe BTC\n  /subscribe cbETH\n  /subscribe all',
    };
  }

  if (parsed.kind === 'all') {
    await insertTelegramSubscription(ctx.db, { chatId: ctx.chatId, assetFilter: null });
    return { text: 'Subscribed to all assets. Use /list to review or /unsubscribe to stop.' };
  }

  await insertTelegramSubscription(ctx.db, { chatId: ctx.chatId, assetFilter: parsed.value });
  return {
    text: `Subscribed to ${parsed.value}. Use /list to review or /unsubscribe to stop.`,
  };
}

export async function handleUnsubscribe(ctx: CommandContext): Promise<CommandResult> {
  const affected = await deactivateAllForChat(ctx.db, ctx.chatId);
  if (affected === 0) {
    return { text: 'You have no active subscriptions.' };
  }
  return { text: `Deactivated ${affected} subscription(s). You will no longer receive alerts.` };
}

export async function handleList(ctx: CommandContext): Promise<CommandResult> {
  const rows = await listActiveForChat(ctx.db, ctx.chatId);
  if (rows.length === 0) {
    return { text: 'You have no subscriptions yet. Use /subscribe <asset> to start.' };
  }
  const lines = rows.map((r, i) => {
    const label = r.assetFilter === null ? 'all assets' : r.assetFilter;
    return `  ${i + 1}. ${label}`;
  });
  return { text: `Active subscriptions:\n${lines.join('\n')}` };
}
