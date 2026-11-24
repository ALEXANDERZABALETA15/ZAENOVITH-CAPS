import { getGorras, marcasDisponibles } from '@/lib/getGorras'   // Trae las gorras desde Supabase
import { SITIO_URL } from '@/lib/contacto'    // La dirección oficial: https://www.crownlux.co
import { rutaGorra, rutaMarca } from '@/lib/rutas'   // La URL de cada gorra (con su slug) y de cada marca
import { coleccionesDisponibles } from '@/lib/colecciones'
import { FOTO_RESPALDO, urlProductoGrande } from '@/lib/imagenes'

// Cada 3600 segundos (1 hora) Next vuelve a armar la lista.
// Para qué sirve: si subes una gorra nueva, aparece sola en el sitemap, sin volver a desplegar.
export const revalidate = 3600

export default async function sitemap() {
  const gorras = await getGorras()   // Trae todas las gorras publicadas de la tabla `gorras`

  // 1. Páginas fijas de CROWNLUX
  const rutasFijas = [
    '',                      // el inicio
    '/novedades',
    '/ofertas',
    '/como-comprar',
    '/preguntas-frecuentes',
    '/sobre-nosotros',
    '/politica-de-cambios',
  ].map((ruta) => ({
    url: `${SITIO_URL}${ruta}`,   // Ejemplo: https://www.crownlux.co/ofertas
  }))

  // 2. Colecciones y marcas con gorras publicadas (salen solas del catálogo)
  const rutasListados = [
    ...coleccionesDisponibles(gorras).map((c) => `/coleccion/${c.clave}`),   // /coleccion/premium
    ...marcasDisponibles(gorras).map((m) => rutaMarca(m.nombre)),            // /marca/new-era
  ].map((ruta) => ({ url: `${SITIO_URL}${ruta}` }))

  // 3. Una entrada por cada gorra, con sus fotos (ayuda a aparecer en Google Imágenes)
  const rutasGorras = gorras.map((gorra) => ({
    url: `${SITIO_URL}${rutaGorra(gorra)}`,   // Ejemplo: https://www.crownlux.co/gorra/new-era-boston-red-sox-59fifty-7-1-4-20
    // Fecha de la última edición (precio, agotada, fotos): le indica a Google qué volver a revisar.
    // La mantiene Supabase sola (ver supabase/gorras_updated_at.sql)
    lastModified: new Date(gorra.updatedAt),
    images: gorra.fotos.filter((f) => f !== FOTO_RESPALDO).map(urlProductoGrande),
  }))

  // 4. Se juntan las listas en una sola
  return [...rutasFijas, ...rutasListados, ...rutasGorras]
}
