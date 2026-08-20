'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const preguntas = [
  {
    pregunta: '¿Cuánto demora el envío?',
    respuesta: 'Realizamos envíos nacionales de 2 a 5 días hábiles, dependiendo de la ciudad de destino.',
  },
  {
    pregunta: '¿Manejan varias tallas?',
    respuesta: 'Sí, manejamos varias tallas para que encuentres el ajuste perfecto en cada modelo de nuestra colección.',
  },
  {
    pregunta: '¿Qué pasa si mi gorra llega dañada?',
    respuesta: 'Si tu gorra llega rasguñada, dañada o con algún cambio de color, tienes 7 días desde que la recibes para reportarlo. Solo necesitamos foto o video como evidencia y realizamos el cambio por otra gorra sin costo adicional.',
  },
  {
    pregunta: '¿Cómo hago mi pedido?',
    respuesta: 'Eliges tu gorra en el catálogo, das clic en comprar y te redirigimos directo a WhatsApp con tu pedido ya armado para confirmar los detalles.',
  },
  {
    pregunta: '¿Los pagos son seguros?',
    respuesta: 'Aceptamos Nequi, Bancolombia, efectivo y transferencia. Confirmamos cada pedido por WhatsApp antes de cualquier envío.',
  },
  {
    pregunta: '¿Hacen envíos a todo Colombia?',
    respuesta: 'Sí, llegamos a todo el territorio nacional.',
  },
]

export default function PreguntasFrecuentesPage() {
  const [abierta, setAbierta] = useState(null)

  function toggle(index) {
    setAbierta(abierta === index ? null : index)
  }

  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      paddingTop: 'clamp(100px, 12vw, 140px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 40px)',
      }}>

        {/* Botón volver */}
        <Link
          href="/"
          className="btn-volver"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
            marginBottom: 'clamp(32px, 5vw, 48px)',
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          Volver al inicio
        </Link>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}
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
              color: 'var(--color-green)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
              margin: 0,
            }}>
              Resolvemos tus dudas
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Preguntas Frecuentes
          </h1>
        </motion.div>

        {/* Acordeón */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {preguntas.map((item, index) => {
            const abiertaAhora = abierta === index
            return (
              <motion.div
                key={item.pregunta}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{
                  backgroundColor: 'var(--color-black-card)',
                  border: abiertaAhora
                    ? '1px solid rgba(30,107,82,0.4)'
                    : '1px solid rgba(199,199,199,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border 0.3s ease',
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: 'clamp(16px, 2.5vw, 22px) clamp(18px, 3vw, 26px)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(13px, 1.8vw, 15px)',
                    fontWeight: '500',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-inter)',
                    letterSpacing: '0.01em',
                  }}>
                    {item.pregunta}
                  </span>

                  <motion.span
                    animate={{ rotate: abiertaAhora ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontSize: '20px',
                      color: 'var(--color-green)',
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence>
                  {abiertaAhora && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        margin: 0,
                        padding: '0 clamp(18px, 3vw, 26px) clamp(16px, 2.5vw, 22px)',
                        fontSize: 'clamp(12px, 1.6vw, 14px)',
                        color: 'var(--color-gray)',
                        lineHeight: '1.7',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: '300',
                      }}>
                        {item.respuesta}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </main>
  )
}