'use client';

import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Path-based locale switching. EN routes live at root (/, /dashboard).
// KO routes mirror under /ko (/ko/, /ko/dashboard). Switching just
// adds or strips the /ko prefix.
function swapLocale(pathname: string, target: Locale): string {
  // Strip any existing /ko prefix
  const stripped = pathname.replace(/^\/ko(\/|$)/, '/');
  if (target === 'ko') {
    if (stripped === '/') return '/ko/';
    return `/ko${stripped}`;
  }
  return stripped;
}

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() ?? '/';

  return (
    <fieldset
      className="flex bg-slate-100 p-1 rounded-full border-0 m-0"
      aria-label="Language selector"
    >
      <Link
        href={swapLocale(pathname, 'en')}
        aria-pressed={current === 'en'}
        className={cn(
          'px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all',
          current === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-600',
        )}
      >
        EN
      </Link>
      <Link
        href={swapLocale(pathname, 'ko')}
        aria-pressed={current === 'ko'}
        className={cn(
          'px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all',
          current === 'ko'
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-600',
        )}
      >
        KR
      </Link>
    </fieldset>
  );
}
