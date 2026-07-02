'use client'

import { useState } from 'react'

export default function GaleriaDetalle({ fotos, nombre }) {
  const [fotoActual, setFotoActual] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div>

      {/* Imagen principal */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden',
          marginBottom: '12px',
          borderRadius: '2px',
          border: '1px solid rgba(199,199,199,0.08)',
        }}
      >
        <img
          src={fotos[fotoActual]}
          alt={nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            display: 'block',
          }}
        />
      </div>

      {/* Miniaturas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${fotos.length}, 1fr)`,
        gap: '8px',
      }}>
        {fotos.map((foto, index) => (
          <div
            key={index}
            onClick={() => setFotoActual(index)}
            style={{
              aspectRatio: '1/1',
              overflow: 'hidden',
              borderRadius: '2px',
              border: fotoActual === index
                ? '1px solid var(--color-green)'
                : '1px solid rgba(199,199,199,0.06)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: fotoActual === index ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (fotoActual !== index) {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.borderColor = 'rgba(30,107,82,0.5)'
              }
            }}
            onMouseLeave={(e) => {
              if (fotoActual !== index) {
                e.currentTarget.style.opacity = '0.6'
                e.currentTarget.style.borderColor = 'rgba(199,199,199,0.06)'
              }
            }}
          >
            <img
              src={foto}
              alt={`${nombre} vista ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

    </div>
  )
}