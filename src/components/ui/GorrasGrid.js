'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import GorraCard from '@/components/ui/GorraCard'
import SelectOrden from '@/components/ui/SelectOrden'
import { useColeccion } from '@/lib/ColeccionContext'
import { TODAS, claveColeccion, coleccionesDisponibles } from '@/lib/colecciones'

const GORRAS_POR_PAGINA = 12

const PRIORIDAD_ESTADO = { activo: 0, proximo: 1, agotado: 2 }

const opcionesOrden = [
  { valor: 'relevante', label: 'Más recientes' },
  { valor: 'precio-asc', label: 'Menor precio' },
  { valor: 'precio-desc', label: 'Mayor precio' },
  { valor: 'alfabetico', label: 'Alfabético A-Z' },
]

// Recibe el catálogo ya cargado en el servidor (src/app/page.js): no consulta Supabase desde el navegador
export default function GorrasGrid({ gorras = [] }) {
  const { coleccionActiva, setColeccionActiva } = useColeccion()
  const [cantidad, setCantidad] = useState(GORRAS_POR_PAGINA)
  const [orden, setOrden] = useState('relevante')
  const filtrosRef = useRef(null)

  // Los chips salen del catálogo real, así una colección nueva en la base aparece sola.
  // Cada chip muestra cuántas gorras tiene (agotadas incluidas, igual que el grid).
  const conteo = new Map()
  gorras.forEach((g) => {
    const clave = claveColeccion(g.coleccion)
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1)
  })
  const colecciones = [
    { clave: TODAS, nombre: 'Todas', total: gorras.length },
    ...coleccionesDisponibles(gorras).map((c) => ({ ...c, total: conteo.get(c.clave) ?? 0 })),
  ]

  // En móvil los chips van en una fila deslizable: centra el activo cuando cambia
  // (por ejemplo al elegir una colección desde las tarjetas de "Encuentra tu estilo").
  // Solo mueve la fila, nunca la página.
  useEffect(() => {
    const fila = filtrosRef.current
    const chip = fila?.querySelector('[aria-pressed="true"]')
    if (!fila || !chip || fila.scrollWidth <= fila.clientWidth) return
    fila.scrollTo({
      left: chip.offsetLeft - (fila.clientWidth - chip.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }, [coleccionActiva])

  const gorrasFiltradas = coleccionActiva === TODAS
    ? gorras
    : gorras.filter((g) => claveColeccion(g.coleccion) === coleccionActiva)

  const gorrasOrdenadas = [...gorrasFiltradas].sort((a, b) => {
    // Disponibles primero, luego proximas, agotadas al final (en cualquier orden elegido)
    const porDisponibilidad = (PRIORIDAD_ESTADO[a.estado] ?? 1) - (PRIORIDAD_ESTADO[b.estado] ?? 1)
    if (porDisponibilidad !== 0) return porDisponibilidad

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

  function cambiarOrden(valor) {
    setOrden(valor)
    setCantidad(GORRAS_POR_PAGINA)
  }

  return (
    <section
      id="catalogo"
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
              color: 'var(--color-green-text)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Todos los modelos
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
            Catálogo Premium
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
            Cada diseño es único. Cada gorra cuenta una historia.
          </p>
        </motion.div>

        {/* Fila de filtros + orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="catalogo-controles"
          style={{ marginBottom: 'clamp(32px, 6vw, 56px)' }}
        >
          {/* Filtros de colección: estilos en globals.css (.chip-filtro) */}
          <div
            ref={filtrosRef}
            className="filtros-coleccion"
            role="group"
            aria-label="Filtrar por colección"
          >
            {colecciones.map((col) => {
              const activa = coleccionActiva === col.clave
              return (
                <button
                  key={col.clave}
                  type="button"
                  className="chip-filtro"
                  onClick={() => cambiarColeccion(col.clave)}
                  aria-pressed={activa}
                >
                  {/* Fondo del chip activo: se desliza de un chip a otro al cambiar */}
                  {activa && (
                    <motion.span
                      layoutId="chip-filtro-activo"
                      className="chip-filtro__fondo"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {col.nombre}
                  <span className="chip-filtro__conteo">
                    {col.total}
                    <span className="sr-only"> modelos</span>
                  </span>
                </button>
              )
            })}
          </div>

          <SelectOrden opciones={opcionesOrden} valor={orden} onCambiar={cambiarOrden} />
        </motion.div>

        {/* Grid */}
        {gorrasVisibles.length > 0 && (
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
        {gorrasOrdenadas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-gray)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.1em',
            }}>
              No hay gorras en esta colección por el momento.
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
            <p className="progreso-catalogo">
              Mostrando {gorrasVisibles.length} de {gorrasOrdenadas.length}
            </p>
            <div
              className="progreso-catalogo__barra"
              aria-hidden="true"
              style={{ '--progreso': `${(gorrasVisibles.length / gorrasOrdenadas.length) * 100}%` }}
            />
            <button type="button" onClick={verMas} className="btn-cta btn-cta--contorno">
              Ver más gorras
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}