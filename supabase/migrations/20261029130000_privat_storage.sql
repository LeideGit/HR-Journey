-- FEAT-006 (filer), FEAT-010 (Storage). PRD: FR-DOC-006, SEC-003, SEC-004, SEC-007, SEC-008, SEC-009.
-- Privat bucket. Ingen publik läsning, inga publika länkar.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dokument',
  'dokument',
  false,
  26214400,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Läsning och skrivning följer samma behörighet som dokumentobjektet (SEC-007, FEAT-006).
-- Filnamnet i Storage är dokumentets och versionens ID, inte användarinmatat namn.
-- Sökvägen är "<document_id>/<version_id>", och document_id är den första segmentet.
create policy dokument_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'dokument'
    and public.can_read_document(((storage.foldername(name))[1])::uuid)
  );

create policy dokument_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'dokument'
    and public.can_read_document(((storage.foldername(name))[1])::uuid)
  );

-- Ingen UPDATE- eller DELETE-policy för authenticated. Ändring och radering av filer
-- sker inte i MVP (FR-DRET-003 kräver explicit godkännande).
-- Ingen policy för anon. Anonym åtkomst blockeras (SEC-004).
