# FEAT-003 Profiler, tidslinjemallar, milestones och tasks

- **FEAT-ID:** FEAT-003
- **Status:** planned
- **Scopeklassificering:** MVP, med blockerad delfunktion (mallpropagering)
- **PRD-ID:** PP-004, PP-005, PP-010, G-005, G-006, SK-006, SK-007, SK-008, SK-010, FR-PROF-001 till FR-PROF-006, FR-TMPL-001 till FR-TMPL-005, FR-MILE-001 till FR-MILE-006, FR-VTL-007, FR-VTL-008, FR-VTL-009, FR-VTL-010, FR-VTL-011, FR-VTL-016, FR-VTL-017, FR-VTL-018, FR-VTL-019, AC-005, AC-006, TEST-004, OQ-002, FR-M365-MVP-001

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-003-B1 | HR skapar profil med namn, e-post, profiltyp, avdelning, chef, startdatum och valfritt slutdatum (FR-PROF-001). | supported |
| FEAT-003-B2 | Profiltyp styr tidslinjemall: Anställd, Konsult, LIA (FR-PROF-002, 5.3). | supported |
| FEAT-003-B3 | Fasta datum genereras från profildatum och mallregler (FR-PROF-003). | supported |
| FEAT-003-B4 | HR granskar planen innan den sparas (FR-PROF-004). | supported |
| FEAT-003-B5 | Individuell tidslinje är separat från mallen (FR-PROF-005, AC-006). | supported |
| FEAT-003-B6 | Individuella ändringar påverkar inte andra profiler (FR-PROF-006). | supported |
| FEAT-003-B7 | Milestone har titel, beskrivning, datum, status och framförhållning (FR-MILE-001). | supported |
| FEAT-003-B8 | Milestone kan innehålla tasks och visa progress (FR-MILE-002, FR-MILE-003). | supported |
| FEAT-003-B9 | Alla tasks klara ger Slutförd (FR-MILE-004, FR-VTL-018). Återöppnad task ger Aktuellt eller Försenad utifrån datum (FR-MILE-005, FR-VTL-019). | supported |
| FEAT-003-B10 | Milestone kan innehålla åtgärden Boka möte (FR-MILE-006, FR-M365-MVP-001). Innehåller FEAT-008. | supported |
| FEAT-003-B11 | HR administrerar profiltyper och mallar enligt behörighet (FR-TMPL-001). | supported. Behörighet: HR-administratör (5.2). |
| FEAT-003-B12 | Malländring kan begränsas till nya profiler (FR-TMPL-002). | **blocked**: OQ-002. |
| FEAT-003-B13 | Malländring kan appliceras på befintliga profiler efter förhandsgranskning (FR-TMPL-003). | **blocked**: OQ-002. |
| FEAT-003-B14 | Berörda personer och milestones visas före malländring (FR-TMPL-004). | supported, men beroende av B12–B13. |
| FEAT-003-B15 | Individuella avvikelser skrivs inte över tyst (FR-TMPL-005). | supported. Konfliktregel saknas, så själva skrivningen blockeras tills OQ-002 är avgjord. |
| FEAT-003-B16 | Drag-and-drop och datumändring sparas i backend (FR-VTL-009, FR-VTL-010, FR-VTL-016). | supported |
| FEAT-003-B17 | Misslyckad lagring lämnar inte falskt sparat tillstånd (FR-VTL-017). | supported. Kräver testad rollback för optimistisk UI. |
| FEAT-003-B18 | Milestones kan dras från biblioteket (FR-VTL-011). | ambiguous: PRD anger inte vad "biblioteket" är. Förslag: mallens milestone-lista. [TBD] ansvarig användaren. |
| FEAT-003-B19 | Malländring är en egen versionerad händelse i historiken. | not-represented: PRD kräver spårbarhet (G-012) men inte för malländring specifikt. Se FEAT-009. |

## 2. Icke-mål

- Automatisk konfliktlösning vid malländring (OQ-002 är öppen).
- Sync av malländringar till Microsoft 365.

## 3. Datamodellspåverkan

- Mall per profiltyp med milestone-definitioner (titel, relativt datum, framförhållning, tasks).
- Individuell milestone-instans kopplad till person. Instansen är inte en referens till mallen, så att malländring inte skriver över den (FR-PROF-005).
- Task: titel, status, slutförd tidpunkt, ägare om PRD kräver det (PRD anger inte ägare: ambiguous).
- Schema och RLS i FEAT-010.

## 4. Säkerhets- och integritetspåverkan

- Mallar är inte personuppgifter, men HR-administratörs rätt att ändra dem är en integritetsrisk (RISK-004).
- Malländring som kan påverka befintliga profiler är **hög risk** i REVIEW.md (mallpropagering).

## 5. Beroenden

- FEAT-002 (tidslinje), FEAT-004 (dashboard läser milestones), FEAT-008 (Boka möte), FEAT-009 (historik), FEAT-010 (datamodell).

## 6. Risker

- RISK-004: malländring skriver över individuell anpassning.
- RISK-019: prototypens teknikval blir produktionsval.

## 7. Acceptanskriterier

- AC-FEAT-003-1: Skapad profil får en tidslinje av rätt profiltyp (SK-006).
- AC-FEAT-003-2: Individuell ändring ändrar ingen annan profil (AC-006).
- AC-FEAT-003-3: Alla tasks klara ger Slutförd, och återöppnad task ger rätt status (FR-MILE-004, FR-MILE-005).
- AC-FEAT-003-4: Misslyckad sparning visar fel och lämnar tidigare tillstånd kvar (FR-VTL-017).
- AC-FEAT-003-5 (blockerad): malländring visar konsekvens innan lagring. Väntar på OQ-002.

## 8. Test- och evalkrav

- TEST-001: status- och datumtester.
- TEST-002: tidslinjegenerering och drag-and-drop.
- TEST-004: mallpropagering och konflikt. **Blockerad av OQ-002.** Test skrivs men markeras `blocked` i feature-list.
- Rollback-test för optimistisk UI (krav i PRD sektion 10).

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- **OQ-002 (konfliktregel för mallpropagering).** Avvaktad på användarens beslut (D-6). Blockerar B12, B13, B15 och TEST-004. Ansvarig användaren. Nästa steg: beslut om konfliktregel. Övrig funktion får byggas.
- B18 (bibliotek för milestones). Ansvarig användaren. Nästa steg: bekräfta förslaget. [TBD].
