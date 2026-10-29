# ADR-007: Mockad M365-adapter i MVP

- **Status:** Accepterad
- **Datum:** 2026-10-29
- **Beslutad av:** användaren (godkänner att allt M365- och Graph-beteende i MVP är mockat, inklusive simulerad koppling till M365 och Graph)
- **PRD-ID:** ARCH-M365-004, ARCH-M365-008, FR-M365-MVP-005, FR-M365-MVP-009, FR-M365-MVP-010, FR-M365-MVP-011, FR-M365-MVP-012, FR-M365-MVP-013, AC-M365-MVP-005, AC-M365-MVP-007, AC-M365-MVP-008, AC-M365-MVP-010, TEST-M365-004, TEST-M365-005, TEST-M365-006, OPS-005, OPS-006, OPS-010, NFR-007, NFR-015, DEP-007
- **FEAT-ID:** FEAT-008, FEAT-011

## Kontext

PRD v002 kräver att M365-bokningen är mockad i MVP, att mockflödet följer samma gränssnitt som en framtida Graph-adapter (FR-M365-MVP-010), att ingen verklig kalenderinbjudan eller Teams-möte skapas (OPS-010), och att den verkliga adaptern är avstängd (OPS-006). ARCH-M365-008 kräver ADR före verklig Graph-integration. Den här ADR:n gäller mocken och kontraktet, inte verklig Graph.

## Beslut

1. **Ett adapterkontrakt** definieras som TypeScript-interface i backend, med operationerna `bookMeeting`, `getMeeting` och `getMappingStatus`. Kontraktet beskriver operationer, indata, utdata och felkoder. Det innehåller inga Graph-typer.
2. **Två implementationer** av kontraktet: `MockM365Adapter` (aktiv i MVP) och en framtida `GraphM365Adapter` (ej implementerad, ej godkänd). Valet görs av konfiguration. Standardvärdet i MVP är mock (OPS-005).
3. **Feature flag för Graph** är avstängd i MVP-miljön och kan inte slås på från frontend (OPS-006, FEAT-011-B9).
4. **Mocken läser och skriver endast till HR Journey-databasen.** Den gör inga nätverksanrop mot Microsoft-domäner, inklusive `graph.microsoft.com` och `login.microsoftonline.com` (FR-M365-MVP-005, TEST-M365-004).
5. **Mockdata är fiktiv och märkt.** Mötesposter har `is_mock = true`. UI visar mockindikator (FR-M365-MVP-009, AC-M365-MVP-007).
6. **Mocken simulerar felmodellen.** Timeout, tillfälliga fel och validering returneras med samma felkoder som kontraktet definierar, så att UI-felpresentationen testas även i MVP (TEST-M365-006, NFR-007).
7. **Ingen falsk framgång.** Mocken returnerar bara `booked` när posten är skriven till databasen i samma transaktion. Annars returneras fel (FR-VTL-017, AC-M365-FUT-006 som princip).
8. **Inbjudningar, Teams-länkar och kalender-ID:n skapas inte.** Fält för dem finns inte i MVP-schemat (AC-M365-MVP-008).

## Konsekvenser

- Positivt: domänlogik för möten testas utan Graph-konto eller tenant.
- Positivt: byte till Graph kräver att en ny adapter implementerar kontraktet, inte att domänmodellen byggs om (AC-M365-MVP-010).
- Negativt: mocken kan ge intryck av verklig integration. Risken hanteras med märkning och tester (RISK-010).
- Negativt: kontraktet kan behöva ändras när Graph-verkligheten är känd. Ändringen görs då i ADR, inte tyst.
- Test: TEST-M365-001 till TEST-M365-007.

## Alternativ som övervägts

| Alternativ | Varför inte valt |
|---|---|
| Ingen adapter, direkt databasinsert i UI | Bryter FR-M365-MVP-010. Byte till Graph skulle kräva omskrivning av UI. |
| Verklig Graph-sandbox i MVP | Bryter FR-M365-MVP-005 och OPS-010. Kräver tenant, consent och permissions som ännu är Needs investigation. |
| Mock i frontend | Bryter ARCH-M365-002. Mocken måste ligga i backend så att kontraktet är detsamma som för Graph. |

## Beslut om mockformat (2026-10-29)

Mocken använder ett eget, enkelt format. Det efterliknar inte Graph-svar. Användaren godkände detta: enkel lösning för MVP, inte överarbetad. Mockens poster är HR Journey-tabeller med `is_mock = true`. Inga Graph-fältnamn, ID-format eller felkoder kopieras.

## Öppna frågor

- **Simulerad Graph-form:** avgjord, se beslutet ovan.
- **Mockad ändringshändelse** (US-M365-003): om mocken ska kunna visa att ett möte ändrats eller tagits bort i M365 är ej beslutat. Ansvarig användaren. Blockerar FEAT-008-B14.
- **Mötesämne och SEC-019:** regeln för vad som får kopieras till ämne eller beskrivning är inte beslutad. Ansvarig användaren.
