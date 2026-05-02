'use client'

import { useState } from 'react'

function formatPrecio(precio) {
  return precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })
}

export default function ProductDetail({ gorra }) {
  const [fotoPrincipal, setFotoPrincipal] = useState(0)

  const comprarWhatsApp = () => {
    const mensaje = `
Hola, quiero comprar la gorra ${gorra.nombre}
Color: ${gorra.color}
Precio: ${formatPrecio(gorra.precio)}
`

    const url = `https://wa.me/573001112233?text=${encodeURIComponent(mensaje)}`

    window.open(url, '_blank')
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-black)',
        padding: '140px clamp(16px, 5vw, 60px) 80px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}
      >

        {/* GALERÍA */}
        <div>

          {/* Imagen principal */}
          <div
            style={{
              backgroundColor: 'var(--color-black-card)',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <img
              src={gorra.fotos[fotoPrincipal]}
              alt={gorra.nombre}
              style={{
                width: '100%',
                height: '700px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Miniaturas */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {gorra.fotos.map((foto, index) => (
              <button
                key={index}
                onClick={() => setFotoPrincipal(index)}
                style={{
                  border:
                    fotoPrincipal === index
                      ? '2px solid var(--color-gold)'
                      : '1px solid rgba(255,255,255,0.1)',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  width: '90px',
                  height: '90px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={foto}
                  alt={gorra.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div>

          <p
            style={{
              color: 'var(--color-gold)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            {gorra.coleccion}
          </p>

          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: '1',
              marginBottom: '20px',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            {gorra.nombre}
          </h1>

          <p
            style={{
              fontSize: '32px',
              color: 'var(--color-gold)',
              fontWeight: '700',
              marginBottom: '24px',
            }}
          >
            {formatPrecio(gorra.precio)}
          </p>

          <p
            style={{
              color: 'var(--color-gray)',
              lineHeight: '1.8',
              fontSize: '15px',
              marginBottom: '32px',
              maxWidth: '500px',
            }}
          >
            {gorra.descripcion}
          </p>

          {/* COLOR */}
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                color: 'white',
                marginBottom: '12px',
                fontWeight: '600',
              }}
            >
              Color
            </p>

            <div
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 20px',
                color: 'var(--color-white)',
              }}
            >
              {gorra.color}
            </div>
          </div>

          {/* BOTÓN */}
          <button
            onClick={comprarWhatsApp}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '18px',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-black)',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Comprar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}