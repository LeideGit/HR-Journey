# FEAT-007 AI-assistent (read-only, datadriven mockmotor)

- **FEAT-ID:** FEAT-007
- **Status:** planned
- **Scopeklassificering:** MVP (mockmotor). Verklig LLM-integration är Future.
- **PRD-ID:** PP-014, PP-015, PP-016, G-013, SK-014, SK-015, SK-016, SK-017, SK-018, FR-AI-001 till FR-AI-011, FR-AI-CTX-001 till FR-AI-CTX-012, FR-AI-FUNC-001 till FR-AI-FUNC-008, FR-AI-DOC-001 till FR-AI-DOC-005, FR-AI-SRC-001 till FR-AI-SRC-007, FR-AI-HIST-001 till FR-AI-HIST-009, AC-AI-001 till AC-AI-018, NFR-005, NFR-006, SEC-011 till SEC-015, TEST-AI-001 till TEST-AI-010, RISK-007, RISK-008, RISK-009, DEP-006, ADR-004, ADR-005, FR-AI-FUT-001 till FR-AI-FUT-005, BL-001 till BL-005, OQ-AI-001 till OQ-AI-003

## 1. Beteende

### 1.1 Panel och navigation

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B1 | AI-knapp i toppnavigationen (FR-AI-001, AC-AI-001). | supported |
| FEAT-007-B2 | Knappen öppnar en Copilot-liknande vänsterpanel (FR-AI-002). | supported |
| FEAT-007-B3 | Panelen ligger kvar vid navigation mellan sidor (FR-AI-003, AC-AI-002, TEST-AI-009). | supported |
| FEAT-007-B4 | Aktiv session ligger kvar vid navigation (FR-AI-004). | supported |
| FEAT-007-B5 | Panelen har flikarna Chatt och Historik (FR-AI-005). | supported |

### 1.2 Read-only

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B6 | AI:n är read-only och ändrar ingen HR Journey-data (FR-AI-006, FR-AI-007, SEC-015, AC-AI-017). | supported |
| FEAT-007-B7 | En prompt som begär ändring ger ett svar som förklarar att AI:n inte ändrar data, och ingen skrivning sker (AC-AI-017). | supported. Svarets formulering är [TBD] ansvarig utvecklaren. |
| FEAT-007-B8 | AI-genererade skrivåtgärder ligger utanför MVP (FR-AI-FUT-004, BL-005). | supported |

### 1.3 Kontext

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B9 | Primär kontext är aktuell sida (FR-AI-CTX-001, AC-AI-003). | supported |
| FEAT-007-B10 | Personprofil ger person, tidslinje, milestones, tasks och tillåtna dokument (FR-AI-CTX-002). | supported |
| FEAT-007-B11 | Milestonevy ger milestone, person, tasks och tillåtna dokument (FR-AI-CTX-003). | supported |
| FEAT-007-B12 | Dokumentvy ger dokument och aktuell version (FR-AI-CTX-004). | supported |
| FEAT-007-B13 | Ändrad sidkontext visas i panelen (FR-AI-CTX-005). | supported |
| FEAT-007-B14 | @ lägger till en person (FR-AI-CTX-006). / lägger till ett dokument (FR-AI-CTX-007). | supported |
| FEAT-007-B15 | Autocomplete visar endast objekt användaren får läsa (FR-AI-CTX-008, AC-AI-004, AC-AI-005, SEC-013). | supported |
| FEAT-007-B16 | Explicit kontext ligger kvar tills användaren tar bort den (FR-AI-CTX-009). | supported |
| FEAT-007-B17 | Aktuell dokumentversion är standard (FR-AI-CTX-010, AC-AI-006). | supported |
| FEAT-007-B18 | Historisk version väljs uttryckligen (FR-AI-CTX-011, AC-AI-007). | supported |
| FEAT-007-B19 | Kontext filtreras efter behörighet före mockmotorn (FR-AI-CTX-012, PP-015). | supported |

### 1.4 Funktioner

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B20 | Sammanfatta en persons resa (FR-AI-FUNC-001, AC-AI-008). | supported |
| FEAT-007-B21 | Sammanfatta vad HR behöver göra härnäst (FR-AI-FUNC-002). | supported |
| FEAT-007-B22 | Analysera milestone- och taskstatus (FR-AI-FUNC-003). | supported |
| FEAT-007-B23 | Sammanfatta mockat dokumentinnehåll (FR-AI-FUNC-004). | supported |
| FEAT-007-B24 | Jämföra två dokument (FR-AI-FUNC-005). | supported |
| FEAT-007-B25 | Jämföra två versioner av samma dokument (FR-AI-FUNC-006, AC-AI-009). | supported |
| FEAT-007-B26 | Följdfråga använder tidigare sessionskontext (FR-AI-FUNC-007, AC-AI-010). | supported |
| FEAT-007-B27 | Kombinera tillåtna personer, händelser och dokument (FR-AI-FUNC-008). | supported |
| FEAT-007-B28 | Mockmotorn är datadriven. Svar genereras från Supabase-data med regler och mallar, inte från fri text (FR-AI-010, FR-AI-008). | supported |
| FEAT-007-B29 | Mockmotorn ersättbar av LLM-adapter med samma kontrakt (FR-AI-011, ADR-004). | supported |

### 1.5 Mockat dokumentinnehåll

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B30 | Relevanta fiktiva dokumentversioner kan ha mock_text_content (FR-AI-DOC-001). | supported |
| FEAT-007-B31 | Mockmotorn använder mock_text_content för analys (FR-AI-DOC-002). | supported |
| FEAT-007-B32 | Ingen extraktion av verklig text ur uppladdade filer (FR-AI-DOC-003, BL-004). | supported |
| FEAT-007-B33 | mock_text_content följer dokumentets behörighet (SEC-014, FR-AI-DOC-004). | supported |
| FEAT-007-B34 | mock_text_content är separerad från metadatasökning (FR-AI-DOC-005, FR-DSRCH-003). | supported |

### 1.6 Källor

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B35 | Varje AI-svar har klickbara källor (FR-AI-SRC-001, AC-AI-011). | supported |
| FEAT-007-B36 | Källor pekar på person, milestone, dokument och dokumentversion (FR-AI-SRC-002). | supported |
| FEAT-007-B37 | Dokumentkälla anger exakt version (FR-AI-SRC-003, AC-AI-012). | supported |
| FEAT-007-B38 | Källreferensen sparar den version som användes (FR-AI-SRC-004, FR-DVER-005). | supported |
| FEAT-007-B39 | Ny version ändrar inte gamla källor retroaktivt (FR-AI-SRC-005, AC-AI-013). | supported |
| FEAT-007-B40 | Behörighet omprövas när gammal konversation öppnas (FR-AI-SRC-006, SEC-012). | supported |
| FEAT-007-B41 | Otillgänglig källa visas neutralt utan läckage (FR-AI-SRC-007, AC-AI-014). | supported |
| FEAT-007-B42 | Följdfrågor och svar ska ha källor. | ambiguous: PRD säger "varje AI-svar". Förslag: även följdsvar, vilket är konsistent. |

### 1.7 Chatthistorik

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B43 | Sessioner lagras i Supabase (FR-AI-HIST-001). | supported |
| FEAT-007-B44 | Sessioner är privata för skaparen. Backend och RLS verkställer (FR-AI-HIST-002, FR-AI-HIST-003, SEC-011, AC-AI-015). | supported |
| FEAT-007-B45 | Öppna och fortsätt en session (FR-AI-HIST-004, AC-AI-016). | supported |
| FEAT-007-B46 | Byt namn på en session (FR-AI-HIST-005). | supported |
| FEAT-007-B47 | Radera en session, inklusive meddelanden och referenser (FR-AI-HIST-006, FR-AI-HIST-007). | supported. Permanent radering, kräver explicit användarbekräftelse. |
| FEAT-007-B48 | Meddelanden bevarar använd kontext och källreferenser (FR-AI-HIST-008). | supported |
| FEAT-007-B49 | Sessioner sorteras efter senaste aktivitet (FR-AI-HIST-009). | supported |
| FEAT-007-B50 | Historiken laddas utan att blockera huvudsidan (NFR-006). | supported |

### 1.8 Gränser

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-007-B51 | Inga externa LLM-anrop i MVP (FR-AI-009, AC-AI-018, TEST-AI-010). | supported |
| FEAT-007-B52 | Verklig LLM-leverantör, dataplacering, personuppgiftsbiträde, retention, promptloggning och kostnad (FR-AI-FUT-001, FR-AI-FUT-002). | Needs investigation (OQ-AI-001, OQ-AI-002). |
| FEAT-007-B53 | Prompt injection från dokumentinnehåll ska ingå i hotmodellen (FR-AI-FUT-003). | ambiguous: hotmodell krävs före verklig LLM. I MVP påverkar injection inte mockmotorn, men testet ska finnas (OQ-AI-003). |
| FEAT-007-B54 | Fulltextsökning och verklig dokumentextraktion (FR-AI-FUT-005, BL-002, BL-004). | Future. Ej implementerat. |
| FEAT-007-B55 | Verklig LLM-integration (FR-AI-FUT-001, BL-003). | Future. Ej implementerat. Kräver godkänd PRD-ändring. |

## 2. Icke-mål

- Externa LLM-anrop (FR-AI-009).
- Ändring av HR Journey-data av AI (FR-AI-007).
- Verklig textextraktion ur filer (FR-AI-DOC-003).
- Citering ur dokument (BL-001).

## 3. Datamodellspåverkan

- `ai_sessions`: id, owner_id, namn, skapad, senast aktiv. RLS: ägaren ser och ändrar.
- `ai_messages`: session_id, roll, innehåll, använd kontext, tidpunkt.
- `ai_message_sources`: message_id, källtyp (person, milestone, dokument, dokumentversion), källobjekt-ID, dokumentversions-ID, version_label vid svarstillfället, tillgänglighetsstatus. Versionsreferensen är en fast kopia och ändras inte av nya versioner (FR-AI-SRC-004).
- `ai_explicit_context`: session_id, objekttyp, objekt-ID, version-ID om vald. Tills användaren tar bort den (FR-AI-CTX-009).
- `document_versions.mock_text_content`: nullable text. RLS följer dokumentobjektets behörighet.
- Schema i FEAT-010. Radering av session kaskaderar till meddelanden, källor och kontext (FR-AI-HIST-007).

## 4. Säkerhets- och integritetspåverkan

- **Alltid hög risk:** AI-behörighetsfiltrering, privat chatthistorik, källåtkomst (REVIEW.md).
- Behörighetsfilter sker i backend före mockmotorn. Frontend får aldrig skicka en egen kontextlista som godtas utan kontroll (FR-AI-CTX-012).
- Källöppning omprövar behörighet vid varje öppning, även om källan fanns när svaret skrevs (SEC-012, AC-AI-014).
- Autocomplete och felmeddelanden får inte läcka att ett skyddat objekt finns (SEC-013).
- Privat historik: även HR-administratör ser inte andras sessioner, såvida inte ett senare beslut ger den rätten (SEC-011). Förslag, ej i PRD: ingen admin-åtkomst till sessioner. [TBD] ansvarig användaren.
- Mock-AI får inte skriva till någon tabell utöver session-, meddelande-, källa- och kontexttabellerna.

## 5. Beroenden

- FEAT-001 (roll), FEAT-003, FEAT-006 (version och mock_text_content), FEAT-010 (RLS och datamodell).
- ADR-004 (adapterkontrakt), ADR-005 (sessioner och källsnapshots).

## 6. Risker

- RISK-007: AI läcker otillåten information.
- RISK-008: AI-historik blir bakväg till återkallad information.
- RISK-009: mockad AI uppfattas som verklig analys. Åtgärd: tydlig etikett "Mockat svar" i panelen.
- RISK-020: spec blir inaktuell efter scopeändring.

## 7. Acceptanskriterier

- AC-FEAT-007-1: Panelen öppnas från toppnavigationen och ligger kvar vid navigation (AC-AI-001, AC-AI-002).
- AC-FEAT-007-2: @ och / visar endast tillåtna objekt (AC-AI-004, AC-AI-005).
- AC-FEAT-007-3: Standard är aktuell version, och historisk version kräver uttryckligt val (AC-AI-006, AC-AI-007).
- AC-FEAT-007-4: Personsammanfattning matchar mockdatan (AC-AI-008).
- AC-FEAT-007-5: Jämförelse av två versioner använder de två versionernas innehåll (AC-AI-009).
- AC-FEAT-007-6: Följdfråga får tidigare kontext (AC-AI-010).
- AC-FEAT-007-7: Varje svar har klickbara källor, och dokumentkälla visar exakt version (AC-AI-011, AC-AI-012).
- AC-FEAT-007-8: Gammalt svar behåller sin versionsreferens efter ny version (AC-AI-013).
- AC-FEAT-007-9: Återkallad behörighet blockerar öppning av källan (AC-AI-014).
- AC-FEAT-007-10: Session är privat, och kan öppnas, fortsättas, döpas om och raderas (AC-AI-015, AC-AI-016).
- AC-FEAT-007-11: Ingen prompt ändrar data (AC-AI-017).
- AC-FEAT-007-12: Inget externt LLM-anrop sker (AC-AI-018).

## 8. Test- och evalkrav

- TEST-AI-001 (personsammanfattning mot mockdata), TEST-AI-002 (följdfråga), TEST-AI-003 (aktuell version som standard), TEST-AI-004 (versionsjämförelse), TEST-AI-005 (klickbara källor och versionssnapshot), TEST-AI-006 (permission revocation), TEST-AI-007 (privat sessionshistorik), TEST-AI-008 (read-only enforcement), TEST-AI-009 (persistent panel vid navigation), TEST-AI-010 (ingen extern LLM anropas). Ett test per ID.
- Eval (YAML i `evals/cases/`): fasta frågor mot fiktiv seed med förväntade källor och versioner. Grader: källor finns, rätt version, inga skyddade objekt i svar.
- Negativt test: användare utan rätt till dokument får inga träffar i @, /, svar eller källor.
- Nätverkstest: ingen utgående trafik till LLM-domäner (TEST-AI-010).

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- B42 (följdsvar och källor). Ansvarig användaren. Nästa steg: bekräfta. Förslag ovan gäller tills dess.
- B53 (prompt injection-test). Ansvarig utvecklaren. Nästa steg: skriv testet i MVP. Hotmodell krävs före LLM (OQ-AI-003).
- Privat historik för HR-administratör (SEC-011, se säkerhetsavsnittet). Ansvarig användaren. Nästa steg: bekräfta. [TBD].
- OQ-AI-001, OQ-AI-002: blockerar endast framtida LLM, inte MVP.
