# Contributing

Thanks for your interest in The Sentinel. This guide is for human contributors; AI agents follow [`AGENTS.md`](./AGENTS.md).

## Getting started

```bash
git clone git@github.com:Oclix-Labs/The-Sentinel.git
cd The-Sentinel
pnpm install
```

## Before you push

```bash
pnpm typecheck && pnpm lint && pnpm test
```

Pre-commit hook runs `gitleaks protect --staged` to prevent secret leaks. Do not bypass with `--no-verify`.

## Branch strategy

- `main` — production. Deploys to `rwa-sentinel.workers.dev`. Merges require 권상현 approval.
- `dev` — staging. Deploys to `rwa-sentinel-staging.workers.dev`. Default PR target.
- `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>` — work branches. Open PR to `dev`.

## Commit format

Conventional Commits — `type(scope): subject`

Examples:
- `feat(poller): add cbETH/USD cross-check`
- `fix(alert-writer): handle empty queue batch`
- `docs(roadmap): clarify Phase 3 token utility`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`.

## Pull requests

Open PRs against `dev`. PR body should include:

1. **What** — one line summary
2. **Why** — motivation / issue link
3. **How tested** — commands run, manual steps, links

At least one review required (see [`.github/CODEOWNERS`](./.github/CODEOWNERS)). Urgent changes may use `[URGENT]` label for self-merge; post-merge review within 24h.

## Project layout

See [`README.md`](./README.md#repository-layout).

## Coding style

- TypeScript strict mode enforced
- Biome for lint + format (`pnpm lint`)
- No `any`, no `@ts-ignore` without `// reason:`
- File max 300 lines
- Test co-located near source (`*.test.ts`)

## Licensing

By contributing you agree your contributions are licensed under MIT.

## Code of conduct

Be kind. Be rigorous. Ship good code.

## Questions

- **Tech questions**: GitHub Discussions → Q&A
- **Bugs**: GitHub Issues with `bug` label
- **New ideas (not ready to implement)**: GitHub Discussions → Ideas
- **Security** issues: email `security@oclixlabs.xyz` (do not open public issue)
