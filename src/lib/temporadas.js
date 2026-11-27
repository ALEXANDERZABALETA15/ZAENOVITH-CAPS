// Temporadas comerciales (Black Friday, Navidad...): mientras duran, toda la tienda se pone en modo
// temporada sin cambiar los colores de la marca: barra superior con contador, sello junto al logo,
// en las gorras en oferta, en su ficha y en el pie de página, y el panel del home.
//
// Cada temporada es una entrada de TEMPORADAS. Para la próxima se agrega otra entrada con sus
// fechas y textos; los componentes no se tocan. Se enciende y se apaga sola según la fecha
// (hora de Colombia, UTC-5), también en páginas que vienen de caché (ver TemporadaContext.js).
//
// Vista previa antes de que empiece: NEXT_PUBLIC_VISTA_TEMPORADA=<id> en .env.local
// (ej. NEXT_PUBLIC_VISTA_TEMPORADA=navidad) y reiniciar el servidor. Nunca en producción.

export const TEMPORADAS = [
  {
    id: 'black-friday',
    nombre: 'Black Friday',
    inicio: '2026-11-27T00:00:00-05:00',
    fin: '2026-11-30T23:59:59-05:00',
    etiqueta: 'Black Week · 27 al 30 de noviembre',
    // Para lectores de pantalla, en vez del contador que cambia cada segundo
    cierre: 'el lunes 30 de noviembre a las 11:59 p. m.',
    // Cuenta regresiva hasta `fin` en la barra, en la ficha de las ofertas y en el panel del home
    contador: true,

    // Barra superior de todas las páginas. Sin contador muestra `texto` en su lugar
    barra: {
      titulo: 'Black Friday',
      extra: 'en CROWNLUX',
      enlace: { texto: 'Ver ofertas', href: '/ofertas' },
    },

    // Sello circular: texto del anillo y monograma del centro (o icono: 'estrella')
    sello: { anillo: 'BLACK FRIDAY · CROWNLUX · 2026 ·', centro: 'BF' },

    // Las gorras con etiqueta «Oferta» la muestran con este nombre y llevan el sello
    etiquetaOferta: 'Black Friday',
    precioOferta: 'Precio Black Friday',

    // Panel del home (PanelTemporada.js): primera palabra en contorno, segunda en metal.
    // Sin panel, quitar esta línea.
    panel: { titulo: ['Black', 'Friday'] },
  },

  // Plantilla para Navidad (ajustar fechas y textos, y descomentar):
  // {
  //   id: 'navidad',
  //   nombre: 'Navidad',
  //   inicio: '2026-12-01T00:00:00-05:00',
  //   fin: '2026-12-24T23:59:59-05:00',
  //   etiqueta: 'Navidad en CROWNLUX',
  //   cierre: 'el 24 de diciembre a las 11:59 p. m.',
  //   contador: false,
  //   barra: { titulo: 'Navidad', extra: 'en CROWNLUX', texto: 'Envío gratis en Ibagué', enlace: { texto: 'Ver catálogo', href: '/#catalogo' } },
  //   sello: { anillo: 'NAVIDAD · CROWNLUX · 2026 ·', icono: 'estrella', colores: { borde: '#d9b871', interior: '#d9b871', texto: '#e8cf94', centro: '#e8cf94' } },
  //   etiquetaOferta: 'Navidad',
  //   precioOferta: 'Precio de Navidad',
  // },
]

// La temporada que está corriendo (o la de la vista previa), o null
export function temporadaActiva(ahora = Date.now()) {
  const vista = process.env.NEXT_PUBLIC_VISTA_TEMPORADA
  return TEMPORADAS.find((t) => (
    ahora < Date.parse(t.fin) && (ahora >= Date.parse(t.inicio) || t.id === vista)
  )) ?? null
}

export function temporadaPorId(id) {
  return TEMPORADAS.find((t) => t.id === id) ?? null
}
