import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWA Sentinel — Public Watchdog for Tokenized RWAs on Base",
  description:
    "Public-good watchdog for tokenized RWAs on Base. Multi-oracle cross-check (Chainlink + Pyth + RedStone) with an append-only on-chain alert log. MIT-licensed.",
  openGraph: {
    title: "RWA Sentinel — Public Watchdog for Tokenized RWAs on Base",
    description:
      "Public-good watchdog for tokenized RWAs on Base. Open-source (MIT), retail-facing, Base-exclusive.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RWA Sentinel — Public Watchdog for Tokenized RWAs on Base",
    description: "Public-good watchdog for tokenized RWAs on Base.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
