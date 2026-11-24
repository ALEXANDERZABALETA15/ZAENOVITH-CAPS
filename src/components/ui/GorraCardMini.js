'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrecio, porcentajeDescuento } from '@/lib/precio'
import { estiloBadge, textoBadge, mostrarBadge } from '@/lib/badges'
import { rutaGorra } from '@/lib/rutas'

const estiloEtiqueta = {
  position: 'absolute',
  top: '8px',
  fontSize: '9px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '3px 7px',
  borderRadius: '4px',
  fontFamily: 'var(--font-inter)',
}

export default function GorraCardMini({ gorra }) {
  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'
  const descuento = agotado ? null : porcentajeDescuento(gorra.precio, gorra.precioAnterior)
  const badge = estiloBadge(gorra.badge)

  return (
    <Link
      href={rutaGorra(gorra)}
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
          <Image
            src={gorra.fotos[0]}
            alt={gorra.nombre}
            fill
            sizes="(max-width: 600px) 50vw, 220px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              filter: agotado ? 'grayscale(70%) brightness(0.7)' : 'none',
            }}
          />

          {mostrarBadge(gorra) && (
            <span style={{ ...estiloEtiqueta, left: '8px', backgroundColor: badge.bg, color: badge.color }}>
              {textoBadge(gorra.badge)}
            </span>
          )}

          {descuento && (
            <span style={{ ...estiloEtiqueta, right: '8px', backgroundColor: '#f87171', color: '#0a0a0a', fontSize: '10px', letterSpacing: '0.04em' }}>
              -{descuento}%
            </span>
          )}

          {agotado && (
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid var(--color-silver)',
              backgroundColor: 'rgba(10,10,10,0.6)',
              color: 'var(--color-white)',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '5px 10px',
              fontFamily: 'var(--font-inter)',
              whiteSpace: 'nowrap',
            }}>
              Agotada
            </span>
          )}
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
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            flexWrap: 'wrap',
            margin: 0,
            fontFamily: 'var(--font-inter)',
          }}>
            <span style={{
              fontSize: 'clamp(12px, 1.6vw, 14px)',
              fontWeight: '700',
              color: agotado ? 'var(--color-gray)' : 'var(--color-green-text)',
            }}>
              {formatPrecio(gorra.precio)}
            </span>
            {gorra.precioAnterior && !agotado && (
              <span style={{ fontSize: '11px', color: 'var(--color-gray)', textDecoration: 'line-through' }}>
                {formatPrecio(gorra.precioAnterior)}
              </span>
            )}
            {proximo && (
              <span style={{ fontSize: '10px', color: 'var(--color-silver)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Próximamente
              </span>
            )}
          </p>
        </div>

      </div>
    </Link>
  )
}
