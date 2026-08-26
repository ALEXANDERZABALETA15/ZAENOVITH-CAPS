import { supabase } from './supabase'

export async function getGorras() {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error al obtener gorras:', error)
    return []
  }

  return data.map((gorra) => ({
    id: gorra.id,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    fotos: [gorra.foto1, gorra.foto2, gorra.foto3].filter(Boolean),
    createdAt: gorra.created_at,
  }))
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

  return {
    id: data.id,
    nombre: data.nombre,
    precio: data.precio,
    precioAnterior: data.precio_anterior,
    coleccion: data.coleccion,
    color: data.color,
    descripcion: data.descripcion,
    estado: data.estado,
    badge: data.badge,
    fotos: [data.foto1, data.foto2, data.foto3].filter(Boolean),
  }
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

  return data.map((gorra) => ({
    id: gorra.id,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    fotos: [gorra.foto1, gorra.foto2, gorra.foto3].filter(Boolean),
  }))
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

  return data.map((gorra) => ({
    id: gorra.id,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    fotos: [gorra.foto1, gorra.foto2, gorra.foto3].filter(Boolean),
  }))
}
export async function getGorrasRelacionadas(coleccion, idExcluir) {
  const { data, error } = await supabase
    .from('gorras')
    .select('*')
    .eq('coleccion', coleccion)
    .eq('estado', 'activo')
    .neq('id', idExcluir)
    .order('id', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error al obtener relacionadas:', error)
    return []
  }

  return data.map((gorra) => ({
    id: gorra.id,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    fotos: [gorra.foto1, gorra.foto2, gorra.foto3].filter(Boolean),
  }))
}