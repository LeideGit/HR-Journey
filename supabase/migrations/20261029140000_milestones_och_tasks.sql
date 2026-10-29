-- FEAT-003 (individuella milestones och tasks). PRD: FR-MILE-001 till FR-MILE-005, FR-PROF-005,
-- FR-PROF-006, FR-VTL-016, FR-VTL-018, FR-VTL-019, PP-004, PP-010, AC-006.
-- Endast fiktiva data (SEC-001, PP-020).
--
-- Malltabeller (FR-TMPL-*) ingår INTE. De är blockerade av OQ-002 (D-6).
-- Individuella milestones kopieras eller skapas per person. De refererar inte till en mall,
-- så att en framtida malländring inte skriver över dem (FR-PROF-005, FR-PROF-006).

create type public.milestone_status as enum ('kommande', 'aktuellt', 'forsenad', 'slutford');

create table public.person_milestones (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.persons (id) on delete restrict,
  title text not null check (length(title) between 1 and 200),
  description text,
  due_date date not null,
  -- Framförhållning i dagar (FR-MILE-001). Standard enligt FEAT-004-B3.
  lead_days integer not null default 28 check (lead_days >= 0),
  -- Lagrad status. Härleds av tasks och datum i applikationslagret (FR-MILE-004, FR-MILE-005).
  status public.milestone_status not null default 'kommande',
  is_mock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.person_milestones enable row level security;

create table public.milestone_tasks (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.person_milestones (id) on delete cascade,
  title text not null check (length(title) between 1 and 200),
  is_done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  constraint milestone_tasks_done_consistent check ((is_done and done_at is not null) or (not is_done and done_at is null))
);

alter table public.milestone_tasks enable row level security;

-- Läsning och skrivning: HR och HR-administratör (FEAT-002, FEAT-003).
create policy person_milestones_select on public.person_milestones
  for select to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy person_milestones_insert on public.person_milestones
  for insert to authenticated
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy person_milestones_update on public.person_milestones
  for update to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'))
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy milestone_tasks_select on public.milestone_tasks
  for select to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy milestone_tasks_insert on public.milestone_tasks
  for insert to authenticated
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy milestone_tasks_update on public.milestone_tasks
  for update to authenticated
  using ((select public.current_app_role()) in ('hr', 'hr_admin'))
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

-- Ingen DELETE-policy. Milestones och tasks raderas inte i MVP.
