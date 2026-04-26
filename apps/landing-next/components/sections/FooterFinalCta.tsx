import { Button } from '@/components/ui/button';
import { type Locale, getDict } from '@/lib/i18n';
import {
  AUDIT_URL,
  BASESCAN_MAINNET,
  DISCORD_URL,
  DOCS_URL,
  FARCASTER_URL,
  GITHUB_REPO,
  PREMIUM_WAITLIST_LINK,
  RESEARCH_URL,
  TELEGRAM_BOT_LINK,
  TWITTER_URL,
  WHITEPAPER_URL,
  localePath,
} from '@/lib/utils';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function FooterFinalCta({ locale }: { locale: Locale }) {
  const t = getDict(locale).footer;
  const nav = getDict(locale).nav;

  return (
    <>
      {/* Final CTA strip */}
      <section className="py-16 bg-primary/5 border-t border-primary/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink">
            {t.finalCtaCopy}
          </h3>
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary">
              {t.finalCtaButton} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* 4-column footer */}
      <footer className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-on-primary" aria-hidden="true" />
                </div>
                <span className="font-semibold text-lg text-ink tracking-tight">
                  RWA <span className="text-primary">Sentinel</span>
                </span>
              </div>
              <p className="text-sm text-ink-secondary mb-4 leading-relaxed">{t.brandTagline}</p>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                GitHub Repository →
              </a>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnProduct}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li>
                  <a
                    href={TELEGRAM_BOT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {t.productLinks.telegram}
                  </a>
                </li>
                <li>
                  <Link href={localePath(locale, 'dashboard')} className="hover:text-ink">
                    {t.productLinks.dashboard}
                  </Link>
                </li>
                <li>
                  <a href={PREMIUM_WAITLIST_LINK} className="hover:text-ink">
                    {t.productLinks.premium}
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnResources}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li>
                  <a
                    href={WHITEPAPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {nav.whitepaper}
                  </a>
                </li>
                <li>
                  <a
                    href={DOCS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {nav.docs}
                  </a>
                </li>
                <li>
                  <a
                    href={RESEARCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {nav.research}
                  </a>
                </li>
                <li>
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {nav.audit}
                  </a>
                </li>
              </ul>
            </div>

            {/* Network */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-caps mb-4 text-ink-muted">
                {t.columnNetwork}
              </h4>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li>
                  <a
                    href={BASESCAN_MAINNET}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {t.networkLinks.mainnet}
                  </a>
                </li>
                <li>
                  <span className="text-ink-muted">{t.networkLinks.status}</span>
                </li>
                <li>
                  <a
                    href={TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {t.networkLinks.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={FARCASTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {t.networkLinks.farcaster}
                  </a>
                </li>
                <li>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {t.networkLinks.discord}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 text-xs text-ink-muted font-mono">
            {t.rights}
          </div>
        </div>
      </footer>
    </>
  );
}
