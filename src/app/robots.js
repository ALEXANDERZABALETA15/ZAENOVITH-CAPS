import { SITIO_URL } from '@/lib/contacto'   // La dirección oficial

export default function robots() {
  return {
    rules: {
      userAgent: '*',   // Aplica a todos los buscadores (Google, Bing...)
      allow: '/',       // Pueden revisar todo el sitio
      disallow: ['/admin', '/api/'],   // Menos el panel de administración y los endpoints internos
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,   // Dónde está la lista de páginas
  }
}