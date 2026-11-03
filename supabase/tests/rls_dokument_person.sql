-- RLS för personkoppling. FEAT-006-B3, FR-DSRCH-005. PASS/FAIL per påstående. Testdata rensas.
begin;

insert into auth.users (id, aud, role, email, encrypted_password, created_at, updated_at, instance_id) values
  ('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'hr-test@example.test', '', now(), now(), '00000000-0000-0000-0000-000000000000');
insert into public.user_roles (user_id, role) values ('33333333-3333-3333-3333-333333333333', 'hr');

do $$
declare
  n int;
  hr constant uuid := '33333333-3333-3333-3333-333333333333';
  skyddad constant uuid := '20000000-0000-0000-0000-000000000006';
  standard constant uuid := '20000000-0000-0000-0000-000000000003';
  lonebesked constant uuid := '20000000-0000-0000-0000-000000000002';
begin
  -- 1. Anonym ser ingen koppling.
  set local role anon;
  select count(*) into n from public.document_person_links;
  reset role;
  raise notice 'TEST anon_ser_inga_kopplingar: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 2. HR ser inte koppling till skyddat dokument (ingen läsrätt till dokumentet).
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.document_person_links where document_id = skyddad;
  reset role;
  raise notice 'TEST hr_ser_inte_koppling_skyddat: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 3. HR ser koppling till standarddokument.
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.document_person_links where document_id = standard;
  reset role;
  raise notice 'TEST hr_ser_koppling_standard: %', case when n = 1 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 4. HR ser inte koppling till skyddat lönebesked (FR-DSRCH-005, SEC-006).
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.document_person_links where document_id = lonebesked;
  reset role;
  raise notice 'TEST hr_ser_inte_koppling_lonebesked: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;
end $$;

rollback;
