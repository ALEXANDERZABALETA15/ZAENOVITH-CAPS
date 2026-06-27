'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--color-black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(100px, 15vw, 130px)',
      }}
    >
      {/* Fondo decorativo verde */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(300px, 60vw, 700px)',
          height: 'clamp(300px, 60vw, 700px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(30,107,82,0.08) 0%, rgba(10,10,10,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Línea decorativa izquierda */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(16px, 5vw, 60px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '1px',
          height: 'clamp(80px, 15vw, 150px)',
          background:
            'linear-gradient(to bottom, transparent, var(--color-silver), transparent)',
        }}
      />

      {/* Línea decorativa derecha */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(16px, 5vw, 60px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '1px',
          height: 'clamp(80px, 15vw, 150px)',
          background:
            'linear-gradient(to bottom, transparent, var(--color-silver), transparent)',
        }}
      />

      {/* Contenido principal */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          padding: '0 clamp(16px, 5vw, 40px)',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {/* Etiqueta superior */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: 'clamp(16px, 3vw, 24px)',
          }}
        >
          <div
            style={{
              width: 'clamp(30px, 5vw, 50px)',
              height: '1px',
              backgroundColor: 'var(--color-green)',
            }}
          />

          <p
            style={{
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              color: 'var(--color-green)',
              fontWeight: '600',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Coleccion Exclusiva
          </p>

          <div
            style={{
              width: 'clamp(30px, 5vw, 50px)',
              height: '1px',
              backgroundColor: 'var(--color-green)',
            }}
          />
        </div>

        {/* Título principal */}
        <h1
          style={{
            fontSize: 'clamp(36px, 8vw, 96px)',
            fontWeight: '900',
            color: 'var(--color-white)',
            letterSpacing: '0.1em',
            lineHeight: '1',
            marginBottom: 'clamp(8px, 2vw, 16px)',
            fontFamily: 'var(--font-cinzel)',
            textTransform: 'uppercase',
          }}
        >
          CROWNLUX
        </h1>

        {/* Subtítulo */}
        <h2
          style={{
            fontSize: 'clamp(10px, 2vw, 14px)',
            fontWeight: '400',
            color: 'var(--color-silver)',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(16px, 4vw, 32px)',
            fontFamily: 'var(--font-inter)',
          }}
        >
          Premium Caps
        </h2>

        {/* Descripción */}
        <p
          style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'var(--color-gray)',
            lineHeight: '1.8',
            maxWidth: '480px',
            margin: '0 auto',
            marginBottom: 'clamp(32px, 6vw, 56px)',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
          }}
        >
          Gorras de edicion limitada con disenos exclusivos. Cada pieza cuenta
          una historia unica.
        </p>

        {/* Botones */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 20px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Botón principal */}
          <Link
            href="#coleccion"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px)',
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-white)',
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
              borderRadius: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-green-light)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Ver Coleccion
          </Link>

          {/* Botón secundario */}
          <Link
            href="#contacto"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px)',
              backgroundColor: 'transparent',
              color: 'var(--color-white)',
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid var(--color-silver)',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
              borderRadius: '1px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-green)'
              e.currentTarget.style.color = 'var(--color-green)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-silver)'
              e.currentTarget.style.color = 'var(--color-white)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Contactanos
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            marginTop: 'clamp(40px, 8vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <p
            style={{
              fontSize: '9px',
              color: 'var(--color-gray)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Scroll
          </p>

          <div
            style={{
              width: '1px',
              height: 'clamp(30px, 5vw, 50px)',
              background:
                'linear-gradient(to bottom, var(--color-green), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  )
}