import type { SubscriberRow } from '../persistence';
import { signHmacSha256 } from '../signing';
import type { AlertPayload, DeliveryOutcome } from '../types';

export async function deliverWebhook(
  sub: SubscriberRow,
  payload: AlertPayload,
): Promise<DeliveryOutcome> {
  if (!sub.webhookUrl) {
    throw new Error(`deliverWebhook called with subscriber id=${sub.id} but webhookUrl is null`);
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (sub.secret) {
    headers['x-sentinel-signature'] = `sha256=${await signHmacSha256(sub.secret, body)}`;
  }

  try {
    const res = await fetch(sub.webhookUrl, { method: 'POST', headers, body });
    return {
      subscriptionId: sub.id,
      channel: 'webhook',
      status: res.ok ? 'ok' : 'error',
      httpStatus: res.status,
    };
  } catch (err) {
    return {
      subscriptionId: sub.id,
      channel: 'webhook',
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
