# FEAT-006 Dokument, versioner, giltighet och gallring

- **FEAT-ID:** FEAT-006
- **Status:** planned
- **Scopeklassificering:** MVP
- **PRD-ID:** PP-006, PP-007, PP-008, PP-010, PP-011, PP-012, G-007, G-008, G-009, G-010, G-011, SK-011, SK-012, SK-013, FR-DOC-001 till FR-DOC-011, FR-DVER-001 till FR-DVER-006, FR-DSRCH-001 till FR-DSRCH-005, FR-DVAL-001 till FR-DVAL-003, FR-DRET-001 till FR-DRET-004, FR-DARCH-001, FR-DARCH-002, AC-007 till AC-011, SEC-003, SEC-007 till SEC-010, TEST-005, TEST-007, TEST-008, OQ-004, BL-001, BL-002, BL-004, BL-006, BL-007, BL-008, BL-009, BL-016

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-006-B1 | PDF, DOCX, XLSX och PPTX accepteras (FR-DOC-001). Körbara och andra filformat blockeras (SEC-009). | supported. Lista över blockerade format är [TBD] ansvarig utvecklaren. |
| FEAT-006-B2 | Dokumentnamn och dokumenttyp krävs (FR-DOC-002). | supported |
| FEAT-006-B3 | Individspecifikt dokument kräver personkoppling (FR-DOC-003). | supported |
| FEAT-006-B4 | Dokument kopplas till milestones och generella dokument till profiltyp (FR-DOC-004, FR-DOC-005). Dokument refereras utan duplicering (PP-006, AC-008). | supported |
| FEAT-006-B5 | Dokument lagras privat, utan publika länkar (FR-DOC-006, SEC-003, SEC-008). | supported |
| FEAT-006-B6 | Dokumenttyp styr säkerhetsklass och gallringsregel (FR-DOC-007, PP-008). | supported |
| FEAT-006-B7 | Särskilt skydd kräver extra behörighet (FR-DOC-008, AC-010). | supported |
| FEAT-006-B8 | Förhandsgranskning för behörig HR (FR-DOC-009). PDF och förhandsgranskning av DOCX, XLSX och PPTX. | PDF: supported. Office: **ambiguous** (OQ-004). |
| FEAT-006-B9 | Nedladdning loggas (FR-DOC-010). | supported |
| FEAT-006-B10 | Extern delning finns inte (FR-DOC-011, BL-007). | supported |
| FEAT-006-B11 | Ny fil blir ny version som blir aktuell (FR-DVER-001, FR-DVER-002). Föregående version flyttas till versionshistorik (FR-DVER-003, AC-009). | supported |
| FEAT-006-B12 | Relationer använder automatiskt aktuell version (FR-DVER-004). | supported |
| FEAT-006-B13 | Exakt versions-ID bevaras för AI-källor (FR-DVER-005). Konsumeras i FEAT-007. | supported |
| FEAT-006-B14 | Skydd och gallring följer dokumentobjektet, inte versionen (FR-DVER-006). | supported |
| FEAT-006-B15 | Metadatasökning på namn, typ, person, avdelning, milestone, datum och status (FR-DSRCH-001, FR-DSRCH-002). | supported |
| FEAT-006-B16 | Ingen fulltextsökning av filinnehåll (FR-DSRCH-003, BL-002). | supported |
| FEAT-006-B17 | Historiska versioner visas inte som standardträffar (FR-DSRCH-004). Skyddad metadata läcker inte i sökning (FR-DSRCH-005). | supported |
| FEAT-006-B18 | Giltighet med Gäller från och Gäller till, påminnelse fyra veckor före Gäller till (FR-DVAL-001, FR-DVAL-002). | supported |
| FEAT-006-B19 | Passerad giltighet raderar inte dokumentet (FR-DVAL-003). | supported |
| FEAT-006-B20 | Utlöst gallringsregel ger Gallring krävs (FR-DRET-001). Gallring kräver aktivt HR-godkännande (FR-DRET-002, AC-011). | supported |
| FEAT-006-B21 | Permanent radering endast från arkiverat tillstånd och omfattar alla versioner och lagringsobjekt (FR-DRET-003, FR-DRET-004, SEC-010). | supported |
| FEAT-006-B22 | Dokument kan arkiveras och återställas (FR-DARCH-001). | supported |
| FEAT-006-B23 | Vem som får gallra och radera permanent. | ambiguous: PRD anger "HR-godkännande", men inte om HR-administratör krävs. Förslag: HR-administratör, [TBD] ansvarig användaren. |
| FEAT-006-B24 | Dokumentversion kan innehålla mock_text_content för AI (FR-AI-DOC-001). Lagring och åtkomst i FEAT-007. | supported |

## 2. Icke-mål

- Extraktion av verklig text ur filer (FR-AI-DOC-003, BL-004).
- Citering ur dokument (BL-001).
- Dokumentgenerering och -redigering (BL-008, BL-009).
- Egna dokumenttaggar (BL-006).
- Extern delning (BL-007).

## 3. Datamodellspåverkan

- Två separata objekt: dokumentobjekt och dokumentversion (ADR-003). Version har Gäller från och Gäller till.
- Aktuell version är en pekare från objekt till version. Historiska versioner är oförändrade.
- Storage: privat bucket. Filen lagras under objektets ID och versionens ID, inte under användarinmatat namn.
- Mock_text_content per version, skilt från metadata och sökindex (FR-AI-DOC-005).
- Schema, RLS och Storage-policy i FEAT-010.

## 4. Säkerhets- och integritetspåverkan

- **Hög risk** (särskilt skyddade dokument, Storage, gallring, permanent radering). Två mänskliga reviewers.
- Preview och nedladdning kontrolleras i backend, inte bara i UI (SEC-007).
- Gallring och permanent radering är oåterkalleliga. Kräver explicit godkännande och ska loggas (FEAT-009).
- Publik länk får aldrig skapas (SEC-008).

## 5. Beroenden

- FEAT-001 (roller), FEAT-002 (person), FEAT-003 (milestones), FEAT-009 (logg), FEAT-010 (Storage och RLS).

## 6. Risker

- RISK-006: särskilt dokumentskydd kringgås.
- RISK-004: fel dokumentversion används.
- RISK-001: verkliga HR-dokument laddas upp i MVP. Ingen teknisk kontroll finns för detta. Åtgärd: dokumenterad regel och seed endast med fiktiva filer.

## 7. Acceptanskriterier

- AC-FEAT-006-1: Dokument laddas upp privat och syns från person och milestone utan duplicering (AC-007, AC-008).
- AC-FEAT-006-2: Ny version blir aktuell och gammal version finns kvar i historik (AC-009).
- AC-FEAT-006-3: Särskilt skyddat dokument blockeras för HR utan extra behörighet (AC-010).
- AC-FEAT-006-4: Gallring utan HR-godkännande är inte möjlig (AC-011).
- AC-FEAT-006-5: 500 fiktiva dokumentposter laddas och söks utan filhämtning (NFR-003, NFR-004).
- AC-FEAT-006-6 (blockerad): förhandsgranskning av Office-filer. Väntar på OQ-004.

## 8. Test- och evalkrav

- TEST-005: dokumentversionering och relationer.
- TEST-007: särskilt dokumentskydd (negativa tester för HR).
- TEST-008: gallring och permanent radering, inkl. alla versioner.
- TEST-SEC-001: XSS vid visning av metadata och filnamn.
- Storage-test: publik åtkomst till fil ger nekad åtkomst (SEC-003, TEST-006).

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- **OQ-004 (Office-preview).** Ansvarig användaren. Nästa steg: välja teknik. Blockerar FEAT-006-B8 för DOCX, XLSX och PPTX. PDF kan byggas.
- B23 (vem gallrar). Ansvarig användaren. Nästa steg: bekräfta. [TBD] tills dess.
