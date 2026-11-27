export const badgeColors = {
  Nuevo:        { bg: '#1a3a2a', color: '#4ade80' },
  Destacado:    { bg: '#1a2a3a', color: '#c7c7c7' },
  Oferta:       { bg: '#3a1a1a', color: '#f87171' },
  Exclusivo:    { bg: '#0f2a1f', color: '#3fb68b' },
  Proximamente: { bg: '#1a1a2a', color: '#c7c7c7' },
}

const badgeTexto = {
  Proximamente: 'Próximamente',
}

export function estiloBadge(badge) {
  return badgeColors[badge] || badgeColors.Destacado
}

export function textoBadge(badge) {
  return badgeTexto[badge] || badge
}

// El estado agotado se comunica con su propio sello; el badge "Agotado" no se repite.
export function mostrarBadge(gorra) {
  return Boolean(gorra.badge) && gorra.estado !== 'agotado' && gorra.badge !== 'Agotado'
}

// En oferta y a la venta: la lista de /ofertas y las gorras que llevan el sello de temporada
export function esOferta(gorra) {
  return gorra.badge === 'Oferta' && gorra.estado === 'activo'
}

// Verde de la marca en degradado: el texto blanco pasa AA en todo el badge
const estiloTemporada = { bg: 'linear-gradient(135deg, #1e6b52, #164d3b)', color: '#ffffff' }

// Texto y colores del badge. Durante una temporada (src/lib/temporadas.js)
// las ofertas llevan su nombre: "Black Friday" en vez de "Oferta".
export function badgeDeGorra(gorra, temporada) {
  if (temporada?.etiquetaOferta && esOferta(gorra)) {
    return { texto: temporada.etiquetaOferta, estilo: estiloTemporada }
  }
  return { texto: textoBadge(gorra.badge), estilo: estiloBadge(gorra.badge) }
}
