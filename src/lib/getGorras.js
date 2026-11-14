import { supabase } from './supabase'

function mapGorra(gorra) {
  return {
    id: gorra.id,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    fotos: [gorra.foto1, gorra.foto2, gorra.foto3, gorra.foto4, gorra.foto5, gorra.foto6].filter(Boolean),
    createdAt: gorra.created_at,
    // Ficha técnica y stock (ver supabase/gorras_ficha.sql). Pueden venir vacíos.
    marca: gorra.marca ?? null,
    tipo: gorra.tipo ?? null,
    talla: gorra.talla ?? null,
    material: gorra.material ?? null,
    visera: gorra.visera ?? null,
    stock: typeof gorra.stock === 'number' ? gorra.stock : null,
  }
}

export async function getGorras() {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error al obtener gorras:', error)
    return []
  }

  return data.map(mapGorra)
}

export async function getGorraById(id) {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error al obtener gorra:', error)
    return null
  }

  return mapGorra(data)
}

export async function getGorrasNuevas() {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .eq('badge', 'Nuevo')
    .eq('estado', 'activo')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error al obtener novedades:', error)
    return []
  }

  return data.map(mapGorra)
}

export async function getGorrasOfertas() {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .eq('badge', 'Oferta')
    .eq('estado', 'activo')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error al obtener ofertas:', error)
    return []
  }

  return data.map(mapGorra)
}

const MINIMO_RELACIONADAS = 4
const MAXIMO_RELACIONADAS = 8

// Primero gorras de la misma colección; si hay pocas, completa con otras disponibles
// para que el detalle nunca termine sin salida.
export async function getGorrasRelacionadas(coleccion, idExcluir) {
  const { data: mismas, error } = await supabase
    .from('gorras')
    .select('*')
    .eq('coleccion', coleccion)
    .eq('estado', 'activo')
    .neq('id', idExcluir)
    .order('id', { ascending: false })
    .limit(MAXIMO_RELACIONADAS)

  if (error) {
    console.error('Error al obtener relacionadas:', error)
    return []
  }

  if (mismas.length >= MINIMO_RELACIONADAS) return mismas.map(mapGorra)

  const excluir = [idExcluir, ...mismas.map((g) => g.id)]
  const { data: otras, error: errorOtras } = await supabase
    .from('gorras')
    .select('*')
    .eq('estado', 'activo')
    .not('id', 'in', `(${excluir.join(',')})`)
    .order('id', { ascending: false })
    .limit(MAXIMO_RELACIONADAS - mismas.length)

  if (errorOtras) {
    console.error('Error al completar relacionadas:', errorOtras)
    return mismas.map(mapGorra)
  }

  return [...mismas, ...otras].map(mapGorra)
}
