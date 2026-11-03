-- FEAT-006 (personkoppling), FEAT-010 (datamodell). PRD: FR-DOC-003, FR-DOC-005, FR-DSRCH-005, SEC-006.
-- Kopplingen är bara ett samband. Den ger ingen läsrätt. Läsning följer can_read_document för dokumentet,
-- så att en koppling aldrig avslöjar ett särskilt skyddat dokument (SEC-006, FR-DSRCH-005).
-- Endast fiktiva data (SEC-001, PP-020).

create table public.document_person_links (
  document_id uuid not null references public.documents (id) on delete cascade,
  person_id uuid not null references public.persons (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (document_id, person_id)
);

alter table public.document_person_links enable row level security;

-- Läsning: bara om användaren får läsa dokumentet. Personen syns inte via koppling till skyddat dokument.
create policy document_person_links_select on public.document_person_links
  for select to authenticated
  using ((select public.can_read_document(document_id)));

-- Skrivning: HR och HR-administratör, och bara på dokument de får läsa.
create policy document_person_links_insert on public.document_person_links
  for insert to authenticated
  with check (
    (select public.current_app_role()) in ('hr', 'hr_admin')
    and (select public.can_read_document(document_id))
  );

create policy document_person_links_delete on public.document_person_links
  for delete to authenticated
  using (
    (select public.current_app_role()) in ('hr', 'hr_admin')
    and (select public.can_read_document(document_id))
  );
