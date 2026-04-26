import { FooterFinalCta } from '@/components/sections/FooterFinalCta';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { LivePreview } from '@/components/sections/LivePreview';
import { Problem } from '@/components/sections/Problem';
import { Roadmap } from '@/components/sections/Roadmap';
import { Stats } from '@/components/sections/Stats';
import { TrustSignals } from '@/components/sections/TrustSignals';
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
        <LivePreview locale={locale} />
        <Roadmap locale={locale} />
        <TrustSignals locale={locale} />
      </main>
      <FooterFinalCta locale={locale} />
    </>
  );
}
