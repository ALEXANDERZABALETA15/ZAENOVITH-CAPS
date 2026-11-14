'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// IMPORTANTE: estas reseñas deben ser de clientes reales y verificables (Ley 1480).
// Reemplazar por reseñas reales (capturas de WhatsApp/Instagram, Google) antes de promocionar.
const resenas = [
  {
    id: 1,
    nombre: 'Santiago M.',
    ciudad: 'Bogotá',
    estrellas: 5,
    comentario: 'Increíble calidad, la gorra llegó perfecta y el bordado es de otro nivel. Definitivamente volveré a comprar.',
    gorra: 'Gold Edition',
  },
  {
    id: 2,
    nombre: 'Valentina R.',
    ciudad: 'Medellín',
    estrellas: 5,
    comentario: 'Súper rápido el envío y la atención por WhatsApp fue excelente. La gorra es exactamente como en las fotos.',
    gorra: 'LA Curva',
  },
  {
    id: 3,
    nombre: 'Andres P.',
    ciudad: 'Cali',
    estrellas: 5,
    comentario: 'Me encantó el diseño exclusivo. Mis amigos me preguntan dónde la compré. Total recomendado.',
    gorra: 'NY Snapback',
  },
  {
    id: 4,
    nombre: 'Camila T.',
    ciudad: 'Ibagué',
    estrellas: 5,
    comentario: 'La mejor tienda de gorras que he encontrado. Calidad premium a buen precio. Muy feliz con mi compra.',
    gorra: 'Retro Vintage',
  },
  {
    id: 5,
    nombre: 'Felipe G.',
    ciudad: 'Barranquilla',
    estrellas: 5,
    comentario: 'Excelente experiencia de compra. El empaque es muy elegante y la gorra superó mis expectativas.',
    gorra: 'Urban Street',
  },
  {
    id: 6,
    nombre: 'Isabella C.',
    ciudad: 'Pereira',
    estrellas: 5,
    comentario: 'La gorra Chrome Hearts es una obra de arte. Vale cada peso. Envío rápido y seguro.',
    gorra: 'Chrome Hearts',
  },
]

function Estrellas({ cantidad }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: cantidad }).map((_, i) => (
        <span key={i} style={{ color: 'var(--color-green-text)', fontSize: '14px' }}>★</span>
      ))}
    </div>
  )
}

export default function Resenas() {
  const [activa, setActiva] = useState(0)

  function siguiente() {
    setActiva((prev) => (prev + 1) % resenas.length)
  }

  function anterior() {
    setActiva((prev) => (prev - 1 + resenas.length) % resenas.length)
  }

  const resena = resenas[activa]

  return (
    <section style={{
      backgroundColor: 'var(--color-black)',
      padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 56px)' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
            <p style={{
              fontSize: '11px',
              color: 'var(--color-green-text)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Lo Que Dicen Nuestros Clientes
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Clientes Satisfechos
          </h2>

        </motion.div>

        {/* Carrusel */}
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>

          <motion.div
            key={activa}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: 'var(--color-black-card)',
              border: '1px solid rgba(199,199,199,0.08)',
              borderRadius: '2px',
              padding: 'clamp(24px, 4vw, 48px)',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <p style={{
              fontSize: '48px',
              color: 'var(--color-green-text)',
              lineHeight: '1',
              marginBottom: '16px',
              opacity: 0.4,
              fontFamily: 'serif',
            }}>
              
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Estrellas cantidad={resena.estrellas} />
            </div>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'var(--color-silver)',
              lineHeight: '1.8',
              fontFamily: 'var(--font-inter)',
              fontStyle: 'italic',
              fontWeight: '300',
              marginBottom: '24px',
            }}>
              {resena.comentario}
            </p>

            <div style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-green)',
              margin: '0 auto 20px',
            }} />

            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-inter)',
              marginBottom: '4px',
            }}>
              {resena.nombre}
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
              fontWeight: '300',
            }}>
              {resena.ciudad} · {resena.gorra}
            </p>
          </motion.div>

          {/* Controles */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}>
            <button
              onClick={anterior}
              aria-label="Reseña anterior"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(199,199,199,0.2)',
                color: 'var(--color-silver)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-green)'
                e.currentTarget.style.borderColor = 'var(--color-green)'
                e.currentTarget.style.color = 'var(--color-white)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(199,199,199,0.2)'
                e.currentTarget.style.color = 'var(--color-silver)'
              }}
            >
              ←
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {resenas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiva(index)}
                  aria-label={`Ver reseña ${index + 1}`}
                  style={{
                    width: activa === index ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: activa === index
                      ? 'var(--color-green)'
                      : 'rgba(199,199,199,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={siguiente}
              aria-label="Reseña siguiente"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(199,199,199,0.2)',
                color: 'var(--color-silver)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-green)'
                e.currentTarget.style.borderColor = 'var(--color-green)'
                e.currentTarget.style.color = 'var(--color-white)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(199,199,199,0.2)'
                e.currentTarget.style.color = 'var(--color-silver)'
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}