# FEAT-005 Simulerade mejl

- **FEAT-ID:** FEAT-005
- **Status:** planned
- **Scopeklassificering:** MVP (simulerat). Verkligt utskick är Future.
- **PRD-ID:** SK-009, FR-MAIL-001 till FR-MAIL-006, FR-MAIL-FUT-001 till FR-MAIL-FUT-003, BL-010, OPS-010, RISK-010

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-005-B1 | Relevant milestone kan innehålla ett mejlutkast (FR-MAIL-001). | supported |
| FEAT-005-B2 | HR redigerar mottagare, ämne och innehåll (FR-MAIL-002). | supported |
| FEAT-005-B3 | HR väljer aktivt Godkänn och skicka (FR-MAIL-003). | supported |
| FEAT-005-B4 | Utskicket simuleras, och inget verkligt Outlook-mejl skickas (FR-MAIL-004, FR-MAIL-005). | supported |
| FEAT-005-B5 | Händelsen loggas som simulerad (FR-MAIL-006). | supported. Historikformat i FEAT-009. |
| FEAT-005-B6 | Mejlmottagare är personer i systemet eller fria adresser. | ambiguous: PRD säger "mottagare" men inte om fria adresser är tillåtna. Förslag: endast mottagare från systemet, [TBD] ansvarig användaren. |
| FEAT-005-B7 | Utgående adresser i MVP är fiktiva. | supported (SEC-001). Kontrolleras i tester. |

## 2. Icke-mål

- Verkliga utskick via SMTP eller Microsoft Graph (BL-010, FR-MAIL-FUT-001). Graph-behörigheter, avsändaridentitet, consent och auditing är Needs investigation (FR-MAIL-FUT-002).
- Mejlmallar för informationsutskick (FR-MAIL-FUT-*, PP-013 gäller framtida utskick med HR-granskning).

## 3. Datamodellspåverkan

- Mejlutkast kopplat till milestone och person.
- Simuleringslogg: mottagare, ämne, tidpunkt, utfall. Ingen extra kopia av skickat Outlook-meddelande (FR-MAIL-FUT-003).

## 4. Säkerhets- och integritetspåverkan

- Mejltext kan innehålla känslig HR-information. Den ska följa personens och milestonens behörighet (SEC-019).
- Ingen verklig utgående trafik. Kontrollerat i tester (OPS-010).

## 5. Beroenden

- FEAT-003 (milestone), FEAT-009 (logg), FEAT-010.

## 6. Risker

- RISK-001: verklig data används i MVP.
- RISK-010: simulerat utskick uppfattas som verkligt.

## 7. Acceptanskriterier

- AC-FEAT-005-1: Utkast kan redigeras och förhandsgranskas (SK-009).
- AC-FEAT-005-2: Godkänn och skicka skapar en simulerad logg och ingen extern anrop.
- AC-FEAT-005-3: UI visar tydligt att utskicket är simulerat.

## 8. Test- och evalkrav

- Test: inga utgående HTTP-anrop mot e-postdomäner vid skick (OPS-010).
- Test: simuleringsindikator syns i UI.

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- B6 (fria mottagaradresser). Ansvarig användaren. Nästa steg: bekräfta att mottagare endast kommer från systemet. [TBD] tills dess.
