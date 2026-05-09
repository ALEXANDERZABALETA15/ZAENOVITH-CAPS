'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'


const badgeColors = {
  Nuevo:        { bg: '#1a472a', color: '#4ade80' },
  Destacado:    { bg: '#1a3a5c', color: '#60a5fa' },
  Oferta:       { bg: '#4a1a1a', color: '#f87171' },
  Agotado:      { bg: '#2a2a2a', color: '#888888' },
  Exclusivo:    { bg: '#3a2a0a', color: '#C9A84C' },
  Proximamente: { bg: '#2a1a3a', color: '#c084fc' },
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
    <Link
    href={`/gorra/${gorra.id}`}
    style={{ textDecoration: 'none' }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--color-black-card)',
        border: isHovered
          ? '1px solid rgba(201,168,76,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '2px',
        overflow: 'hidden',
        transition: 'border 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(201,168,76,0.12)'
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

      {/* Imagen con zoom */}
<div
  style={{
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: '1/1',
  }}
>
  <img
  src={gorra.fotos[fotoActual]}
  alt={gorra.nombre}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    filter: agotado ? 'grayscale(60%)' : 'none',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
  }}
/>

  {/* Overlay oscuro en hover */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0)',
      transition: 'background-color 0.3s ease',
      ...(isHovered && {
        backgroundColor: 'rgba(0,0,0,0.15)',
      }),
    }}
  />

  {/* Badge */}
  <div
    style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: badge.bg,
      color: badge.color,
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: '2px',
      fontFamily: 'var(--font-inter)',
    }}
  >
    {gorra.badge}
  </div>

  {/* Puntos indicadores */}
  <div
    style={{
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '6px',
    }}
  >
    {gorra.fotos.map((_, index) => (
      <button
        key={index}
        onClick={(e) => {
          e.stopPropagation()
          setFotoActual(index)
        }}
        style={{
          width: fotoActual === index ? '20px' : '6px',
          height: '6px',
          borderRadius: '3px',
          backgroundColor:
            fotoActual === index
              ? 'var(--color-gold)'
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
          fontSize: '10px',
          color: 'var(--color-gold)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '6px',
          fontFamily: 'var(--font-inter)',
          fontWeight: '600',
        }}>
          {gorra.coleccion}
        </p>

        {/* Nombre */}
        <h3 style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          fontWeight: '700',
          color: 'var(--color-white)',
          marginBottom: '6px',
          fontFamily: 'var(--font-playfair)',
          letterSpacing: '0.03em',
        }}>
          {gorra.nombre}
        </h3>

        {/* Descripción */}
        <p style={{
          fontSize: 'clamp(11px, 1.5vw, 13px)',
          color: 'var(--color-gray)',
          lineHeight: '1.6',
          marginBottom: '14px',
          fontFamily: 'var(--font-inter)',
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
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: '700',
            color: agotado ? 'var(--color-gray)' : 'var(--color-gold)',
            fontFamily: 'var(--font-inter)',
          }}>
            {formatPrecio(gorra.precio)}
          </span>

          {gorra.precioAnterior && (
            <span style={{
              fontSize: '13px',
              color: 'var(--color-gray)',
              textDecoration: 'line-through',
              fontFamily: 'var(--font-inter)',
            }}>
              {formatPrecio(gorra.precioAnterior)}
            </span>
          )}
        </div>

        {/* Botón comprar */}
        <button
          disabled={agotado || proximo}
          style={{
            width: '100%',
            padding: 'clamp(10px, 1.5vw, 13px)',
            backgroundColor: agotado || proximo
              ? 'transparent'
              : 'var(--color-gold)',
            color: agotado || proximo
              ? 'var(--color-gray)'
              : 'var(--color-black)',
            border: agotado || proximo
              ? '1px solid rgba(255,255,255,0.1)'
              : 'none',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: agotado || proximo ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-inter)',
            borderRadius: '2px',
          }}
          onMouseEnter={(e) => {
            if (!agotado && !proximo) {
              e.currentTarget.style.backgroundColor = 'var(--color-gold-light)'
            }
          }}
          onMouseLeave={(e) => {
            if (!agotado && !proximo) {
              e.currentTarget.style.backgroundColor = 'var(--color-gold)'
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