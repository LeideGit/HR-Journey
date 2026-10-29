-- FEAT-001 (roller), FEAT-002/003 (personer). PRD: SEC-002, SEC-004, PP-009, FR-PERSON-002, FR-PROF-001.
-- Endast fiktiva data (SEC-001, PP-020).

-- Roller enligt PRD sektion 5.1 (HR) och 5.2 (HR-administratör).
-- Rollen lagras server-side. Klienten kan inte ändra den (FEAT-001-B4).
create type public.app_role as enum ('hr', 'hr_admin');

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- En användare får läsa sin egen roll. Ingen klient kan skriva roller.
create policy user_roles_select_own on public.user_roles
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Hjälpfunktion för policies. Körs med definierarens rättigheter, så att
-- policies inte rekursivt anropar user_roles-RLS.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.user_roles where user_id = (select auth.uid());
$$;

revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to authenticated;

-- Personer (FR-PERSON-002, FR-PROF-001). Fiktiva.
create type public.profile_type as enum ('anstalld', 'konsult', 'lia');

create table public.persons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  profile_type public.profile_type not null,
  department text not null,
  manager_name text,
  start_date date not null,
  end_date date,
  is_active boolean not null default true,
  is_mock boolean not null default true,
  created_at timestamptz not null default now(),
  constraint persons_end_after_start check (end_date is null or end_date >= start_date)
);

alter table public.persons enable row level security;

-- HR och HR-administratör läser personer (FEAT-002).
create policy persons_select_hr on public.persons
  for select to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'));

-- Skrivning till personer: HR och HR-administratör (FEAT-003-B1).
create policy persons_insert_hr on public.persons
  for insert to authenticated
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy persons_update_hr on public.persons
  for update to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'))
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

-- Ingen DELETE-policy: personer raderas inte i MVP (FEAT-002-B12, B13).
