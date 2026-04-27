import { SectionBadge } from '@/components/section-badge';
import { type Locale, getDict } from '@/lib/i18n';

export function Problem({ locale }: { locale: Locale }) {
  const t = getDict(locale).problem;

  return (
    <section id="problem" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <SectionBadge>{t.badge}</SectionBadge>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-6 text-ink">
          {t.title}
        </h2>
        <p className="text-lg text-ink-secondary leading-relaxed">{t.body}</p>
      </div>
    </section>
  );
}
