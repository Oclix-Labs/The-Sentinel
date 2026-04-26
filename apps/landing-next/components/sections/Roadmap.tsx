import { SectionBadge } from '@/components/section-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Locale, getDict } from '@/lib/i18n';

export function Roadmap({ locale }: { locale: Locale }) {
  const t = getDict(locale).roadmap;

  return (
    <section id="roadmap" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionBadge>{t.badge}</SectionBadge>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-h1 mb-4 text-ink">
            {t.titlePart1}
            <span className="italic text-primary">{t.titleAccent1}</span>
            {t.titlePart2}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.cards.map((card, i) => (
            <Card key={card.tag} className={i === 2 ? 'border-primary/30' : ''}>
              <CardHeader>
                <Badge variant={i === 0 ? 'live' : 'section'} className="mb-3 w-fit">
                  {card.tag}
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-ink-secondary mb-4">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-primary mt-1 flex-shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {card.disclaimer && (
                  <p className="text-[11px] text-ink-muted leading-relaxed pt-3 border-t border-slate-100">
                    {card.disclaimer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
