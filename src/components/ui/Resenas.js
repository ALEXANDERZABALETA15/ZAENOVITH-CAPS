'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const resenas = [
  {
    id: 1,
    nombre: 'Santiago M.',
    ciudad: 'Bogota',
    estrellas: 5,
    comentario: 'Increible calidad, la gorra llego perfecta y el bordado es de otro nivel. Definitivamente volvere a comprar.',
    gorra: 'Gold Edition',
    fecha: 'Hace 2 dias',
  },
  {
    id: 2,
    nombre: 'Valentina R.',
    ciudad: 'Medellin',
    estrellas: 5,
    comentario: 'Super rapido el envio y la atencion por WhatsApp fue excelente. La gorra es exactamente como en las fotos.',
    gorra: 'LA Curva',
    fecha: 'Hace 5 dias',
  },
  {
    id: 3,
    nombre: 'Andres P.',
    ciudad: 'Cali',
    estrellas: 5,
    comentario: 'Me encanto el diseno exclusivo. Mis amigos me preguntan donde la compre. Total recomendado.',
    gorra: 'NY Snapback',
    fecha: 'Hace 1 semana',
  },
  {
    id: 4,
    nombre: 'Camila T.',
    ciudad: 'Ibague',
    estrellas: 5,
    comentario: 'La mejor tienda de gorras que he encontrado. Calidad premium a buen precio. Muy feliz con mi compra.',
    gorra: 'Retro Vintage',
    fecha: 'Hace 2 semanas',
  },
  {
    id: 5,
    nombre: 'Felipe G.',
    ciudad: 'Barranquilla',
    estrellas: 5,
    comentario: 'Excelente experiencia de compra. El empaque es muy elegante y la gorra supero mis expectativas.',
    gorra: 'Urban Street',
    fecha: 'Hace 3 semanas',
  },
  {
    id: 6,
    nombre: 'Isabella C.',
    ciudad: 'Pereira',
    estrellas: 5,
    comentario: 'La gorra Gold Edition es una obra de arte. Vale cada peso. Envio rapido y seguro.',
    gorra: 'Gold Edition',
    fecha: 'Hace 1 mes',
  },
]

function Estrellas({ cantidad }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: cantidad }).map((_, i) => (
        <span key={i} style={{ color: '#C9A84C', fontSize: '14px' }}>★</span>
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
      backgroundColor: '#0a0a0a',
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
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C' }} />
            <p style={{
              fontSize: '11px',
              color: '#C9A84C',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Lo Que Dicen Nuestros Clientes
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: '#ffffff',
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '0.03em',
            marginBottom: '16px',
          }}>
            Clientes Satisfechos
          </h2>

          {/* Estadísticas */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(24px, 5vw, 56px)',
            flexWrap: 'wrap',
            marginTop: '24px',
          }}>
            {[
              { numero: '500+', label: 'Clientes felices' },
              { numero: '5.0', label: 'Calificacion promedio' },
              { numero: '100%', label: 'Recomendacion' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: '800',
                  color: '#C9A84C',
                  fontFamily: 'var(--font-playfair)',
                  lineHeight: '1',
                  marginBottom: '6px',
                }}>
                  {stat.numero}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#888',
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Carrusel de reseñas */}
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>

          {/* Reseña activa */}
          <motion.div
            key={activa}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: '#111111',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '2px',
              padding: 'clamp(24px, 4vw, 48px)',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            {/* Comillas decorativas */}
            <p style={{
              fontSize: '48px',
              color: '#C9A84C',
              lineHeight: '1',
              marginBottom: '16px',
              opacity: 0.4,
              fontFamily: 'serif',
            }}>
            </p>

            {/* Estrellas */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Estrellas cantidad={resena.estrellas} />
            </div>

            {/* Comentario */}
            <p style={{
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#cccccc',
              lineHeight: '1.8',
              fontFamily: 'var(--font-inter)',
              fontStyle: 'italic',
              marginBottom: '24px',
            }}>
              {resena.comentario}
            </p>

            {/* Separador */}
            <div style={{
              width: '40px',
              height: '1px',
              backgroundColor: '#C9A84C',
              margin: '0 auto 20px',
            }} />

            {/* Info cliente */}
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                fontFamily: 'var(--font-inter)',
                marginBottom: '4px',
              }}>
                {resena.nombre}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#888',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.1em',
              }}>
                {resena.ciudad} · {resena.gorra} · {resena.fecha}
              </p>
            </div>
          </motion.div>

          {/* Controles */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}>

            {/* Botón anterior */}
            <button
              onClick={anterior}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A84C'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#C9A84C'
              }}
            >
              ←
            </button>

            {/* Puntos indicadores */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {resenas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiva(index)}
                  style={{
                    width: activa === index ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: activa === index
                      ? '#C9A84C'
                      : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={siguiente}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A84C'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#C9A84C'
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