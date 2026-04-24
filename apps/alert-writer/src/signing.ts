/**
 * HMAC-SHA256 signing via Web Crypto API. Used for webhook payload signatures so
 * subscribers can verify authenticity using their configured secret. Output is
 * lowercase hex — subscribers compare against the X-Sentinel-Signature header,
 * which carries the `sha256=<hex>` prefix (prefix applied in webhook.ts).
 */
export async function signHmacSha256(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
