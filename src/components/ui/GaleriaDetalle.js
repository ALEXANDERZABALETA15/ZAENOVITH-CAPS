'use client'

import { useState } from 'react'
import Image from 'next/image'

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
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden',
          marginBottom: '12px',
          borderRadius: '2px',
          border: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        <img
          src={fotos[fotoActual]}
          alt={nombre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          priority
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
              position: 'relative',
              aspectRatio: '1/1',
              overflow: 'hidden',
              borderRadius: '2px',
              border: fotoActual === index
                ? '1px solid rgba(201,168,76,0.8)'
                : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: fotoActual === index ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (fotoActual !== index) {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (fotoActual !== index) {
                e.currentTarget.style.opacity = '0.6'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              }
            }}
          >
            <img
              src={foto}
              alt={`${nombre} vista ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 15vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

    </div>
  )
}