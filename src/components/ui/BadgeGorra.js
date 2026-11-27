'use client'

import { useTemporada } from '@/lib/TemporadaContext'
import { badgeDeGorra, mostrarBadge } from '@/lib/badges'

const estiloBase = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: '4px',
  fontFamily: 'var(--font-inter)',
}

// Badge de la gorra (Nuevo, Oferta...). En temporada, las ofertas llevan el nombre de la temporada.
// `style` agrega la posición o el tamaño de cada lugar donde se usa.
export default function BadgeGorra({ gorra, style }) {
  const temporada = useTemporada()
  if (!mostrarBadge(gorra)) return null

  const { texto, estilo } = badgeDeGorra(gorra, temporada)
  return (
    <span style={{ ...estiloBase, background: estilo.bg, color: estilo.color, ...style }}>
      {texto}
    </span>
  )
}
