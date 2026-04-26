import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Roadmap } from '@/components/sections/Roadmap';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { FooterFinalCta } from '@/components/sections/FooterFinalCta';
import { SiteNav } from '@/components/site-nav';
import { type Locale, getDict } from '@/lib/i18n';

export function LandingContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <SiteNav t={t.nav} locale={locale} />
      <main>
        <Hero locale={locale} />
        <Stats locale={locale} />
        <Problem locale={locale} />
        <HowItWorks locale={locale} />
        {/* LivePreview is added in PR 2 (between HowItWorks and Roadmap). */}
        <Roadmap locale={locale} />
        <TrustSignals locale={locale} />
      </main>
      <FooterFinalCta locale={locale} />
    </>
  );
}
