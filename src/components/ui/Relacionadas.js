'use client'

import { useState, useEffect } from 'react'
import GorraCardMini from './GorraCardMini'
import { getGorrasRelacionadas } from '@/lib/getGorras'

export default function Relacionadas({ coleccion, idActual }) {
  const [gorras, setGorras] = useState([])
  const [cargando, setCargando] = useState(true)
  const [inicio, setInicio] = useState(0)

  useEffect(() => {
    async function cargar() {
      const data = await getGorrasRelacionadas(coleccion, idActual)
      setGorras(data)
      setCargando(false)
    }
    cargar()
  }, [coleccion, idActual])

  if (!cargando && gorras.length === 0) return null

  const visibles = gorras.slice(inicio, inicio + 4)
  const hayAnterior = inicio > 0
  const haySiguiente = inicio + 4 < gorras.length

  function anterior() {
    setInicio((prev) => Math.max(0, prev - 4))
  }

  function siguiente() {
    setInicio((prev) => prev + 4)
  }

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(48px, 8vw, 72px) clamp(16px, 5vw, 40px) 0',
      borderTop: '1px solid rgba(199,199,199,0.08)',
      marginTop: 'clamp(48px, 8vw, 72px)',
    }}>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 'clamp(24px, 4vw, 36px)',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <p style={{
            fontSize: '10px',
            color: 'var(--color-green)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter)',
            fontWeight: '600',
            margin: '0 0 6px',
          }}>
            Tambien te puede interesar
          </p>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {coleccion}
          </h2>
        </div>

        {gorras.length > 4 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={anterior}
              disabled={!hayAnterior}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(199,199,199,0.2)',
                color: hayAnterior ? 'var(--color-silver)' : 'rgba(199,199,199,0.2)',
                fontSize: '15px',
                cursor: hayAnterior ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ←
            </button>
            <button
              onClick={siguiente}
              disabled={!haySiguiente}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(199,199,199,0.2)',
                color: haySiguiente ? 'var(--color-silver)' : 'rgba(199,199,199,0.2)',
                fontSize: '15px',
                cursor: haySiguiente ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              →
            </button>
          </div>
        )}
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(30,107,82,0.2)',
            borderTop: '2px solid var(--color-green)',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 22vw, 220px), 1fr))',
          gap: 'clamp(14px, 2vw, 20px)',
          paddingBottom: 'clamp(32px, 5vw, 48px)',
        }}>
          {visibles.map((gorra) => (
            <GorraCardMini key={gorra.id} gorra={gorra} />
          ))}
        </div>
      )}

    </section>
  )
}