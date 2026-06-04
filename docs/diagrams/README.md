# Diagrams

Source-of-truth Mermaid diagrams. Renderable directly on GitHub, in Excalidraw (`Mermaid → Diagram`, Cmd+Shift+M), and via Mermaid CLI for PNG/SVG export.

## Files

| File | Used in |
|---|---|
| `architecture-pipeline.mmd` | Whitepaper §3.1 · Landing §03 Architecture · README diagram |
| `3-phase-decentralization.mmd` | Whitepaper §3.2–3.4 · Landing §08 Roadmap · Application narrative |

## Rendering

**Quick view** — paste into [mermaid.live](https://mermaid.live) or any GitHub markdown:

````markdown
```mermaid
%% paste contents here
```
````

**Excalidraw** — open Excalidraw → `Library` → `Mermaid to Excalidraw` → paste → Insert. Allows freehand editing afterwards. Recommended for whitepaper PNG export.

**SVG/PNG export** —
```bash
npx -p @mermaid-js/mermaid-cli mmdc -i architecture-pipeline.mmd -o architecture-pipeline.svg
npx -p @mermaid-js/mermaid-cli mmdc -i 3-phase-decentralization.mmd -o ../../apps/landing-next/public/diagrams/3-phase-decentralization.svg -w 1200 -H 420 --backgroundColor white
```

## Color palette (matches landing page)

- `#0052FF` — Base primary blue
- `#FF0420` — Optimism / on-chain accent
- `#F59E0B` — Phase 2 / amber alert
- `#10B981` — Phase 3 / success green
- `#94A3B8` — neutral storage
- `#E8EFFF` / `#FFF4E0` / `#E8FFF0` — phase-1/2/3 surface fills
