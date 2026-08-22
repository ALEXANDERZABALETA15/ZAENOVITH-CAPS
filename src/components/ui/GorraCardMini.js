'use client'

import Link from 'next/link'

function formatPrecio(precio) {
  return precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })
}

export default function GorraCardMini({ gorra }) {
  const agotado = gorra.estado === 'agotado'

  return (
    <Link
      href={`/gorra/${gorra.id}`}
      style={{
        textDecoration: 'none',
        display: 'block',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      <div style={{
        backgroundColor: 'var(--color-black-card)',
        border: '1px solid rgba(199,199,199,0.08)',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'border 0.3s ease',
      }}>

        <div style={{
          position: 'relative',
          aspectRatio: '1/1',
          overflow: 'hidden',
        }}>
          <img
            src={gorra.fotos[0]}
            alt={gorra.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: agotado ? 'grayscale(60%)' : 'none',
            }}
          />
        </div>

        <div style={{ padding: '12px 14px' }}>
          <h3 style={{
            fontSize: 'clamp(11px, 1.5vw, 13px)',
            fontWeight: '600',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {gorra.nombre}
          </h3>
          <p style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)',
            fontWeight: '700',
            color: agotado ? 'var(--color-gray)' : 'var(--color-green)',
            fontFamily: 'var(--font-inter)',
            margin: 0,
          }}>
            {formatPrecio(gorra.precio)}
          </p>
        </div>

      </div>
    </Link>
  )
}