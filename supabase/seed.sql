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

-- Milestones och uppgifter för personsidan och dashboarden (FEAT-003, FEAT-004).
-- Samma id:n som i hostat projekt, så att lokal och hostad data är identiska.
insert into public.person_milestones (id, person_id, title, due_date, lead_days) values
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Uppföljning', '2026-10-22', 28),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Introduktion', '2025-06-01', 28),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Kompetenssamtal', '2027-04-10', 28),
  ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Utvärdering', '2026-10-25', 28),
  ('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Onboarding', '2026-03-20', 28),
  ('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Planera introduktion', '2026-11-05', 28)
on conflict (id) do nothing;

insert into public.milestone_tasks (id, milestone_id, title, is_done, done_at) values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Uppgift 1', false, null),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'Uppgift 2', true, '2026-10-20T09:00:00Z'),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002', 'Uppgift 1', true, '2025-05-30T09:00:00Z'),
  ('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000003', 'Uppgift 1', false, null),
  ('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000004', 'Uppgift 1', false, null),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000005', 'Uppgift 1', true, '2026-03-19T09:00:00Z'),
  ('60000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000006', 'Uppgift 1', false, null)
on conflict (id) do nothing;

-- Demokonton för lokal utveckling och demo (SEC-001: fiktiva @example.test). Lösenord: demo.
-- Skapas här så att de finns efter varje db reset. Ingen självregistrering (SEC-004).
create extension if not exists pgcrypto with schema extensions;
insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, instance_id, confirmation_token, recovery_token, email_change_token_new, email_change)
select v.id, 'authenticated', 'authenticated', v.email, extensions.crypt('demo', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', json_build_object('display_name', v.name), now(), now(), '00000000-0000-0000-0000-000000000000', '', '', '', ''
from (values
  ('11111111-1111-1111-1111-111111111111'::uuid, 'hr-admin@example.test', 'Fiktiv HR-administratör'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'hr@example.test', 'Fiktiv HR-användare')
) as v(id, email, name)
on conflict (id) do nothing;

insert into public.user_roles (user_id, role) values
  ('11111111-1111-1111-1111-111111111111', 'hr_admin'),
  ('22222222-2222-2222-2222-222222222222', 'hr')
on conflict (user_id) do nothing;

-- Korta beskrivningar för varje milestone (visas i infomodulen). Fiktiva uppgifter.
update public.person_milestones set description = case id
  when '50000000-0000-0000-0000-000000000001' then 'Följ upp hur personen känner sig i rollen och om något behöver justeras i arbetet.'
  when '50000000-0000-0000-0000-000000000002' then 'Introduktionen i organisationen: rutiner, verktyg och första veckorna.'
  when '50000000-0000-0000-0000-000000000003' then 'Planera och genomför kompetenssamtalet och sätt mål för kommande period.'
  when '50000000-0000-0000-0000-000000000004' then 'Utvärdera konsultuppdraget med uppdragsgivaren och dokumentera resultatet.'
  when '50000000-0000-0000-0000-000000000005' then 'Onboarding av nyanställd: konton, utrustning och genomgång av policyer.'
  when '50000000-0000-0000-0000-000000000006' then 'Förbered introduktionen för LIA-eleven: dagsschema, mentor och kontaktpersoner.'
end
where id in ('50000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000004','50000000-0000-0000-0000-000000000005','50000000-0000-0000-0000-000000000006');

-- Fyra fiktiva dokument med personkoppling (FEAT-006-B3). Alla data är påhittade.
-- Ett skyddat dokument (särskilt skydd) är bara synligt för HR-administratör.
insert into public.documents (id, name, document_type, security_class, retention_status, is_archived) values
  ('20000000-0000-0000-0000-000000000003', 'Fiktivt anställningsavtal, Anna', 'avtal', 'standard', 'ej_aktuell', false),
  ('20000000-0000-0000-0000-000000000004', 'Fiktivt konsultuppdragsavtal, Bo', 'avtal', 'standard', 'ej_aktuell', false),
  ('20000000-0000-0000-0000-000000000005', 'Fiktivt LIA-avtal, Cia', 'avtal', 'standard', 'ej_aktuell', false),
  ('20000000-0000-0000-0000-000000000006', 'Fiktiv hälsouppgift, Anna (skyddad)', 'halsa', 'skyddad', 'ej_aktuell', false)
on conflict (id) do nothing;

insert into public.document_versions (id, document_id, version_no, storage_path, mime_type, valid_from, valid_to, mock_text_content) values
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 1, '20000000-0000-0000-0000-000000000003/30000000-0000-0000-0000-000000000004.pdf', 'application/pdf', '2026-02-01', '2027-12-31', 'Fiktivt anställningsavtal. Påhittade villkor.'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 1, '20000000-0000-0000-0000-000000000004/30000000-0000-0000-0000-000000000005.pdf', 'application/pdf', '2026-03-15', '2026-11-20', 'Fiktivt konsultuppdragsavtal. Påhittade villkor.'),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005', 1, '20000000-0000-0000-0000-000000000005/30000000-0000-0000-0000-000000000006.pdf', 'application/pdf', '2026-09-01', '2027-06-30', 'Fiktivt LIA-avtal. Påhittade villkor.'),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000006', 1, '20000000-0000-0000-0000-000000000006/30000000-0000-0000-0000-000000000007.pdf', 'application/pdf', '2026-01-01', null, 'Fiktiv hälsouppgift. Påhittat innehåll, endast HR-administratör.')
on conflict (id) do nothing;

update public.documents set current_version_id = '30000000-0000-0000-0000-000000000004' where id = '20000000-0000-0000-0000-000000000003';
update public.documents set current_version_id = '30000000-0000-0000-0000-000000000005' where id = '20000000-0000-0000-0000-000000000004';
update public.documents set current_version_id = '30000000-0000-0000-0000-000000000006' where id = '20000000-0000-0000-0000-000000000005';
update public.documents set current_version_id = '30000000-0000-0000-0000-000000000007' where id = '20000000-0000-0000-0000-000000000006';

insert into public.document_person_links (document_id, person_id) values
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001')
on conflict do nothing;
