'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [dispositivo, setDispositivo] = useState('desktop')

  useEffect(() => {
    const checkDispositivo = () => {
      const ancho = window.innerWidth
      if (ancho < 768) {
        setDispositivo('movil')
      } else if (ancho < 1200) {
        setDispositivo('tablet')
      } else {
        setDispositivo('desktop')
      }
    }
    checkDispositivo()
    window.addEventListener('resize', checkDispositivo)
    return () => window.removeEventListener('resize', checkDispositivo)
  }, [])

  const imagenesFondo = {
    movil: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1788281701/Formato_916_ok7qen.png',
    tablet: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1790816826/Formato_4_3_u9ofke.jpg',
    desktop: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1787713702/Modifying_logo_in_image_2K_202608202128_uutkt2.jpg',
  }

  const imagenFondo = imagenesFondo[dispositivo]

  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${imagenFondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(100px, 15vw, 130px)',
      }}
    >

      {/* Overlay oscuro para legibilidad */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
      }} />

      {/* Línea decorativa izquierda */}
      <div style={{
        position: 'absolute',
        left: 'clamp(16px, 5vw, 60px)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: 'clamp(80px, 15vw, 150px)',
        background: 'linear-gradient(to bottom, transparent, var(--color-silver), transparent)',
        zIndex: 1,
      }} />

      {/* Línea decorativa derecha */}
      <div style={{
        position: 'absolute',
        right: 'clamp(16px, 5vw, 60px)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: 'clamp(80px, 15vw, 150px)',
        background: 'linear-gradient(to bottom, transparent, var(--color-silver), transparent)',
        zIndex: 1,
      }} />

      {/* Contenido principal */}
      <div style={{
        textAlign: 'center',
        zIndex: 2,
        padding: '0 clamp(16px, 5vw, 40px)',
        maxWidth: '900px',
        width: '100%',
      }}>

        {/* Etiqueta superior */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: dispositivo === 'movil'
            ? 'clamp(180px, 55vw, 260px)'
            : dispositivo === 'tablet'
              ? 'clamp(220px, 45vw, 320px)'
              : 'clamp(280px, 40vw, 420px)',
        }}>
          <div style={{ width: 'clamp(30px, 5vw, 50px)', height: '1px', backgroundColor: 'var(--color-green)' }} />
          <p style={{
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            color: 'var(--color-green)',
            fontWeight: '600',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter)',
          }}>
            Coleccion Exclusiva
          </p>
          <div style={{ width: 'clamp(30px, 5vw, 50px)', height: '1px', backgroundColor: 'var(--color-green)' }} />
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: 'clamp(12px, 3vw, 20px)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>

          {/* Botón principal */}
          <a
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
              e.currentTarget.style.backgroundColor = 'var(--color-green-light)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-green)'
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
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          marginTop: 'clamp(40px, 8vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <p style={{
            fontSize: '9px',
            color: 'var(--color-gray)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter)',
          }}>
            Scroll
          </p>
          <div style={{
            width: '1px',
            height: 'clamp(30px, 5vw, 50px)',
            background: 'linear-gradient(to bottom, var(--color-green), transparent)',
          }} />
        </div>

      </div>
    </section>
  )
}