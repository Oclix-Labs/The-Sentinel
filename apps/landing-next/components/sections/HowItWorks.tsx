'use client';

import { OracleNetworkSvg } from '@/components/scenes/OracleNetworkSvg';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const OracleNetworkScene = dynamic(
  () => import('@/components/scenes/OracleNetworkScene'),
  {
    ssr: false,
    loading: () => <SceneSkeleton />,
  },
);

function SceneSkeleton() {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-surface-alt"
      style={{ height: '320px' }}
      aria-hidden="true"
    />
  );
}

function useShowFallback(): boolean {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setFallback(reducedMotion || mobile);
  }, []);

  return fallback;
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks;
  const showFallback = useShowFallback();

  return (
    <section id="how-it-works" className="py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <SectionBadge>{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-6 text-ink">
            {t.titlePart1}
            <span className="italic text-primary">{t.titleAccent}</span>
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">{t.body}</p>
        </div>

        {showFallback ? (
          <OracleNetworkSvg locale={locale} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-surface-alt overflow-hidden">
            <OracleNetworkScene locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}
