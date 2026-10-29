# FEAT-012 Plattform, CI och GitHub Pages-deploy

- **FEAT-ID:** FEAT-012
- **Status:** planned
- **Scopeklassificering:** MVP
- **PRD-ID:** NFR-010, NFR-011, NFR-012, NFR-014, OPS-001, OPS-007, OPS-008, OPS-009, TEST-OPS-001, TEST-OPS-002, TEST-SEC-002, DEP-002, DEP-003, ARCH-M365-001, RISK-019, RISK-002, RISK-003, SEC-004, SEC-005, PP-019, FR-AI-FUT-004, SEC-011

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-012-B1 | Frontend publiceras via GitHub Pages (OPS-001, DEP-002). | supported |
| FEAT-012-B2 | CI kör build, lint, typecheck, tester och specifikationsvalidering, och blockerar merge vid fel (NFR-014, OPS-007, DEP-003, TEST-OPS-001). | supported |
| FEAT-012-B3 | Öppna högrisk- och säkerhetsfynd blockerar release (OPS-008). | supported |
| FEAT-012-B4 | Prototypen märks som fiktiv testmiljö i UI (OPS-009). | supported. Märkningstext är [TBD] ansvarig användaren. |
| FEAT-012-B5 | Deploy från ren session fungerar (TEST-OPS-002). | supported |
| FEAT-012-B6 | Appen fungerar i Chrome och Edge (NFR-010). | supported |
| FEAT-012-B7 | Primära flöden är tangentbordstillgängliga (NFR-011, FEAT-002-B6). | supported |
| FEAT-012-B8 | Målnivå WCAG 2.2 AA (NFR-012). | supported. Verifieras av visuell och tillgänglighetstest, inte bara i CI. |
| FEAT-012-B9 | Frontend anropar aldrig privilegierade operationer med inbäddade credentials (ARCH-M365-001). | supported |
| FEAT-012-B10 | Ingen extern LLM-trafik och ingen Graph-trafik i MVP-bundle (FEAT-007-B51, FEAT-008-B11). | supported |
| FEAT-012-B11 | Publik frontend är inte publik dataåtkomst (RISK-002). Backend och RLS skyddar data oberoende av frontend. | supported |
| FEAT-012-B12 | Ingen AI-skrivoperation i frontend-bundle (FR-AI-FUT-004). | supported |
| FEAT-012-B13 | Frontendstack Vite + React + TypeScript och statisk hosting (ADR-001). Stacken är prototypval; RISK-019 gäller produktionsval. | supported som MVP-val. Produktionsbeslut Needs investigation. |
| FEAT-012-B14 | Verkliga personuppgifter och verkliga HR-dokument får inte användas i MVP (BL-015, BL-016, RISK-001). | supported. Kontrolleras genom regel och seed-granskning, inte teknisk spärr. |

## 2. Icke-mål

- Mobilapp (BL-018).
- Entra ID-produktionsdeploy (BL-014).

## 3. Datamodellspåverkan

Ingen.

## 4. Säkerhets- och integritetspåverkan

- **Hög risk:** secrets i CI, GitHub Secrets, deploy-workflow. Två mänskliga reviewers vid ändring av workflow-filer.
- Hemlighetsskanning i CI, beroendeskanning och bundle-kontroll (TEST-SEC-002).
- Service-role-nyckel och databaslösenord får aldrig nå bundle eller loggar (SEC-005, PP-019).

## 5. Beroenden

- FEAT-010 (Supabase-anslutning, anon-nyckel), FEAT-011 (feature flag).
- GitHub Pages och GitHub Actions. Public repo `LeideGit/HR-Journey`.

## 6. Risker

- RISK-019: prototypens teknikval blir produktionsval.
- RISK-002: publik frontend förväxlas med publik dataåtkomst.
- RISK-003: privilegierad nyckel exponeras i bundle.

## 7. Acceptanskriterier

- AC-FEAT-012-1: Build, lint, typecheck, tester och spec-validering passerar i CI innan merge.
- AC-FEAT-012-2: Deploy till GitHub Pages fungerar från en tom klon, med routing som fungerar på statisk hosting.
- AC-FEAT-012-3: Bundle innehåller inga service-role-nycklar, databaslösenord eller Graph-secrets (TEST-M365-007).
- AC-FEAT-012-4: Fiktiv-märkning syns på alla sidor.

## 8. Test- och evalkrav

- TEST-OPS-001 (build, lint, typecheck, deploy).
- TEST-OPS-002 (GitHub Pages från ren session).
- TEST-SEC-002 (hemlighets- och beroendeskanning).
- TEST-M365-007 (inga secrets i frontend).
- Visuell och tillgänglighetstest för NFR-012.

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- Routing på GitHub Pages (404-fallback eller hash-routing). Ansvarig utvecklaren. Nästa steg: välj metod. [TBD].
- Inget av detta blockerar FEAT-010 eller FEAT-007.
