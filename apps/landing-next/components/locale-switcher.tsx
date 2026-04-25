"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const params = useSearchParams();

  function buildHref(target: Locale) {
    const sp = new URLSearchParams(params?.toString() ?? "");
    if (target === "en") sp.delete("lang");
    else sp.set("lang", target);
    const qs = sp.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div
      className="flex bg-slate-100 p-1 rounded-full"
      role="group"
      aria-label="Language selector"
    >
      <Link
        href={buildHref("en")}
        aria-pressed={current === "en"}
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all",
          current === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        EN
      </Link>
      <Link
        href={buildHref("ko")}
        aria-pressed={current === "ko"}
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all",
          current === "ko"
            ? "bg-primary text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        KR
      </Link>
    </div>
  );
}
