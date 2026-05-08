'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { gorras } from '@/lib/gorras'
import GorraCard from '@/components/ui/GorraCard'
import { useColeccion } from '@/lib/ColeccionContext'

const colecciones = ['Todas', 'Clasicos', 'Urbano', 'Vintage', 'Premium']
const GORRAS_POR_PAGINA = 4

export default function GorrasGrid() {
  const { coleccionActiva, setColeccionActiva } = useColeccion()
  const [cantidad, setCantidad] = useState(GORRAS_POR_PAGINA)

  const gorrasFiltradas = coleccionActiva === 'Todas'
    ? gorras
    : gorras.filter((g) => g.coleccion === coleccionActiva)

  const gorrasVisibles = gorrasFiltradas.slice(0, cantidad)
  const hayMas = cantidad < gorrasFiltradas.length

  function verMas() {
    setCantidad((prev) => prev + GORRAS_POR_PAGINA)
  }

  function cambiarColeccion(col) {
    setColeccionActiva(col)
    setCantidad(GORRAS_POR_PAGINA)
  }

  return (
    <section
      id="coleccion"
      style={{
        backgroundColor: 'var(--color-black)',
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
            <p style={{
              fontSize: '11px',
              color: 'var(--color-gold)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Coleccion Exclusiva
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-playfair)',
            marginBottom: '16px',
          }}>
            Catalogo Premium
          </h2>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'var(--color-gray)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontFamily: 'var(--font-inter)',
          }}>
            Cada diseno es unico. Cada gorra cuenta una historia.
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'clamp(32px, 6vw, 56px)',
          }}
        >
          {colecciones.map((col) => (
            <button
              key={col}
              onClick={() => cambiarColeccion(col)}
              style={{
                padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 24px)',
                backgroundColor: coleccionActiva === col
                  ? 'var(--color-gold)'
                  : 'transparent',
                color: coleccionActiva === col
                  ? 'var(--color-black)'
                  : 'var(--color-gray)',
                border: coleccionActiva === col
                  ? '1px solid var(--color-gold)'
                  : '1px solid rgba(255,255,255,0.1)',
                fontSize: 'clamp(10px, 1.5vw, 12px)',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-inter)',
                borderRadius: '2px',
              }}
              onMouseEnter={(e) => {
                if (coleccionActiva !== col) {
                  e.currentTarget.style.borderColor = 'var(--color-gold)'
                  e.currentTarget.style.color = 'var(--color-gold)'
                }
              }}
              onMouseLeave={(e) => {
                if (coleccionActiva !== col) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'var(--color-gray)'
                }
              }}
            >
              {col}
            </button>
          ))}
        </motion.div>

        {/* Grid de tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(240px, 30vw, 300px), 1fr))',
          gap: 'clamp(16px, 3vw, 28px)',
          marginBottom: 'clamp(32px, 6vw, 56px)',
        }}>
          {gorrasVisibles.map((gorra) => (
            <GorraCard key={gorra.id} gorra={gorra} />
          ))}
        </div>

        {/* Sin resultados */}
        {gorrasFiltradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
            }}>
              No hay gorras en esta coleccion por el momento.
            </p>
          </div>
        )}

        {/* Botón Ver más */}
        {hayMas && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <button
              onClick={verMas}
              style={{
                padding: 'clamp(12px, 2vw, 16px) clamp(32px, 5vw, 56px)',
                backgroundColor: 'transparent',
                color: 'var(--color-gold)',
                border: '1px solid var(--color-gold)',
                fontSize: 'clamp(11px, 1.5vw, 13px)',
                fontWeight: '700',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-inter)',
                borderRadius: '2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gold)'
                e.currentTarget.style.color = 'var(--color-black)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-gold)'
              }}
            >
              Ver Mas Gorras
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}