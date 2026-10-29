# HR Journey – projektinstruktioner

MVP för HR med visuell personresa, milestones, dokument, simulerade mejl, mockad AI och mockad Microsoft 365-mötesbokning. **All data är fiktiv.** Språk i UI och artefakter: svenska.

## Auktoritet och källor

1. **PRD-HR-Journey-v002.md** är enda scope- och kravauktoritet. Filen är lokal och git-ignorerad. Om den saknas: avbryt och begär bilagan. Rekonstruera den inte.
2. **project/feature-list.json** är maskinläsbar status för varje feature.
3. **specs/FEAT-*.md** är aktuellt beteendekontrakt och verifieringskrav.
4. **docs/adr/** är arkitekturbeslut.
5. **project-preparations.md** (lokal, git-ignorerad) beskriver miljö, Supabase-projekt och GitHub. Läs den före uppbyggnad.

Repot, inte minnet, är källan för aktuell implementation.

## Regler

- Endast FEAT-innehåll som är **supported** i PRD:n är implementationsscope. Backlogg och Future implementeras inte utan godkänd PRD-ändring.
- En ändring som påverkar produktbeteende, UI, datamodell, API, migration, Auth, RLS, Storage, AI, M365-mock, Graph-arkitektur, permissions, tester, evals, dependencies, acceptanskriterier eller status uppdaterar berörda FEAT i **samma** ändring.
- Status **complete** kräver completion-gate i REVIEW.md. Annars `needs-verification`, `blocked` eller `in-progress`.
- Falska success states är förbjudna. Ett steg som inte är konfigurerat ska synas som SKIPPED och ge fel.
- Optimistisk UI kräver testad rollback.
- Osäkra påståenden om Microsoft Graph, tenant, permissions eller Teams märks `Needs investigation`. Gör inga antaganden.
- Använd `[TBD]` bara för icke-kritiska luckor, med ansvarig, nästa steg och blockerad feature.

## Säkerhet

- Hemligheter (service-role-nyckel, databaslösenord, Graph-secrets, tokens) får aldrig hamna i frontend, repo, logg eller commit.
- Endast publik anon-nyckel i frontend, via `.env.local` (git-ignorerad). `.env.example` har tomma platshållare.
- Storage är privat. Inga publika länkar.
- Ingen extern LLM-anrop i MVP. Ingen Graph-trafik i MVP.
- Verkliga personuppgifter och verkliga HR-dokument får inte användas, inte ens som testdata.

## Git

- Commit och push endast efter användarens godkännande.
- Commit-meddelanden slutar med: `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`
- PR-beskrivningar slutar med: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- Repot är publikt. Granska varje commit för personuppgifter och hemligheter innan push.
- Ändra inte projektet `LeideGit's Project`. Använd bara hostat projekt `hr-journey`.

## Kommandon

```
bash scripts/setup.sh           # kontrollera förutsättningar, installerar inget
bash scripts/verify.sh          # alla kontroller, ger fel vid SKIPPED
node scripts/validate-specs.mjs # PRD-mappning, FEAT-status mot feature-list
node scripts/run-evals.mjs      # evals (ej implementerad runner ännu)
node scripts/generate-reports.mjs  # genererar reports/*.md
```

## Var saker finns

- Spec: `specs/` (FEAT-001 till FEAT-012, se `specs/README.md`)
- Status: `project/feature-list.json`, `project/progress.md`, `project/implementation-plan.md`
- Granskning: `REVIEW.md`
- Evals: `evals/cases/`, `evals/graders/`, `evals/baselines.json`
- Rapporter: `reports/` (genererade)
- Besluts- och källreferenser: `docs/references.md`

## Projektets status

Scopeavstämning är klar och alla FEAT är `planned`. Ingen implementation finns. Se `project/progress.md` för aktuella blockerare.
