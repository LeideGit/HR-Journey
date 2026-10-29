# FEAT-011 Administration och systeminställningar

- **FEAT-ID:** FEAT-011
- **Status:** planned
- **Scopeklassificering:** MVP
- **PRD-ID:** section 5.2, FR-TMPL-001, FR-DOC-007, FR-DOC-008, FR-DRET-001, FR-DVAL-001, FR-DVAL-002, OQ-002 (blockerad delfunktion), OQ-M365-003 (framtida integrationskonfiguration), OPS-006, SEC-006, BL-017

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-011-B1 | HR-administratör administrerar dokumenttyper (5.2). | supported |
| FEAT-011-B2 | HR-administratör administrerar säkerhetsklasser (5.2, FR-DOC-007). | supported |
| FEAT-011-B3 | HR-administratör administrerar gallringsregler (5.2, FR-DRET-001). | supported |
| FEAT-011-B4 | HR-administratör administrerar giltighetsregler, inklusive standardpåminnelse på fyra veckor (5.2, FR-DVAL-002). | supported |
| FEAT-011-B5 | HR-administratör ger extra behörighet för särskilt skyddade dokument (5.2, FR-DOC-008). | supported |
| FEAT-011-B6 | HR-administratör administrerar profiltyper och mallar (FR-TMPL-001, FEAT-003 B11). | supported |
| FEAT-011-B7 | HR kan inte göra något av B1–B6 (5.1, PP-009). | supported |
| FEAT-011-B8 | Konfiguration för framtida M365-integration. | **Needs investigation** (5.2 "framtida integrationskonfiguration enligt separat behörighetsmodell", OQ-M365-003). Ingen MVP-funktion. |
| FEAT-011-B9 | Verklig Graph-adapter är avstängd via konfiguration eller feature flag i MVP (OPS-006). | supported. Flaggans form är [TBD] ansvarig utvecklaren. |
| FEAT-011-B10 | Ändring av malländringsregel (OQ-002). | **blocked** |

## 2. Icke-mål

- Användarhantering i UI (BL-017 och D-7 är uppskjutna). Användare skapas utanför MVP-UI.
- Integrationskonfiguration för Graph i UI (Future).

## 3. Datamodellspåverkan

- `document_types`, `security_classes`, `retention_rules`, `validity_rules`, `system_settings`.
- Ändring av dessa skrivs till `audit_events` (FEAT-009).
- Ändring av säkerhetsklass eller gallringsregel som påverkar befintliga dokument kräver förhandsgranskning av berörda dokument. Förslag, [TBD] ansvarig användaren.

## 4. Säkerhets- och integritetspåverkan

- **Hög risk:** permission grants (särskilt skydd), gallringsregler och mallar är listade som alltid hög risk i REVIEW.md.
- Endast HR-administratör får skriva i administrationstabeller. RLS verkställer, inte UI.
- Säkerhetsklass som ändras kan göra dokument mer eller mindre åtkomliga. Varje ändring loggas.

## 5. Beroenden

- FEAT-001, FEAT-003, FEAT-006, FEAT-009, FEAT-010.

## 6. Risker

- RISK-004: malländring skriver över individuell anpassning (via mallar).
- RISK-006: särskilt dokumentskydd kringgås via ändrad säkerhetsklass.

## 7. Acceptanskriterier

- AC-FEAT-011-1: HR-administratör kan skapa och ändra dokumenttyp, säkerhetsklass och gallringsregel.
- AC-FEAT-011-2: HR får 403 eller motsvarande vid skrivning till administrationstabeller (TEST-006).
- AC-FEAT-011-3: HR kan inte ge sig själv särskild behörighet (negativt test).
- AC-FEAT-011-4: Ändring av administrationsdata skapar en loggpost.

## 8. Test- och evalkrav

- TEST-006: RLS-tester för administrationstabeller.
- TEST-007: särskilt dokumentskydd, inkl. grant och revoke.
- TEST-OPS-001: feature flag för Graph är avstängd i MVP-build.

## 9. Verifieringsevidens

Ingen.

## 10. Öppna blockerare

- B8 (framtida integrationskonfiguration). Ansvarig användaren. Blockerar Future, inte MVP.
- B9 (flaggans form). Ansvarig utvecklaren. Nästa steg: välj konfigurationsmekanism. [TBD].
- B10 (OQ-002). Ansvarig användaren. Blockerad av D-6.
