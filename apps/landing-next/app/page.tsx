import Link from "next/link";
import { ArrowRight, AlertTriangle, ShieldCheck, Zap, History } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { ContractsCallout } from "@/components/contracts-callout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDict, type Locale, LOCALES } from "@/lib/i18n";
import { GITHUB_REPO } from "@/lib/utils";

const STAGE_ICONS = [Zap, AlertTriangle, ShieldCheck, History];

export default function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const locale: Locale = LOCALES.includes(searchParams.lang as Locale)
    ? (searchParams.lang as Locale)
    : "en";
  const t = getDict(locale);
  const langSuffix = locale === "ko" ? "?lang=ko" : "";

  return (
    <>
      <SiteNav t={t.nav} locale={locale} />

      <main>
        {/* HERO */}
        <section className="relative pt-40 pb-32 overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-40" />
          <div className="absolute inset-0 gradient-mesh" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <Badge variant="primary" className="mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t.hero.badge}
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-tight mb-6 prose-title">
              {t.hero.title_part1}
              <br />
              <span className="text-primary italic">{t.hero.title_accent}</span>{" "}
              {t.hero.title_part2}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
              {t.hero.desc}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#architecture">
                <Button size="lg" variant="primary">
                  {t.hero.cta_primary} <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  {t.hero.cta_secondary}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-12 border-y border-slate-100 bg-surface-alt">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: "9", l: t.stats.failures },
              { v: "≥$50M", l: t.stats.lost },
              { v: "5", l: t.stats.assets },
              { v: "0", l: t.stats.watchdogs },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
                  {s.v}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mt-2 font-mono">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM */}
        <section id="problem" className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <Badge className="mb-3">{t.problem.label}</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold prose-title mb-6">
              {t.problem.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t.problem.desc}
            </p>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-6">
            <Badge className="mb-3">{t.solution.label}</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold prose-title mb-6">
              {t.solution.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t.solution.desc}
            </p>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-3">{t.arch.label}</Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold prose-title mb-4">
                {t.arch.title_part1}
                <span className="text-primary italic">{t.arch.title_accent}</span>
              </h2>
              <p className="text-slate-500 leading-relaxed">{t.arch.desc}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {t.arch.stages.map((s, i) => {
                const Icon = STAGE_ICONS[i];
                return (
                  <Card key={i} className="text-center">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="font-mono text-[10px] text-primary font-bold mb-1">
                        STEP {s.id}
                      </div>
                      <CardTitle>{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ASSETS */}
        <section id="assets" className="py-24 bg-surface-alt">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Badge className="mb-3">Phase 1 Coverage</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold prose-title mb-6">
              5 assets · 3 oracles · 1-min cadence
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
              {[
                "BTC / USD",
                "ETH / USD",
                "USDC / USD",
                "cbETH / USD",
                "USDO (PoR)",
              ].map((a) => (
                <div
                  key={a}
                  className="card px-4 py-6 font-mono text-sm font-semibold"
                >
                  {a}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-6 font-mono">
              {locale === "ko"
                ? "Chainlink · Pyth · RedStone — 자세한 오라클 매트릭스는 .research/oracle-inventory-base.md 참조"
                : "Chainlink · Pyth · RedStone — full overlap matrix in .research/oracle-inventory-base.md"}
            </p>
          </div>
        </section>

        {/* ROADMAP */}
        <section id="roadmap" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="mb-3">{t.roadmap.label}</Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold prose-title mb-4">
                {t.roadmap.title_part1}
                <span className="text-primary italic">{t.roadmap.title_accent}</span>
              </h2>
              <p className="text-slate-500">{t.roadmap.sub}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {t.roadmap.phases.map((p, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Badge
                      variant={i === 0 ? "primary" : i === 1 ? "amber" : "success"}
                      className="mb-3"
                    >
                      {p.tag}
                    </Badge>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {p.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary mt-1">→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* DASHBOARD CTA */}
        <section className="py-16 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="font-serif text-3xl font-semibold mb-3">
              {locale === "ko"
                ? "라이브 대시보드를 직접 확인하세요"
                : "See the live dashboard"}
            </h3>
            <p className="text-slate-500 mb-6">
              {locale === "ko"
                ? "최신 가격과 알림을 실시간으로 확인할 수 있습니다."
                : "Latest prices and alerts in real time."}
            </p>
            <Link href={`/dashboard${langSuffix}`}>
              <Button size="lg" variant="primary">
                {t.nav.dashboard} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <ContractsCallout t={t.contracts} />
          </div>
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-bold text-lg">
                  RWA <span className="text-primary">Sentinel</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4">{t.footer.desc}</p>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                GitHub Repository →
              </a>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">
                {t.footer.infra}
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Poller Worker</li>
                <li>AlertWriter Worker</li>
                <li>Public API (Hono)</li>
                <li>AlertRegistry.sol</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">
                {t.footer.eco}
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>BTC / USD</li>
                <li>ETH / USD</li>
                <li>USDC / USD</li>
                <li>cbETH / USD</li>
                <li>USDO (attestation)</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-400">
            <p>{t.footer.rights}</p>
            <a
              href={`${GITHUB_REPO}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600"
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
