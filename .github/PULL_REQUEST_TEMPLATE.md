<!-- Delete sections that do not apply. Keep it brief — reviewers read code, not essays. -->

## What

<!-- One-line summary of the change. -->

## Why

<!-- Motivation, issue link (Closes #N), or decision link (ADR). -->

## How tested

<!-- Commands run, manual testing steps, screenshots, or test output. -->

---

## Checklist

- [ ] Typecheck passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint`
- [ ] Tests pass: `pnpm test`
- [ ] If core logic changed: new tests added
- [ ] If architecture changed: `docs/ARCHITECTURE.md` updated
- [ ] If decision made: ADR added under `docs/DECISIONS/`
- [ ] No secrets committed (pre-commit hook ran)
- [ ] Breaking change? → `BREAKING CHANGE:` in commit footer + changelog entry

<!-- For urgent fixes: add `[URGENT]` to PR title, self-merge allowed, post-merge review within 24h. -->
