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
    <Link href={`/gorra/${gorra.id}`} style={{ textDecoration: 'none' }}>
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
          borderRadius: '2px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 20px 60px rgba(30,107,82,0.1)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          position: 'relative',
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
            borderRadius: '1px',
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
        <div style={{ padding: 'clamp(14px, 2vw, 20px)' }}>

          {/* Colección */}
          <p style={{
            fontSize: '9px',
            color: 'var(--color-green)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '600',
          }}>
            {gorra.coleccion}
          </p>

          {/* Nombre */}
          <h3 style={{
            fontSize: 'clamp(13px, 1.8vw, 16px)',
            fontWeight: '700',
            color: 'var(--color-white)',
            marginBottom: '6px',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
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
              borderRadius: '1px',
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
            {agotado ? 'Sin Stock' : proximo ? 'Proximamente' : 'Comprar Ahora'}
          </button>

        </div>
      </motion.div>
    </Link>
  )
}