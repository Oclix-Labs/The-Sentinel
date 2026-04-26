import type { Dict } from '@/lib/i18n';
import {
  ALERT_REGISTRY_ADDRESS,
  BASESCAN_MAINNET,
  BASESCAN_SEPOLIA,
  shortenAddress,
} from '@/lib/utils';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function ContractsCallout({ t }: { t: Dict['contracts'] }) {
  return (
    <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
              {t.label}
            </span>
          </div>
          <h4 className="font-bold text-lg">{t.title}</h4>
          <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs">
          <a
            href={BASESCAN_MAINNET}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-colors"
          >
            <span className="text-slate-400">Mainnet</span>
            <span className="font-semibold">{shortenAddress(ALERT_REGISTRY_ADDRESS)}</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          <a
            href={BASESCAN_SEPOLIA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-colors"
          >
            <span className="text-slate-400">Sepolia</span>
            <span className="font-semibold">{shortenAddress(ALERT_REGISTRY_ADDRESS)}</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
