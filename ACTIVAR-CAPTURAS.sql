begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fundedtrack-trade-images', 'fundedtrack-trade-images', false, 1000000, array['image/jpeg'])
on conflict (id) do update set public=false, file_size_limit=1000000, allowed_mime_types=array['image/jpeg'];
-- Solo el usuario autenticado puede acceder a su propia carpeta.
drop policy if exists "ft73 trade image upload" on storage.objects;
create policy "ft73 trade image upload" on storage.objects
for insert to authenticated with check (
 bucket_id='fundedtrack-trade-images'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
 and storage.extension(name)='jpg'
);
drop policy if exists "ft73 trade image read" on storage.objects;
create policy "ft73 trade image read" on storage.objects
for select to authenticated using (
 bucket_id='fundedtrack-trade-images'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
);
-- Archivos inmutables: la app crea un nombre nuevo al reemplazar una captura.
-- No se borran automáticamente para conservar referencias de respaldos y grupos.
commit;
