// Datos comunes de SEO y de vista previa al compartir.
// Ojo: en Next, si una página define `openGraph` o `twitter`, REEMPLAZA el bloque del layout
// completo (no lo mezcla). Por eso cada página arma el suyo con metadatosPagina().
import { urlCompartir } from './imagenes'
import { SITIO_URL, WHATSAPP_NUMERO } from './contacto'

export const REDES_SOCIALES = [
  'https://www.instagram.com/crownlux.co/',
  'https://www.tiktok.com/@crownluxco',
]

const IMAGEN_MARCA = 'https://res.cloudinary.com/dg4kazsno/image/upload/v1787713702/Modifying_logo_in_image_2K_202608202128_uutkt2.jpg'

export const NOMBRE_SITIO = 'CROWNLUX'
export const TITULO_SITIO = 'CROWNLUX — Gorras Premium en Colombia'
export const DESCRIPCION_SITIO = 'Tienda online de gorras premium: New Era, Supreme, Kith y más. Ediciones exclusivas y limitadas con envíos a toda Colombia. Calidad original garantizada.'

// 1200×630 en JPG liviano (~130 KB): WhatsApp no muestra vistas previas pesadas
export const IMAGEN_COMPARTIR_SITIO = {
  url: urlCompartir(IMAGEN_MARCA),
  width: 1200,
  height: 630,
  alt: 'CROWNLUX — Premium Caps',
}

// ruta: '/novedades', '/gorra/new-era-…-12'… (metadataBase del layout la completa con el dominio)
export function metadatosPagina({ titulo, descripcion, ruta, imagen = IMAGEN_COMPARTIR_SITIO }) {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: ruta,
      siteName: NOMBRE_SITIO,
      images: [imagen],
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [imagen.url],
    },
  }
}

// ---------- Datos estructurados (schema.org) ----------
// Google los usa para entender la tienda y mostrar resultados enriquecidos.

// Para <script type="application/ld+json">: se escapa "<" para que ningún texto
// de la base pueda cerrar la etiqueta <script>
export function jsonLd(datos) {
  return { __html: JSON.stringify(datos).replace(/</g, '\\u003c') }
}

// Home: quién es la tienda y cómo contactarla
export function datosTienda() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      '@id': `${SITIO_URL}/#tienda`,
      name: NOMBRE_SITIO,
      url: SITIO_URL,
      description: DESCRIPCION_SITIO,
      sameAs: REDES_SOCIALES,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: `+${WHATSAPP_NUMERO}`,
        areaServed: 'CO',
        availableLanguage: 'es',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITIO_URL}/#sitio`,
      name: NOMBRE_SITIO,
      url: SITIO_URL,
      inLanguage: 'es-CO',
      publisher: { '@id': `${SITIO_URL}/#tienda` },
    },
  ]
}

// Migas de pan: Google las muestra en el resultado en vez de la URL.
// migas: [{ nombre, ruta }]; la última es la página actual.
export function datosMigas(migas) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((miga, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: miga.nombre,
      item: `${SITIO_URL}${miga.ruta}`,
    })),
  }
}
