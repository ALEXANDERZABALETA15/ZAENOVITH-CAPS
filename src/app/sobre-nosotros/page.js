'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SobreNosotrosPage() {
  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      paddingTop: 'clamp(100px, 12vw, 140px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      <div style={{
        maxWidth: '800px',
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
          style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 72px)' }}
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
              Desde 2023
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Nuestra Historia
          </h1>
        </motion.div>

        {/* Cuerpo del texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(20px, 3vw, 28px)',
          }}
        >
          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'var(--color-silver)',
            lineHeight: '1.9',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            margin: 0,
          }}>
            Hace más de tres años notamos algo que nos frustraba como amantes de la moda y del streetwear: conseguir una gorra de verdadera calidad en Colombia fue uno de nuestros primeros retos. Entre réplicas de mala factura y precios que no correspondían al producto, sentíamos que faltaba una opción seria para quienes valoramos el detalle, el material y el diseño.
          </p>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'var(--color-silver)',
            lineHeight: '1.9',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            margin: 0,
          }}>
            Así nació CROWNLUX. No como una idea de un fin de semana, sino como un compromiso que hemos sostenido durante años: trabajar únicamente con proveedores y materiales de confianza, para que cada gorra que sale de nuestras manos cumpla el estándar que nosotros mismos buscábamos y no encontrábamos.
          </p>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'var(--color-silver)',
            lineHeight: '1.9',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            margin: 0,
          }}>
            Hoy seguimos con la misma filosofía del primer día. Cada pieza de nuestra colección está pensada para quienes entienden que una gorra no es solo un accesorio — es una declaración de estilo.
          </p>

          {/* Cita destacada */}
          <div style={{
            borderLeft: '2px solid var(--color-green)',
            paddingLeft: 'clamp(20px, 3vw, 28px)',
            marginTop: 'clamp(12px, 2vw, 16px)',
          }}>
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-cinzel)',
              letterSpacing: '0.03em',
              lineHeight: '1.5',
              margin: 0,
            }}>
              Bienvenido a CROWNLUX.<br />Premium Caps, sin atajos.
            </p>
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: 'clamp(56px, 8vw, 80px)',
            paddingTop: 'clamp(40px, 6vw, 56px)',
            borderTop: '1px solid rgba(199,199,199,0.08)',
          }}
        >
          <Link
            href="/#coleccion"
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
            Ver Coleccion
          </Link>
        </motion.div>

      </div>
    </main>
  )
}