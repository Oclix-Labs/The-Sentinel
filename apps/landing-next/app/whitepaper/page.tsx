import fs from 'node:fs';
import path from 'node:path';
import { PrintButton } from '@/components/whitepaper/print-button';
import { GITHUB_REPO } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata: Metadata = {
  title: 'Lite Whitepaper v0.1 — RWA Sentinel',
  description:
    'RWA Sentinel Lite Whitepaper v0.1 — the progressively-decentralized public-goods watchdog for tokenized RWAs on Base.',
  openGraph: {
    title: 'RWA Sentinel — Lite Whitepaper v0.1',
    description: 'The public watchdog for tokenized RWAs on Base.',
    type: 'article',
  },
};

const SOURCE_CANDIDATES = [
  path.resolve(process.cwd(), '../../docs/WHITEPAPER-v0.1-SKELETON.md'),
  path.resolve(process.cwd(), 'docs/WHITEPAPER-v0.1-SKELETON.md'),
];

function loadWhitepaperMarkdown(): string {
  for (const candidate of SOURCE_CANDIDATES) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf8');
  }
  throw new Error(`Whitepaper source not found. Looked in:\n${SOURCE_CANDIDATES.join('\n')}`);
}

function cleanMarkdown(md: string): string {
  return md
    .replace(/<div[^>]*page-break[^>]*>\s*<\/div>/gi, '')
    .replace(
      /```mermaid[\s\S]*?```/,
      '![Figure 1. Four-stage detection pipeline: ingestion, cross-check, attestation tracking, alert and on-chain registry.](/diagrams/architecture-pipeline.svg)',
    )
    .trim();
}

/** Strip wiki-style artifacts; keep prose readable as a formal paper. */
function sanitizeForPaper(md: string): string {
  let s = md;

  const reviewIdx = s.indexOf('## Review & approval workflow');
  if (reviewIdx >= 0) s = s.slice(0, reviewIdx).trimEnd();

  s = s
    .replace(/🚧\s*/g, '')
    .replace(/✅/g, 'Yes')
    .replace(/❌/g, 'No')
    .replace(/\s*\*?\*?\[DIRECTIONAL\]\*?\*?/gi, '')
    .replace(/^>\s?/gm, '')
    .replace(/_Source:\s*`([^`]+)`\.?_/g, '_Figure source: $1._');

  while (/\*\*[^*]+\*\*/.test(s)) {
    s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  }

  const refStart = s.indexOf('## References');
  if (refStart >= 0) {
    const head = s.slice(0, refStart);
    const tail = s.slice(refStart).split('\n');
    let n = 0;
    const formatted = tail.map((line) => {
      const item = line.match(/^-\s+(.+)$/);
      if (item) {
        n += 1;
        return `${n}. ${item[1]}`;
      }
      return line;
    });
    s = head + formatted.join('\n');
  }

  return s.trim();
}

function splitDocument(raw: string): { abstract: string; body: string } {
  const absStart = raw.indexOf('## 1. Abstract');
  const probStart = raw.indexOf('## 2. Problem');

  let abstract = '';
  if (absStart >= 0 && probStart > absStart) {
    const afterHeading = raw.indexOf('\n', absStart);
    abstract = raw.slice(afterHeading + 1, probStart).trim();
  }

  const body = probStart >= 0 ? raw.slice(probStart) : raw;

  return {
    abstract: sanitizeForPaper(cleanMarkdown(abstract)),
    body: sanitizeForPaper(cleanMarkdown(body)),
  };
}

function resolveHref(href?: string): string {
  if (!href) return '#';
  if (/^(https?:|mailto:|#|\/)/.test(href)) return href;
  const repoPath = href.replace(/^\.\//, 'docs/').replace(/^\.\.\//, '');
  return `${GITHUB_REPO}/blob/main/${repoPath}`;
}

function isBibliographicHref(href?: string, resolved?: string): boolean {
  if (!href) return false;
  if (href.startsWith('./') || href.startsWith('../')) return true;
  if (resolved?.includes('/docs/') || resolved?.includes('/.research/')) return true;
  return false;
}

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    const resolved = resolveHref(href);
    const bibliographic = isBibliographicHref(href, resolved);
    const external = /^(https?:|mailto:)/.test(resolved);

    return (
      <a
        href={resolved}
        className={bibliographic ? 'paper-cite' : 'paper-link'}
        {...(external && !bibliographic ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  table({ children, ...props }) {
    return (
      <div className="paper-table">
        <table {...props}>{children}</table>
      </div>
    );
  },
  img({ src, alt }) {
    const srcStr = typeof src === 'string' ? src : '';
    const wideFigure = srcStr.includes('3-phase-decentralization');
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={srcStr}
        alt={alt ?? ''}
        loading="lazy"
        className={wideFigure ? 'paper-figure-wide' : undefined}
      />
    );
  },
  code({ children, className }) {
    const inline = !className;
    if (inline) {
      return <span className="paper-inline-addr">{children}</span>;
    }
    return <code className={className}>{children}</code>;
  },
  pre({ children }) {
    return <div className="paper-block">{children}</div>;
  },
};

const AUTHORS = '권상현, 모진영, 이재근, 김현우';

export default function WhitepaperPage() {
  const { abstract, body } = splitDocument(loadWhitepaperMarkdown());
  const prose = abstract ? `## 1. Abstract\n\n${abstract}\n\n${body}` : body;

  return (
    <div className="paper-backdrop">
      <nav className="paper-chrome no-print" aria-label="Document controls">
        <Link href="/" className="paper-chrome-link">
          ← Back
        </Link>
        <PrintButton className="paper-chrome-link" />
      </nav>

      <article className="paper">
        <header className="paper-title">
          <h1>RWA Sentinel: The Public Watchdog for Tokenized RWAs on Base</h1>
          <p className="paper-authors">{AUTHORS}</p>
          <p className="paper-affil">
            Oclix Labs; Yonsei BAY Blockchain Society; Seoul, Republic of Korea
          </p>
          <p className="paper-date">April 27, 2026</p>
        </header>

        <section className="paper-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {prose}
          </ReactMarkdown>
        </section>
      </article>
    </div>
  );
}
