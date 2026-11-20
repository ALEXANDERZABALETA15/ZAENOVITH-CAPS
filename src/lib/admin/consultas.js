import 'server-only'

// Lecturas del panel. Reciben el cliente con la sesión del admin (requerirAdmin),
// por eso ven también las gorras ocultas y los costos.

const COLUMNAS_GORRA = [
  'id', 'nombre', 'precio', 'precio_anterior', 'coleccion', 'color', 'descripcion',
  'estado', 'badge', 'stock', 'marca', 'tipo', 'talla', 'material', 'visera',
  'foto1', 'foto2', 'foto3', 'foto4', 'foto5', 'foto6', 'updated_at',
  'gorras_costos(costo)',
].join(',')

function mapGorra(g) {
  const costo = Array.isArray(g.gorras_costos) ? g.gorras_costos[0]?.costo : g.gorras_costos?.costo
  return {
    id: g.id,
    nombre: g.nombre,
    precio: g.precio,
    precioAnterior: g.precio_anterior,
    costo: costo ?? null,
    coleccion: g.coleccion,
    color: g.color,
    descripcion: g.descripcion,
    estado: g.estado,
    badge: g.badge,
    stock: g.stock ?? 0,
    marca: g.marca,
    tipo: g.tipo,
    talla: g.talla,
    material: g.material,
    visera: g.visera,
    fotos: [g.foto1, g.foto2, g.foto3, g.foto4, g.foto5, g.foto6].filter(Boolean),
    actualizada: g.updated_at,
  }
}

function fallo(contexto, error) {
  return new Error(`No se pudo ${contexto}: ${error.message}. ¿Ya ejecutaste supabase/admin.sql?`)
}

export async function gorrasAdmin(supabase) {
  let { data, error } = await supabase.from('gorras').select(COLUMNAS_GORRA).order('id', { ascending: false })

  // Sin supabase/admin.sql todavía no existe la tabla de costos: se muestra el catálogo sin ellos
  if (error && /gorras_costos/i.test(error.message)) {
    ;({ data, error } = await supabase
      .from('gorras')
      .select(COLUMNAS_GORRA.replace(',gorras_costos(costo)', ''))
      .order('id', { ascending: false }))
  }

  if (error) throw fallo('leer las gorras', error)
  return data.map(mapGorra)
}

export function coleccionesDe(gorras) {
  return [...new Set(gorras.map((g) => g.coleccion).filter(Boolean))].sort()
}
