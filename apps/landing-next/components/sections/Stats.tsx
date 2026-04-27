'use client';

import { fetchAlerts } from '@/lib/api';
import { type Locale, getDict } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export function Stats({ locale }: { locale: Locale }) {
  const t = getDict(locale).stats;
  const [alertCount, setAlertCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        const result = await fetchAlerts();
        if (cancelled) return;
        setAlertCount(result.alerts.length);
      } catch {
        if (cancelled) return;
        setAlertCount(null);
      }
    }

    load();
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  const items = [
    { value: t.failuresValue, label: t.failuresLabel },
    { value: t.lostValue, label: t.lostLabel },
    {
      value: alertCount === null ? '—' : String(alertCount),
      label: t.alertsLabel,
    },
    { value: t.licenseValue, label: t.licenseLabel },
  ];

  return (
    <section className="py-12 border-y border-slate-100 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <div className="font-mono text-4xl md:text-5xl font-semibold text-primary">
              {item.value}
            </div>
            <div className="text-xs uppercase tracking-caps text-ink-muted mt-2 font-mono">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
