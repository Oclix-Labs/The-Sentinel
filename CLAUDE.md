# CLAUDE.md

> **Primary agent rules**: see [`AGENTS.md`](./AGENTS.md).
>
> This file adds Claude Code-specific guidance only.

## Claude-specific notes

### When creating files
- All new markdown docs go under `docs/` — **never create new top-level `.md` files** without updating `AGENTS.md` and `docs/SSOT-INDEX.md` in the same PR.
- For decisions, use `docs/DECISIONS/NNNN-<slug>.md` (template in `docs/DECISIONS/template.md`). Copy the latest NNNN + 1.
- Research (evidence / external reality) goes in `.research/<topic>.md` with a front-matter block including `researched_at`, `valid_until`, `confidence`. These files are immutable; new version = new filename.

### When planning work
- Update `docs/MEMBER-TASKS.md` for Base Batches sprint tasks, or open a GitHub Issue for post-sprint work. Do not invent parallel planning documents.
- For multi-step implementation, use `superpowers:writing-plans` (separate session) rather than inlining a plan in chat.

### Research vs Spec boundary
- `.research/*.md` is SSOT for external reality — always cite by file path + section, never copy-paste findings into `docs/SPEC.md` or similar.
- If you need to claim "oracle X is available on Base", cite `.research/oracle-inventory-base.md#section-2` — that is the trace.

### Skill preferences
- Use `superpowers:brainstorming` before writing any new feature spec (not during existing sprint work).
- Use `superpowers:writing-plans` for multi-step implementation work that spans multiple sessions.
- Use `superpowers:test-driven-development` for core logic in poller / cross-check engine — these are correctness-critical.
- Use `superpowers:systematic-debugging` for any oracle-comparison or on-chain interaction bug.

### Memory hygiene
- Personal user preferences (how-to-collaborate) → memory system (not committed)
- Team-level decisions → commit as ADR in `docs/DECISIONS/`
- Project facts derivable from code or git → do not duplicate into memory

### Team context pointers (for session continuity)
- User (`ahwlsqja`) is on a 4-person team: 권상현 (Lead + SC), 모진영 (Backend), 이재근 (Frontend + Marketing), 김현우 (English + Docs + Video).
- Language: Korean for conversation, English for code / commits / documentation.
- Sprint: 2026-04-19 to 2026-04-27 (Base Batches 003 submission).

---

_See `AGENTS.md` for non-negotiable project rules._
