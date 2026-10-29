-- FEAT-006 (dokument), FEAT-010 (datamodell). PRD: ADR-003, FR-DOC-001 till FR-DOC-011,
-- FR-DVER-001 till FR-DVER-006, FR-DVAL-001, FR-DVAL-002, SEC-003, SEC-007, SEC-008, SEC-010.
-- Endast fiktiva data (SEC-001, PP-020).

-- Särskilt skydd (FR-DOC-008). Extra behörighet som HR-administratör ger.
create table public.document_grants (
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null,
  granted_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  primary key (user_id, document_id)
);

alter table public.document_grants enable row level security;

-- Dokumentobjekt (ADR-003, PP-006). Skydd och gallring följer objektet (FR-DVER-006).
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 200),
  document_type text not null,
  security_class text not null check (security_class in ('standard', 'skyddad')),
  retention_status text not null default 'ej_aktuell'
    check (retention_status in ('ej_aktuell', 'gallring_kravs', 'arkiverad')),
  is_archived boolean not null default false,
  is_mock boolean not null default true,
  created_at timestamptz not null default now(),
  -- Aktuell version (FR-DVER-002, FR-DVER-004). Sätts i samma transaktion som ny version.
  current_version_id uuid
);

alter table public.documents enable row level security;

-- Version av dokument (FR-DVER-001 till FR-DVER-003, FR-DVAL-001).
create table public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  version_no integer not null check (version_no >= 1),
  storage_path text not null,
  mime_type text not null check (mime_type in (
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )),
  valid_from date,
  valid_to date,
  -- Fiktivt innehåll för mockmotorn (FR-AI-DOC-001). Följer dokumentets behörighet (SEC-014).
  mock_text_content text,
  created_at timestamptz not null default now(),
  unique (document_id, version_no),
  constraint document_versions_valid_range check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

alter table public.document_versions enable row level security;

alter table public.documents
  add constraint documents_current_version_fk
  foreign key (current_version_id) references public.document_versions (id) deferrable initially deferred;

-- Hjälpfunktion: får användaren läsa dokumentet? (FR-DOC-008, FEAT-001-B3)
-- Standard: HR och HR-administratör. Skyddat: endast HR-administratör, eller HR med grant.
create or replace function public.can_read_document(doc_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.documents d
    where d.id = doc_id
      and (
        (select public.current_app_role()) = 'hr_admin'
        or (
          (select public.current_app_role()) = 'hr'
          and (
            d.security_class = 'standard'
            or exists (
              select 1 from public.document_grants g
              where g.document_id = d.id and g.user_id = (select auth.uid())
            )
          )
        )
      )
  );
$$;

revoke all on function public.can_read_document(uuid) from public;
grant execute on function public.can_read_document(uuid) to authenticated;

-- Policies. Ingen policy ger anon eller authenticated utan roll åtkomst (SEC-004).
create policy documents_select on public.documents
  for select to authenticated
  using ((select public.can_read_document(id)));

create policy document_versions_select on public.document_versions
  for select to authenticated
  using ((select public.can_read_document(document_id)));

-- Skrivning till dokument: HR och HR-administratör. Särskilt skyddade kräver grant eller admin.
create policy documents_insert on public.documents
  for insert to authenticated
  with check ((select public.current_app_role()) in ('hr', 'hr_admin'));

create policy documents_update on public.documents
  for update to authenticated
  using ((select public.can_read_document(id)))
  with check ((select public.can_read_document(id)));

create policy document_versions_insert on public.document_versions
  for insert to authenticated
  with check ((select public.can_read_document(document_id)));

-- Grants: endast HR-administratör (FEAT-011-B5). Ingen självgrant (FEAT-011-AC-3).
create policy document_grants_select_admin on public.document_grants
  for select to authenticated
  using ((select public.current_app_role()) = 'hr_admin');

create policy document_grants_insert_admin on public.document_grants
  for insert to authenticated
  with check ((select public.current_app_role()) = 'hr_admin');

create policy document_grants_delete_admin on public.document_grants
  for delete to authenticated
  using ((select public.current_app_role()) = 'hr_admin');

-- Inga DELETE-policyer på documents eller document_versions. Permanent radering är ej
-- implementerad i denna migration (FR-DRET-003, kräver explicit godkännande).
