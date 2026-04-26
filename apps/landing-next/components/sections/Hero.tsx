import { Button } from '@/components/ui/button';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';
import { TELEGRAM_BOT_LINK, localePath } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale).hero;
  const isKo = locale === 'ko';

  return (
    <section className="relative pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionBadge variant="live" className="mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-on-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-primary" />
          </span>
          {t.badge}
        </SectionBadge>

        <h1
          className={`${isKo ? 'font-kohero' : 'font-serif'} text-5xl md:text-7xl font-semibold leading-[1.05] mb-6 tracking-display text-ink`}
        >
          {t.title}
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-ink-secondary mb-10 leading-relaxed">
          {t.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary">
              {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <Link href={localePath(locale, 'dashboard')}>
            <Button size="lg" variant="outline">
              {t.ctaSecondary}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
