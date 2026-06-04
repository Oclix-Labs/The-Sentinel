'use client';

/** Triggers the browser print dialog (print CSS renders a PDF-ready document). */
export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Print
    </button>
  );
}
