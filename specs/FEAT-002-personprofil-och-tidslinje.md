# FEAT-002 Personprofil och visuell tidslinje

- **FEAT-ID:** FEAT-002
- **Status:** in-progress (se `project/feature-list.json`)
- **Scopeklassificering:** MVP
- **PRD-ID:** PP-001, PP-002, PP-003, PP-004, G-003, G-004, SK-003, SK-004, SK-005, FR-PERSON-001 till FR-PERSON-005, FR-VTL-001 till FR-VTL-019, AC-003, AC-004, NFR-001, NFR-002, TEST-002, TEST-003

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-002-B1 | Dedikerad profilsida visar namn, profiltyp, avdelning, chef, e-post och period (FR-PERSON-001, FR-PERSON-002). | supported |
| FEAT-002-B2 | Tidslinjen är primär komponent och kronologisk (FR-VTL-001, FR-PERSON-003). | supported |
| FEAT-002-B3 | X-position bestäms av milestonens datum (FR-VTL-002, AC-004). | supported |
| FEAT-002-B4 | Dåtid, nutid och framtid syns, och dagens datum markeras (FR-VTL-003, FR-VTL-013). Tidslinjen öppnas alltid med idag synligt i vyn. Scroll flyttas dit vid montering och när dagens datum ändras (användarbeslut 2026-10-29). | supported |
| FEAT-002-B5 | Milestones är interaktiva rutor med titel, datum och status (FR-VTL-004). | supported |
| FEAT-002-B6 | Kommande, Aktuellt, Försenad och Slutförd särskiljs utan enbart färg (FR-VTL-005, WCAG). | supported |
| FEAT-002-B7 | Ljus statusnyans som bakgrund (FR-VTL-006). | supported |
| FEAT-002-B8 | Individuella avvikelser markeras (FR-VTL-012). | supported |
| FEAT-002-B9 | Tät information överlappar inte okontrollerat (FR-VTL-014). Långa tidslinjer är navigerbara (FR-VTL-015). | supported |
| FEAT-002-B10 | Exakt tidsskala (år, månad, vecka) per zoomnivå. | ambiguous: OQ-003. Förslag: månadsskala som standard, [TBD] ansvarig användaren. |
| FEAT-002-B11 | Dokument, historik och möten nås utan att personkontexten tappas (FR-PERSON-004). | supported |
| FEAT-002-B12 | Aktiv eller arkiverad status syns (FR-PERSON-005). Arkivering av person är i PRD inte definierad som egen operation. | ambiguous: FR-DARCH-002 säger separata livscykler, men personarkivering har ingen PRD-operation. |
| FEAT-002-B13 | Drag-and-drop och datumändring, sparade i backend, utan falskt sparat tillstånd (FR-VTL-009, FR-VTL-010, FR-VTL-016, FR-VTL-017). | supported; detaljer i FEAT-003. |

## 2. Icke-mål

- Tidslinjeberäkning för mer än de fält PRD:n anger.
- Grafisk tidslinje för dokument (dokument ligger i FEAT-006).

## 3. Datamodellspåverkan

- Profil: namn, e-post, profiltyp, avdelning, chef, startdatum, slutdatum, status (FR-PROF-001, FR-PERSON-005).
- Tidslinjen är en egen instans per person som kan avvika från mallen (PP-004, FR-PROF-005). Se FEAT-003.
- Datum i UTC i databasen, visning i svensk lokal tid. Att detta är rätt metod är [TBD] ansvarig utvecklaren, ej i PRD.

## 4. Säkerhets- och integritetspåverkan

- Personuppgifter syns endast för behörig HR (FEAT-001).
- Inga personuppgifter i URL:er eller loggar (SEC-018, tekniska ID:n används).

## 5. Beroenden

- FEAT-001 (roll), FEAT-003 (milestones och tasks), FEAT-010 (datamodell).

## 6. Risker

- RISK-005: tidslinjen blir svår att förstå.
- NFR-002: minst 50 milestones per tidslinje ska fungera.

## 7. Acceptanskriterier

- AC-FEAT-002-1: Tidslinje med 50 milestones renderas och är navigerbar (NFR-002, FR-VTL-015).
- AC-FEAT-002-2: Milestone ligger vid rätt x-position efter datum (AC-004).
- AC-FEAT-002-3: Tidigare, aktuell och nästa milestone går att identifiera utan att öppna dem (SK-005).
- AC-FEAT-002-4: Tangentbord kan nå milestone-rutor (NFR-011).

## 8. Test- och evalkrav

- TEST-002: tidslinjegenerering och drag-and-drop.
- TEST-003: tillgängligt alternativ till drag-and-drop (tangentbord eller formulär).
- Visuell test för kontrast och överlapp (NFR-012, WCAG 2.2 AA).
- Eval: SK-004 (förstå tidslinjen utan att öppna varje milestone).

## 9. Verifieringsevidens

- src/timeline/scale.test.ts (17 tester, OQ-003 skala och positionsregel)
- src/timeline/Timeline.test.tsx (kort, idag, scroll, tangentbord)
- src/person/PersonPage.test.tsx (9 tester)
- Idag i mitten vid öppning: scroll-regel testad, PR #7 mergad 2026-10-29

## 10. Öppna blockerare

- Koppling till hostad data (använder fixtures)
- Flikarna Dokument och Historik (platshållare)
- Drag-and-drop av milestones (FR-VTL-009, kräver backend och rollback)
- Visuell och tillgänglighetstest (NFR-012)
- Granskning: PR #6 och #7 mergade utan granskning
