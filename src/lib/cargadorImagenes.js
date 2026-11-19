'use client'

// Cargador de next/image (ver next.config.js → images.loaderFile).
// Pide a Cloudinary el ancho exacto que el navegador necesita, en el mejor formato
// que soporte (avif/webp/jpg) y con calidad automática.
// Así no se usa el optimizador de imágenes del hosting, que tiene cupo propio.
import { esCloudinary, transformar } from './imagenes'

export default function cargadorImagenes({ src, width }) {
  if (!esCloudinary(src)) return src
  return transformar(src, `f_auto,q_auto,w_${width},c_limit`)
}
