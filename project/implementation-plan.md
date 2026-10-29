# Implementationsplan

Ordningen följer beroenden mellan FEAT-filerna. Ingen fas startar innan dess blockerare är lösta, om inte fasen anges som oberoende.

## Fas 0: Governance (klar 2026-10-29)

- PRD v002 som enda auktoritet. PRD är unstaged och git-ignorerad.
- FEAT-001 till FEAT-012, `project/feature-list.json`, ADR-006 och ADR-007.
- Claude Code-artefakter: CLAUDE.md, REVIEW.md, `.claude/`, scripts, evals, rapporter.

## Fas 1: Scaffold och verktyg

**Blockerar all kod. Oberoende av öppna beslut.**

- Vite + React + TypeScript i repo-roten.
- `package.json` med scripts för `build`, `lint`, `typecheck`, `test`. Utan dessa skippar `verify.sh` och ger fel.
- `.env.example` med tomma platshållare.
- FEAT: FEAT-012.

## Fas 2: Databas, RLS och Storage

- Migrationer i `supabase/migrations/`. Testas lokalt före push till `hr-journey`.
- RLS på alla exponerade tabeller. Storage privat.
- Seed med fiktiva personer, dokument, användare och AI-data.
- FEAT: FEAT-010. Negativa RLS-tester är obligatoriska.
- Blockerare: provisionering (D-7) påverkar bara hostad inloggning.

## Fas 3: Auth och roller

- Inloggning för HR och HR-administratör. Lokalt först.
- FEAT: FEAT-001.
- Blockerare: D-7 för hostad inloggning.

## Fas 4: Personer, tidslinje och milestones

- Profil, tidslinje, milestones och tasks.
- FEAT: FEAT-002, FEAT-003.
- Blockerare: OQ-003 (tidsskala). OQ-002 blockerar bara mallpropagering (FR-TMPL-002, FR-TMPL-003, TEST-004).

## Fas 5: Dashboard

- FEAT: FEAT-004.
- Blockerare: OQ-001 (Kommande/Aktuellt).

## Fas 6: Dokument och versioner

- Upload, versioner, sökning, giltighet, gallring, arkivering.
- FEAT: FEAT-006.
- Blockerare: OQ-004 för Office-preview. PDF kan byggas först.

## Fas 7: Historik, administration och simulerade mejl

- FEAT: FEAT-009, FEAT-011, FEAT-005.
- Blockerare: OQ-002 för malländring i administration (FEAT-011-B10). B6 för mejlmottagare.

## Fas 8: Mock M365-möte

- Mockadapter enligt ADR-007 och mockformat (eget format, beslut 2026-10-29).
- FEAT: FEAT-008 (MVP-delen). Future-delen är inte i planen.

## Fas 9: AI-assistent (mock)

- Panel, kontext, mockmotor, källor, sessioner. Ingen extern LLM.
- FEAT: FEAT-007.
- Beroende: fas 2, 4, 6.

## Fas 10: Deploy och CI

- GitHub Pages deploy-workflow och CI (build, lint, typecheck, test, spec-validering).
- FEAT: FEAT-012.
- Ska vara klart före första extern visning.

## Ej i plan

- Verklig Graph-integration, Entra ID, verklig LLM. Future. Kräver ADR-008 till ADR-011 och godkänd PRD-ändring.
