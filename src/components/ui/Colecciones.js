'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useColeccion } from '@/lib/ColeccionContext'
import { claveColeccion } from '@/lib/colecciones'

const colecciones = [
  {
    nombre: 'Clásicos',
    descripcion: 'Estilos atemporales',
    imagen: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1783091995/fila-1-columna-1_1_lberf5.png',
  },
  {
    nombre: 'Urbano',
    descripcion: 'Streetwear premium',
    imagen: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1783091995/fila-1-columna-2_o1ldv4.png',
  },
  {
    nombre: 'Premium',
    descripcion: 'Lo más exclusivo',
    imagen: 'https://res.cloudinary.com/dg4kazsno/image/upload/v1783091995/fila-1-columna-3_wnwu3e.png',
  },
]

export default function Colecciones() {
  const { setColeccionActiva } = useColeccion()

  function handleColeccion(nombre) {
    setColeccionActiva(claveColeccion(nombre))
    const catalogo = document.getElementById('catalogo')
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section style={{
      backgroundColor: 'var(--color-black)',
      padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(32px, 5vw, 56px)',
          }}
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
              Nuestras Colecciones
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green)' }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: '800',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Encuentra Tu Estilo
          </h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
        }}>
          {colecciones.map((col, index) => (
            <ColeccionCard
              key={col.nombre}
              col={col}
              index={index}
              onClick={() => handleColeccion(col.nombre)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function ColeccionCard({ col, index, onClick }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      aria-label={`Ver colección ${col.nombre}`}
      className="coleccion-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '3/4',
        width: '100%',
        padding: 0,
        background: 'var(--color-black-card)',
        textAlign: 'left',
        display: 'block',
      }}
      whileHover={{ y: -4 }}
    >
      {/* Bordes, zoom de la imagen y CTA: .coleccion-card en globals.css */}
      <Image
        src={col.imagen}
        alt=""
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
        style={{ objectFit: 'cover' }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'clamp(16px, 3vw, 24px)',
      }}>
        <h3 style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          fontWeight: '700',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-cinzel)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          {col.nombre}
        </h3>

        <p style={{
          fontSize: '12px',
          color: 'var(--color-silver)',
          fontFamily: 'var(--font-inter)',
          letterSpacing: '0.05em',
          fontWeight: '300',
        }}>
          {col.descripcion}
        </p>

        <span className="coleccion-card__cta" style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '14px',
        }}>
          Ver colección
          <span className="coleccion-card__flecha" aria-hidden="true">→</span>
        </span>
      </div>
    </motion.button>
  )
}
