'use client';

import { SiteNav } from '@/components/site-nav';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Promise.all([fetchPrices(), fetchAlerts()])
      .then(([p, a]) => {
        if (cancelled) return;
        setPrices(p.prices);
        setPricesMock(p.mocked);
        setAlerts(a.alerts);
        setAlertsMock(a.mocked);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
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
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <Badge className="mb-3">Live</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold prose-title">
                {t.dashboard.title}
              </h1>
              <p className="text-slate-500 mt-2">{t.dashboard.subtitle}</p>
            </div>
            {!loading && showingMock && (
              <Badge variant="warning">
                {locale === 'ko' ? 'Mock 데이터 (API 미연결)' : 'Showing mock data'}
              </Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* PRICES */}
            <Card>
              <CardHeader>
                <CardTitle>{t.dashboard.pricesTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-slate-400">…</p>
                ) : prices.length === 0 ? (
                  <p className="text-sm text-slate-500">{t.dashboard.noData}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100">
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
                            <td className="py-3 pr-4 font-mono font-semibold">{p.asset}</td>
                            <td className="py-3 pr-4 text-slate-500 capitalize">{p.oracle}</td>
                            <td className="py-3 pr-4 text-right font-mono">${p.priceE18}</td>
                            <td className="py-3 text-right font-mono text-xs text-slate-400">
                              {formatTimestamp(p.ts, locale)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ALERTS */}
            <Card>
              <CardHeader>
                <CardTitle>{t.dashboard.alertsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-slate-400">…</p>
                ) : alerts.length === 0 ? (
                  <p className="text-sm text-slate-500">{t.dashboard.noData}</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div key={a.id} className="border border-slate-100 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-mono font-semibold">{a.asset}</div>
                          <Badge variant="warning" className="shrink-0">
                            {formatBps(a.deviationBps)}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mb-2">
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
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-xs text-slate-400 font-mono">
            {locale === 'ko'
              ? 'API 연결: NEXT_PUBLIC_SENTINEL_API_URL 환경변수 설정 시 실제 데이터 표시. 미설정 시 mock.'
              : 'API source: set NEXT_PUBLIC_SENTINEL_API_URL to use live data. Otherwise mock.'}
          </div>
        </div>
      </main>
    </>
  );
}
