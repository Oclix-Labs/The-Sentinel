'use client';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';
import type { Dict, Locale } from '@/lib/i18n';
import {
  AUDIT_URL,
  DOCS_URL,
  GITHUB_REPO,
  RESEARCH_URL,
  TELEGRAM_BOT_LINK,
  WHITEPAPER_URL,
  cn,
  localePath,
} from '@/lib/utils';
import { ChevronDown, Github, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SiteNav({ t, locale }: { t: Dict['nav']; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-colors',
        scrolled
          ? 'bg-white border-b border-slate-200'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href={localePath(locale)} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-on-primary" aria-hidden="true" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-ink">
            RWA <span className="text-primary">Sentinel</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
          <Link href={localePath(locale, 'dashboard')} className="hover:text-ink">
            {t.dashboard}
          </Link>
          <a href="#how-it-works" className="hover:text-ink">
            {t.coverage}
          </a>
          <a href="#roadmap" className="hover:text-ink">
            {t.roadmap}
          </a>
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-ink"
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
            >
              {t.resources} <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-0 w-48 pt-2">
                <div
                  role="menu"
                  className="rounded-md border border-slate-200 bg-white shadow-sm py-2"
                >
                  <a
                    href={WHITEPAPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm hover:bg-surface-alt"
                    role="menuitem"
                  >
                    {t.whitepaper}
                  </a>
                  <a
                    href={DOCS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm hover:bg-surface-alt"
                    role="menuitem"
                  >
                    {t.docs}
                  </a>
                  <a
                    href={RESEARCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm hover:bg-surface-alt"
                    role="menuitem"
                  >
                    {t.research}
                  </a>
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm hover:bg-surface-alt"
                    role="menuitem"
                  >
                    {t.audit}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} />
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-secondary hover:text-ink hover:bg-surface-alt"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={TELEGRAM_BOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              {t.cta}
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
