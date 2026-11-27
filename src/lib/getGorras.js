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
import { slugValido, slugTexto } from './rutas'
import { claveColeccion } from './colecciones'
import { porcentajeDescuento } from './precio'
import { esOferta } from './badges'

// Columnas explícitas: si la tabla gana columnas internas (costos, notas), no se publican solas
const COLUMNAS = [
  'id', 'slug', 'sku', 'nombre', 'precio', 'precio_anterior', 'coleccion', 'color', 'descripcion',
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
    sku: gorra.sku?.trim() || null,
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

const MAXIMO_NOVEDADES = 12

// Las últimas gorras disponibles que llegaron, sin depender de que alguien les ponga la etiqueta:
// así /novedades nunca queda vacía. Las marcadas "Nuevo" van primero.
export function filtrarNovedades(gorras) {
  const esNueva = (g) => (g.badge === 'Nuevo' ? 0 : 1)
  return gorras
    .filter((g) => g.estado === 'activo')
    .sort((a, b) =>
      esNueva(a) - esNueva(b) ||
      new Date(b.createdAt) - new Date(a.createdAt) ||
      masNuevaPrimero(a, b))
    .slice(0, MAXIMO_NOVEDADES)
}

// Mismo orden que el catálogo del inicio: disponibles, luego próximas, agotadas al final;
// dentro de cada grupo, las más recientes primero
const PRIORIDAD_ESTADO = { activo: 0, proximo: 1, agotado: 2 }

export function ordenCatalogo(gorras) {
  return [...gorras].sort((a, b) =>
    (PRIORIDAD_ESTADO[a.estado] ?? 1) - (PRIORIDAD_ESTADO[b.estado] ?? 1) ||
    new Date(b.createdAt) - new Date(a.createdAt) ||
    masNuevaPrimero(a, b))
}

export function filtrarColeccion(gorras, clave) {
  return ordenCatalogo(gorras.filter((g) => claveColeccion(g.coleccion) === clave))
}

// Marcas con al menos una gorra publicada: [{ slug, nombre, cantidad }].
// "New Era" y "new era " cuentan como la misma; se muestra el nombre más usado.
export function marcasDisponibles(gorras) {
  const marcas = new Map()
  gorras.forEach((g) => {
    const slug = slugTexto(g.marca)
    if (!slug) return
    const m = marcas.get(slug) ?? { slug, cantidad: 0, nombres: {} }
    const nombre = g.marca.trim()
    m.cantidad += 1
    m.nombres[nombre] = (m.nombres[nombre] ?? 0) + 1
    marcas.set(slug, m)
  })
  return [...marcas.values()]
    .map(({ slug, cantidad, nombres }) => ({
      slug,
      cantidad,
      nombre: Object.entries(nombres).sort((a, b) => b[1] - a[1])[0][0],
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
}

export function filtrarMarca(gorras, slug) {
  return ordenCatalogo(gorras.filter((g) => slugTexto(g.marca) === slug))
}

export function filtrarOfertas(gorras) {
  return gorras.filter(esOferta).sort(masNuevaPrimero)
}

// Para paneles de temporada (Black Friday): las ofertas con más descuento primero
// y el "Hasta X%" real. descuentoMaximo es null si ninguna tiene precio anterior.
export function resumenOfertas(gorras, limite = 4) {
  const ofertas = filtrarOfertas(gorras)
    .map((gorra) => ({ gorra, descuento: porcentajeDescuento(gorra.precio, gorra.precioAnterior) ?? 0 }))
    .sort((a, b) => b.descuento - a.descuento)

  return {
    gorras: ofertas.slice(0, limite).map((o) => o.gorra),
    descuentoMaximo: ofertas[0]?.descuento || null,
  }
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
