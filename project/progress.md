# Progress

Uppdaterad 2026-10-29. Statusen här måste stämma med `project/feature-list.json`. `scripts/validate-specs.mjs` kontrollerar det.

## Läge

- **Live:** https://leidegit.github.io/HR-Journey/ (HTTP 200). Bygget körs från `main` via GitHub Actions.
- **Hostat projekt** `hr-journey`: fyra migrationer tillämpade, RLS aktivt på alla sju `public`-tabeller, privat bucket `dokument`, seed inlagd (3 personer, 2 dokument, 3 versioner).
- **Konton:** `hr@example.test` (roll `hr`) och `hr-admin@example.test` (roll `hr_admin`), lösenord `demo`. Inloggning verifierad av användaren i webbläsare.
- **Självregistrering:** avstängd i hostat projekt (`disable_signup=true`).
- **Tester:** 40 enhetstester, 13 RLS-påståenden lokalt. Alla gröna.
- **`main`:** innehåller PR #1 till #4. Inga öppna PR.
- **`scripts/verify.sh`:** röd på två punkter som är släppta tillsvidare (evals-runner, ändrade-filer-kontroll).

## Features

| FEAT | Status | Vad som finns | Vad som saknas |
|---|---|---|---|
| FEAT-001 Autentisering och roller | in-progress | Inloggning, två roller i `user_roles`, RLS | Provisionering (D-7), granskning av Auth-PR |
| FEAT-002 Personprofil och tidslinje | planned | Ingenting | Profilsida, tidslinje (wireframe 02). Tidsskala blockerad av OQ-003 |
| FEAT-003 Profiler, mallar, milestones | in-progress | Milestones och tasks med RLS, statusregel | Malltabeller och mallpropagering (OQ-002), UI för milestones |
| FEAT-004 Dashboard | in-progress | Arbetskö med filter, KPI-kort, dokumentärenden (wireframe 01) | Koppling till hostad data, gräns Kommande/Aktuellt (OQ-001) |
| FEAT-005 Simulerade mejl | planned | Ingenting | Allt |
| FEAT-006 Dokument och gallring | planned | Tabeller, privat Storage, RLS testat | UI, uppladdning, versionering i UI, Office-preview (OQ-004), gallring |
| FEAT-007 AI-assistent (mock) | planned | Ingenting | Allt |
| FEAT-008 M365-mock | planned | Ingenting (ADR-006, ADR-007 skrivna) | Allt |
| FEAT-009 Historik | planned | Ingenting | Allt. Händelselista är ej beslutad |
| FEAT-010 Datamodell, RLS, Storage | in-progress | 7 tabeller, RLS, privat Storage, seed, RLS-tester, hostat | Storage-policytest mot hostat, UI-koppling |
| FEAT-011 Administration | planned | Ingenting | Allt. Malländring blockerad av OQ-002 |
| FEAT-012 Plattform, CI, deploy | in-progress | CI (verify, rls, build-pages, deploy), Pages live | Evals-runner, PR-granskningsautomatik, tillgänglighetstest |

## Beslut

| ID | Beslut | Status | Blockerar |
|---|---|---|---|
| OQ-001 | Gräns Kommande/Aktuellt | öppen, ägare användaren | FEAT-004 (statuslogik) |
| OQ-002 | Konfliktregel mallpropagering | avvaktad av användaren (D-6) | FEAT-003 (B12, B13, B15), FEAT-011 (B10) |
| OQ-003 | Tidsskala för tidslinjen | öppen, ägare användaren | FEAT-002 |
| OQ-004 | Previewteknik för Office-filer | öppen, ägare användaren | FEAT-006 (DOCX, XLSX, PPTX) |
| D-7 | Användarprovisionering | avvaktad, demo-MVP | Fler konton än de två demo-kontona |
| PRD | M365-mock som MVP-scope | ej inskriven i PRD v002 (ADR-007 godkänner) | Konflikt tills PRD uppdateras |

## Granskning och processavvikelser

- **PR #2** (inloggning, CI, deploy) **mergad utan granskning**. REVIEW.md kräver två mänskliga granskare för hög risk. Ej åtgärdat.
- **PR #1** och **PR #4** mergade av användaren. PR #1 var också utan dokumenterad andra granskare.
- **PR #3** (spec-validering) mergad av agenten efter användarens godkännande.
- **Demolösenord** `demo` på två konton. Byts innan annan användning.

## Kända drift och lärdomar

- **Deploy-miljön** `github-pages` hade en branch-policy som tillät endast `feat/fas-0-1-scaffold-och-rls`. Deploy från `main` blockerades, vilket gav misslyckade körningar utan steg. Åtgärdat genom att lägga till `main`. Den gamla branchen är kvar.
- **Loggar** för misslyckade jobb kan saknas (`BlobNotFound`). Annotationer på check-run visade orsaken.
- **Självregistrering** var påslagen i hostat trots att prep antog att den var av. Verifierad och avstängd.
- **`config push`** skulle skriva över 10 Auth-, pooler- och storage-inställningar. Ej använd. Hostade inställningar ändras i Dashboard eller med riktad åtgärd.
- **Publik nyckel** ligger i repository variables, inte secrets. Den finns i bygget som avsett. Hemliga nycklar finns inte i bygget.
- **supabase-js** innehåller strängen `sb_secret_` som kod. CI-regeln matchar därför värden, inte prefix.

## Nästa steg (plan)

Planen är ordnad efter vad som kan göras utan att vänta på beslut.

1. **FEAT-002, personsida och tidslinje** (wireframe 02). Positionsfunktion och visning med en tillfällig, märkt tidsskala `TBD OQ-003`. Blockerad i sin helhet av OQ-003 för slutlig skala.
2. **FEAT-004, koppla dashboarden till hostad data.** Läsa milestones och dokument från Supabase i stället för fixtures, under inloggning. Statusgränsen fortsätter som parameter (OQ-001).
3. **FEAT-006, dokumentvy** (wireframe 03). Lista och detalj, metadatasökning (FR-DSRCH). PDF först, Office-preview väntar på OQ-004.
4. **FEAT-012, evals-runner och granskningsautomatik.** Krävs för att `verify.sh` ska bli grön. Släppt tillsvidare av användaren, så denna punkt är lägre prioritet.
5. **FEAT-005, FEAT-009, FEAT-011.** Mejl, historik och administration. Mindre beroenden av beslut, men större volym.
6. **FEAT-007 och FEAT-008.** AI-mock och M365-mock. Största volymen, och inga blockerande beslut annat än PRD-uppdateringen.

Varje punkt ska ge en PR med berörda FEAT uppdaterade i samma ändring, och två granskare för hög risk.

## Ej gjort

- Granskning av PR #2 (två granskare).
- Evals-runner. Cases är `not-run`.
- Visuell och tillgänglighetstest (NFR-012, WCAG 2.2 AA).
- Inloggningstest i CI i webbläsare.
- Provisionering av användare (D-7).
- Byte av demolösenord.
