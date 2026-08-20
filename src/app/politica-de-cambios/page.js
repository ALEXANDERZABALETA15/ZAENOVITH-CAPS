'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const reglas = [
  {
    titulo: 'Producto dañado o defectuoso',
    descripcion: 'Si tu gorra llega rasguñada, dañada o con algún cambio de color, aceptamos el cambio dentro de los 7 días siguientes a la entrega.',
  },
  {
    titulo: 'Modelo o color equivocado',
    descripcion: 'Si por error de despacho te llega un modelo o color distinto al que pediste, hacemos el cambio sin ningún costo para ti.',
  },
  {
    titulo: 'Evidencia requerida',
    descripcion: 'Para aprobar cualquier cambio necesitamos una foto o video claro del producto recibido, enviado por WhatsApp dentro del plazo indicado.',
  },
  {
    titulo: 'Condición del producto',
    descripcion: 'La gorra debe estar sin usar y con sus etiquetas originales para que el cambio pueda ser procesado.',
  },
  {
    titulo: 'Costo de envío de devolución',
    descripcion: 'Si el error fue nuestro (producto dañado o equivocado), CROWNLUX cubre el envío de vuelta. En otros casos, el costo se evalúa y se acuerda contigo directamente.',
  },
]

export default function PoliticaDeCambiosPage() {
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
              Tu compra esta protegida
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
            margin: '0 0 16px',
          }}>
            Politica de Cambios
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'var(--color-gray)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
          }}>
            Queremos que compres con total tranquilidad. Estas son las reglas claras de nuestro proceso de cambios.
          </p>
        </motion.div>

        {/* Reglas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {reglas.map((regla, index) => (
            <motion.div
              key={regla.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{
                display: 'flex',
                gap: '18px',
                backgroundColor: 'var(--color-black-card)',
                border: '1px solid rgba(199,199,199,0.08)',
                borderRadius: '12px',
                padding: 'clamp(18px, 3vw, 26px)',
              }}
            >
              <div style={{
                width: '2px',
                flexShrink: 0,
                backgroundColor: 'var(--color-green)',
                borderRadius: '2px',
              }} />
              <div>
                <h3 style={{
                  fontSize: 'clamp(13px, 1.8vw, 15px)',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.02em',
                  margin: '0 0 8px',
                }}>
                  {regla.titulo}
                </h3>
                <p style={{
                  fontSize: 'clamp(12px, 1.6vw, 13px)',
                  color: 'var(--color-gray)',
                  lineHeight: '1.7',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: '300',
                  margin: 0,
                }}>
                  {regla.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: 'clamp(48px, 7vw, 64px)',
            paddingTop: 'clamp(32px, 5vw, 48px)',
            borderTop: '1px solid rgba(199,199,199,0.08)',
          }}
        >
          <p style={{
            fontSize: 'clamp(12px, 1.6vw, 13px)',
            color: 'var(--color-gray)',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            marginBottom: '20px',
          }}>
            ¿Tienes un caso puntual? Escríbenos directamente.
          </p>
          <a
            href="https://wa.me/573133635338"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 2vw, 16px) clamp(32px, 5vw, 48px)',
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-white)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              borderRadius: '1px',
            }}
          >
            Escribir por WhatsApp
          </a>
        </motion.div>

      </div>
    </main>
  )
}