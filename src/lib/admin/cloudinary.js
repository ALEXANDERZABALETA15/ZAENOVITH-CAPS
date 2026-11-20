// Subida y borrado de fotos en Cloudinary desde el panel.
// La clave secreta vive solo aquí (servidor). El navegador sube la foto directo a Cloudinary
// con una firma de un solo uso que le damos nosotros: la foto no pasa por nuestro servidor.
//
// Variables de entorno (en el hosting y en .env.local):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
import 'server-only'
import { createHash } from 'node:crypto'

// Todas las fotos subidas desde el panel van a esta carpeta. Solo las de esta carpeta se
// borran automáticamente: las fotos viejas subidas a mano nunca se tocan.
export const CARPETA_GORRAS = 'crownlux/gorras'

// Red de seguridad en Cloudinary: aunque el navegador ya entrega la foto a 2000 px como máximo,
// si algo falla en la compresión Cloudinary igual la limita al guardarla.
const TRANSFORMACION_ENTRADA = 'c_limit,w_2000,h_2000'
const FORMATOS_PERMITIDOS = 'jpg,jpeg,png,webp'

function credenciales() {
  const nube = process.env.CLOUDINARY_CLOUD_NAME
  const clave = process.env.CLOUDINARY_API_KEY
  const secreto = process.env.CLOUDINARY_API_SECRET
  if (!nube || !clave || !secreto) {
    throw new Error('Faltan las credenciales de Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).')
  }
  return { nube, clave, secreto }
}

// Firma de Cloudinary: parámetros ordenados alfabéticamente "a=1&b=2" + secreto, en SHA-1
function firmar(parametros, secreto) {
  const cadena = Object.keys(parametros)
    .sort()
    .map((clave) => `${clave}=${parametros[clave]}`)
    .join('&')
  return createHash('sha1').update(cadena + secreto).digest('hex')
}

export function firmaSubida() {
  const { nube, clave, secreto } = credenciales()
  const parametros = {
    allowed_formats: FORMATOS_PERMITIDOS,
    folder: CARPETA_GORRAS,
    timestamp: Math.floor(Date.now() / 1000),
    transformation: TRANSFORMACION_ENTRADA,
  }
  return {
    url: `https://api.cloudinary.com/v1_1/${nube}/image/upload`,
    campos: { ...parametros, api_key: clave, signature: firmar(parametros, secreto) },
  }
}

// https://res.cloudinary.com/<nube>/image/upload/[transformaciones/]v123/crownlux/gorras/abc.webp
//   → "crownlux/gorras/abc"   (null si la foto no es de nuestra carpeta)
export function publicIdDeCarpeta(url) {
  if (typeof url !== 'string') return null
  const nube = process.env.CLOUDINARY_CLOUD_NAME
  const partes = url.match(/^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:.*?\/)?v\d+\/(.+)\.[a-z0-9]+$/i)
  if (!partes || partes[1] !== nube) return null
  const publicId = partes[2]
  return publicId.startsWith(`${CARPETA_GORRAS}/`) ? publicId : null
}

// Borra fotos de la carpeta del panel. Nunca lanza error: si Cloudinary falla, la foto
// queda huérfana (ocupa espacio) pero el guardado de la gorra no se interrumpe.
export async function borrarFotos(urls) {
  const ids = [...new Set(urls.map(publicIdDeCarpeta).filter(Boolean))]
  if (!ids.length) return

  let datos
  try {
    datos = credenciales()
  } catch (e) {
    console.error(e.message)
    return
  }
  const { nube, clave, secreto } = datos

  await Promise.all(
    ids.map(async (publicId) => {
      // invalidate: la CDN deja de servir la foto borrada
      const parametros = { invalidate: 'true', public_id: publicId, timestamp: Math.floor(Date.now() / 1000) }
      const cuerpo = new URLSearchParams({ ...parametros, api_key: clave, signature: firmar(parametros, secreto) })
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${nube}/image/destroy`, { method: 'POST', body: cuerpo })
        if (!res.ok) console.error(`Cloudinary: no se pudo borrar ${publicId}`, await res.text())
      } catch (e) {
        console.error(`Cloudinary: no se pudo borrar ${publicId}`, e)
      }
    })
  )
}
