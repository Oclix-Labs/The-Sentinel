/**
 * Isolates /whitepaper from the landing site's Inter UI, colored tokens, and
 * focus rings so the route reads as a standalone academic document.
 */
export default function WhitepaperLayout({ children }: { children: React.ReactNode }) {
  return <div className="whitepaper-shell">{children}</div>;
}
