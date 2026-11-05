# FEAT-013 Personlista

- **FEAT-ID:** FEAT-013
- **Status:** planned (se `project/feature-list.json`)
- **Scopeklassificering:** MVP
- **PRD-ID:** FR-PERSON-006, FR-PERSON-007, FR-PERSON-008, FR-PERSON-009, FR-PERSON-010, PP-009

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-013-B1 | HR ser en lista över alla personer som RLS låter den inloggade användaren läsa (FR-PERSON-006). | supported |
| FEAT-013-B2 | Listan går att söka i på namn, e-post och avdelning (FR-PERSON-007). | supported |
| FEAT-013-B3 | Listan går att filtrera på profiltyp, avdelning och chef, och filtren kombineras (FR-PERSON-008). | supported |
| FEAT-013-B4 | Klick på en person öppnar personprofilen enligt FEAT-002 (FR-PERSON-001). | supported |
| FEAT-013-B5 | Tomt resultat visar en tydlig text. | supported |
| FEAT-013-B6 | Statusfilter (aktiv eller arkiverad) ingår inte. Arkivering av person är avvaktad av användaren. | ambiguous (FEAT-002-B12) |
| FEAT-013-B7 | KPI-kort (antal aktiva och arkiverade, kommande och försenade milestones) är Future (FR-PERSON-009). | not-represented i MVP |
| FEAT-013-B8 | Kolumnen "nästa aktivitet" per person är Future (FR-PERSON-010). | not-represented i MVP |

## 2. Icke-mål

- Statusfilter och arkivering av person (avvaktat, se FEAT-013-B6).
- KPI-kort och kolumnen "Kommande aktivitet" (Future, FR-PERSON-009 och FR-PERSON-010).
- Skapa person, massåtgärder och export. Inte beskrivna i PRD:n för MVP.
- Sökning i fritext över dokument och milestones (BL-002).

## 3. Datamodellspåverkan

- Ingen egen tabell. Listan läser `public.persons` (FEAT-010) med avdelning, profiltyp och chef.
- Sökning och filter sker i databasfrågan under RLS. Inga personer hämtas till klienten bara för att döljas i UI.

## 4. Säkerhets- och integritetspåverkan

- Listan visar bara personer som RLS släpper igenom för användarens roll (PP-009). Det gäller även sök- och filterresultat.
- Sökning får inte läcka existens för personer utan läsrätt, till exempel genom antal träffar i UI.
- Inga personuppgifter i URL:er eller loggar. Tekniska ID:n används i navigering (SEC-018).
- Alla personer i testdata är fiktiva.

## 5. Beroenden

- FEAT-001 (roll), FEAT-002 (personprofil dit klick navigerar), FEAT-010 (datamodell och RLS).

## 6. Risker

- RISK-005: listan blir svår att överblicka vid många personer. Sidnumrering eller motsvarande krävs om listan blir lång.
- Sökning eller filter som kringgår RLS. Kräver negativa RLS-tester innan merge.

## 7. Acceptanskriterier

- AC-FEAT-013-1: HR ser exakt de personer som RLS släpper igenom. Verifieras med en roll som saknar läsrätt för någon person (FR-PERSON-006).
- AC-FEAT-013-2: Sök på namn, e-post och avdelning ger rätt träffar (FR-PERSON-007).
- AC-FEAT-013-3: Filter på profiltyp, avdelning och chef kombineras korrekt (FR-PERSON-008).
- AC-FEAT-013-4: Klick öppnar rätt personprofil (FEAT-013-B4).
- AC-FEAT-013-5: Tomt resultat visar en tydlig text.

## 8. Test- och evalkrav

- RLS-test: användare med begränsad läsrätt ser inte personer utanför sin behörighet, varken i lista, sök eller filter.
- Enhetstest: sök och filter, inklusive kombinerade filter och tomt resultat.
- UI-test: klick öppnar personprofilen.
- Tangentbord kan nå listans rader och sökfält (NFR-011).

## 9. Verifieringsevidens

- Ingen implementation än.

## 10. Öppna blockerare

- FEAT-013-B6: statusfilter och arkivering av person, avvaktat av användaren. Ingen ändring av FEAT-013 innan beslut.
- Menylänken "Personer" visar i dag dashboarden (`src/App.tsx` faller igenom till Dashboard). Det är ett falskt success state. Användaren har beslutat att låta det stå tills FEAT-013 byggs, och då ska länken kopplas till listvyn.
- Visuell och tillgänglighetstest av listan (NFR-012).
