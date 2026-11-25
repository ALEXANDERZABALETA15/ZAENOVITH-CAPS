'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import GorraCard from '@/components/ui/GorraCard'

// Página de listado (novedades, ofertas, colecciones, marcas). Las gorras llegan ya filtradas desde el servidor.
// relacionados: [{ nombre, href }] enlaces a otras colecciones o marcas ("Explora también")
export default function ListadoGorras({ etiqueta, titulo, descripcion, textoVacio, gorras = [], relacionados = [] }) {
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
              color: 'var(--color-green-text)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
              margin: 0,
            }}>
              {etiqueta}
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
            {titulo}
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
            {descripcion}
          </p>
        </motion.div>

        {gorras.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
              marginBottom: '24px',
            }}>
              {textoVacio}
            </p>
            <Link href="/#catalogo" className="btn-cta btn-cta--primario">
              Ver Catálogo
            </Link>
          </div>
        ) : (
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

        {relacionados.length > 0 && (
          <nav aria-label="Explora también" style={{ marginTop: 'clamp(48px, 7vw, 80px)', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '11px',
              color: 'var(--color-green-text)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
              margin: '0 0 18px',
            }}>
              Explora también
            </h2>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }}>
              {relacionados.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="btn-volver"
                    style={{
                      display: 'inline-block',
                      padding: '9px 18px',
                      border: '1px solid rgba(199,199,199,0.18)',
                      borderRadius: '999px',
                      color: 'var(--color-silver)',
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    {r.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

      </div>
    </main>
  )
}
