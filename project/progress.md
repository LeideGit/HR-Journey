# Progress

Uppdaterad 2026-10-29. Status här måste stämma med `project/feature-list.json`. `scripts/validate-specs.mjs` kontrollerar det.

## Läge

- Scopeavstämning mot PRD v002: klar.
- FEAT-001 till FEAT-012: `planned`. Ingen implementation.
- ADR-006 och ADR-007: accepterade.
- Claude Code-artefakter: skrivna, format verifierade mot officiell dokumentation (2026-10-29).
- `scripts/verify.sh`: **EJ GODKÄND**. Build, lint, typecheck, test och evals saknas.
- Inget är committat eller pushat.

## Blockerare (se feature-list för full lista)

| Beslut | Blockerar | Ägare |
|---|---|---|
| OQ-002 mallpropagering | FEAT-003 (delar), FEAT-011 (B10) | användaren, avvaktad |
| OQ-001 Kommande/Aktuellt | FEAT-004 | användaren |
| OQ-003 tidsskala | FEAT-002 | användaren |
| OQ-004 Office-preview | FEAT-006 (delar) | användaren |
| D-7 användarprovisionering | FEAT-001 (hostad inloggning) | användaren, avvaktad |
| PRD v002 uppdatering av M365-mock som MVP | Alla M365-FEAT som MVP | användaren |

## Ej gjort

- `package.json`, Vite, React, TypeScript (FEAT-012, implementationsplan fas 1).
- Migrationer och seed (FEAT-010).
- Evals-runner. Cases är `not-run`.
- CI och GitHub Pages (FEAT-012).
- Automatiserad PR-granskning och säkerhetsgranskning (REVIEW.md avsnitt 4 och 5).

## Kända drift

- `scripts/generate-reports.mjs` säger "EJ REDO" i readiness, vilket stämmer med feature-list.
- `CLAUDE.md` nämner `scripts/setup.sh`, `scripts/verify.sh`, `validate-specs.mjs`, `run-evals.mjs` och `generate-reports.mjs`. Alla finns.
