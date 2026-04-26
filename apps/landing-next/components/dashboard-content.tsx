'use client';

import { SiteNav } from '@/components/site-nav';
import { Badge } from '@/components/ui/badge';
import { type AlertRow, type PriceRow, fetchAlerts, fetchPrices } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { localePath } from '@/lib/utils';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function formatTimestamp(ts: number, locale: Locale): string {
  return new Date(ts * 1000).toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatBps(bps: number): string {
  const sign = bps > 0 ? '+' : '';
  return `${sign}${(bps / 100).toFixed(2)}%`;
}

export function DashboardContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [pricesMock, setPricesMock] = useState(true);
  const [alertsMock, setAlertsMock] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const [p, a] = await Promise.all([fetchPrices(), fetchAlerts()]);
        if (cancelled) return;
        setPrices(p.prices);
        setPricesMock(p.mocked);
        setAlerts(a.alerts);
        setAlertsMock(a.mocked);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  const showingMock = pricesMock || alertsMock;

  return (
    <>
      <SiteNav t={t.nav} locale={locale} />

      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href={localePath(locale)}
            className="inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <Badge variant="live" className="mb-3">
                LIVE
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 text-ink">
                {t.dashboard.title}
              </h1>
              <p className="text-ink-secondary mt-2">{t.dashboard.subtitle}</p>
            </div>
            {!loading && showingMock && <Badge variant="warning">{t.dashboard.mockBadge}</Badge>}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* PRICES */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="p-6 pb-3">
                <h3 className="font-sans font-semibold text-base text-ink">
                  {t.dashboard.pricesTitle}
                </h3>
              </div>
              <div className="p-6 pt-3">
                {loading ? (
                  <p className="text-sm text-ink-muted">…</p>
                ) : prices.length === 0 ? (
                  <p className="text-sm text-ink-secondary">{t.dashboard.noData}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] font-mono uppercase tracking-caps text-ink-muted border-b border-slate-100">
                          <th className="py-2 pr-4">{t.dashboard.asset}</th>
                          <th className="py-2 pr-4">{t.dashboard.oracle}</th>
                          <th className="py-2 pr-4 text-right">{t.dashboard.price}</th>
                          <th className="py-2 text-right">{t.dashboard.time}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prices.map((p, i) => (
                          <tr
                            key={`${p.asset}-${p.oracle}-${i}`}
                            className="border-b border-slate-50 last:border-0"
                          >
                            <td className="py-3 pr-4 font-mono font-semibold text-ink">
                              {p.asset}
                            </td>
                            <td className="py-3 pr-4 text-ink-secondary capitalize">{p.oracle}</td>
                            <td className="py-3 pr-4 text-right font-mono text-ink">
                              ${p.priceE18}
                            </td>
                            <td className="py-3 text-right font-mono text-xs text-ink-muted">
                              {formatTimestamp(p.ts, locale)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* ALERTS */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="p-6 pb-3">
                <h3 className="font-sans font-semibold text-base text-ink">
                  {t.dashboard.alertsTitle}
                </h3>
              </div>
              <div className="p-6 pt-3">
                {loading ? (
                  <p className="text-sm text-ink-muted">…</p>
                ) : alerts.length === 0 ? (
                  <p className="text-sm text-ink-secondary">{t.dashboard.noData}</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div key={a.id} className="border border-slate-100 rounded-md p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-mono font-semibold text-ink">{a.asset}</div>
                          <Badge variant="warning" className="shrink-0">
                            {formatBps(a.deviationBps)}
                          </Badge>
                        </div>
                        <div className="text-xs text-ink-muted font-mono mb-2">
                          {a.oraclePair} · {formatTimestamp(a.blockTs, locale)}
                        </div>
                        {a.txHash && (
                          <a
                            href={`https://basescan.org/tx/${a.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                          >
                            {t.dashboard.tx} {a.txHash.slice(0, 10)}…
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
