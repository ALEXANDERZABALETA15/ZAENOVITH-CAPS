'use client'

import { useState, useEffect, useRef } from 'react'
import { whatsappLink, mensajePedido } from '@/lib/contacto'
import { formatPrecio } from '@/lib/precio'
import { eventoVerProducto, eventoComprar, eventoCompartir } from '@/lib/analitica'
import AvisoModal from './AvisoModal'
import { IconoWhatsApp, IconoCampana, IconoCompartir } from './Iconos'

const CANTIDAD_MAXIMA = 5
const UMBRAL_ULTIMAS = 3

const estiloBoton = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: 'clamp(15px, 2vw, 18px)',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textAlign: 'center',
  textDecoration: 'none',
  borderRadius: '6px',
  transition: 'background-color 0.3s ease',
  fontFamily: 'var(--font-inter)',
}

const estiloBotonCantidad = {
  width: '44px',
  height: '44px',
  background: 'none',
  color: 'var(--color-white)',
  fontSize: '18px',
  fontFamily: 'var(--font-inter)',
}

// Botón de compra (o de aviso), cantidad, microcopy de cómo funciona, compartir,
// y en móvil una barra fija con el precio cuando el botón principal no está en pantalla.
export default function CompraDetalle({ gorra }) {
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const [mostrarBarra, setMostrarBarra] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const ctaRef = useRef(null)

  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'
  const disponible = !agotado && !proximo
  const maximo = gorra.stock ? Math.min(gorra.stock, CANTIDAD_MAXIMA) : CANTIDAD_MAXIMA
  const ultimas = disponible && gorra.stock && gorra.stock <= UMBRAL_ULTIMAS ? gorra.stock : null
  const urlPedido = whatsappLink(mensajePedido(gorra, cantidad))

  useEffect(() => {
    eventoVerProducto(gorra)
  }, [gorra])

  useEffect(() => {
    if (!ctaRef.current) return
    const observador = new IntersectionObserver(
      ([entrada]) => setMostrarBarra(!entrada.isIntersecting),
      { threshold: 0 }
    )
    observador.observe(ctaRef.current)
    return () => observador.disconnect()
  }, [])

  async function compartir() {
    const url = window.location.href
    const texto = `Mira esta gorra: ${gorra.nombre}`

    if (navigator.share) {
      try {
        await navigator.share({ title: `${gorra.nombre} — CROWNLUX`, text: texto, url })
        eventoCompartir(gorra, 'nativo')
      } catch {
        // El usuario cerró el menú de compartir
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
      eventoCompartir(gorra, 'copiar_link')
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, '_blank', 'noopener')
      eventoCompartir(gorra, 'whatsapp')
    }
  }

  function botonPrincipal(compacto = false) {
    if (disponible) {
      return (
        <a
          href={urlPedido}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => eventoComprar(gorra, cantidad, compacto ? 'barra_movil' : 'detalle')}
          aria-label={`Comprar ${cantidad > 1 ? `${cantidad} unidades de ` : ''}${gorra.nombre} por WhatsApp`}
          style={{
            ...estiloBoton,
            ...(compacto && { padding: '13px 18px', width: 'auto', flexShrink: 0, fontSize: '12px', letterSpacing: '0.14em' }),
            backgroundColor: 'var(--color-green)',
            color: 'var(--color-white)',
            boxShadow: '0 8px 24px rgba(30,107,82,0.3)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green-dark)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
        >
          <IconoWhatsApp size={compacto ? 16 : 18} />
          Comprar
        </a>
      )
    }

    return (
      <button
        type="button"
        onClick={() => setAvisoAbierto(true)}
        aria-haspopup="dialog"
        style={{
          ...estiloBoton,
          ...(compacto && { padding: '13px 18px', width: 'auto', flexShrink: 0, fontSize: '12px', letterSpacing: '0.12em' }),
          backgroundColor: 'transparent',
          color: 'var(--color-white)',
          border: '1px solid var(--color-green)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-green)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <IconoCampana size={compacto ? 14 : 16} />
        {proximo ? 'Avísame cuando llegue' : 'Avísame si vuelve'}
      </button>
    )
  }

  return (
    <>
      <div ref={ctaRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {ultimas && (
          <p style={{
            color: '#fbbf24',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'var(--font-inter)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
            {ultimas === 1 ? '¡Última unidad disponible!' : `¡Últimas ${ultimas} unidades!`}
          </p>
        )}

        {disponible && maximo > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span id="etiqueta-cantidad" style={{
              color: 'var(--color-silver)',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              Cantidad
            </span>
            <div
              role="group"
              aria-labelledby="etiqueta-cantidad"
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(199,199,199,0.2)',
                borderRadius: '6px',
              }}
            >
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                aria-label="Quitar una"
                style={{ ...estiloBotonCantidad, opacity: cantidad <= 1 ? 0.3 : 1 }}
              >
                −
              </button>
              <span
                aria-live="polite"
                style={{
                  minWidth: '32px',
                  textAlign: 'center',
                  color: 'var(--color-white)',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(maximo, c + 1))}
                disabled={cantidad >= maximo}
                aria-label="Agregar una"
                style={{ ...estiloBotonCantidad, opacity: cantidad >= maximo ? 0.3 : 1 }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {disponible && cantidad > 1 && (
          <p style={{
            color: 'var(--color-silver)',
            fontSize: '13px',
            textAlign: 'right',
            fontFamily: 'var(--font-inter)',
          }}>
            Total: <strong style={{ color: 'var(--color-white)' }}>{formatPrecio(gorra.precio * cantidad)}</strong>
          </p>
        )}

        {botonPrincipal()}

        <p style={{
          color: 'var(--color-gray)',
          fontSize: '12px',
          textAlign: 'center',
          lineHeight: '1.6',
          fontFamily: 'var(--font-inter)',
        }}>
          {disponible
            ? 'Te abrimos WhatsApp con tu pedido listo. Confirmas y pagas.'
            : 'Déjanos tu número y te contactamos apenas esté disponible.'}
        </p>

        <button
          type="button"
          onClick={compartir}
          style={{
            alignSelf: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            background: 'none',
            color: 'var(--color-silver)',
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-inter)',
            borderRadius: '999px',
          }}
        >
          <IconoCompartir size={15} />
          <span aria-live="polite">{copiado ? 'Link copiado' : 'Compartir con un amigo'}</span>
        </button>
      </div>

      {/* Barra fija en móvil (oculta en escritorio por CSS) */}
      <div
        className="barra-compra-movil"
        aria-hidden={!mostrarBarra}
        style={{
          transform: mostrarBarra ? 'translateY(0)' : 'translateY(110%)',
          visibility: mostrarBarra ? 'visible' : 'hidden',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            color: 'var(--color-white)',
            fontSize: '12px',
            fontFamily: 'var(--font-cinzel)',
            fontWeight: '700',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '2px',
          }}>
            {cantidad > 1 ? `${cantidad} × ${gorra.nombre}` : gorra.nombre}
          </p>
          <p style={{
            color: disponible ? 'var(--color-green-text)' : 'var(--color-gray)',
            fontSize: '15px',
            fontWeight: '700',
            fontFamily: 'var(--font-inter)',
          }}>
            {formatPrecio(gorra.precio * cantidad)}
          </p>
        </div>
        {botonPrincipal(true)}
      </div>

      {avisoAbierto && (
        <AvisoModal
          gorra={gorra}
          tipo={proximo ? 'llegada' : 'restock'}
          onCerrar={() => setAvisoAbierto(false)}
        />
      )}
    </>
  )
}
