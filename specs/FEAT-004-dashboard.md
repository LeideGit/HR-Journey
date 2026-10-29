# FEAT-004 Dashboard och arbetskö

- **FEAT-ID:** FEAT-004
- **Status:** in-progress
- **Scopeklassificering:** MVP
- **PRD-ID:** PP-005, G-001, G-002, SK-001, SK-002, SK-013, FR-DASH-001 till FR-DASH-008, AC-002, NFR-001, OQ-001

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-004-B1 | Dashboarden är HR:s primära arbetskö (FR-DASH-001, PP-005). | supported |
| FEAT-004-B2 | Milestone-statusar är Kommande, Aktuellt och Försenad (FR-DASH-002). | supported |
| FEAT-004-B3 | Standardframförhållning är fyra veckor (FR-DASH-003). | supported |
| FEAT-004-B4 | Gränsen mellan Kommande och Aktuellt. | **ambiguous** (OQ-001). Förslag: Kommande är start efter idag, Aktuellt är inom aktiv period. Ej godkänt. |
| FEAT-004-B5 | Filter efter profiltyp och status, kombinerbara (FR-DASH-004, FR-DASH-005). | supported |
| FEAT-004-B6 | Dokumentärenden i samma kö, särskiljbara från milestones (FR-DASH-006, FR-DASH-007, SK-013). | supported |
| FEAT-004-B7 | Post öppnar relevant person, milestone eller dokument (FR-DASH-008). | supported |

## 2. Icke-mål

- Automatisk prioritering av ärenden med AI (AI-funktioner är read-only och ligger i FEAT-007).
- Notiser eller e-post (ej i PRD).

## 3. Datamodellspåverkan

- Ingen egen tabell. Dashboarden läser milestones (FEAT-003) och dokumentärenden (FEAT-006).
- Statusberäkning ska ske i en delad funktion med tester (TEST-001), så att UI och backend ger samma status.

## 4. Säkerhets- och integritetspåverkan

- Dashboarden visar bara poster som användarens roll får läsa. Filtrering sker i RLS, inte i UI (PP-009).
- Dokumentärenden visar ingen skyddad metadata för HR som saknar behörighet (FR-DSRCH-005).

## 5. Beroenden

- FEAT-001, FEAT-003, FEAT-006, FEAT-010.

## 6. Risker

- RISK-005: arbetskön blir svår att förstå.
- Fel statusberäkning ger felaktig prioritet. Kräver TEST-001 innan merge.

## 7. Acceptanskriterier

- AC-FEAT-004-1: Dashboard visar relevanta milestones och dokumentärenden (AC-002).
- AC-FEAT-004-2: Filtrerat resultat kombinerar profiltyp och status korrekt (FR-DASH-005).
- AC-FEAT-004-3: Post öppnar rätt objekt (FR-DASH-008).
- AC-FEAT-004-4 (blockerad): statusgränsen följer beslutet i OQ-001.

## 8. Test- och evalkrav

- TEST-001 (status- och datumtester, inkl. gränsfall kring fyra veckor).
- Eval: SK-001 (identifiera vad som kräver uppmärksamhet).

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- **OQ-001.** Ansvarig användaren. Nästa steg: bekräfta eller ändra förslaget i FEAT-004-B4. Blockerar AC-FEAT-004-4 och TEST-001 för gränsfall.
