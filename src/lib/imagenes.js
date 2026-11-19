// Imágenes y videos se sirven desde Cloudinary, nunca desde Vercel ni Supabase.
// En la base solo se guarda la URL original; el tamaño y el formato se piden aquí.
//
// Cada combinación nueva (foto + ancho + formato) gasta una "transformación" de Cloudinary
// una sola vez; después queda en su CDN. Por eso los anchos posibles están acotados
// en next.config.js (deviceSizes / imageSizes) y no se piden anchos arbitrarios.

import { SITIO_URL } from './contacto'

// Se muestra si una gorra no tiene foto cargada
export const FOTO_RESPALDO = '/sin-foto.svg'

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.*)$/

export function esCloudinary(url) {
  return typeof url === 'string' && CLOUDINARY.test(url)
}

// Agrega una transformación a una URL de Cloudinary.
// Si la URL ya trae transformaciones (antes del segmento de versión v123...), la nuestra
// se encadena al final para respetar el recorte original.
// Las URLs que no son de Cloudinary se devuelven tal cual.
export function transformar(url, transformacion) {
  const partes = typeof url === 'string' ? url.match(CLOUDINARY) : null
  if (!partes) return url

  const [, base, resto] = partes
  const segmentos = resto.split('/')
  const indiceVersion = segmentos.findIndex((s) => /^v\d+$/.test(s))

  // Sin versión no se puede distinguir una carpeta de una transformación: se asume que no hay
  if (indiceVersion <= 0) return `${base}${transformacion}/${resto}`

  const previas = segmentos.slice(0, indiceVersion)
  const desdeVersion = segmentos.slice(indiceVersion)
  return `${base}${[...previas, transformacion, ...desdeVersion].join('/')}`
}

function absoluta(url) {
  return url.startsWith('/') ? `${SITIO_URL}${url}` : url
}

// Vista previa al compartir (WhatsApp, Facebook, Instagram).
// JPG explícito porque algunos lectores de enlaces no entienden webp/avif,
// y liviano porque WhatsApp no muestra imágenes pesadas.
export function urlCompartir(url, { ancho = 1200, alto = 630 } = {}) {
  if (!url) return absoluta(FOTO_RESPALDO)
  return absoluta(transformar(url, `c_fill,g_center,w_${ancho},h_${alto},f_jpg,q_auto`))
}

// Imagen grande para datos estructurados (Google Shopping / resultados enriquecidos)
export function urlProductoGrande(url) {
  if (!url) return absoluta(FOTO_RESPALDO)
  return absoluta(transformar(url, 'f_auto,q_auto,w_1600,c_limit'))
}

// Video comprimido al ancho de la pantalla que lo va a mostrar
export function urlVideo(url, ancho) {
  return transformar(url, `q_auto,vc_auto,w_${ancho},c_limit`)
}
