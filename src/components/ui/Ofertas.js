'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GorraCard from './GorraCard'
import { getGorrasOfertas } from '@/lib/getGorras'

export default function Ofertas() {
  const [gorras, setGorras] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const data = await getGorrasOfertas()
      setGorras(data)
      setCargando(false)
    }
    cargar()
  }, [])

  if (!cargando && gorras.length === 0) return null

  return (
    <section
      id="ofertas"
      style={{
        backgroundColor: 'var(--color-black)',
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
        borderTop: '1px solid rgba(199,199,199,0.06)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}
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
              Precios Especiales
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            Ofertas
          </h2>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'var(--color-gray)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
          }}>
            Gorras premium a precios especiales por tiempo limitado. No te las pierdas.
          </p>
        </motion.div>

        {/* Spinner */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid rgba(30,107,82,0.2)',
              borderTop: '2px solid var(--color-green)',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        )}

        {/* Grid */}
        {!cargando && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(240px, 30vw, 300px), 1fr))',
            gap: 'clamp(16px, 3vw, 28px)',
          }}>
            {gorras.map((gorra) => (
              <GorraCard key={gorra.id} gorra={gorra} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}