'use client'

import { useState, useRef } from 'react'
import VisorFotos from './VisorFotos'

// Galería deslizable: en móvil se pasa con el dedo (scroll-snap nativo),
// en escritorio con las miniaturas o con las flechas del teclado.
// Tocar la foto abre el visor a pantalla completa con zoom.
export default function GaleriaDetalle({ fotos, nombre }) {
  const [actual, setActual] = useState(0)
  const [visorAbierto, setVisorAbierto] = useState(false)
  const pistaRef = useRef(null)
  const varias = fotos.length > 1

  function irA(indice) {
    const pista = pistaRef.current
    if (!pista) return
    pista.scrollTo({ left: indice * pista.clientWidth, behavior: 'smooth' })
  }

  function alDesplazar() {
    const pista = pistaRef.current
    if (!pista) return
    const indice = Math.round(pista.scrollLeft / pista.clientWidth)
    if (indice !== actual) setActual(indice)
  }

  function alTeclear(e) {
    if (e.key === 'ArrowRight' && actual < fotos.length - 1) {
      e.preventDefault()
      irA(actual + 1)
    } else if (e.key === 'ArrowLeft' && actual > 0) {
      e.preventDefault()
      irA(actual - 1)
    }
  }

  return (
    <div>

      {/* Foto principal */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div
          ref={pistaRef}
          onScroll={alDesplazar}
          onKeyDown={varias ? alTeclear : undefined}
          tabIndex={varias ? 0 : undefined}
          role={varias ? 'region' : undefined}
          aria-roledescription={varias ? 'carrusel' : undefined}
          aria-label={varias ? `Fotos de ${nombre}` : undefined}
          className="galeria-pista"
          style={{
            display: 'flex',
            overflowX: varias ? 'auto' : 'hidden',
            scrollSnapType: 'x mandatory',
            aspectRatio: '1/1',
            borderRadius: '2px',
            border: '1px solid rgba(199,199,199,0.08)',
          }}
        >
          {fotos.map((foto, index) => (
            <button
              key={foto}
              type="button"
              onClick={() => setVisorAbierto(true)}
              aria-label={`Ampliar foto ${index + 1}`}
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '100%',
                padding: 0,
                background: 'none',
                scrollSnapAlign: 'start',
                cursor: 'zoom-in',
              }}
            >
              <img
                src={foto}
                alt={index === 0 ? nombre : `${nombre}, vista ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>

        {/* Indicador de que se puede ampliar */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10,10,10,0.65)',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '16px', height: '16px' }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
          </svg>
        </span>

        {/* Contador: indica que hay más fotos para deslizar */}
        {varias && (
          <span
            aria-live="polite"
            style={{
              position: 'absolute',
              right: '12px',
              bottom: '12px',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(10,10,10,0.65)',
              color: 'var(--color-white)',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-inter)',
              pointerEvents: 'none',
            }}
          >
            {actual + 1} / {fotos.length}
          </span>
        )}
      </div>

      {/* Miniaturas */}
      {varias && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${fotos.length}, 1fr)`,
          gap: '8px',
        }}>
          {fotos.map((foto, index) => (
            <button
              key={foto}
              type="button"
              onClick={() => irA(index)}
              aria-label={`Ver foto ${index + 1} de ${fotos.length}`}
              aria-current={actual === index ? 'true' : undefined}
              style={{
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: '2px',
                padding: 0,
                background: 'none',
                border: actual === index
                  ? '1px solid var(--color-green-text)'
                  : '1px solid rgba(199,199,199,0.06)',
                transition: 'all 0.3s ease',
                opacity: actual === index ? 1 : 0.6,
              }}
            >
              <img
                src={foto}
                alt=""
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      )}

      {visorAbierto && (
        <VisorFotos
          fotos={fotos}
          nombre={nombre}
          inicial={actual}
          onCerrar={() => setVisorAbierto(false)}
        />
      )}

    </div>
  )
}
