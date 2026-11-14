-- Columnas nuevas para la ficha técnica, más fotos y stock.
-- Ejecutar una vez en Supabase → SQL Editor. Todas son opcionales:
-- la web solo muestra lo que tenga valor, así que se pueden ir llenando de a poco.

alter table public.gorras
  add column if not exists marca     text,     -- New Era, Kith, CROWNLUX...
  add column if not exists tipo      text,     -- Snapback, Fitted, Trucker, Dad hat, Strapback
  add column if not exists talla     text,     -- 'Ajustable (talla única)' o '7 1/8' para fitted
  add column if not exists material  text,     -- '100% algodón, bordado 3D'
  add column if not exists visera    text,     -- 'Curva' o 'Plana'
  add column if not exists foto4     text,     -- Sugerido: interior con etiquetas
  add column if not exists foto5     text,     -- Sugerido: vista trasera / cierre
  add column if not exists foto6     text,     -- Sugerido: foto puesta en una persona
  add column if not exists stock     integer check (stock is null or stock >= 0);
  -- stock: si es 1, 2 o 3 la web muestra "Últimas N unidades". Vacío = no se muestra nada.
