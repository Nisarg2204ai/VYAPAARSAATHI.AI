-- Keep invoice PDFs private. Only the backend service role creates and signs objects.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invoice-pdfs', 'invoice-pdfs', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

-- No storage.objects policy is granted to anon/authenticated roles. Clients receive a
-- ten-minute signed URL only after the API verifies invoice ownership.
commit;
