-- RLS- och Storage-test för dokument. Kör mot lokal databas efter db reset.
-- Varje påstående är ett PASS/FAIL-utskrift. Vid FAIL avbryts inte körningen.
-- PRD: FR-DOC-008, AC-010, TEST-006, TEST-007, SEC-004, SEC-007. FEAT-006, FEAT-010.
-- Testdata rensas i slutet. Endast fiktiva konton (@example.test).

begin;

insert into auth.users (id, aud, role, email, encrypted_password, created_at, updated_at, instance_id) values
  ('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'admin-test@example.test', '', now(), now(), '00000000-0000-0000-0000-000000000000'),
  ('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'hr-test@example.test',    '', now(), now(), '00000000-0000-0000-0000-000000000000');
insert into public.user_roles (user_id, role) values
  ('22222222-2222-2222-2222-222222222222', 'hr_admin'),
  ('33333333-3333-3333-3333-333333333333', 'hr');

-- Seed-dokumenten från seed.sql finns redan. Ingen ny dokumentdata behövs här.

do $$
declare
  n int;
  ok boolean;
  std constant uuid := '20000000-0000-0000-0000-000000000001';
  skyddad constant uuid := '20000000-0000-0000-0000-000000000002';
  hr constant uuid := '33333333-3333-3333-3333-333333333333';
  admin constant uuid := '22222222-2222-2222-2222-222222222222';
begin
  -- 1. Anonym ser inga dokument.
  set local role anon;
  select count(*) into n from public.documents;
  reset role;
  raise notice 'TEST anon_ser_inga_dokument: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 2. HR ser standarddokument.
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.documents where id = std;
  reset role;
  raise notice 'TEST hr_ser_standard: %', case when n = 1 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 3. HR ser inte särskilt skyddat dokument (AC-010).
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.documents where id = skyddad;
  reset role;
  raise notice 'TEST hr_ser_skyddat_0 (AC-010): %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 4. HR kan inte ge sig själv grant (FEAT-011 AC-3).
  ok := false;
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  begin
    insert into public.document_grants (user_id, document_id) values (hr, skyddad);
  exception when others then
    ok := true;
  end;
  reset role;
  raise notice 'TEST hr_sjalvgrant_nekad: %', case when ok then 'PASS' else 'FAIL' end;

  -- 5. HR-admin ser båda dokumenten.
  perform set_config('request.jwt.claims', json_build_object('sub', admin, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.documents where id in (std, skyddad);
  reset role;
  raise notice 'TEST admin_ser_bada: %', case when n = 2 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 6. Storage: anonym ser inga filer i bucket dokument.
  set local role anon;
  select count(*) into n from storage.objects where bucket_id = 'dokument';
  reset role;
  raise notice 'TEST storage_anon_0: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 7. Storage: bucketen är privat.
  select count(*) into n from storage.buckets where id = 'dokument' and public = false;
  raise notice 'TEST storage_bucket_privat: %', case when n = 1 then 'PASS' else 'FAIL' end;
end $$;

rollback;
