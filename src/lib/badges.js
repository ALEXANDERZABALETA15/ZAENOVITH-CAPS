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
