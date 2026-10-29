# Readiness

Genererad av `scripts/generate-reports.mjs`. Redigera inte för hand.

## Beslut

**EJ REDO för release.** 5 in-progress, 7 planned.

Ingen feature har implementation. Completion-gate i REVIEW.md är inte uppfylld för någon feature.

## Status per FEAT

| FEAT | Titel | Scope | Status | Blockerad av |
|---|---|---|---|---|
| FEAT-001 | Autentisering och roller | MVP | in-progress | D-7 |
| FEAT-002 | Personprofil och visuell tidslinje | MVP | planned | OQ-003, B12 |
| FEAT-003 | Profiler, tidslinjemallar, milestones och tasks | MVP | in-progress | OQ-002, del: FR-TMPL-002, del: FR-TMPL-003, del: TEST-004 |
| FEAT-004 | Dashboard och arbetskö | MVP | in-progress | OQ-001 |
| FEAT-005 | Simulerade mejl | MVP | planned | B6 |
| FEAT-006 | Dokument, versioner, giltighet och gallring | MVP | planned | OQ-004, B23, del: Office-preview |
| FEAT-007 | AI-assistent (read-only, mockmotor) | MVP | planned | - |
| FEAT-008 | Microsoft 365-mötesbokning (mock i MVP, Graph som Future) | MVP-mock + Future | planned | - |
| FEAT-009 | Historik och granskningsspår | MVP | planned | B1, B6, B9 |
| FEAT-010 | Datamodell, RLS, Storage och migrationer | MVP | in-progress | - |
| FEAT-011 | Administration och systeminställningar | MVP | planned | OQ-002, del: FEAT-011-B10 |
| FEAT-012 | Plattform, CI och GitHub Pages-deploy | MVP | in-progress | - |

## Öppna beslut

| ID | Beslut | Ägare | Status |
|---|---|---|---|
| OQ-001 | Gräns mellan Kommande och Aktuellt | user | open |
| OQ-002 | Konfliktregel för mallpropagering | user | deferred by user (D-6) |
| OQ-003 | Exakt tidslinjeskala | user | open |
| OQ-004 | Previewteknik för Office-dokument | user | open |
| D-7 | Användarprovisionering | user | deferred by user, demo MVP |

## Kontroller som inte är konfigurerade

Se REVIEW.md, avsnitt 14.
