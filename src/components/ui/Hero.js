'use client'

import { getImageProps } from 'next/image'

// Una imagen por tipo de pantalla. El navegador elige con <picture> ANTES de descargar,
// así un celular baja solo la versión móvil (antes bajaba también la de escritorio).
const IMAGENES_FONDO = {
  movil: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1788281701/Formato_916_ok7qen.png',
  tablet: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1790816826/Formato_4_3_u9ofke.jpg',
  desktop: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1787713702/Modifying_logo_in_image_2K_202608202128_uutkt2.jpg',
}

// Mismos cortes que usaba el JavaScript anterior: < 768 móvil, < 1200 tablet
const fuente = (src, width, height) =>
  getImageProps({ src, width, height, alt: '', sizes: '100vw' }).props.srcSet

const SRCSET_MOVIL = fuente(IMAGENES_FONDO.movil, 1080, 1920)
const SRCSET_TABLET = fuente(IMAGENES_FONDO.tablet, 1600, 1200)
const { props: propsEscritorio } = getImageProps({
  src: IMAGENES_FONDO.desktop,
  width: 1920,
  height: 1080,
  alt: '',
  sizes: '100vw',
})

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

      {/* Fondo: es la imagen principal del home, se pide con prioridad alta */}
      <picture>
        <source media="(max-width: 767px)" srcSet={SRCSET_MOVIL} sizes="100vw" />
        <source media="(max-width: 1199px)" srcSet={SRCSET_TABLET} sizes="100vw" />
        <img
          {...propsEscritorio}
          alt=""
          loading="eager"
          fetchPriority="high"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </picture>

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

        {/* H1 del home para buscadores y lectores de pantalla. La marca ya está en la imagen;
            un titular comercial visible es una decisión de diseño pendiente. */}
        <h1 className="sr-only">CROWNLUX: gorras premium en Ibagué con envíos a toda Colombia</h1>

        {/* Etiqueta superior (el espacio inferior depende de la pantalla: ver .hero-etiqueta en globals.css) */}
        <div className="hero-etiqueta" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ width: 'clamp(30px, 5vw, 50px)', height: '1px', backgroundColor: 'var(--color-green)' }} />
          <p style={{
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            color: 'var(--color-green-text)',
            fontWeight: '600',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-inter)',
          }}>
            Colección Exclusiva
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

          {/* Botones: estilos en globals.css (.btn-cta) */}
          <a href="#catalogo" className="btn-cta btn-cta--primario">
            Ver Catálogo
          </a>

          <a href="#contacto" className="btn-cta btn-cta--secundario">
            Contáctanos
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