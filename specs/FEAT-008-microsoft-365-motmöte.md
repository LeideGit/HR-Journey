# FEAT-008 Microsoft 365-mötesbokning (mock i MVP, Graph som framtid)

- **FEAT-ID:** FEAT-008
- **Status:** planned
- **Scopeklassificering:** MVP (mockad bokning och mockad adapter). Microsoft Graph-integration är Future.
- **PRD-ID:** PP-017, PP-018, PP-019, G-014, G-015, SK-019, SK-020, SK-021, US-M365-001 till US-M365-004, FR-M365-MVP-001 till FR-M365-MVP-013, FR-M365-FUT-001 till FR-M365-FUT-014, FR-M365-MAP-001 till FR-M365-MAP-007, ARCH-M365-001 till ARCH-M365-008, SEC-M365-001 till SEC-M365-012, AC-M365-MVP-001 till AC-M365-MVP-010, AC-M365-FUT-001 till AC-M365-FUT-008, TEST-M365-001 till TEST-M365-007, TEST-M365-FUT-001 till TEST-M365-FUT-004, NFR-007, NFR-008, NFR-009, NFR-015, SEC-016, SEC-017, SEC-019, SEC-020, SEC-021, SEC-022, SEC-023, OPS-005, OPS-006, OPS-010, RISK-010, RISK-011, RISK-012, RISK-013, RISK-014, RISK-015, RISK-016, RISK-017, RISK-018, BL-011, BL-012, BL-013, BL-014, OQ-M365-001 till OQ-M365-010, ADR-006 till ADR-011, DEP-007, DEP-008, DEP-009

## 1. Beteende, MVP

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-008-B1 | Milestone kan innehålla åtgärden Boka möte (FR-M365-MVP-001, AC-M365-MVP-001). | supported |
| FEAT-008-B2 | HR öppnar ett mötesformulär från milestonen (FR-M365-MVP-002, AC-M365-MVP-002). | supported |
| FEAT-008-B3 | Formuläret visar ämne, deltagare, datum, starttid, sluttid och Teams-alternativ (FR-M365-MVP-003, AC-M365-MVP-004). | supported |
| FEAT-008-B4 | Person och milestone är förvalda (AC-M365-MVP-003). | supported |
| FEAT-008-B5 | Personens M365-mappning visualiseras med fiktiv data (FR-M365-MVP-004, FR-M365-MAP-001). | supported |
| FEAT-008-B6 | Bokningen är mockad och kräver ingen Graph-anslutning (FR-M365-MVP-005). | supported |
| FEAT-008-B7 | Resultatet visas som ett mockat Microsoft 365-möte med titel, tider, deltagare, organiserare, status och Teams-indikator (FR-M365-MVP-006, FR-M365-MVP-008). | supported |
| FEAT-008-B8 | Mötet kopplas till aktuell person och milestone (FR-M365-MVP-007, AC-M365-MVP-006). | supported |
| FEAT-008-B9 | UI anger tydligt att integrationen är mockad (FR-M365-MVP-009, AC-M365-MVP-007). | supported |
| FEAT-008-B10 | Mockflödet följer samma gränssnitt som framtida Graph-adapter (FR-M365-MVP-010, ARCH-M365-004, AC-M365-MVP-010). | supported |
| FEAT-008-B11 | Inga kalenderinbjudningar skickas, och inga Teams-möten skapas (FR-M365-MVP-011, FR-M365-MVP-012, AC-M365-MVP-008, OPS-010). | supported |
| FEAT-008-B12 | Mockad bokning och ändring loggas som simulerad aktivitet (FR-M365-MVP-013, AC-M365-MVP-009). Loggformat i FEAT-009. | supported |
| FEAT-008-B13 | Mötesinformation visas från person och milestone (US-M365-002, AC-M365-MVP-006). | supported |
| FEAT-008-B14 | HR ser om mötet är ändrat eller borttaget i M365 (US-M365-003). | **not-represented** i MVP. Ingen mockad ändringshändelse är definierad. Ligger som Future (FR-M365-FUT-009) om inte användaren bekräftar en mockad variant. |
| FEAT-008-B15 | HR varnas om säker mottagarmappning saknas (FR-M365-MAP-006). | supported. Visas i mockat formulär. |
| FEAT-008-B16 | Felaktig eller tvetydig mappning skapar ingen kalenderinbjudan (FR-M365-MAP-007). | supported i MVP som spärr i mockflödet. |
| FEAT-008-B17 | Mappningsstatus: ej verifierad, verifierad, felaktig, frånkopplad (FR-M365-MAP-005). | supported |
| FEAT-008-B18 | Mappningen är inte bara visningsnamn (FR-M365-MAP-002). | supported. Mockmappningen använder fiktiv UPN och användar-ID. |

## 2. Beteende, Future (Needs investigation)

Ingen av dessa punkter är implementationsscope. Varje punkt är `Needs investigation` tills den verifierats mot officiell dokumentation och godkänts.

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-008-F1 | Kalenderhändelser skapas i Microsoft Graph (FR-M365-FUT-001, FR-M365-FUT-002). | Needs investigation |
| FEAT-008-F2 | Teams-möte konfigureras när kalendern stödjer det (FR-M365-FUT-003). Providerstöd per kalender och tenant (OQ-M365-010). | Needs investigation |
| FEAT-008-F3 | Deltagare får mötet via M365 (FR-M365-FUT-004). | Needs investigation |
| FEAT-008-F4 | Microsoft 365 är system of record för händelsen (FR-M365-FUT-006, ARCH-M365-007). | supported som princip (PP-017). Övrig detalj Needs investigation. |
| FEAT-008-F5 | HR Journey lagrar endast koppling, interna ID:n och nödvändig metadata (FR-M365-FUT-007, FR-M365-FUT-008, AC-M365-FUT-008). Exakt metadata: OQ-M365-007. | supported som princip, detaljer Needs investigation |
| FEAT-008-F6 | Synkronisering av ändringar och borttagning (FR-M365-FUT-009, FR-M365-FUT-010, OQ-M365-006, OQ-M365-008, TEST-M365-FUT-002). | Needs investigation |
| FEAT-008-F7 | Graph-fel ger begriplig status utan falskt lyckat tillstånd (FR-M365-FUT-011, AC-M365-FUT-006, NFR-008). | supported som princip. Felmodell Needs investigation. |
| FEAT-008-F8 | Retry är idempotent och dubbelbokning förhindras (FR-M365-FUT-012, FR-M365-FUT-013, NFR-009, TEST-M365-FUT-003). | supported som princip. Mekanism Needs investigation (OQ-M365-009). |
| FEAT-008-F9 | Delegated kontra application permissions (SEC-M365-002 till SEC-M365-004, OQ-M365-001, ADR-008). Calendars.ReadWrite är verifierad som kandidat i Graph-dokumentationen, men slutligt scope och consent är Needs investigation (SEC-M365-005). | Needs investigation |
| FEAT-008-F10 | Tenant-, admin consent- och tenantpolicy (SEC-M365-007, OQ-M365-003). | Needs investigation |
| FEAT-008-F11 | Entra ID-inloggning för HR Journey (BL-014, OQ-M365-004, SEC-M365-001). | Needs investigation |
| FEAT-008-F12 | Stabil personmappningsnyckel och fallback (FR-M365-MAP-003, FR-M365-MAP-004, OQ-M365-005, TEST-M365-FUT-004). Användaruppslag: SEC-M365-006. | Needs investigation |
| FEAT-008-F13 | Tokenlagring, rotation och revokering (SEC-M365-009, SEC-M365-012, ADR-011). | Needs investigation |
| FEAT-008-F14 | Certifikat eller federerad credential för confidential client (SEC-M365-011). | Needs investigation |
| FEAT-008-F15 | Throttling, rate limits, webhookskydd (OQ-M365-009, section 19.2 i PRD). | Needs investigation |
| FEAT-008-F16 | GDPR-bedömning och produktionsgranskning före Graph (SEC-020, SEC-022, DEP-009). | Needs investigation |
| FEAT-008-F17 | Auditing av mötesändringar utan onödig personuppgiftsduplicering (FR-M365-FUT-014, SEC-017). | Needs investigation |
| FEAT-008-F18 | Visning av Graph-mötesstatus och metadata i HR Journey (FR-M365-FUT-005). | Needs investigation |
| FEAT-008-F19 | Integrationsgräns: Graph-anrop endast via backend-adapter (ARCH-M365-003, ARCH-M365-006: Graph ersätter inte HR Journeys profiler, tidslinjer och milestones). | supported som arkitekturprincip, implementation Needs investigation |
| FEAT-008-F20 | Least privilege och förbud mot för breda Graph-behörigheter (SEC-M365-003: application permissions endast vid verifierat behov; SEC-M365-008: least privilege; SEC-M365-010: client secret ej i frontend). | Needs investigation (behörighetsval), supported som krav |
| FEAT-008-F21 | Tokenmodell och verifierad Graph-permissionslista (OQ-M365-002). | Needs investigation |
| FEAT-008-F22 | ADR för personmappning och identitet (ADR-009) och för event-sync och system-of-record-gräns (ADR-010). Krävs före Future. | Needs investigation |

## 3. Icke-mål, MVP

- Riktig Graph-trafik (TEST-M365-004, OPS-006).
- Verkliga kalenderinbjudningar eller Teams-möten (BL-011, BL-012, OPS-010).
- Verklig Graph-synkronisering (BL-013).
- Entra ID-produktionsinloggning (BL-014).
- Kopia av hela kalenderposten i HR Journey (FR-M365-FUT-008).

## 4. Datamodellspåverkan, MVP

- `m365_mock_mappings`: person_id, mock_tenant_id, mock_user_id, mock_upn, status (ej verifierad, verifierad, felaktig, frånkopplad), skapad. Fiktiva värden, märkta som mock.
- `meeting_bookings`: id, person_id, milestone_id, ämne, deltagare (person-ID), start, slut, Teams-flagga, status, `is_mock = true`, skapad av, skapad tid. Ingen kalender-ID eller Graph-ID i MVP.
- Mötesbeskrivning är inte en MVP-kolumn. SEC-019 kräver att HR-känslig information inte kopieras till ämne eller beskrivning. Mockformuläret begränsar ämnet till en vald mall eller kort text, och varnar vid personnamn eller känsliga ord. [TBD] ansvarig användaren.
- Adapterkontrakt (TypeScript-interface) är gemensamt för mock och framtida Graph-adapter. Domänmodellen importerar inte Graph-klienten (ARCH-M365-005).
- Schema i FEAT-010.

## 5. Säkerhets- och integritetspåverkan

- **Alltid hög risk:** Graph-auth, permissions, tokens och secrets (REVIEW.md). MVP har inga riktiga credentials.
- Ingen Graph-credential, client secret eller token får finnas i frontend (ARCH-M365-001, SEC-016, TEST-M365-007).
- Mock-adaptern körs på backend, så att kontraktet liknar den framtida verkliga flödet (ARCH-M365-002).
- Mockformatet är eget och enkelt, och efterliknar inte Graph-svar. Beslut 2026-10-29, se ADR-007.
- Feature flag för verklig Graph-adapter är avstängd i MVP-miljön (OPS-006). Flaggan finns som konfiguration, inte kod.
- Mockad mötesbokning ska inte kunna förväxlas med verklig: märkning i UI och i data (RISK-010).

## 6. Beroenden

- FEAT-001 (roll), FEAT-003 (milestone, Boka möte), FEAT-009 (simulerad logg), FEAT-010 (datamodell).
- DEP-007 (mock-adapter), DEP-008 (Entra och Graph-konfiguration, senare).

## 7. Risker

- RISK-010: mockat möte uppfattas som verkligt.
- RISK-011: fel person mappas till M365-identitet.
- RISK-016: HR-känslig information i mötesämne eller beskrivning.
- RISK-014, RISK-015: Graph-fel och retry. Gäller bara Future.
- RISK-017: mötesdata dupliceras och divergerar.

## 8. Acceptanskriterier, MVP

- AC-FEAT-008-1: Kvalificerad milestone visar Boka möte (AC-M365-MVP-001).
- AC-FEAT-008-2: Formuläret har person och milestone förvalda (AC-M365-MVP-002, AC-M365-MVP-003).
- AC-FEAT-008-3: Bokningen skapar en mockad möteskoppling och visar den från person och milestone (AC-M365-MVP-005, AC-M365-MVP-006).
- AC-FEAT-008-4: Mockindikator syns (AC-M365-MVP-007).
- AC-FEAT-008-5: Ingen kalenderhändelse eller Teams-länk skapas, och ingen Graph-trafik sker (AC-M365-MVP-008, TEST-M365-004).
- AC-FEAT-008-6: Aktiviteten loggas som simulerad (AC-M365-MVP-009).
- AC-FEAT-008-7: Mockadapter kan ersättas utan ombyggnad av domänmodellen (AC-M365-MVP-010, TEST-M365-005).

## 9. Acceptanskriterier, Future

Ingen är godkänd i MVP.

- AC-M365-FUT-001 (ADR för delegated kontra application före verklig integration).
- AC-M365-FUT-002 (Graph-permissions verifierade).
- AC-M365-FUT-003 (least privilege dokumenterat).
- AC-M365-FUT-004 (personmappning entydig).
- AC-M365-FUT-005 (secrets endast i godkänd backend-miljö).
- AC-M365-FUT-006 (Graph-fel ger inte falskt lyckad status).
- AC-M365-FUT-007 (ändrat eller borttaget M365-möte återspeglas utan att milestone raderas).
- AC-M365-FUT-008 (kalenderinformation dupliceras inte mer än behovet).

## 10. Test- och evalkrav

- TEST-M365-001 (mockad mötesbokning).
- TEST-M365-002 (koppling möte, person och milestone).
- TEST-M365-003 (tydlig mockindikator).
- TEST-M365-004 (ingen Graph-trafik i MVP-läge, nätverkstest).
- TEST-M365-005 (adapterkontrakt för mock och framtida Graph).
- TEST-M365-006 (timeout, retry och felpresentation för adaptern, även för mock).
- TEST-M365-007 (inga secrets i frontendbundle).
- TEST-M365-FUT-001 till TEST-M365-FUT-004: skrivs först när Future godkänts.

## 11. Verifieringsevidens

Ingen.

## 12. Öppna blockerare

- **ADR-008 till ADR-011 saknas.** ARCH-M365-008 kräver ADR före verklig Graph-integration, inte före mock. ADR-006 (Graph som integrationslager) och ADR-007 (mockad adapter) är skrivna i `docs/adr/`. Ansvarig utvecklaren. Övriga blockerar Future.
- Mötesämne och SEC-019 (automatisk kopiering av HR-information). Ansvarig användaren. Nästa steg: bekräfta regeln. [TBD].
- Mockad ändringshändelse (US-M365-003). Ansvarig användaren. Nästa steg: besluta om mockad ändring ska finnas i MVP. [TBD].
- Alla F1–F17 blockerar Future, inte MVP.
