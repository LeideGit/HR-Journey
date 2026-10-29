-- Seed med fiktiva personer och dokument (OPS-003, SEC-001, PP-020).
-- Alla namn, e-postadresser och dokument är påhittade. Domänen är example.test.
-- Ingen användarkonto skapas här. Konton hanteras separat (D-7, ej beslutad).
-- Kör om med: supabase db reset --local

-- Personer (FR-PERSON-002, FR-PROF-001). Tre profiltyper enligt PRD 5.3.
insert into public.persons (id, name, email, profile_type, department, manager_name, start_date, end_date, is_active) values
  ('10000000-0000-0000-0000-000000000001', 'Fiktiv Anna Exempel',  'anna.exempel@example.test',   'anstalld', 'Fiktiv HR-avdelning', 'Fiktiv Chef A', '2026-02-01', null,         true),
  ('10000000-0000-0000-0000-000000000002', 'Fiktiv Bo Testsson',   'bo.testsson@example.test',    'konsult',  'Fiktiv IT',           'Fiktiv Chef B', '2026-03-15', '2027-03-14', true),
  ('10000000-0000-0000-0000-000000000003', 'Fiktiv Cia Demo',      'cia.demo@example.test',       'lia',      'Fiktiv Försäljning',  'Fiktiv Chef C', '2026-09-01', '2027-06-30', true)
on conflict (id) do nothing;

-- Dokument. Ett standarddokument och ett särskilt skyddat (FR-DOC-008).
insert into public.documents (id, name, document_type, security_class) values
  ('20000000-0000-0000-0000-000000000001', 'Fiktiv introduktionsplan',     'plan',  'standard'),
  ('20000000-0000-0000-0000-000000000002', 'Fiktivt lönebesked (skyddat)', 'lon',   'skyddad')
on conflict (id) do nothing;

-- Dokumentversioner. Version 2 är aktuell för standarddokumentet (FR-DVER-002).
insert into public.document_versions (id, document_id, version_no, storage_path, mime_type, valid_from, valid_to, mock_text_content) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, '20000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000001.pdf', 'application/pdf', '2026-02-01', '2026-12-31', 'Fiktiv version 1 av introduktionsplanen.'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 2, '20000000-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000002.pdf', 'application/pdf', '2026-03-01', '2027-03-01', 'Fiktiv version 2 av introduktionsplanen. Innehåller tre fiktiva steg.'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 1, '20000000-0000-0000-0000-000000000002/30000000-0000-0000-0000-000000000003.pdf', 'application/pdf', '2026-01-01', '2026-12-31', 'Fiktivt lönebesked. Skyddat, endast HR-administratör.')
on conflict (id) do nothing;

update public.documents set current_version_id = '30000000-0000-0000-0000-000000000002'
  where id = '20000000-0000-0000-0000-000000000001';
update public.documents set current_version_id = '30000000-0000-0000-0000-000000000003'
  where id = '20000000-0000-0000-0000-000000000002';
