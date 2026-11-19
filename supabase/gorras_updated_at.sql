-- Fecha de última modificación de cada gorra.
-- Sirve para el sitemap: le avisa a Google qué gorras cambiaron (precio, agotada, fotos)
-- para que las vuelva a revisar. Ejecutar una vez en Supabase → SQL Editor.
--
-- El código ya lee esta columna (src/lib/getGorras.js): en un ambiente nuevo hay que
-- ejecutar este script ANTES de desplegar, o las consultas del catálogo fallan.

alter table public.gorras
  add column if not exists updated_at timestamptz not null default now();

-- Se actualiza sola en cada UPDATE, sin que nadie tenga que acordarse de cambiarla
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gorras_updated_at on public.gorras;
create trigger gorras_updated_at
  before update on public.gorras
  for each row execute function public.tocar_updated_at();
