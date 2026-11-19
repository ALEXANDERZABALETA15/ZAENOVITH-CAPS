/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las fotos las optimiza Cloudinary (src/lib/cargadorImagenes.js), no el hosting:
    // el optimizador de Vercel/Netlify tiene cupo propio y descargaría cada original otra vez.
    loader: 'custom',
    loaderFile: './src/lib/cargadorImagenes.js',
    // Anchos permitidos. Pocos a propósito: cada ancho nuevo por foto es una transformación
    // de Cloudinary. Cubren celular, tablet, escritorio y pantallas de alta densidad.
    deviceSizes: [480, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
}

module.exports = nextConfig
