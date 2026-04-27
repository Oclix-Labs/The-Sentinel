import { OracleNetworkSvg } from '@/components/scenes/OracleNetworkSvg';
import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks;

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
        <OracleNetworkSvg locale={locale} />
      </div>
    </section>
  );
}
