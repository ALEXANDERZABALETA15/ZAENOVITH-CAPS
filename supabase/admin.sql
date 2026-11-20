-- Panel de administración (/admin): acceso, inventario, ventas y costos.
-- Ejecutar en Supabase → SQL Editor DESPUÉS de gorras_ficha.sql y gorras_updated_at.sql.
-- Se puede ejecutar varias veces: cada paso revisa si ya existe.
--
-- Después de ejecutarlo, una sola vez:
--   1. Authentication → Users → Add user → tu correo y contraseña (marca "Auto confirm").
--   2. Authentication → Sign In / Providers → desactiva "Allow new users to sign up".
--   3. Darte permiso de admin (cambia el correo):
--        insert into public.admins (user_id)
--        select id from auth.users where email = 'tu-correo@ejemplo.com'
--        on conflict do nothing;
--
-- Idea general: la web pública (clave anon) solo LEE el catálogo y REGISTRA avisos.
-- Todo lo demás exige un usuario que esté en la tabla admins; lo valida la base misma (RLS),
-- no solo la página, así que una clave filtrada no sirve para modificar nada.


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Administradores
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Nadie la lee por la API; es_admin() la consulta por dentro
revoke all on table public.admins from anon, authenticated;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

revoke all on function public.es_admin() from public;
-- anon también la necesita: la política de lectura del catálogo la usa
grant execute on function public.es_admin() to anon, authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Gorras: stock obligatorio, estado "oculto" y permisos
-- ─────────────────────────────────────────────────────────────────────────────

-- Stock obligatorio (0 si no se sabe). Se llena después desde Admin → Inventario → Conteo.
update public.gorras set stock = 0 where stock is null;
alter table public.gorras
  alter column stock set default 0,
  alter column stock set not null;

-- Estados válidos. "oculto" = archivada: no sale en la web pero conserva su historial de ventas.
-- Se reemplaza cualquier regla anterior sobre estado para poder agregar "oculto".
do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.gorras'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%estado%'
  loop
    execute format('alter table public.gorras drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.gorras
  add constraint gorras_estado_valido
  check (estado in ('activo', 'agotado', 'proximo', 'oculto'));

alter table public.gorras enable row level security;

-- Se reemplazan TODAS las políticas de gorras por las de abajo. Una política vieja tipo
-- "lectura para todos" haría visibles las gorras ocultas (las políticas se suman).
do $$
declare r record;
begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'gorras'
  loop
    execute format('drop policy %I on public.gorras', r.policyname);
  end loop;
end $$;

create policy "Catálogo público"
  on public.gorras for select
  to anon, authenticated
  using (estado is distinct from 'oculto' or public.es_admin());

create policy "Admin crea gorras"
  on public.gorras for insert
  to authenticated
  with check (public.es_admin());

create policy "Admin edita gorras"
  on public.gorras for update
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

create policy "Admin borra gorras"
  on public.gorras for delete
  to authenticated
  using (public.es_admin());

grant select on table public.gorras to anon, authenticated;
revoke insert, update, delete on table public.gorras from anon;
grant insert, update, delete on table public.gorras to authenticated;
-- Por si el id de gorras es serial: insertar necesita usar su secuencia
grant usage, select on all sequences in schema public to authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Costos (tabla aparte: la web pública no puede leerlos de ninguna forma)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.gorras_costos (
  gorra_id    bigint primary key references public.gorras (id) on delete cascade,
  costo       integer not null check (costo >= 0),
  updated_at  timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Ventas (registradas a mano desde el panel; los pedidos llegan por WhatsApp)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.ventas (
  id                bigint generated always as identity primary key,
  fecha             timestamptz not null default now(),
  cliente_nombre    text,
  cliente_telefono  text,
  ciudad            text,
  direccion         text,
  canal             text not null default 'whatsapp'
                    check (canal in ('whatsapp', 'instagram', 'presencial', 'otro')),
  metodo_pago       text check (metodo_pago in ('nequi', 'bancolombia', 'efectivo', 'transferencia', 'otro')),
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  subtotal          integer not null default 0 check (subtotal >= 0),
  descuento         integer not null default 0 check (descuento >= 0),
  envio             integer not null default 0 check (envio >= 0),  -- lo que se le cobra al cliente
  total             integer generated always as (subtotal - descuento + envio) stored,
  notas             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Precio y costo quedan copiados al momento de la venta: si mañana cambia el precio
-- de la gorra, el historial no se altera.
create table if not exists public.venta_items (
  id               bigint generated always as identity primary key,
  venta_id         bigint not null references public.ventas (id) on delete cascade,
  gorra_id         bigint references public.gorras (id) on delete set null,
  gorra_nombre     text not null,
  cantidad         integer not null check (cantidad > 0),
  precio_unitario  integer not null check (precio_unitario >= 0),
  costo_unitario   integer check (costo_unitario >= 0)
);

create index if not exists venta_items_venta_idx on public.venta_items (venta_id);
create index if not exists venta_items_gorra_idx on public.venta_items (gorra_id);
create index if not exists ventas_fecha_idx on public.ventas (fecha desc);


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Movimientos de inventario (todo cambio de stock queda registrado)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.movimientos_inventario (
  id                bigint generated always as identity primary key,
  gorra_id          bigint not null references public.gorras (id) on delete cascade,
  cantidad          integer not null check (cantidad <> 0),   -- positivo entra, negativo sale
  stock_resultante  integer not null,
  motivo            text not null
                    check (motivo in ('inicial', 'ingreso', 'venta', 'cancelacion', 'devolucion', 'perdida', 'ajuste')),
  nota              text,
  venta_id          bigint references public.ventas (id) on delete set null,
  creado_por        uuid default auth.uid(),
  created_at        timestamptz not null default now()
);

create index if not exists movimientos_gorra_idx on public.movimientos_inventario (gorra_id, created_at desc);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Permisos de las tablas privadas: solo admin
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  t text;
  r record;
begin
  foreach t in array array['gorras_costos', 'ventas', 'venta_items', 'movimientos_inventario']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);

    for r in select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', r.policyname, t);
    end loop;

    execute format(
      'create policy "Solo admin" on public.%I for all to authenticated
         using (public.es_admin()) with check (public.es_admin())', t);
  end loop;
end $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Avisos: el admin los lee y los marca como atendidos
-- ─────────────────────────────────────────────────────────────────────────────

grant select, update, delete on table public.avisos to authenticated;

drop policy if exists "Admin lee avisos" on public.avisos;
create policy "Admin lee avisos"
  on public.avisos for select to authenticated
  using (public.es_admin());

drop policy if exists "Admin actualiza avisos" on public.avisos;
create policy "Admin actualiza avisos"
  on public.avisos for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "Admin borra avisos" on public.avisos;
create policy "Admin borra avisos"
  on public.avisos for delete to authenticated
  using (public.es_admin());


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. updated_at automático (misma función que gorras_updated_at.sql)
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ventas_updated_at on public.ventas;
create trigger ventas_updated_at
  before update on public.ventas
  for each row execute function public.tocar_updated_at();

drop trigger if exists gorras_costos_updated_at on public.gorras_costos;
create trigger gorras_costos_updated_at
  before update on public.gorras_costos
  for each row execute function public.tocar_updated_at();


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Funciones de stock y ventas
-- Cada una corre en una sola transacción: si algo falla, no queda nada a medias.
-- Bloquean la fila de la gorra (FOR UPDATE), así dos ventas simultáneas no venden
-- la misma última unidad.
-- ─────────────────────────────────────────────────────────────────────────────

-- Suma o resta stock, registra el movimiento y ajusta el estado:
--   llega a 0 estando activa → agotado;  vuelve a tener stock estando agotada → activo.
--   "proximo" y "oculto" no se tocan.
create or replace function public.mover_stock(
  p_gorra_id  bigint,
  p_cantidad  integer,
  p_motivo    text,
  p_nota      text default null,
  p_venta_id  bigint default null
)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_gorra  record;
  v_nuevo  integer;
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if p_cantidad is null or p_cantidad = 0 then
    raise exception 'La cantidad no puede ser 0';
  end if;

  select id, nombre, stock, estado into v_gorra
  from public.gorras where id = p_gorra_id
  for update;

  if not found then
    raise exception 'La gorra % no existe', p_gorra_id;
  end if;

  v_nuevo := v_gorra.stock + p_cantidad;
  if v_nuevo < 0 then
    raise exception 'Stock insuficiente de "%": quedan % unidades', v_gorra.nombre, v_gorra.stock;
  end if;

  update public.gorras
  set stock  = v_nuevo,
      estado = case
                 when v_nuevo = 0 and estado = 'activo' then 'agotado'
                 when v_nuevo > 0 and estado = 'agotado' then 'activo'
                 else estado
               end,
      badge  = case
                 when v_nuevo > 0 and estado = 'agotado' and badge = 'Agotado' then null
                 else badge
               end
  where id = p_gorra_id;

  insert into public.movimientos_inventario (gorra_id, cantidad, stock_resultante, motivo, nota, venta_id)
  values (p_gorra_id, p_cantidad, v_nuevo, p_motivo, nullif(trim(p_nota), ''), p_venta_id);

  return v_nuevo;
end;
$$;

-- Conteo físico: deja el stock en el número exacto contado (registra la diferencia como ajuste)
create or replace function public.fijar_stock(
  p_gorra_id  bigint,
  p_stock     integer,
  p_nota      text default null
)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_actual integer;
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if p_stock is null or p_stock < 0 then
    raise exception 'El stock contado debe ser 0 o más';
  end if;

  select stock into v_actual from public.gorras where id = p_gorra_id for update;
  if not found then
    raise exception 'La gorra % no existe', p_gorra_id;
  end if;

  if p_stock = v_actual then
    return v_actual;
  end if;

  return public.mover_stock(p_gorra_id, p_stock - v_actual, 'ajuste', coalesce(nullif(trim(p_nota), ''), 'Conteo físico'));
end;
$$;

-- Registra una venta completa: datos del cliente + productos, y descuenta el stock.
-- p_venta: { cliente_nombre, cliente_telefono, ciudad, direccion, canal, metodo_pago,
--            estado, descuento, envio, notas, fecha }
-- p_items: [ { gorra_id, cantidad, precio_unitario? } ]   (sin precio → precio actual)
create or replace function public.registrar_venta(p_venta jsonb, p_items jsonb)
returns bigint
language plpgsql
set search_path = ''
as $$
declare
  v_id        bigint;
  v_item      jsonb;
  v_gorra     record;
  v_cantidad  integer;
  v_precio    integer;
  v_subtotal  integer := 0;
  v_estado    text := coalesce(nullif(p_venta->>'estado', ''), 'pendiente');
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta no tiene productos';
  end if;
  if v_estado = 'cancelado' then
    raise exception 'Una venta nueva no puede empezar cancelada';
  end if;

  insert into public.ventas (
    fecha, cliente_nombre, cliente_telefono, ciudad, direccion,
    canal, metodo_pago, estado, descuento, envio, notas
  )
  values (
    coalesce((p_venta->>'fecha')::timestamptz, now()),
    nullif(trim(p_venta->>'cliente_nombre'), ''),
    nullif(trim(p_venta->>'cliente_telefono'), ''),
    nullif(trim(p_venta->>'ciudad'), ''),
    nullif(trim(p_venta->>'direccion'), ''),
    coalesce(nullif(p_venta->>'canal', ''), 'whatsapp'),
    nullif(p_venta->>'metodo_pago', ''),
    v_estado,
    coalesce((p_venta->>'descuento')::integer, 0),
    coalesce((p_venta->>'envio')::integer, 0),
    nullif(trim(p_venta->>'notas'), '')
  )
  returning id into v_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_cantidad := (v_item->>'cantidad')::integer;
    if v_cantidad is null or v_cantidad <= 0 then
      raise exception 'Cantidad inválida en la venta';
    end if;

    select g.id, g.nombre, g.precio, c.costo into v_gorra
    from public.gorras g
    left join public.gorras_costos c on c.gorra_id = g.id
    where g.id = (v_item->>'gorra_id')::bigint;

    if not found then
      raise exception 'La gorra % no existe', v_item->>'gorra_id';
    end if;

    v_precio := coalesce((v_item->>'precio_unitario')::integer, v_gorra.precio);
    if v_precio < 0 then
      raise exception 'Precio inválido para "%"', v_gorra.nombre;
    end if;

    insert into public.venta_items (venta_id, gorra_id, gorra_nombre, cantidad, precio_unitario, costo_unitario)
    values (v_id, v_gorra.id, v_gorra.nombre, v_cantidad, v_precio, v_gorra.costo);

    perform public.mover_stock(v_gorra.id, -v_cantidad, 'venta', null, v_id);

    v_subtotal := v_subtotal + v_precio * v_cantidad;
  end loop;

  update public.ventas set subtotal = v_subtotal where id = v_id;

  if (select total from public.ventas where id = v_id) < 0 then
    raise exception 'El descuento no puede ser mayor que el valor de la venta';
  end if;

  return v_id;
end;
$$;

-- Cambia el estado de una venta. Cancelar devuelve las unidades al inventario.
-- Una venta cancelada no se reabre (se registra de nuevo), así el stock nunca se descuadra.
create or replace function public.cambiar_estado_venta(p_venta_id bigint, p_estado text)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_actual  text;
  v_item    record;
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  select estado into v_actual from public.ventas where id = p_venta_id for update;
  if not found then
    raise exception 'La venta % no existe', p_venta_id;
  end if;
  if v_actual = p_estado then
    return;
  end if;
  if v_actual = 'cancelado' then
    raise exception 'Esta venta está cancelada y no se puede reabrir. Regístrala de nuevo.';
  end if;

  if p_estado = 'cancelado' then
    for v_item in
      select gorra_id, sum(cantidad)::integer as cantidad
      from public.venta_items
      where venta_id = p_venta_id and gorra_id is not null
      group by gorra_id
    loop
      perform public.mover_stock(v_item.gorra_id, v_item.cantidad, 'cancelacion', null, p_venta_id);
    end loop;
  end if;

  update public.ventas set estado = p_estado where id = p_venta_id;
end;
$$;

revoke all on function public.mover_stock(bigint, integer, text, text, bigint) from public, anon;
revoke all on function public.fijar_stock(bigint, integer, text) from public, anon;
revoke all on function public.registrar_venta(jsonb, jsonb) from public, anon;
revoke all on function public.cambiar_estado_venta(bigint, text) from public, anon;
grant execute on function public.mover_stock(bigint, integer, text, text, bigint) to authenticated;
grant execute on function public.fijar_stock(bigint, integer, text) to authenticated;
grant execute on function public.registrar_venta(jsonb, jsonb) to authenticated;
grant execute on function public.cambiar_estado_venta(bigint, text) to authenticated;
