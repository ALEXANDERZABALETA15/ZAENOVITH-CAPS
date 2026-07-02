'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const badgeColors = {
  Nuevo:        { bg: '#1a3a2a', color: '#4ade80' },
  Destacado:    { bg: '#1a2a3a', color: '#c7c7c7' },
  Oferta:       { bg: '#3a1a1a', color: '#f87171' },
  Agotado:      { bg: '#2a2a2a', color: '#7a7a7a' },
  Exclusivo:    { bg: '#0f2a1f', color: '#1e6b52' },
  Proximamente: { bg: '#1a1a2a', color: '#c7c7c7' },
}

function formatPrecio(precio) {
  return precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })
}

export default function GorraCard({ gorra }) {
  const [fotoActual, setFotoActual] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const badge = badgeColors[gorra.badge] || badgeColors['Nuevo']
  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'

  return (
    <Link href={`/gorra/${gorra.id}`} style={{ textDecoration: 'none', height: '100%' }}>
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
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setFotoActual(0)
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
            src={gorra.fotos[fotoActual]}
            alt={gorra.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              filter: agotado ? 'grayscale(60%)' : 'none',
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
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: badge.bg,
            color: badge.color,
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '4px',
            fontFamily: 'var(--font-inter)',
          }}>
            {gorra.badge}
          </div>

          {/* Puntos indicadores */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
          }}>
            {gorra.fotos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setFotoActual(index)
                }}
                style={{
                  width: fotoActual === index ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: fotoActual === index
                    ? 'var(--color-green)'
                    : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Información */}
        <div style={{
          padding: 'clamp(14px, 2vw, 20px)',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>

          {/* Colección */}
          <p style={{
            fontSize: '9px',
            color: 'var(--color-green)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '600',
          }}>
            {gorra.coleccion}
          </p>

          {/* Nombre */}
          <h3 style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)',
            fontWeight: '700',
            color: 'var(--color-white)',
            marginBottom: '8px',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: '1.4',
            minHeight: '40px',
          }}>
            {gorra.nombre}
          </h3>

          {/* Descripción */}
          <p style={{
            fontSize: 'clamp(11px, 1.5vw, 12px)',
            color: 'var(--color-gray)',
            lineHeight: '1.6',
            marginBottom: '14px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}>
            {gorra.descripcion}
          </p>

          {/* Precio */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <span style={{
              fontSize: 'clamp(14px, 2vw, 17px)',
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

          {/* Botón */}
          <button
            disabled={agotado || proximo}
            style={{
              width: '100%',
              padding: 'clamp(10px, 1.5vw, 13px)',
              backgroundColor: agotado || proximo
                ? 'transparent'
                : 'var(--color-green)',
              color: agotado || proximo
                ? 'var(--color-gray)'
                : 'var(--color-white)',
              border: agotado || proximo
                ? '1px solid rgba(199,199,199,0.1)'
                : 'none',
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: agotado || proximo ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
              borderRadius: '6px',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!agotado && !proximo) {
                e.currentTarget.style.backgroundColor = 'var(--color-green-light)'
              }
            }}
            onMouseLeave={(e) => {
              if (!agotado && !proximo) {
                e.currentTarget.style.backgroundColor = 'var(--color-green)'
              }
            }}
          >
              {agotado ? 'Sin Stock' : proximo ? 'Proximamente' : (
              <>
                Comprar Ahora
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: '14px', height: '14px', flexShrink: 0 }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.5.5 0 00.611.61l5.638-1.447A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.034-1.378l-.361-.214-3.737.959.986-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </Link>
  )
}