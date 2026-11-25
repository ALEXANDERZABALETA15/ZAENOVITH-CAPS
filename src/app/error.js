'use client'

import Link from 'next/link'
import { whatsappLink } from '@/lib/contacto'

// Se muestra solo si una página no se puede generar y no hay una versión anterior en caché
// (por ejemplo, Supabase caído justo cuando alguien abre una gorra nueva por primera vez).
export default function Error({ reset }) {
  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(120px, 15vw, 160px) clamp(16px, 5vw, 40px) 80px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: '800',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-cinzel)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Algo no cargó bien
        </h1>
        <p style={{
          color: 'var(--color-silver)',
          fontSize: '15px',
          lineHeight: '1.7',
          fontFamily: 'var(--font-inter)',
          marginBottom: '28px',
        }}>
          Estamos teniendo un problema momentáneo. Intenta de nuevo en unos segundos
          o escríbenos por WhatsApp y te atendemos de una.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="btn-cta btn-cta--primario"
          >
            Reintentar
          </button>
          <a
            href={whatsappLink('Hola, quiero ver el catálogo de gorras.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta--secundario"
          >
            WhatsApp
          </a>
        </div>
        <Link href="/" className="btn-volver" style={{
          display: 'inline-block',
          marginTop: '24px',
          color: 'var(--color-gray)',
          fontSize: '13px',
          fontFamily: 'var(--font-inter)',
        }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
