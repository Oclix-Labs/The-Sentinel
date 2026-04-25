import Link from "next/link";
import { Shield } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import type { Dict, Locale } from "@/lib/i18n";

export function SiteNav({ t, locale }: { t: Dict["nav"]; locale: Locale }) {
  const langSuffix = locale === "ko" ? "?lang=ko" : "";
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href={`/${langSuffix}`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            RWA <span className="text-primary">Sentinel</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#problem" className="hover:text-slate-900 transition-colors">
            {t.overview}
          </a>
          <a href="#architecture" className="hover:text-slate-900 transition-colors">
            {t.architecture}
          </a>
          <a href="#assets" className="hover:text-slate-900 transition-colors">
            {t.assets}
          </a>
          <a href="#roadmap" className="hover:text-slate-900 transition-colors">
            {t.roadmap}
          </a>
          <Link
            href={`/dashboard${langSuffix}`}
            className="hover:text-slate-900 transition-colors"
          >
            {t.dashboard}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher current={locale} />
          <a
            href="https://github.com/Oclix-Labs/The-Sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block"
          >
            <Button variant="primary" size="sm">
              {t.cta}
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
