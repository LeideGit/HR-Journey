# ADR-006: Microsoft Graph som integrationslager, inte datamodell

- **Status:** Accepterad för arkitekturprincipen. Graph-implementation är inte godkänd.
- **Datum:** 2026-10-29
- **Beslutad av:** användaren (godkänner att allt M365- och Graph-beteende i MVP är mockat)
- **PRD-ID:** PP-017, PP-018, ARCH-M365-002, ARCH-M365-003, ARCH-M365-005, ARCH-M365-006, ARCH-M365-007, FR-M365-FUT-006, FR-M365-FUT-007, FR-M365-FUT-008, OQ-M365-001
- **FEAT-ID:** FEAT-008

## Kontext

PRD v002 kräver att Microsoft 365 är system of record för kalender- och mötesinformation (PP-017), men att Microsoft Graph endast är ett integrationslager (PP-018). HR Journey ska äga person, milestone och HR-relationen till mötet (ARCH-M365-006). Målarkitekturen är:

React/TypeScript frontend → HR Journey backend → Microsoft Graph API → Microsoft 365 (Outlook Calendar, Teams meetings)

Microsoft Graph kan skapa kalenderhändelser och skicka inbjudningar (PRD sektion 12.3). Vilka behörigheter som krävs är inte fastställt (OQ-M365-001, OQ-M365-002).

## Beslut

1. **Frontend anropar aldrig Graph.** Alla M365-operationer går via HR Journey backend (ARCH-M365-001, ARCH-M365-002). Frontend innehåller inga credentials.
2. **Graph-anrop är inkapslade i en adapter.** Domänlogiken för person, milestone och möteskoppling importerar inte Graph-klienten (ARCH-M365-003, ARCH-M365-005).
3. **HR Journey äger sin egen datamodell.** Graph ersätter inte profiler, tidslinjer, milestones eller HR-relationen (ARCH-M365-006, PP-018).
4. **Microsoft 365 är system of record för kalenderhändelsen.** HR Journey lagrar koppling, interna ID:n och nödvändig metadata, inte en parallell kalenderpost (FR-M365-FUT-006 till FR-M365-FUT-008).
5. **Ingen Graph-trafik i MVP.** Den verkliga adaptern är avstängd genom konfiguration eller feature flag (OPS-006). Detaljerna i ADR-007.

## Konsekvenser

- Positivt: byte från mock till Graph påverkar adapterlagret, inte domänmodellen (AC-M365-MVP-010).
- Positivt: mock och Graph följer samma kontrakt, så tester av domänlogiken gäller båda.
- Negativt: en extra backend-hop för all M365-funktion. Ingen direkt klientintegration.
- Test: TEST-M365-005 (kontrakt), TEST-M365-004 (ingen Graph-trafik), TEST-M365-007 (inga secrets i frontend).

## Alternativ som övervägts

| Alternativ | Varför inte valt |
|---|---|
| Frontend anropar Graph direkt med användarens token | Bryter ARCH-M365-001. Tokens skulle exponeras i frontend (SEC-016). |
| Spegla hela kalenderhändelsen i HR Journey | Bryter FR-M365-FUT-008 och skapar divergens (RISK-017). |
| Microsoft 365 som primär datakälla för personer | Bryter PP-018 och ARCH-M365-006. |

## Öppna frågor

- **OQ-M365-001 (delegated eller application):** Needs investigation. Avgörs i ADR-008, som ännu inte är skriven. Ansvarig utvecklaren. Blockerar all Graph-implementation, inte MVP.
- **Graph-anropsmönster** (synkron anrop från backend eller asynkront jobb): Needs investigation. Blockerar Future.
- **Verifiering av Graph-dokumentation:** Calendars.ReadWrite är en verifierad kandidat, men slutligt scope är Needs investigation (SEC-M365-005). Får inte användas som antagande.
