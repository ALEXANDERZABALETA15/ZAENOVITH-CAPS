'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GorraCard from '@/components/ui/GorraCard'
import { getGorrasOfertas } from '@/lib/getGorras'
import Link from 'next/link'

export default function OfertasPage() {
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

  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      paddingTop: 'clamp(100px, 12vw, 140px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      <div style={{
        maxWidth: '1400px',
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
              Precios Especiales
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            Ofertas
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

        {/* Sin ofertas */}
        {!cargando && gorras.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
              marginBottom: '24px',
            }}>
              No hay ofertas disponibles en este momento
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: 'var(--color-green)',
                color: 'var(--color-white)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter)',
                borderRadius: '1px',
              }}
            >
              Ver Catalogo
            </Link>
          </div>
        )}

        {/* Grid */}
        {!cargando && gorras.length > 0 && (
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
    </main>
  )
}