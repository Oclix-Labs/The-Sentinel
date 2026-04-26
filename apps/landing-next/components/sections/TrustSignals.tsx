import {
  ALERT_REGISTRY_ADDRESS,
  BASESCAN_MAINNET,
  GITHUB_REPO,
  shortenAddress,
} from '@/lib/utils';
import { type Locale, getDict } from '@/lib/i18n';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function TrustSignals({ locale }: { locale: Locale }) {
  const t = getDict(locale).trust;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-lg border border-slate-200 bg-surface-alt p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-caps text-primary">
                  {t.title}
                </span>
              </div>
              <div className="text-sm text-ink-secondary mb-1">
                <span className="font-mono">{t.networkLabel}</span>
                <span className="mx-2 text-ink-muted">·</span>
                <a
                  href={BASESCAN_MAINNET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-semibold text-ink hover:text-primary inline-flex items-center gap-1"
                >
                  {shortenAddress(ALERT_REGISTRY_ADDRESS)}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <div className="text-sm text-ink-secondary">{t.licenseLine}</div>
              <div className="text-sm text-ink-muted">{t.auditLine}</div>
            </div>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 bg-white text-sm font-semibold text-ink hover:border-border-strong"
            >
              {t.githubCta}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
