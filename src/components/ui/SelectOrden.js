'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IconoCheck, IconoChevron, IconoOrden } from '@/components/ui/Iconos'

// Selector de orden del catálogo con lista propia: la lista nativa de <select>
// no se puede estilizar. Sigue el patrón "listbox button" de WAI-ARIA:
// - Botón: Enter / Espacio / ↑ / ↓ abren la lista.
// - Lista: ↑ ↓ Inicio Fin mueven, Enter / Espacio eligen, Esc cierra, una letra salta a esa opción.
// Estilos en globals.css (.orden, .control-orden, .orden-lista, .orden-opcion).
export default function SelectOrden({ opciones, valor, onCambiar, etiqueta = 'Ordenar' }) {
  const [abierto, setAbierto] = useState(false)
  const [activa, setActiva] = useState(0)
  const raizRef = useRef(null)
  const botonRef = useRef(null)
  const listaRef = useRef(null)
  const reducirMovimiento = useReducedMotion()

  const id = useId()
  const etiquetaId = `${id}-etiqueta`
  const listaId = `${id}-lista`

  const indiceElegido = Math.max(0, opciones.findIndex((op) => op.valor === valor))
  const elegida = opciones[indiceElegido]

  function abrir() {
    setActiva(indiceElegido)
    setAbierto(true)
  }

  function cerrar(devolverFoco) {
    setAbierto(false)
    if (devolverFoco) botonRef.current?.focus()
  }

  function elegir(indice) {
    const op = opciones[indice]
    if (op && op.valor !== valor) onCambiar(op.valor)
    cerrar(true)
  }

  // Al abrir, el foco pasa a la lista para poder moverse con el teclado
  useEffect(() => {
    if (abierto) listaRef.current?.focus({ preventScroll: true })
  }, [abierto])

  // Clic o toque fuera del control: cierra sin robar el foco
  useEffect(() => {
    if (!abierto) return
    function alTocarFuera(e) {
      if (!raizRef.current?.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('pointerdown', alTocarFuera)
    return () => document.removeEventListener('pointerdown', alTocarFuera)
  }, [abierto])

  function teclaBoton(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      abrir()
    }
  }

  function teclaLista(e) {
    const ultima = opciones.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiva((a) => Math.min(ultima, a + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiva((a) => Math.max(0, a - 1))
        break
      case 'Home':
        e.preventDefault()
        setActiva(0)
        break
      case 'End':
        e.preventDefault()
        setActiva(ultima)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        elegir(activa)
        break
      case 'Escape':
        e.preventDefault()
        cerrar(true)
        break
      case 'Tab':
        cerrar(false)
        break
      default:
        // Salto por letra: "m" va a "Más recientes", otra "m" a "Mayor precio"…
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const letra = e.key.toLowerCase()
          for (let paso = 1; paso <= opciones.length; paso++) {
            const i = (activa + paso) % opciones.length
            if (opciones[i].label.toLowerCase().startsWith(letra)) {
              setActiva(i)
              break
            }
          }
        }
    }
  }

  return (
    <div ref={raizRef} className="orden">
      <button
        ref={botonRef}
        type="button"
        className="control-orden"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={abierto ? listaId : undefined}
        onClick={() => (abierto ? cerrar(false) : abrir())}
        onKeyDown={teclaBoton}
      >
        <IconoOrden />
        <span id={etiquetaId} className="control-orden__texto">{etiqueta}</span>
        <span className="control-orden__valor">{elegida?.label}</span>
        <span className="control-orden__chevron"><IconoChevron /></span>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.ul
            ref={listaRef}
            id={listaId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={etiquetaId}
            aria-activedescendant={`${listaId}-${activa}`}
            className="orden-lista"
            onKeyDown={teclaLista}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: reducirMovimiento ? 0 : 0.16, ease: 'easeOut' }}
          >
            {opciones.map((op, i) => {
              const seleccionada = i === indiceElegido
              return (
                <li
                  key={op.valor}
                  id={`${listaId}-${i}`}
                  role="option"
                  aria-selected={seleccionada}
                  data-activa={i === activa}
                  className="orden-opcion"
                  onMouseMove={() => i !== activa && setActiva(i)}
                  onClick={() => elegir(i)}
                >
                  {op.label}
                  {seleccionada && (
                    <span className="orden-opcion__check"><IconoCheck /></span>
                  )}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
