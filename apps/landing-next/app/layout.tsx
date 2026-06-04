import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'RWA Sentinel — The public watchdog for tokenized RWAs on Base',
  description:
    'Cross-oracle deviation alerts for Base RWAs. Free Telegram alerts, on-chain proof, MIT open source. Live now on Base Mainnet.',
  openGraph: {
    title: 'RWA Sentinel — The public watchdog for tokenized RWAs on Base',
    description: 'Cross-oracle deviation alerts for Base RWAs. Free.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RWA Sentinel — Cross-oracle deviation alerts for Base RWAs',
    description: 'Free Telegram alerts. On-chain proof.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Pretendard via CDN for Korean hero (Source Serif 4 is Latin-only).
         * --font-pretendard CSS variable is set in globals.css :root to avoid
         * SSR/CSR hydration mismatch on inline <style> children. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
