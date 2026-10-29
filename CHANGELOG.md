# Changelog

Alla viktiga ändringar dokumenteras här. Format: nyast överst.

## 2026-10-29

### Scope och styrning
- Scopeavstämning mot PRD-HR-Journey-v002.md: FEAT-001 till FEAT-012 skrivna. Alla PRD-ID:n är mappade till minst en FEAT.
- `project/feature-list.json` skapad. Alla FEAT är `planned`.
- PRD:n är unstaged och git-ignorerad (`PRD-HR-Journey*.md`).
- Rollmodell enligt PRD v002: HR och HR-administratör.
- Repot `LeideGit/HR-Journey` är publikt.

### Arkitektur
- ADR-006: Microsoft Graph som integrationslager.
- ADR-007: mockad M365-adapter i MVP, eget enkelt mockformat.

### Claude Code och processartefakter
- `CLAUDE.md`, `REVIEW.md`, `.claude/settings.json`, `.claude/agents/evaluator.md`, `.claude/rules/*.md`.
- `specs/README.md`, `docs/references.md`, `docs/adr/ADR-template.md`.
- `project/implementation-plan.md`, `project/progress.md`.
- `evals/cases/` (5 cases, alla `not-run`), `evals/graders/`, `evals/baselines.json`.
- `scripts/setup.sh`, `scripts/verify.sh`, `scripts/validate-specs.mjs`, `scripts/run-evals.mjs`, `scripts/generate-reports.mjs`.
- `reports/` genererade av `generate-reports.mjs`.

### Ej ändrat
- Ingen applikationskod. Ingen `package.json`. Inga migrationer.
- Ingen commit eller push.
