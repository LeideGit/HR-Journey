# REVIEW.md – granskningsprocess för HR Journey

Gäller alla pull requests. Repot är publikt, så granskningen omfattar även att inget personligt eller hemligt material committas. Styrs av PRD-HR-Journey-v002.md.

## 1. Egenverifiering före PR

Körs lokalt, i denna ordning:

1. `bash scripts/setup.sh`
2. `bash scripts/verify.sh`. Kontrollerar spec-validering, att PRD inte är spårad, hemlighetsskanning, build, lint, typecheck, test, evals och RLS när migrationer finns.
3. `node scripts/generate-reports.mjs`. Uppdaterade rapporter committas i samma PR.
4. FEAT-filer uppdaterade enligt avsnitt 2.

Ett steg som visar **SKIPPED** räknas som misslyckat tills det är konfigurerat.

## 2. Ändringsregel för FEAT

En PR som materiellt påverkar något av följande uppdaterar berörda FEAT i samma PR: produktbeteende, UI/UX, datamodell, API eller adapterkontrakt, migration, Auth, RLS, Storage, AI-kontext, AI-källor, chattsessioner, M365-mock, Graph-arkitektur, permissions, tester, evals, dependencies, acceptanskriterier, kända begränsningar eller status.

PR-beskrivningen listar berörda FEAT-ID:n.

## 3. Fristående granskning

Agenten `evaluator` (`.claude/agents/evaluator.md`) granskar diffen mot PRD och FEAT. Den ändrar inga filer. Den får inte se huvudagentens slutsatser, bara diffen och relevanta FEAT.

## 4. Automatiserad PR-granskning

**Status: ej konfigurerad.** Ska köras som en automatisk granskning av diffen med fynd i formatet i avsnitt 7. Fynd verifieras, dedupliceras och filtreras på confidence innan de visas. Tills den är konfigurerad görs granskningen manuellt via avsnitt 3.

## 5. Separat säkerhetsgranskning

Obligatorisk för hög risk (avsnitt 8). Ska täcka Auth, RLS, Storage-policyer, AI-behörighet och källläckage, M365-permissions och secret-exponering, XSS och publika länkar.

**Status: ej konfigurerad.**

## 6. Parallella specialiserade reviewers

Vid större PR körs en reviewer per område. Varje reviewer får diffen och relevant FEAT, inte huvudagentens slutsats.

| Reviewer | Fokus |
|---|---|
| correctness | Logik, status- och datumberäkning |
| security/privacy | Hemligheter, personuppgifter, loggar |
| regression | Befintligt beteende i FEAT |
| data integrity | Migrationer, versionering, gallring |
| Auth/RLS/Storage | Policyer, roller, privat lagring |
| AI-auktorisering | Kontextfilter, källläckage, sessionsägarskap, read-only |
| M365-permissions | Mockadapter, secret-exponering, ingen Graph-trafik |
| UX/tillgänglighet | Tangentbord, WCAG 2.2 AA, mockindikator |
| PRD/FEAT-konformitet | Scope, supported/backlogg, status |
| artefaktfärskhet | Rapporter, progress, CHANGELOG mot status |

## 7. Fyndformat

Varje fynd anger: **severity** (kritisk, hög, medel, låg), **scenario**, **impact**, **exakt kodplats** (fil:rad), **evidens** och **rekommenderad åtgärd**.

## 8. Riskklassning

| Nivå | Vad som räknas | Krav |
|---|---|---|
| Låg | Ändring utan påverkan på data, behörighet eller hemligheter | Passerar utan separat mänsklig reviewer när alla kontroller är gröna |
| Normal | Övrig funktionell ändring | Minst en mänsklig reviewer |
| Hög | Se nedan | Minst två mänskliga reviewers och säkerhetsgranskning |

**Alltid hög risk:**
- Auth
- RLS
- Storage-policyer
- särskilt skyddade dokument
- AI-behörighetsfiltrering
- privat chatthistorik
- permission grants
- Graph-auth eller permissions
- secrets eller tokens
- mallpropagering
- gallring
- permanent radering
- migrationer som påverkar befintlig data
- förändring som kan göra filer eller metadata publika

Öppna säkerhets- och högriskfynd blockerar merge.

## 9. Mänskligt beslut

- Agentgodkännande räknas aldrig som mänskligt godkännande.
- Ett nytt commit ogiltigförklarar tidigare godkännande. Ny verifiering krävs efter senaste commit.

## 10. Verifiering före merge

- Alla kontroller i avsnitt 1 är gröna efter senaste commit.
- Mänskliga godkännanden finns efter senaste commit.
- Inga öppna blockerande fynd.
- FEAT-status stämmer med `project/feature-list.json` och `project/progress.md`.

## 11. Verifiering före release

- Deploymentevidens för GitHub Pages: URL och commit-SHA.
- Deploy från ren session fungerar (TEST-OPS-002).
- Fiktiv-märkning syns på alla sidor (OPS-009).
- Completion-gate (avsnitt 13) är uppfylld för varje feature som påstås vara lanserad.

## 12. FEAT-freshness reconciliation

Vid varje PR, i denna ordning:

1. Identifiera berörda FEAT-ID:n.
2. Kontrollera FEAT mot kod, migrationer och konfiguration.
3. Uppdatera `project/feature-list.json`.
4. Uppdatera `project/progress.md`.
5. Generera om rapporter.
6. Uppdatera CHANGELOG.
7. Kör `verify` och `validate-specs`.

Om en del inte kan verifieras sätts status till `needs-verification`.

## 13. Completion-gate

En feature får bara vara `complete` när:

- PRD-kopplingen är giltig,
- FEAT-filen beskriver aktuell implementation,
- feature-list anger samma status,
- implementation finns,
- migrationer och policyer är tillämpade när relevanta,
- acceptanskriterier är verifierade,
- tester och evals passerar,
- säkerhetsgranskning är godkänd,
- mänskliga godkännanden finns,
- progress och rapporter är avstämda,
- inga blockerande fynd finns,
- deploymentevidens finns när featuren påstås vara lanserad.

Annars är status `needs-verification`, `blocked` eller `in-progress`.

## 14. Kontroller som ännu inte finns

Varje punkt är en blockerare för merge av den feature som berörs, tills den är konfigurerad.

- Build, lint, typecheck och test: ingen `package.json` än (FEAT-012, fas 1 i implementationsplanen).
- CI-workflow i GitHub Actions (NFR-014, OPS-007).
- RLS-tester och Storage-policytester (TEST-006, FEAT-010).
- AI-permission-tester och read-only-test (TEST-AI-006, TEST-AI-008).
- M365-adaptertester och nätverkstest för ingen Graph-trafik (TEST-M365-004, TEST-M365-005).
- Hemlighets- och beroendeskanning (TEST-SEC-002).
- Visuell test och tillgänglighetstest (NFR-012).
- Granskning av ändrade filer mot FEAT-koppling (`verify`, avsnitt 6 i valideringskraven).
- Rapport- och progress-konsistens mot featurestatus.
- Automatiserad PR-granskning (avsnitt 4) och säkerhetsgranskning (avsnitt 5).
