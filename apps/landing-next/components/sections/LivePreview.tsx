'use client';

import { SectionBadge } from '@/components/section-badge';
import { Badge } from '@/components/ui/badge';
import { type AlertRow, type PriceRow, fetchAlerts, fetchPrices } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { localePath } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function formatTimestamp(ts: number, locale: Locale): string {
  return new Date(ts * 1000).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatBps(bps: number): string {
  const sign = bps > 0 ? '+' : '';
  return `${sign}${(bps / 100).toFixed(2)}%`;
}

export function LivePreview({ locale }: { locale: Locale }) {
  const t = getDict(locale).livePreview;
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const [p, a] = await Promise.all([fetchPrices(), fetchAlerts()]);
        if (cancelled) return;
        setPrices(p.prices);
        setAlerts(a.alerts.slice(0, 3));
        setLoaded(true);
      } catch {
        if (cancelled) return;
        setLoaded(true);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge variant="live">{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-3 text-ink">
            {t.title}
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prices */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="p-6 pb-3">
              <h3 className="font-sans font-semibold text-base text-ink">{t.pricesTitle}</h3>
            </div>
            <div className="p-6 pt-3">
              {!loaded ? (
                <p className="text-sm text-ink-muted font-mono">…</p>
              ) : prices.length === 0 ? (
                <p className="text-sm text-ink-secondary">{t.noData}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] font-mono uppercase tracking-caps text-ink-muted border-b border-slate-100">
                        <th className="py-2 pr-4">Asset</th>
                        <th className="py-2 pr-4">Oracle</th>
                        <th className="py-2 pr-4 text-right">Price</th>
                        <th className="py-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p, i) => (
                        <tr
                          key={`${p.asset}-${p.oracle}-${i}`}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="py-3 pr-4 font-mono font-semibold text-ink">{p.asset}</td>
                          <td className="py-3 pr-4 text-ink-secondary capitalize">{p.oracle}</td>
                          <td className="py-3 pr-4 text-right font-mono text-ink">${p.priceE18}</td>
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

          {/* Alerts */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="p-6 pb-3">
              <h3 className="font-sans font-semibold text-base text-ink">{t.alertsTitle}</h3>
            </div>
            <div className="p-6 pt-3">
              {!loaded ? (
                <p className="text-sm text-ink-muted font-mono">…</p>
              ) : alerts.length === 0 ? (
                <p className="text-sm text-ink-secondary">{t.noData}</p>
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
                      <div className="text-xs text-ink-muted font-mono">
                        {a.oraclePair} · {formatTimestamp(a.blockTs, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={localePath(locale, 'dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t.dashboardLink} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
