import type { Locale } from '@/lib/i18n';
import { getDict } from '@/lib/i18n';

export function OracleNetworkSvg({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks.nodes;
  return (
    <div
      className="rounded-xl border border-slate-200 bg-surface-alt p-8 md:p-12"
      role="img"
      aria-label="Three oracles feeding into Sentinel, then to Base Mainnet AlertRegistry"
    >
      <svg viewBox="0 0 800 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <title>Oracle network: 3 oracles → Sentinel → AlertRegistry</title>
        {/* Edges */}
        <line
          x1="180"
          y1="60"
          x2="400"
          y2="140"
          stroke="#0052FF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="180"
          y1="140"
          x2="400"
          y2="140"
          stroke="#0052FF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="180"
          y1="220"
          x2="400"
          y2="140"
          stroke="#0052FF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        <line
          x1="400"
          y1="140"
          x2="640"
          y2="140"
          stroke="#0052FF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        {/* Oracle nodes (left) */}
        <g>
          <rect x="80" y="40" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text
            x="170"
            y="65"
            textAnchor="middle"
            fontFamily="Inter,sans-serif"
            fontSize="14"
            fontWeight="500"
            fill="#0F172A"
          >
            {t.chainlink}
          </text>
        </g>
        <g>
          <rect x="80" y="120" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text
            x="170"
            y="145"
            textAnchor="middle"
            fontFamily="Inter,sans-serif"
            fontSize="14"
            fontWeight="500"
            fill="#0F172A"
          >
            {t.pyth}
          </text>
        </g>
        <g>
          <rect x="80" y="200" width="180" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text
            x="170"
            y="225"
            textAnchor="middle"
            fontFamily="Inter,sans-serif"
            fontSize="14"
            fontWeight="500"
            fill="#0F172A"
          >
            {t.redstone}
          </text>
        </g>

        {/* Sentinel hub (center) */}
        <g>
          <rect x="340" y="115" width="120" height="50" rx="8" fill="#0052FF" />
          <text
            x="400"
            y="146"
            textAnchor="middle"
            fontFamily="Inter,sans-serif"
            fontSize="14"
            fontWeight="600"
            fill="#FFFFFF"
          >
            {t.sentinel}
          </text>
        </g>

        {/* AlertRegistry (right) */}
        <g>
          <rect
            x="540"
            y="115"
            width="200"
            height="50"
            rx="8"
            fill="#FFFFFF"
            stroke="#0052FF"
            strokeWidth="2"
          />
          <text
            x="640"
            y="146"
            textAnchor="middle"
            fontFamily="JetBrains Mono,monospace"
            fontSize="12"
            fontWeight="500"
            fill="#0F172A"
          >
            {t.registry}
          </text>
        </g>
      </svg>
    </div>
  );
}
