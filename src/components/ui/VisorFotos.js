'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Visor a pantalla completa. En móvil: deslizar entre fotos y zoom con dos dedos (nativo).
// En escritorio: clic para acercar (2.5x) y mover el mouse para recorrer el detalle.
export default function VisorFotos({ fotos, nombre, inicial = 0, onCerrar }) {
  const [actual, setActual] = useState(inicial)
  const [zoom, setZoom] = useState(false)
  const [origen, setOrigen] = useState('50% 50%')
  const pistaRef = useRef(null)
  const cerrarRef = useRef(null)
  const dialogoRef = useRef(null)
  const onCerrarRef = useRef(onCerrar)
  useEffect(() => { onCerrarRef.current = onCerrar })

  const varias = fotos.length > 1

  function irA(indice, suave = true) {
    const pista = pistaRef.current
    if (!pista) return
    setZoom(false)
    pista.scrollTo({ left: indice * pista.clientWidth, behavior: suave ? 'smooth' : 'auto' })
  }

  // Posición inicial, bloqueo de scroll, foco y teclado
  useEffect(() => {
    const anterior = document.activeElement
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarRef.current?.focus()
    requestAnimationFrame(() => irA(inicial, false))

    function onKeyDown(e) {
      if (e.key === 'Escape') onCerrarRef.current()
      if (e.key !== 'Tab' || !dialogoRef.current) return
      // Mantener el foco dentro del visor
      const botones = [...dialogoRef.current.querySelectorAll('button')]
      if (botones.length === 0) return
      const i = botones.indexOf(document.activeElement)
      e.preventDefault()
      const siguiente = e.shiftKey ? (i <= 0 ? botones.length - 1 : i - 1) : (i + 1) % botones.length
      botones[siguiente].focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowAnterior
      anterior?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Flechas del teclado (dependen de la foto actual)
  useEffect(() => {
    function onFlechas(e) {
      if (e.key === 'ArrowRight' && actual < fotos.length - 1) irA(actual + 1)
      if (e.key === 'ArrowLeft' && actual > 0) irA(actual - 1)
    }
    document.addEventListener('keydown', onFlechas)
    return () => document.removeEventListener('keydown', onFlechas)
  }, [actual, fotos.length])

  function alDesplazar() {
    const pista = pistaRef.current
    if (!pista) return
    const indice = Math.round(pista.scrollLeft / pista.clientWidth)
    if (indice !== actual) {
      setActual(indice)
      setZoom(false)
    }
  }

  function posicionMouse(e) {
    const caja = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - caja.left) / caja.width) * 100
    const y = ((e.clientY - caja.top) / caja.height) * 100
    return `${x}% ${y}%`
  }

  function alternarZoom(e) {
    // Solo con mouse: en pantallas táctiles se usa el zoom nativo con dos dedos
    if (e.nativeEvent.pointerType === 'touch') return
    setOrigen(posicionMouse(e))
    setZoom((z) => !z)
  }

  const estiloFlecha = (lado) => ({
    position: 'absolute',
    top: '50%',
    [lado]: '16px',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(28,28,28,0.8)',
    border: '1px solid rgba(199,199,199,0.2)',
    color: 'var(--color-white)',
    fontSize: '20px',
    zIndex: 2,
  })

  return createPortal(
    <div
      ref={dialogoRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${nombre}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2100,
        backgroundColor: 'rgba(5,5,5,0.97)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Barra superior */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        color: 'var(--color-silver)',
        fontFamily: 'var(--font-inter)',
        fontSize: '13px',
      }}>
        <span aria-live="polite">{varias ? `${actual + 1} / ${fotos.length}` : ''}</span>
        <button
          ref={cerrarRef}
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar visor"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'none',
            color: 'var(--color-white)',
            fontSize: '28px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Fotos */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div
          ref={pistaRef}
          onScroll={alDesplazar}
          className="galeria-pista"
          style={{
            display: 'flex',
            height: '100%',
            overflowX: zoom ? 'hidden' : 'auto',
            scrollSnapType: 'x mandatory',
          }}
        >
          {fotos.map((foto, index) => (
            <div
              key={foto}
              style={{
                flex: '0 0 100%',
                height: '100%',
                scrollSnapAlign: 'start',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'pan-x pinch-zoom',
              }}
            >
              <img
                src={foto}
                alt={index === 0 ? nombre : `${nombre}, vista ${index + 1}`}
                draggable={false}
                onClick={index === actual ? alternarZoom : undefined}
                onMouseMove={zoom && index === actual ? (e) => setOrigen(posicionMouse(e)) : undefined}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transform: zoom && index === actual ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: origen,
                  transition: 'transform 0.25s ease',
                  cursor: zoom ? 'zoom-out' : 'zoom-in',
                }}
              />
            </div>
          ))}
        </div>

        {varias && actual > 0 && (
          <button type="button" className="visor-flecha" onClick={() => irA(actual - 1)} aria-label="Foto anterior" style={estiloFlecha('left')}>
            ←
          </button>
        )}
        {varias && actual < fotos.length - 1 && (
          <button type="button" className="visor-flecha" onClick={() => irA(actual + 1)} aria-label="Foto siguiente" style={estiloFlecha('right')}>
            →
          </button>
        )}
      </div>

      <p style={{
        textAlign: 'center',
        padding: '12px 16px calc(16px + env(safe-area-inset-bottom))',
        color: 'var(--color-gray)',
        fontSize: '12px',
        fontFamily: 'var(--font-inter)',
      }}>
        <span className="solo-escritorio">Clic en la foto para acercar</span>
        <span className="solo-movil">Usa dos dedos para acercar</span>
      </p>
    </div>,
    document.body
  )
}
