'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
  { label: 'Envios', valor: 'Todo Colombia', acento: 'green' },
  { label: 'Tiempo', valor: '2 a 5 dias habiles', acento: 'green' },
  { label: 'Pagos', valor: 'Nequi · Bancolombia', acento: 'silver' },
  { label: 'Garantia', valor: 'Cambios en 7 dias', acento: 'green' },
]

const confianza = [
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

export default function ComoComprarPage() {
  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      paddingTop: 'clamp(100px, 12vw, 140px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      <div style={{
        maxWidth: '1200px',
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

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Como Comprar
          </h1>
        </motion.div>

        {/* Pasos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          marginBottom: 'clamp(48px, 8vw, 72px)',
        }}>
          {pasos.map((paso, index) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
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

        {/* Garantías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: 'clamp(16px, 3vw, 32px)',
            paddingTop: 'clamp(32px, 5vw, 48px)',
            paddingBottom: 'clamp(48px, 8vw, 72px)',
            borderTop: '1px solid rgba(199,199,199,0.08)',
            borderBottom: '1px solid rgba(199,199,199,0.08)',
            marginBottom: 'clamp(48px, 8vw, 72px)',
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

        {/* Confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          <h2 style={{
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            La Experiencia CROWNLUX
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
        }}>
          {confianza.map((item, index) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                backgroundColor: 'var(--color-black-card)',
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
                textTransform: 'uppercase',
                marginBottom: '10px',
                fontFamily: 'var(--font-inter)',
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
    </main>
  )
}