-- Tabla para los "Avísame cuando llegue" / "Avísame si vuelve" de las cards.
-- Ejecutar una vez en Supabase → SQL Editor.

create table if not exists public.avisos (
  id            bigint generated always as identity primary key,
  gorra_id      bigint,
  gorra_nombre  text not null,
  tipo          text not null check (tipo in ('llegada', 'restock')),
  telefono      text not null check (telefono ~ '^3[0-9]{9}$'),
  acepta_datos  boolean not null,
  atendido      boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.avisos enable row level security;

-- Permiso de tabla: sin esto la API responde 401 "permission denied for table avisos",
-- porque los proyectos nuevos de Supabase no lo otorgan solos a las tablas creadas por SQL.
-- Solo INSERT: anon no puede leer, editar ni borrar (y además RLS filtra cada fila).
grant insert on table public.avisos to anon;

-- La web (clave anon) solo puede INSERTAR, y solo con autorización de datos aceptada.
-- No hay política de SELECT: nadie puede leer los teléfonos desde la web.
-- Se consultan desde el panel de Supabase (Table Editor).
drop policy if exists "La web puede registrar avisos" on public.avisos;
create policy "La web puede registrar avisos"
  on public.avisos
  for insert
  to anon
  with check (acepta_datos = true and atendido = false);
