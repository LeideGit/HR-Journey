-- RLS-test för milestones och tasks. Kör mot lokal databas efter db reset.
-- PASS/FAIL-utskrift per påstående. PRD: FR-PROF-005, FR-PROF-006, SEC-004, TEST-006. FEAT-003, FEAT-010.
-- Testdata rensas i slutet.

begin;

insert into auth.users (id, aud, role, email, encrypted_password, created_at, updated_at, instance_id) values
  ('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'hr-test@example.test',   '', now(), now(), '00000000-0000-0000-0000-000000000000'),
  ('44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'utan-roll@example.test', '', now(), now(), '00000000-0000-0000-0000-000000000000');
insert into public.user_roles (user_id, role) values ('33333333-3333-3333-3333-333333333333', 'hr');

do $$
declare
  n int;
  ok boolean;
  hr constant uuid := '33333333-3333-3333-3333-333333333333';
  utan constant uuid := '44444444-4444-4444-4444-444444444444';
  person constant uuid := '10000000-0000-0000-0000-000000000001';
  ms uuid;
begin
  -- Seed-person används. Milestone skapas som superuser (kringgår RLS för fixture).
  insert into public.person_milestones (id, person_id, title, due_date)
    values ('50000000-0000-0000-0000-000000000001', person, 'Fiktiv introduktion', '2026-11-15')
    returning id into ms;
  insert into public.milestone_tasks (milestone_id, title) values (ms, 'Fiktiv uppgift 1');

  -- 1. Anonym ser inga milestones.
  set local role anon;
  select count(*) into n from public.person_milestones;
  reset role;
  raise notice 'TEST anon_ser_inga_milestones: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 2. Anonym ser inga tasks.
  set local role anon;
  select count(*) into n from public.milestone_tasks;
  reset role;
  raise notice 'TEST anon_ser_inga_tasks: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 3. Inloggad utan roll ser inga milestones.
  perform set_config('request.jwt.claims', json_build_object('sub', utan, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.person_milestones;
  reset role;
  raise notice 'TEST utan_roll_ser_inga_milestones: %', case when n = 0 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 4. HR ser milestone och task.
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.person_milestones where id = ms;
  reset role;
  raise notice 'TEST hr_ser_milestone: %', case when n = 1 then 'PASS' else 'FAIL (n=' || n || ')' end;

  -- 5. HR kan inte radera milestone (ingen DELETE-policy, FEAT-003).
  perform set_config('request.jwt.claims', json_build_object('sub', hr, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.person_milestones where id = ms;
  get diagnostics n = row_count;
  reset role;
  raise notice 'TEST hr_kan_inte_radera_milestone: %', case when n = 0 then 'PASS' else 'FAIL (rader raderade=' || n || ')' end;

  -- 6. Task med done utan done_at bryter constraint.
  ok := false;
  begin
    insert into public.milestone_tasks (milestone_id, title, is_done, done_at)
      values (ms, 'Ogiltig', true, null);
  exception when check_violation then
    ok := true;
  end;
  raise notice 'TEST task_klar_kraver_done_at: %', case when ok then 'PASS' else 'FAIL' end;
end $$;

-- Rensning. psql kör utan transaktion här, så testdata tas bort explicit.
delete from public.milestone_tasks where title like 'Fiktiv%';
delete from public.person_milestones where title like 'Fiktiv%';
delete from public.user_roles where user_id in ('33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');
delete from auth.users where email like '%@example.test' and email not in (select email from auth.users where false);

rollback;
