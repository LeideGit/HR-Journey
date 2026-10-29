# Progress

Uppdaterad 2026-10-29. Statusen här måste stämma med `project/feature-list.json`. `scripts/validate-specs.mjs` kontrollerar specerna, och `scripts/generate-reports.mjs` genererar rapporterna.

## Läge

- **Live:** https://leidegit.github.io/HR-Journey/ (HTTP 200). Bygget körs från `main` via GitHub Actions. Senaste deploy grön efter PR #7.
- **`main`:** `35f2ef9`. Innehåller PR #1 till #7. Inga öppna PR.
- **Hostat projekt** `hr-journey`: fyra migrationer tillämpade, RLS aktivt på alla sju `public`-tabeller, privat bucket `dokument`, seed inlagd (3 personer, 2 dokument, 3 versioner).
- **Konton** (hostat och lokalt): `hr@example.test` (roll `hr`) och `hr-admin@example.test` (roll `hr_admin`), lösenord `demo`. Inloggning verifierad i webbläsare för hostat och via Auth-API för lokalt.
- **Självregistrering:** avstängd i hostat projekt (`disable_signup=true`).
- **Tester:** 74 enhetstester, gröna. RLS-påståenden: 7 dokument och 6 milestones, körda av `verify.sh`.
- **`scripts/verify.sh`:** röd på två punkter som är släppta tillsvidare: evals-runner och kontrollen för ändrade filer.

## Granskning (processavvikelse)

REVIEW.md kräver en mänsklig granskare som inte är författaren för normal risk, och två för hög risk. Följande PR är mergade utan registrerad granskning från en annan person:

| PR | Innehåll | Risk enligt REVIEW.md | Granskningar |
|---|---|---|---|
| #1 | FEAT-010 (dokument, RLS, Storage) | hög | 0 |
| #2 | Inloggning, CI, deploy | hög | 0 |
| #3 | Spec-validering i CI | låg | 0 |
| #4 | Deploy enligt officiell mall | hög | 0 |
| #5 | Progress-rapport | låg | 0 |
| #6 | Personsida med tidslinje | normal | 0 |
| #7 | Tidslinje startar på idag | låg | 0 |

Mergarna gjordes av `LeideGit`, som är författaren. Ingen av dem har en andra granskare. Detta är inte åtgärdat. Det kan eftergranskas, eller accepteras uttryckligen.

## Features

| FEAT | Status | Vad som finns | Vad som saknas |
|---|---|---|---|
| FEAT-001 Autentisering och roller | in-progress | Inloggning, roller i `user_roles`, RLS, två demo-konton | Provisionering (D-7), inloggningstest i CI |
| FEAT-002 Personprofil och tidslinje | in-progress | Personsida, tidslinje med OQ-003-skala, idag i mitten vid öppning, kort med status, tangentbord | Hostad data, flikarna Dokument och Historik, drag-and-drop, tillgänglighetstest |
| FEAT-003 Profiler, mallar, milestones | in-progress | Milestones och tasks med RLS, statusregel | Malltabeller och mallpropagering (OQ-002), UI för milestone-redigering |
| FEAT-004 Dashboard | in-progress | Arbetskö, filter, KPI-kort, länk till personsida | Hostad data, gräns Kommande/Aktuellt (OQ-001) |
| FEAT-005 Simulerade mejl | planned | Ingenting | Allt |
| FEAT-006 Dokument och gallring | planned | Tabeller, privat Storage, RLS testat | UI, uppladdning, Office-preview (OQ-004), gallring |
| FEAT-007 AI-assistent (mock) | planned | Ingenting | Allt |
| FEAT-008 M365-mock | planned | ADR-006 och ADR-007 skrivna | Allt |
| FEAT-009 Historik | planned | Ingenting | Allt |
| FEAT-010 Datamodell, RLS, Storage | in-progress | 7 tabeller, RLS, privat Storage, seed, RLS-tester, hostat | Storage-policytest mot hostat, UI-koppling, gallring |
| FEAT-011 Administration | planned | Ingenting | Allt. Malländring blockerad av OQ-002 |
| FEAT-012 Plattform, CI, deploy | in-progress | CI, Pages live | Evals-runner, PR-granskningsautomatik, tillgänglighetstest |

## Beslut

| ID | Beslut | Status | Blockerar |
|---|---|---|---|
| OQ-001 | Gräns Kommande/Aktuellt | öppen, ägare användaren | FEAT-004 |
| OQ-002 | Konfliktregel mallpropagering | avvaktad (D-6) | FEAT-003, FEAT-011 |
| OQ-003 | Tidsskala | **stängd 2026-10-29** | — |
| OQ-004 | Previewteknik Office-filer | öppen, ägare användaren | FEAT-006 (DOCX, XLSX, PPTX) |
| D-7 | Användarprovisionering | avvaktad, demo-MVP | Fler konton än demo |
| M365 | M365-mock som MVP-scope | godkänd i ADR-007, ej i PRD v002 | Konflikt tills PRD uppdateras |

## Nästa steg (plan)

1. **Efterhandsgranskning av PR #1–#7**, eller uttryckligt accepterande av avvikelsen. Användarens beslut.
2. **FEAT-004, koppla dashboarden till hostad data** under inloggning. Statusgränsen fortsätter som parameter (OQ-001).
3. **FEAT-006, dokumentvyn** (wireframe 03). Lista och detalj, metadatasökning. PDF först. Office väntar på OQ-004.
4. **FEAT-002, koppla personsidan till hostad data** och bygga flikarna Dokument och Historik.
5. **Navmenyn** (vänster, enligt wireframe). Avvaktad av användaren.
6. **FEAT-012, evals-runner och granskningsautomatik.** Lägre prioritet, eftersom `verify.sh` är släppt.
7. **FEAT-005, 009, 011**: mejl, historik och administration.
8. **FEAT-007 och FEAT-008**: AI-mock och M365-mock.

Varje punkt ska ge en PR med berörda FEAT uppdaterade i samma ändring, och granskare enligt REVIEW.md.

## Kända drift och lärdomar

- **Deploy-miljön** `github-pages` tillät från början bara den gamla arbetsbranchen. Deploy från `main` blockerades av miljöregeln, vilket gav misslyckade körningar utan steg. Åtgärdat genom att lägga till `main`.
- **Loggar** för misslyckade jobb kan saknas (`BlobNotFound`). Check-run-annotationer visade orsaken.
- **Självregistrering** var påslagen trots att prep antog att den var av. Verifierad och avstängd.
- **`config push`** skulle skriva över 10 Auth-, pooler- och storage-inställningar. Ej använd.
- **Publik nyckel** ligger i repository variables, inte secrets. Hemliga nycklar finns inte i bygget.
- **supabase-js** innehåller strängen `sb_secret_` som kod. CI-regeln matchar därför värden, inte prefix.
- **Spec-synk:** ett första skript i denna uppdatering tog bort öppna blockerare i FEAT-003 och FEAT-004. Det upptäcktes och återställdes. Blockerarna finns nu i feature-listan också.

## Ej gjort

- Efterhandsgranskning av PR #1–#7.
- Evals-runner. Cases är `not-run`.
- Visuell och tillgänglighetstest (NFR-012, WCAG 2.2 AA).
- Inloggningstest i CI i webbläsare.
- Provisionering av användare (D-7).
- Byte av demolösenord.
- Navmenyn.
