// Consultas del catálogo. Se ejecutan SOLO en el servidor, al generar las páginas.
// Las páginas quedan en caché (ISR, ver `revalidate` en cada page.js), así que Supabase
// recibe unas pocas consultas por hora en total, no una por visitante.
//
// Regla importante: si Supabase falla, estas funciones LANZAN el error en vez de devolver
// una lista vacía. Así Next conserva la última versión buena de la página en lugar de
// guardar en caché un catálogo vacío o un 404 falso durante todo el período de revalidación.
import 'server-only'
import { cache } from 'react'
import { supabase } from './supabase'
import { FOTO_RESPALDO } from './imagenes'
import { slugValido } from './rutas'

// Columnas explícitas: si la tabla gana columnas internas (costos, notas), no se publican solas
const COLUMNAS = [
  'id', 'slug', 'nombre', 'precio', 'precio_anterior', 'coleccion', 'color', 'descripcion',
  'estado', 'badge', 'created_at', 'updated_at',
  'foto1', 'foto2', 'foto3', 'foto4', 'foto5', 'foto6',
  'marca', 'tipo', 'talla', 'material', 'visera', 'stock',
].join(',')

function mapGorra(gorra) {
  const fotos = [gorra.foto1, gorra.foto2, gorra.foto3, gorra.foto4, gorra.foto5, gorra.foto6].filter(Boolean)

  return {
    id: gorra.id,
    // Solo si sirve como URL (ver lib/rutas.js); si no, la gorra se enlaza por id
    slug: slugValido(gorra.slug) ? gorra.slug : null,
    nombre: gorra.nombre,
    precio: gorra.precio,
    precioAnterior: gorra.precio_anterior,
    coleccion: gorra.coleccion,
    color: gorra.color,
    descripcion: gorra.descripcion,
    estado: gorra.estado,
    badge: gorra.badge,
    // Nunca vacío: las cards, la galería y la vista previa siempre tienen qué mostrar
    fotos: fotos.length ? fotos : [FOTO_RESPALDO],
    createdAt: gorra.created_at,
    // Se actualiza sola en cada edición (trigger en supabase/gorras_updated_at.sql)
    updatedAt: gorra.updated_at ?? gorra.created_at,
    // Ficha técnica y stock (ver supabase/gorras_ficha.sql). Pueden venir vacíos.
    marca: gorra.marca ?? null,
    tipo: gorra.tipo ?? null,
    talla: gorra.talla ?? null,
    material: gorra.material ?? null,
    visera: gorra.visera ?? null,
    stock: typeof gorra.stock === 'number' ? gorra.stock : null,
  }
}

function fallo(contexto, error) {
  return new Error(`Supabase: no se pudo ${contexto}: ${error.message || error}`)
}

// Todo el catálogo en una sola consulta. Home, novedades, ofertas, relacionadas y sitemap
// salen de aquí filtrando en memoria. `cache` evita repetir la consulta dentro de una misma generación.
export const getGorras = cache(async () => {
  const { data, error } = await supabase
    .from('gorras')
    .select(COLUMNAS)
    .order('id', { ascending: true })

  if (error) throw fallo('obtener el catálogo', error)
  return data.map(mapGorra)
})

// null = la gorra no existe (la página responde 404). Un error de conexión se lanza.
export const getGorraById = cache(async (id) => {
  const { data, error } = await supabase
    .from('gorras')
    .select(COLUMNAS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw fallo(`obtener la gorra ${id}`, error)
  return data ? mapGorra(data) : null
})

// null = no hay gorra con ese slug. Un error de conexión se lanza.
export const getGorraBySlug = cache(async (slug) => {
  const { data, error } = await supabase
    .from('gorras')
    .select(COLUMNAS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw fallo(`obtener la gorra ${slug}`, error)
  return data ? mapGorra(data) : null
})

const masNuevaPrimero =(a, b) => b.id - a.id

export function filtrarNovedades(gorras) {
  return gorras.filter((g) => g.badge === 'Nuevo' && g.estado === 'activo').sort(masNuevaPrimero)
}

export function filtrarOfertas(gorras) {
  return gorras.filter((g) => g.badge === 'Oferta' && g.estado === 'activo').sort(masNuevaPrimero)
}

const MINIMO_RELACIONADAS = 4
const MAXIMO_RELACIONADAS = 8

// Primero gorras disponibles de la misma colección; si hay pocas, completa con otras
// disponibles para que el detalle nunca termine sin salida.
export async function getGorrasRelacionadas(coleccion, idExcluir) {
  const disponibles = (await getGorras())
    .filter((g) => g.estado === 'activo' && g.id !== idExcluir)
    .sort(masNuevaPrimero)

  const mismas = disponibles.filter((g) => g.coleccion === coleccion).slice(0, MAXIMO_RELACIONADAS)
  if (mismas.length >= MINIMO_RELACIONADAS) return mismas

  const otras = disponibles
    .filter((g) => g.coleccion !== coleccion)
    .slice(0, MAXIMO_RELACIONADAS - mismas.length)

  return [...mismas, ...otras]
}
