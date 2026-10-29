# FEAT-009 Historik och granskningsspår

- **FEAT-ID:** FEAT-009
- **Status:** planned
- **Scopeklassificering:** MVP
- **PRD-ID:** G-012, SEC-018, FR-DOC-010, FR-DRET-002, FR-DRET-003, FR-M365-MVP-013, FR-M365-FUT-014, FR-MAIL-006, FR-AI-HIST-*, FR-TMPL-005, US-M365-003, SEC-017, section 5.1 (historiespår), NFR-013

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-009-B1 | HR- och dokumenthändelser loggas (G-012). | supported. Händelselista är [TBD] ansvarig användaren. |
| FEAT-009-B2 | Dokumentnedladdning loggas (FR-DOC-010). | supported |
| FEAT-009-B3 | Gallring och permanent radering loggas med godkännande (FR-DRET-002, FR-DRET-003). | supported |
| FEAT-009-B4 | Simulerat mejl loggas som simulerat (FR-MAIL-006). | supported |
| FEAT-009-B5 | Mockat möte loggas som simulerat (FR-M365-MVP-013). | supported |
| FEAT-009-B6 | Malländring loggas, inklusive individuella avvikelser som undantagits (FR-TMPL-005). | ambiguous: PRD kräver att avvikelser inte skrivs över tyst, men inte hur de loggas. Förslag: loggas som händelse med mall-version före och efter. |
| FEAT-009-B7 | Loggen innehåller tekniska korrelations-ID:n i stället för personuppgifter (SEC-018, SEC-017). | supported |
| FEAT-009-B8 | Historik i personprofilen (FR-PERSON-004, section 5.1). | supported |
| FEAT-009-B9 | Loggen är append-only för alla roller (ingen redigering eller radering i MVP). | ambiguous: PRD säger inte. Förslag: append-only. Rensning av loggen är Needs investigation (GDPR, retention). |

## 2. Icke-mål

- Gallring av loggar (Needs investigation, GDPR).
- Export av granskningsspår.

## 3. Datamodellspåverkan

- `audit_events`: id, tidpunkt, aktör (user-ID), händelsetyp, objekttyp, objekt-ID, korrelations-ID, payload utan personuppgifter, `is_simulated` (boolean).
- Insert via backend-funktion. Ingen direkt INSERT från klient.
- Schema och RLS i FEAT-010.

## 4. Säkerhets- och integritetspåverkan

- Loggen kan innehålla personuppgifter via objekt-ID. Endast HR och HR-administratör läser, och endast för objekt de får läsa.
- Särskilt skyddade objekt: händelsen loggas, men innehållet loggas inte.

## 5. Beroenden

- FEAT-001, FEAT-006, FEAT-005, FEAT-008, FEAT-010.

## 6. Risker

- RISK-008: AI-historik eller granskningsspår blir bakväg till återkallad information.
- Loggen divergerar från verkligt tillstånd om den skrivs från klienten. Åtgärd: backend-skrivning i samma transaktion.

## 7. Acceptanskriterier

- AC-FEAT-009-1: Nedladdning, gallring, permanent radering och simulerat utskick ger en loggpost.
- AC-FEAT-009-2: Loggpost för simulerad aktivitet är märkt `is_simulated`.
- AC-FEAT-009-3: Loggpost innehåller inga personuppgifter i payload.
- AC-FEAT-009-4: Misslyckad åtgärd ger ingen loggpost för lyckat utfall (inget falskt success).

## 8. Test- och evalkrav

- TEST-008 (gallring och permanent radering, inkl. loggpost).
- Test: payload saknar personuppgifter för skyddade objekt.
- Test: klient kan inte skriva direkt till `audit_events` (TEST-006).

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- B1 (händelselista). Ansvarig användaren. Nästa steg: godkänna lista. [TBD].
- B6 (malländring i logg). Ansvarig användaren. Nästa steg: bekräfta förslag. Blockerar delar av FEAT-003 B19.
- B9 (append-only). Ansvarig användaren. Nästa steg: bekräfta. Förslag gäller tills dess.
