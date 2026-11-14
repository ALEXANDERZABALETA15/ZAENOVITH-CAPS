'use client'

import { motion } from 'framer-motion'

const items = [
  {
    icono: '🚚',
    titulo: 'Envíos a Toda Colombia',
    descripcion: 'Gratis en Ibagué. Al resto del país en 2 a 5 días hábiles.',
  },
  {
    icono: '✨',
    titulo: 'Calidad Premium',
    descripcion: 'Cada gorra se inspecciona y te enviamos foto del empaque antes de despacharla.',
  },
  {
    icono: '🔒',
    titulo: 'Paga Como Prefieras',
    descripcion: 'Nequi, Bancolombia, efectivo o transferencia. Confirmamos tu pedido por WhatsApp.',
  },
  {
    icono: '🛡️',
    titulo: 'Garantía de 7 Días',
    descripcion: 'Si tu gorra llega con algún daño, te la cambiamos sin costo adicional.',
  },
]

export default function Confianza() {
  return (
    <section style={{
      backgroundColor: 'var(--color-black-soft)',
      borderTop: '1px solid rgba(199,199,199,0.08)',
      borderBottom: '1px solid rgba(199,199,199,0.08)',
      padding: 'clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px)',
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
              Por Qué Elegirnos
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
          }}>
            La Experiencia CROWNLUX
          </h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
        }}>
          {items.map((item, index) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                backgroundColor: 'var(--color-black)',
                border: '1px solid rgba(199,199,199,0.06)',
                borderRadius: '2px',
                padding: 'clamp(24px, 3vw, 36px)',
                textAlign: 'center',
                transition: 'border 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(30,107,82,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(199,199,199,0.06)'
              }}
            >
              <div style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                marginBottom: '16px',
              }}>
                {item.icono}
              </div>

              <div style={{
                width: '24px',
                height: '1px',
                backgroundColor: 'var(--color-green)',
                margin: '0 auto 16px',
              }} />

              <h3 style={{
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                fontWeight: '600',
                color: 'var(--color-white)',
                letterSpacing: '0.1em',
                marginBottom: '10px',
                fontFamily: 'var(--font-inter)',
                textTransform: 'uppercase',
              }}>
                {item.titulo}
              </h3>

              <p style={{
                fontSize: 'clamp(12px, 1.5vw, 13px)',
                color: 'var(--color-gray)',
                lineHeight: '1.7',
                fontFamily: 'var(--font-inter)',
                fontWeight: '300',
              }}>
                {item.descripcion}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}