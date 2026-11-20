'use client'

// Prepara una foto en el navegador ANTES de subirla a Cloudinary:
//   1. Corrige la orientación (fotos de celular giradas).
//   2. Recorta al cuadrado elegido (cards y galería son 1:1).
//   3. Redimensiona a 2000 px como máximo, sin agrandar fotos pequeñas.
//   4. Comprime a WebP (JPG si el navegador no sabe generar WebP), bajando la calidad
//      hasta quedar por debajo de PESO_OBJETIVO.
// Al redibujar en un canvas se descartan los metadatos EXIF (ubicación GPS, modelo del celular).
//
// Por qué 2000 px: el ancho más grande que pide la web es 1920 (next.config.js → deviceSizes)
// y la imagen para Google es de 1600 (urlProductoGrande). Más que eso es peso que nadie ve.
// Después Cloudinary entrega cada foto con f_auto, q_auto y el ancho exacto de la pantalla.

export const LADO_MAXIMO = 2000
const PESO_OBJETIVO = 450 * 1024
const CALIDADES = [0.86, 0.8, 0.74, 0.68]

export async function cargarFoto(archivo) {
  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen.')
  }
  try {
    return await createImageBitmap(archivo, { imageOrientation: 'from-image' })
  } catch {
    // HEIC del iPhone en Chrome/Windows, archivos dañados, etc.
    throw new Error('No se pudo leer la foto. Si es HEIC (iPhone), expórtala como JPG e inténtalo de nuevo.')
  }
}

function aBlob(canvas, tipo, calidad) {
  return new Promise((resolver) => canvas.toBlob(resolver, tipo, calidad))
}

// recorte: { x, y, lado } en píxeles de la foto original
export async function recortarYComprimir(imagen, recorte) {
  const salida = Math.min(LADO_MAXIMO, Math.round(recorte.lado))
  const canvas = document.createElement('canvas')
  canvas.width = salida
  canvas.height = salida

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(imagen, recorte.x, recorte.y, recorte.lado, recorte.lado, 0, 0, salida, salida)

  let blob = null
  for (const calidad of CALIDADES) {
    blob = await aBlob(canvas, 'image/webp', calidad)
    // Safari antiguo ignora webp y devuelve PNG: en ese caso se usa JPG
    if (!blob || blob.type !== 'image/webp') blob = await aBlob(canvas, 'image/jpeg', calidad)
    if (blob && blob.size <= PESO_OBJETIVO) break
  }
  if (!blob) throw new Error('No se pudo comprimir la foto.')

  return { blob, lado: salida }
}

export function formatoPeso(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Sube con la firma que entrega el servidor (Server Action firmarSubidaFoto).
// XMLHttpRequest en vez de fetch para poder mostrar el progreso.
export function subirACloudinary(blob, firma, alProgresar) {
  return new Promise((resolver, rechazar) => {
    const datos = new FormData()
    Object.entries(firma.campos).forEach(([clave, valor]) => datos.append(clave, valor))
    datos.append('file', blob, blob.type === 'image/webp' ? 'foto.webp' : 'foto.jpg')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', firma.url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && alProgresar) alProgresar(e.loaded / e.total)
    }
    xhr.onload = () => {
      let respuesta = {}
      try {
        respuesta = JSON.parse(xhr.responseText)
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && respuesta.secure_url) {
        resolver(respuesta.secure_url)
      } else {
        rechazar(new Error(respuesta.error?.message || 'Cloudinary rechazó la foto.'))
      }
    }
    xhr.onerror = () => rechazar(new Error('Sin conexión con Cloudinary.'))
    xhr.send(datos)
  })
}
