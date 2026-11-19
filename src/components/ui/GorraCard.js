'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { nombreColeccion } from '@/lib/colecciones'
import { whatsappLink, mensajePedido } from '@/lib/contacto'
import { formatPrecio, porcentajeDescuento } from '@/lib/precio'
import { estiloBadge, textoBadge, mostrarBadge as debeMostrarBadge } from '@/lib/badges'
import { eventoComprar } from '@/lib/analitica'
import AvisoModal from './AvisoModal'
import { IconoWhatsApp, IconoCampana } from './Iconos'

const estiloCta = {
  width: '100%',
  padding: 'clamp(10px, 1.5vw, 13px)',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  transition: 'all 0.3s ease',
  fontFamily: 'var(--font-inter)',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  textAlign: 'center',
  lineHeight: '1.3',
}

export default function GorraCard({ gorra }) {
  const [isHovered, setIsHovered] = useState(false)
  const [avisoAbierto, setAvisoAbierto] = useState(false)

  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'
  const href = `/gorra/${gorra.id}`

  // El sello "Agotado" sobre la foto reemplaza al badge
  const mostrarBadge = debeMostrarBadge(gorra)
  const badge = estiloBadge(gorra.badge)
  const descuento = agotado ? null : porcentajeDescuento(gorra.precio, gorra.precioAnterior)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--color-black-card)',
        border: isHovered
          ? '1px solid rgba(30,107,82,0.5)'
          : '1px solid rgba(199,199,199,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(30,107,82,0.1)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Imagen */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '1/1',
          flexShrink: 0,
        }}>
          {/* Cloudinary entrega el ancho justo según la pantalla (ver src/lib/cargadorImagenes.js).
              En celular se declara 67vw aunque la card ocupe todo el ancho: así las pantallas 3x
              reciben ~828 px (≈95 KB) en vez de 1440 px (≈250 KB). A esa distancia no se nota. */}
          <Image
            src={gorra.fotos[0]}
            alt={gorra.nombre}
            fill
            sizes="(max-width: 600px) 67vw, (max-width: 1024px) 50vw, 340px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              filter: agotado ? 'grayscale(70%) brightness(0.7)' : 'none',
              display: 'block',
            }}
          />

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: isHovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.3s ease',
          }} />

          {/* Badge */}
          {mostrarBadge && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: '4px',
              fontFamily: 'var(--font-inter)',
            }}>
              {textoBadge(gorra.badge)}
            </div>
          )}

          {/* Descuento */}
          {descuento && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#f87171',
              color: '#0a0a0a',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.05em',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-inter)',
            }}>
              -{descuento}%
            </div>
          )}

          {/* Sello agotado */}
          {agotado && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                border: '1px solid var(--color-silver)',
                color: 'var(--color-white)',
                backgroundColor: 'rgba(10,10,10,0.6)',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                fontFamily: 'var(--font-inter)',
              }}>
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Información */}
        <div style={{
          padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px) 14px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>

          {/* Colección */}
          <p style={{
            fontSize: '10px',
            color: 'var(--color-green-text)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'var(--font-inter)',
            fontWeight: '600',
          }}>
            {nombreColeccion(gorra.coleccion)}
          </p>

          {/* Nombre */}
          <h3 style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)',
            fontWeight: '700',
            color: 'var(--color-white)',
            marginBottom: '12px',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: '1.4',
            minHeight: '40px',
          }}>
            {gorra.nombre}
          </h3>

          {/* Precio */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: 'auto',
          }}>
            <span style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              fontWeight: '700',
              color: agotado ? 'var(--color-gray)' : 'var(--color-green)',
              fontFamily: 'var(--font-inter)',
            }}>
              {formatPrecio(gorra.precio)}
            </span>

            {gorra.precioAnterior && (
              <span style={{
                fontSize: '12px',
                color: 'var(--color-gray)',
                textDecoration: 'line-through',
                fontFamily: 'var(--font-inter)',
                fontWeight: '300',
              }}>
                {formatPrecio(gorra.precioAnterior)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* CTA: fuera del Link para no anidar elementos interactivos.
          Toda la card lleva al detalle; el botón es el atajo a WhatsApp. */}
      <div style={{ padding: '0 clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px)' }}>
        {proximo || agotado ? (
          <button
            type="button"
            onClick={() => setAvisoAbierto(true)}
            aria-haspopup="dialog"
            style={{
              ...estiloCta,
              backgroundColor: 'transparent',
              color: 'var(--color-white)',
              border: '1px solid var(--color-green)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <IconoCampana />
            {proximo ? 'Avísame cuando llegue' : 'Avísame si vuelve'}
          </button>
        ) : (
          <a
            href={whatsappLink(mensajePedido(gorra))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => eventoComprar(gorra, 1, 'card')}
            aria-label={`Comprar ${gorra.nombre} por WhatsApp`}
            style={{
              ...estiloCta,
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-white)',
              fontWeight: '700',
              padding: 'clamp(12px, 1.6vw, 14px)',
              boxShadow: '0 6px 20px rgba(30,107,82,0.25)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green-dark)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
          >
            <IconoWhatsApp />
            Comprar
          </a>
        )}
      </div>

      {/* Fuera del Link: los clics dentro del portal burbujean por el árbol de React */}
      {avisoAbierto && (
        <AvisoModal
          gorra={gorra}
          tipo={proximo ? 'llegada' : 'restock'}
          onCerrar={() => setAvisoAbierto(false)}
        />
      )}
    </motion.div>
  )
}
