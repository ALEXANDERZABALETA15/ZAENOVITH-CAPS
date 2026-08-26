'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GorraCard from '@/components/ui/GorraCard'
import { getGorras } from '@/lib/getGorras'
import { useColeccion } from '@/lib/ColeccionContext'

const colecciones = ['Todas', 'Clasicos', 'Urbanos', 'Premium']
const GORRAS_POR_PAGINA = 12

const opcionesOrden = [
  { valor: 'relevante', label: 'Mas Relevante' },
  { valor: 'precio-asc', label: 'Menor Precio' },
  { valor: 'precio-desc', label: 'Mayor Precio' },
  { valor: 'alfabetico', label: 'Alfabetico A-Z' },
]

export default function GorrasGrid() {
  const { coleccionActiva, setColeccionActiva } = useColeccion()
  const [cantidad, setCantidad] = useState(GORRAS_POR_PAGINA)
  const [gorras, setGorras] = useState([])
  const [cargando, setCargando] = useState(true)
  const [orden, setOrden] = useState('relevante')

  useEffect(() => {
    async function cargarGorras() {
      setCargando(true)
      const data = await getGorras()
      setGorras(data)
      setCargando(false)
    }
    cargarGorras()
  }, [])

  const gorrasFiltradas = coleccionActiva === 'Todas'
    ? gorras
    : gorras.filter((g) => g.coleccion === coleccionActiva)

  const gorrasOrdenadas = [...gorrasFiltradas].sort((a, b) => {
    if (orden === 'precio-asc') return a.precio - b.precio
    if (orden === 'precio-desc') return b.precio - a.precio
    if (orden === 'alfabetico') return a.nombre.localeCompare(b.nombre)
    // relevante = mas recientes primero
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const gorrasVisibles = gorrasOrdenadas.slice(0, cantidad)
  const hayMas = cantidad < gorrasOrdenadas.length

  function verMas() {
    setCantidad((prev) => prev + GORRAS_POR_PAGINA)
  }

  function cambiarColeccion(col) {
    setColeccionActiva(col)
    setCantidad(GORRAS_POR_PAGINA)
  }

  function cambiarOrden(e) {
    setOrden(e.target.value)
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
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
            <p style={{
              fontSize: '11px',
              color: 'var(--color-green)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Coleccion Exclusiva
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            marginBottom: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
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
            fontWeight: '300',
          }}>
            Cada diseno es unico. Cada gorra cuenta una historia.
          </p>
        </motion.div>

        {/* Fila de filtros + orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(12px, 2vw, 16px)',
            marginBottom: 'clamp(32px, 6vw, 56px)',
          }}
        >
          {/* Filtros de colección */}
          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            flexWrap: 'wrap',
          }}>
            {colecciones.map((col) => (
              <button
                key={col}
                onClick={() => cambiarColeccion(col)}
                style={{
                  padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 24px)',
                  backgroundColor: coleccionActiva === col
                    ? 'var(--color-green)'
                    : 'transparent',
                  color: coleccionActiva === col
                    ? 'var(--color-white)'
                    : 'var(--color-gray)',
                  border: coleccionActiva === col
                    ? '1px solid var(--color-green)'
                    : '1px solid rgba(199,199,199,0.1)',
                  fontSize: 'clamp(10px, 1.5vw, 12px)',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-inter)',
                  borderRadius: '1px',
                }}
                onMouseEnter={(e) => {
                  if (coleccionActiva !== col) {
                    e.currentTarget.style.borderColor = 'var(--color-green)'
                    e.currentTarget.style.color = 'var(--color-green)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (coleccionActiva !== col) {
                    e.currentTarget.style.borderColor = 'rgba(199,199,199,0.1)'
                    e.currentTarget.style.color = 'var(--color-gray)'
                  }
                }}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Dropdown de orden */}
          <select
            value={orden}
            onChange={cambiarOrden}
            style={{
              padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 2.5vw, 20px)',
              backgroundColor: 'var(--color-black-card)',
              color: 'var(--color-white)',
              border: '1px solid rgba(199,199,199,0.15)',
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter)',
              borderRadius: '1px',
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231e6b52'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px',
              paddingRight: '32px',
            }}
          >
            {opcionesOrden.map((op) => (
              <option
                key={op.valor}
                value={op.valor}
                style={{
                  backgroundColor: 'var(--color-black-card)',
                  color: 'var(--color-white)',
                }}
              >
                {op.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Cargando */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid rgba(30,107,82,0.2)',
              borderTop: '2px solid var(--color-green)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{
              color: 'var(--color-gray)',
              fontSize: '13px',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
            }}>
              Cargando coleccion...
            </p>
          </div>
        )}

        {/* Grid */}
        {!cargando && (
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
        )}

        {/* Sin resultados */}
        {!cargando && gorrasOrdenadas.length === 0 && (
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
        {!cargando && hayMas && (
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
                color: 'var(--color-green)',
                border: '1px solid var(--color-green)',
                fontSize: 'clamp(11px, 1.5vw, 13px)',
                fontWeight: '600',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-inter)',
                borderRadius: '1px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-green)'
                e.currentTarget.style.color = 'var(--color-white)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-green)'
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