import { getGorras } from '@/lib/getGorras'   // Función que ya tienes: trae las gorras desde Supabase
import { SITIO_URL } from '@/lib/contacto'    // La dirección oficial: https://www.crownlux.co

// Cada 3600 segundos (1 hora) Next vuelve a armar la lista.
// Para qué sirve: si subes una gorra nueva, aparece sola en el sitemap, sin volver a desplegar.
export const revalidate = 3600

export default async function sitemap() {
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

  // 2. Una entrada por cada gorra
  const gorras = await getGorras()   // Trae todas las gorras de la tabla `gorras`

  const rutasGorras = gorras.map((gorra) => ({
    url: `${SITIO_URL}/gorra/${gorra.id}`,       // Ejemplo: https://www.crownlux.co/gorra/13
    lastModified: new Date(gorra.createdAt),     // Fecha en que se creó la gorra
  }))

  // 3. Se juntan las dos listas en una sola
  return [...rutasFijas, ...rutasGorras]
}