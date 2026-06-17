'use client'

import { motion } from 'framer-motion'

const items = [
  {
    icono: '🚚',
    titulo: 'Envios a Todo Colombia',
    descripcion: 'Despachamos a cualquier ciudad del pais. Rapido y seguro.',
  },
  {
    icono: '✨',
    titulo: 'Calidad Premium',
    descripcion: 'Materiales de primera calidad. Cada gorra es inspeccionada antes de enviar.',
  },
  {
    icono: '🔒',
    titulo: 'Compra Segura',
    descripcion: 'Tu pedido esta protegido. Confirmamos cada detalle antes de despachar.',
  },
  {
    icono: '↩️',
    titulo: 'Cambios y Devoluciones',
    descripcion: 'Si no queda perfecto, lo solucionamos. Tu satisfaccion es primero.',
  },
]

export default function Confianza() {
  return (
    <section style={{
      backgroundColor: '#111111',
      borderTop: '1px solid rgba(201,168,76,0.1)',
      borderBottom: '1px solid rgba(201,168,76,0.1)',
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
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C' }} />
            <p style={{
              fontSize: '11px',
              color: '#C9A84C',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Por Que Elegirnos
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: '#ffffff',
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '0.03em',
          }}>
            La experiencia CROWNLUX
          </h2>
        </motion.div>

        {/* Grid de items */}
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
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '2px',
                padding: 'clamp(24px, 3vw, 36px)',
                textAlign: 'center',
                transition: 'border 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {/* Icono */}
              <div style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                marginBottom: '16px',
              }}>
                {item.icono}
              </div>

              {/* Línea dorada */}
              <div style={{
                width: '24px',
                height: '1px',
                backgroundColor: '#C9A84C',
                margin: '0 auto 16px',
              }} />

              {/* Título */}
              <h3 style={{
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '0.05em',
                marginBottom: '10px',
                fontFamily: 'var(--font-inter)',
                textTransform: 'uppercase',
              }}>
                {item.titulo}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: 'clamp(12px, 1.5vw, 13px)',
                color: '#888',
                lineHeight: '1.7',
                fontFamily: 'var(--font-inter)',
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