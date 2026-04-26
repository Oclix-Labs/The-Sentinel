import { en } from './en';
import { ko } from './ko';

export type Locale = 'en' | 'ko';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: Locale[] = ['en', 'ko'];

export type Dict = {
  nav: {
    dashboard: string;
    coverage: string;
    roadmap: string;
    resources: string;
    whitepaper: string;
    docs: string;
    research: string;
    audit: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: {
    failuresValue: string;
    failuresLabel: string;
    lostValue: string;
    lostLabel: string;
    alertsLabel: string;
    licenseValue: string;
    licenseLabel: string;
  };
  problem: { badge: string; title: string; body: string };
  howItWorks: {
    badge: string;
    titlePart1: string;
    titleAccent: string;
    body: string;
    nodes: { chainlink: string; pyth: string; redstone: string; sentinel: string; registry: string };
  };
  livePreview: {
    badge: string;
    title: string;
    subtitle: string;
    pricesTitle: string;
    alertsTitle: string;
    dashboardLink: string;
    noData: string;
  };
  roadmap: {
    badge: string;
    titlePart1: string;
    titleAccent1: string;
    titlePart2: string;
    cards: {
      tag: string;
      bullets: string[];
      disclaimer?: string;
    }[];
  };
  trust: {
    title: string;
    networkLabel: string;
    licenseLine: string;
    auditLine: string;
    githubCta: string;
  };
  footer: {
    finalCtaCopy: string;
    finalCtaButton: string;
    brandTagline: string;
    columnProduct: string;
    columnResources: string;
    columnNetwork: string;
    productLinks: { telegram: string; dashboard: string; premium: string };
    networkLinks: {
      mainnet: string;
      status: string;
      twitter: string;
      farcaster: string;
      discord: string;
    };
    rights: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    pricesTitle: string;
    alertsTitle: string;
    noData: string;
    asset: string;
    oracle: string;
    price: string;
    deviation: string;
    time: string;
    tx: string;
    refresh: string;
    mockBadge: string;
  };
};

export const dict: Record<Locale, Dict> = { en, ko };

export function getDict(locale: Locale): Dict {
  return dict[locale] ?? dict[DEFAULT_LOCALE];
}
