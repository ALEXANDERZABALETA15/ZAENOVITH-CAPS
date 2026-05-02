'use client'

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

      {/* Fondo decorativo dorado */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(300px, 60vw, 700px)',
          height: 'clamp(300px, 60vw, 700px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, rgba(10,10,10,0) 70%)',
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
          background: 'linear-gradient(to bottom, transparent, var(--color-gold), transparent)',
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
          background: 'linear-gradient(to bottom, transparent, var(--color-gold), transparent)',
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
          <div style={{ width: 'clamp(30px, 5vw, 50px)', height: '1px', backgroundColor: 'var(--color-gold)' }} />
          <p
            style={{
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              color: 'var(--color-gold)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            Coleccion Exclusiva
          </p>
          <div style={{ width: 'clamp(30px, 5vw, 50px)', height: '1px', backgroundColor: 'var(--color-gold)' }} />
        </div>

        {/* Título principal */}
        <h1
          style={{
            fontSize: 'clamp(36px, 8vw, 96px)',
            fontWeight: '900',
            color: 'var(--color-white)',
            letterSpacing: '0.05em',
            lineHeight: '1',
            marginBottom: 'clamp(8px, 2vw, 16px)',
            fontFamily: 'var(--font-playfair)',
          }}
        >
          ZAENOVITH
        </h1>

        {/* Subtítulo dorado */}
        <h2
          style={{
            fontSize: 'clamp(12px, 2.5vw, 20px)',
            fontWeight: '300',
            color: 'var(--color-gold)',
            letterSpacing: '0.4em',
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
            fontSize: 'clamp(13px, 2vw, 16px)',
            color: 'var(--color-gray)',
            lineHeight: '1.8',
            maxWidth: '500px',
            margin: '0 auto',
            marginBottom: 'clamp(32px, 6vw, 56px)',
            fontFamily: 'var(--font-inter)',
          }}
        >
          Gorras de edicion limitada con disenos exclusivos.
          Cada pieza cuenta una historia unica.
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
          <a
            href="#coleccion"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px)',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-black)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gold-light)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gold)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Ver Coleccion
          </a>

          {/* Botón secundario */}
          <a
            href="#contacto"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px)',
              backgroundColor: 'transparent',
              color: 'var(--color-white)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)'
              e.currentTarget.style.color = 'var(--color-gold)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.color = 'var(--color-white)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Contactanos
          </a>
        </div>

        {/* Indicador scroll */}
        <div
          style={{
            marginTop: 'clamp(40px, 8vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <p style={{
            fontSize: '10px',
            color: 'var(--color-gray)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter)',
          }}>
            Scroll
          </p>
          <div
            style={{
              width: '1px',
              height: 'clamp(30px, 5vw, 50px)',
              background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
            }}
          />
        </div>

      </div>
    </section>
  )
}