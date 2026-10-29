# FEAT-010 Datamodell, RLS, Storage och migrationer

- **FEAT-ID:** FEAT-010
- **Status:** in-progress
- **Scopeklassificering:** MVP (grund för alla andra FEAT)
- **PRD-ID:** PP-009, PP-010, SEC-002, SEC-003, SEC-004, SEC-005, SEC-008, SEC-010, NFR-013, OPS-002, OPS-003, OPS-004, TEST-006, RISK-003, ADR-002, ADR-003, ADR-005, DEP-001, DEP-004, DEP-005

## 1. Beteende

| ID | Påstående | Klassificering |
|---|---|---|
| FEAT-010-B1 | Alla exponerade tabeller har RLS aktiverat (SEC-002). | supported |
| FEAT-010-B2 | Storage är privat och utan publika länkar (SEC-003, SEC-008). | supported |
| FEAT-010-B3 | Anonym åtkomst blockeras för alla tabeller, funktioner och Storage (SEC-004). | supported |
| FEAT-010-B4 | Service-role-nyckel finns inte i frontend (SEC-005). | supported |
| FEAT-010-B5 | Migrationer, RLS och Storage-policyer är reproducerbara och versionshanterade (OPS-002, NFR-013). | supported |
| FEAT-010-B6 | Seed med fiktiva personer, dokument, användare och AI-data kan återställas (OPS-003, OPS-004). | supported |
| FEAT-010-B7 | Dokumentobjekt och version är separata (ADR-003, PP-007). | supported |
| FEAT-010-B8 | Permanent radering omfattar alla versioner och lagringsobjekt (SEC-010, FR-DRET-004). | supported |
| FEAT-010-B9 | Hostat projekt `hr-journey` används för deployad MVP. Inga produktionsdata. | supported (PP-020, OPS-009) |
| FEAT-010-B10 | Databasmodellen för persistent data är TECH-*-beroende. | **not-represented**: PRD v002 har inga TECH-ID:n. Se project-preparations.md, D-3. |

## 2. Icke-mål

- Automatisk gallring av rader eller filer (FR-DVAL-003, FR-DRET-002 kräver HR-godkännande).
- Publika Storage-buckets och signerade länkar som varar längre än en session (SEC-008).
- Flera Supabase-projekt i samma MVP (project-preparations.md: endast `hr-journey`).
- Produktionsdata (PP-020, BL-015).

## 3. Datamodell, MVP (översikt)

| Tabell | Syfte | FEAT |
|---|---|---|
| `user_roles` | HR eller HR-administratör per `auth.users` | 001 |
| `persons` | Person, profiltyp, avdelning, chef, e-post, start, slut, status | 002 |
| `profile_types`, `timeline_templates`, `template_milestones` | Profiltyp och mall | 003 |
| `person_milestones`, `milestone_tasks` | Individuell tidslinje (separat från mall) | 003 |
| `documents`, `document_versions` | Dokumentobjekt och version. Gäller från/till, `mock_text_content`, aktuell pekare | 006 |
| `document_links` | Koppling till person, milestone eller profiltyp | 006 |
| `person_m365_mappings`, `meeting_bookings` | Mock-mappning och mockat möte | 008 |
| `ai_sessions`, `ai_messages`, `ai_message_sources`, `ai_explicit_context` | Privat chatt och källsnapshot | 007 |
| `audit_events` | Granskningsspår | 009 |
| `system_settings`, `document_types`, `security_classes`, `retention_rules` | Administration | 011 |

Exakt kolumnlista skrivs i migrationerna. Specen beskriver inte kolumner som ännu inte finns i repot.

## 4. RLS-principer

- Roll läses från `user_roles` med egen policy, aldrig från klientens JWT-anspråk som styrs av klienten.
- HR: läsa och skriva persondata och milestones enligt MVP-regler. Läsa dokument utan särskilt skydd. Ingen åtkomst till `system_settings` eller `retention_rules`.
- HR-administratör: alla HR-rättigheter, plus särskilt skyddade dokument, plus administration (FEAT-011).
- AI-sessioner: `owner_id = auth.uid()` för alla operationer, även för HR-administratör.
- Storage: policy kräver samma behörighet som motsvarande dokumentobjekt. Ingen publik läsning.
- Varje policy testas med positiva och negativa fall (TEST-006).

## 5. Migrationer och seed

- Migrationer i `supabase/migrations/`, pushas till `hr-journey` med `supabase db push` efter lokal test (project-preparations.md, sektion 5).
- Seed i `supabase/seed.sql` med fiktiva data. Inga verkliga namn, e-post eller dokument (SEC-001, PP-020).
- Hostad och lokal databas ska kunna återställas från migrationer plus seed (OPS-003).

## 6. Säkerhets- och integritetspåverkan

- **Alltid hög risk:** RLS, Storage-policyer, migrationer som påverkar befintlig data (REVIEW.md).
- Service-role-nyckel och databaslösenord får inte finnas i repo, frontend eller logg (SEC-005, project-preparations.md sektion 6).
- Publika buckets och publika länkar är förbjudna (SEC-008).

## 7. Beroenden

- Supabase-projekt `hr-journey` och lokal Supabase (project-preparations.md, sektion 4).
- ADR-002 (Supabase), ADR-003 (dokumentobjekt och version).

## 8. Risker

- RISK-003: privilegierad nyckel exponeras.
- RISK-006: särskilt dokumentskydd kringgås via policy-fel.
- RISK-019: prototypens schema blir produktionsschema utan granskning.

## 9. Acceptanskriterier

- AC-FEAT-010-1: Alla tabeller i `public` har RLS aktiverat (kontrolleras av script).
- AC-FEAT-010-2: Anonym `select` mot varje exponerad tabell och Storage returnerar 0 rader eller nekas.
- AC-FEAT-010-3: Migrationer applicerar från tom databas och ger samma schema som hostat.
- AC-FEAT-010-4: Seed återställer fiktiv data utan verkliga personuppgifter.

## 10. Test- och evalkrav

- TEST-006: RLS- och Storage-policytester, positiva och negativa, per tabell.
- TEST-SEC-003: anonym åtkomst.
- TEST-SEC-002: hemlighetsskanning i repo och bundle.
- Script `validate-specs` kontrollerar att varje tabell i migrationer har en FEAT-referens.

## 11. Verifieringsevidens

Ingen.

## 12. Öppna blockerare

- Användarprovisionering (D-7). Ansvarig användaren. Blockerar hostad inloggning, inte lokal utveckling.
- Reproducerbar migrationsstruktur och CLI-version är inte beslutad. [TBD] ansvarig utvecklaren. Nästa steg: första migration lokalt.
