---
paths:
  - "src/**"
  - "scripts/**"
  - "supabase/**"
---

# Utvecklingsregler för HR Journey

- Varje ändring i kod, migrationer eller konfiguration kopplas till ett FEAT-ID. Uppdatera FEAT i samma ändring när beteendet ändras.
- Säkerhet verkställs i backend och RLS, aldrig enbart i UI (PP-009).
- Frontend importerar aldrig service-role-nyckel, databaslösenord eller Graph-credentials. Endast anon-nyckel via miljövariabel.
- Mock-AI och mock-M365 ligger i backend bakom ett kontrakt. Domänlogiken importerar inte Graph-klient och gör inga nätverksanrop mot Microsoft-domäner.
- Inga `dangerouslySetInnerHTML` eller råa HTML-strängar från data. Visning av filnamn, metadata och mock-text ska escapas (TEST-SEC-001).
- Migrationer är versionshanterade i `supabase/migrations/`. Ändra aldrig tillämpade migrationer. Lägg en ny migration.
- Permanent radering, gallring och ändring av särskilda säkerhetsklasser kräver explicit godkännande och loggas.
- Optimistisk UI kräver testad rollback när skrivningen misslyckas (FR-VTL-017).
- UI-texter på svenska.
