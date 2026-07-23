'use client'

import { motion } from 'framer-motion'

const pasos = [
  {
    numero: '01',
    icono: '🧢',
    titulo: 'Elige tu Gorra',
    descripcion: 'Explora el catalogo y encuentra la que te identifica',
    acento: 'green',
  },
  {
    numero: '02',
    icono: '💬',
    titulo: 'Escribenos',
    descripcion: 'Te redirigimos a WhatsApp con tu pedido listo',
    acento: 'green',
  },
  {
    numero: '03',
    icono: '💳',
    titulo: 'Confirma y Paga',
    descripcion: 'Nequi · Bancolombia · Efectivo · Transferencia',
    acento: 'silver',
  },
  {
    numero: '04',
    icono: '📦',
    titulo: 'Lo Recibes',
    descripcion: 'Enviamos foto del empaque antes de despachar',
    acento: 'green',
  },
]

const garantias = [
  { label: 'Envios', valor: 'Toda Colombia', acento: 'green' },
  { label: 'Tiempo', valor: '2 a 4 dias habiles', acento: 'green' },
  { label: 'Pagos', valor: 'Nequi · Bancolombia', acento: 'silver' },
  { label: 'Garantia', valor: 'Cambios en 5 dias', acento: 'green' },
]

export default function ComoProcesar() {
  return (
    <section style={{
      backgroundColor: 'var(--color-black-soft)',
      padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
      borderTop: '1px solid rgba(199,199,199,0.06)',
      borderBottom: '1px solid rgba(199,199,199,0.06)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              fontSize: '10px',
              color: 'var(--color-green)',
              fontWeight: '600',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
              margin: 0,
            }}>
              Proceso de compra
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Asi De Facil
          </h2>
        </motion.div>

        {/* Pasos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          marginBottom: 'clamp(40px, 6vw, 56px)',
        }}>
          {pasos.map((paso, index) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Círculo con ícono */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: paso.acento === 'green'
                  ? '1px solid var(--color-green)'
                  : '1px solid var(--color-silver)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                backgroundColor: paso.acento === 'green'
                  ? 'rgba(30,107,82,0.08)'
                  : 'rgba(199,199,199,0.05)',
                fontSize: '22px',
              }}>
                {paso.icono}
              </div>

              {/* Número */}
              <p style={{
                fontSize: '9px',
                color: 'var(--color-green)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                margin: '0 0 8px',
              }}>
                Paso {paso.numero}
              </p>

              {/* Título */}
              <h3 style={{
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                fontWeight: '600',
                color: 'var(--color-white)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                margin: '0 0 8px',
              }}>
                {paso.titulo}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: 'clamp(11px, 1.5vw, 12px)',
                color: 'var(--color-gray)',
                lineHeight: '1.6',
                fontFamily: 'var(--font-inter)',
                fontWeight: '300',
                margin: 0,
              }}>
                {paso.descripcion}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Separador */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(199,199,199,0.1), transparent)',
          marginBottom: 'clamp(32px, 5vw, 48px)',
        }} />

        {/* Garantías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: 'clamp(16px, 3vw, 32px)',
          }}
        >
          {garantias.map((g) => (
            <div
              key={g.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{
                width: '2px',
                height: '32px',
                backgroundColor: g.acento === 'green'
                  ? 'var(--color-green)'
                  : 'var(--color-silver)',
                borderRadius: '2px',
                flexShrink: 0,
              }} />
              <div>
                <p style={{
                  fontSize: '9px',
                  color: 'var(--color-green)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: '600',
                  margin: '0 0 3px',
                }}>
                  {g.label}
                </p>
                <p style={{
                  fontSize: 'clamp(11px, 1.5vw, 13px)',
                  color: 'var(--color-white)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-inter)',
                  margin: 0,
                  letterSpacing: '0.02em',
                }}>
                  {g.valor}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}