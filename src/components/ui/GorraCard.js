'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { nombreColeccion } from '@/lib/colecciones'
import { whatsappLink, mensajePedido } from '@/lib/contacto'
import AvisoModal from './AvisoModal'

const badgeColors = {
  Nuevo:        { bg: '#1a3a2a', color: '#4ade80' },
  Destacado:    { bg: '#1a2a3a', color: '#c7c7c7' },
  Oferta:       { bg: '#3a1a1a', color: '#f87171' },
  Exclusivo:    { bg: '#0f2a1f', color: '#3fb68b' },
  Proximamente: { bg: '#1a1a2a', color: '#c7c7c7' },
}

const badgeTexto = {
  Proximamente: 'Próximamente',
}

function formatPrecio(precio) {
  return precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })
}

function porcentajeDescuento(precio, precioAnterior) {
  if (!precioAnterior || precioAnterior <= precio) return null
  return Math.round((1 - precio / precioAnterior) * 100)
}

const estiloCta = {
  width: '100%',
  padding: 'clamp(10px, 1.5vw, 13px)',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  transition: 'all 0.3s ease',
  fontFamily: 'var(--font-inter)',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  textAlign: 'center',
  lineHeight: '1.3',
}

export default function GorraCard({ gorra }) {
  const [isHovered, setIsHovered] = useState(false)
  const [avisoAbierto, setAvisoAbierto] = useState(false)

  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'
  const href = `/gorra/${gorra.id}`

  // El sello "Agotado" sobre la foto reemplaza al badge
  const mostrarBadge = gorra.badge && !agotado && gorra.badge !== 'Agotado'
  const badge = badgeColors[gorra.badge] || badgeColors.Destacado
  const descuento = agotado ? null : porcentajeDescuento(gorra.precio, gorra.precioAnterior)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--color-black-card)',
        border: isHovered
          ? '1px solid rgba(30,107,82,0.5)'
          : '1px solid rgba(199,199,199,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(30,107,82,0.1)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Imagen */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '1/1',
          flexShrink: 0,
        }}>
          <img
            src={gorra.fotos[0]}
            alt={gorra.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              filter: agotado ? 'grayscale(70%) brightness(0.7)' : 'none',
              display: 'block',
            }}
          />

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: isHovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.3s ease',
          }} />

          {/* Badge */}
          {mostrarBadge && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: '4px',
              fontFamily: 'var(--font-inter)',
            }}>
              {badgeTexto[gorra.badge] || gorra.badge}
            </div>
          )}

          {/* Descuento */}
          {descuento && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#f87171',
              color: '#0a0a0a',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.05em',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-inter)',
            }}>
              -{descuento}%
            </div>
          )}

          {/* Sello agotado */}
          {agotado && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                border: '1px solid var(--color-silver)',
                color: 'var(--color-white)',
                backgroundColor: 'rgba(10,10,10,0.6)',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                fontFamily: 'var(--font-inter)',
              }}>
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Información */}
        <div style={{
          padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px) 14px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>

          {/* Colección */}
          <p style={{
            fontSize: '10px',
            color: 'var(--color-green-text)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '600',
          }}>
            {nombreColeccion(gorra.coleccion)}
          </p>

          {/* Nombre */}
          <h3 style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)',
            fontWeight: '700',
            color: 'var(--color-white)',
            marginBottom: '12px',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: '1.4',
            minHeight: '40px',
          }}>
            {gorra.nombre}
          </h3>

          {/* Precio */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: 'auto',
          }}>
            <span style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              fontWeight: '700',
              color: agotado ? 'var(--color-gray)' : 'var(--color-green)',
              fontFamily: 'var(--font-inter)',
            }}>
              {formatPrecio(gorra.precio)}
            </span>

            {gorra.precioAnterior && (
              <span style={{
                fontSize: '12px',
                color: 'var(--color-gray)',
                textDecoration: 'line-through',
                fontFamily: 'var(--font-inter)',
                fontWeight: '300',
              }}>
                {formatPrecio(gorra.precioAnterior)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* CTA: fuera del Link para no anidar elementos interactivos.
          Toda la card lleva al detalle; el botón es el atajo a WhatsApp. */}
      <div style={{ padding: '0 clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px)' }}>
        {proximo || agotado ? (
          <button
            type="button"
            onClick={() => setAvisoAbierto(true)}
            aria-haspopup="dialog"
            style={{
              ...estiloCta,
              backgroundColor: 'transparent',
              color: 'var(--color-white)',
              border: '1px solid var(--color-green)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <IconoCampana />
            {proximo ? 'Avísame cuando llegue' : 'Avísame si vuelve'}
          </button>
        ) : (
          <a
            href={whatsappLink(mensajePedido(gorra))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar ${gorra.nombre} por WhatsApp`}
            style={{
              ...estiloCta,
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-white)',
              fontWeight: '700',
              padding: 'clamp(12px, 1.6vw, 14px)',
              boxShadow: '0 6px 20px rgba(30,107,82,0.25)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green-dark)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
          >
            <IconoWhatsApp />
            Comprar
          </a>
        )}
      </div>

      {/* Fuera del Link: los clics dentro del portal burbujean por el árbol de React */}
      {avisoAbierto && (
        <AvisoModal
          gorra={gorra}
          tipo={proximo ? 'llegada' : 'restock'}
          onCerrar={() => setAvisoAbierto(false)}
        />
      )}
    </motion.div>
  )
}

function IconoWhatsApp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '16px', height: '16px', flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.5.5 0 00.611.61l5.638-1.447A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.034-1.378l-.361-.214-3.737.959.986-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
    </svg>
  )
}

function IconoCampana() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: '15px', height: '15px', flexShrink: 0 }}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
