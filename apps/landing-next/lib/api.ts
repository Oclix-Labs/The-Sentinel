// Public API client — wraps apps/api Hono Worker.
// In dev, falls back to mock data when API_BASE_URL is unset or fetch fails.

const API_BASE_URL = process.env.NEXT_PUBLIC_SENTINEL_API_URL ?? '';

export type PriceRow = {
  asset: string;
  oracle: string;
  priceE18: string;
  ts: number;
};

export type AlertRow = {
  id: number;
  asset: string;
  oraclePair: string;
  deviationBps: number;
  blockTs: number;
  txHash: string | null;
  alertType: number;
};

const MOCK_PRICES: PriceRow[] = [
  { asset: 'BTC/USD', oracle: 'chainlink', priceE18: '67234.12', ts: nowMinus(12) },
  { asset: 'BTC/USD', oracle: 'pyth', priceE18: '67241.88', ts: nowMinus(8) },
  { asset: 'ETH/USD', oracle: 'chainlink', priceE18: '3284.56', ts: nowMinus(14) },
  { asset: 'ETH/USD', oracle: 'pyth', priceE18: '3285.02', ts: nowMinus(6) },
  { asset: 'USDC/USD', oracle: 'chainlink', priceE18: '1.0001', ts: nowMinus(20) },
];

const MOCK_ALERTS: AlertRow[] = [
  {
    id: 0,
    asset: 'cbETH/USD',
    oraclePair: 'chainlink_vs_pyth',
    deviationBps: 9995,
    blockTs: nowMinus(60 * 60 * 6),
    txHash: '0x6887b042a839ec4d1a2b1e936b4bd5c304ee9e2b0f4b9d17cb711d4e04338c09',
    alertType: 0,
  },
];

function nowMinus(seconds: number) {
  return Math.floor(Date.now() / 1000) - seconds;
}

export async function fetchPrices(): Promise<{ prices: PriceRow[]; mocked: boolean }> {
  if (!API_BASE_URL) return { prices: MOCK_PRICES, mocked: true };
  try {
    const res = await fetch(`${API_BASE_URL}/prices`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = (await res.json()) as { prices: Record<string, Record<string, PriceRow>> };
    const flat: PriceRow[] = [];
    for (const asset of Object.keys(data.prices ?? {})) {
      for (const oracle of Object.keys(data.prices[asset] ?? {})) {
        flat.push({ ...(data.prices[asset][oracle] as PriceRow), asset, oracle });
      }
    }
    return { prices: flat.slice(0, 5), mocked: false };
  } catch {
    return { prices: MOCK_PRICES, mocked: true };
  }
}

export async function fetchAlerts(): Promise<{ alerts: AlertRow[]; mocked: boolean }> {
  if (!API_BASE_URL) return { alerts: MOCK_ALERTS, mocked: true };
  try {
    const res = await fetch(`${API_BASE_URL}/alerts?limit=5`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = (await res.json()) as { alerts: AlertRow[] };
    return { alerts: (data.alerts ?? []).slice(0, 5), mocked: false };
  } catch {
    return { alerts: MOCK_ALERTS, mocked: true };
  }
}
