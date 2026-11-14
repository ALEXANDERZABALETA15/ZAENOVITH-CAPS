'use client'

import { useState, useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { celularValido, normalizarCelular, registrarAviso } from '@/lib/avisos'
import { whatsappLink, mensajeAvisoLlegada, mensajeAvisoRestock } from '@/lib/contacto'

// Formulario rápido para "Avísame cuando llegue" (tipo 'llegada') y "Avísame si vuelve" (tipo 'restock').
// Se monta solo mientras está abierto.
export default function AvisoModal({ gorra, tipo, onCerrar }) {
  const [telefono, setTelefono] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [trampa, setTrampa] = useState('') // honeypot anti-bots
  const [estado, setEstado] = useState('form') // form | enviando | exito | error
  const [errorCampo, setErrorCampo] = useState('')

  const dialogoRef = useRef(null)
  const inputRef = useRef(null)
  const idTitulo = useId()
  const idTelefono = useId()
  const idError = useId()

  const mensajeWhatsApp = tipo === 'llegada' ? mensajeAvisoLlegada(gorra) : mensajeAvisoRestock(gorra)

  // Ref para que el efecto corra una sola vez aunque el padre pase una función nueva en cada render
  const onCerrarRef = useRef(onCerrar)
  useEffect(() => { onCerrarRef.current = onCerrar })

  // Foco al abrir, bloqueo de scroll, Esc para cerrar, foco atrapado dentro del diálogo
  useEffect(() => {
    const anterior = document.activeElement
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onCerrarRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialogoRef.current) return
      const enfocables = dialogoRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"])'
      )
      if (enfocables.length === 0) return
      const primero = enfocables[0]
      const ultimo = enfocables[enfocables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowAnterior
      anterior?.focus?.()
    }
  }, [])

  async function enviar(e) {
    e.preventDefault()

    if (!celularValido(telefono)) {
      setErrorCampo('Escribe un celular válido de 10 dígitos, por ejemplo 300 123 4567.')
      inputRef.current?.focus()
      return
    }
    if (!acepta) {
      setErrorCampo('Necesitamos tu autorización para poder contactarte.')
      return
    }
    setErrorCampo('')

    // Un bot llenó el campo oculto: fingimos éxito sin guardar
    if (trampa) {
      setEstado('exito')
      return
    }

    setEstado('enviando')
    const ok = await registrarAviso({ gorra, tipo, telefono })
    setEstado(ok ? 'exito' : 'error')
  }

  const celularFormateado = normalizarCelular(telefono).replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3')

  return createPortal(
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <motion.div
        ref={dialogoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          backgroundColor: 'var(--color-black-card)',
          border: '1px solid rgba(199,199,199,0.12)',
          borderRadius: '12px',
          padding: 'clamp(24px, 5vw, 32px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          fontFamily: 'var(--font-inter)',
        }}
      >
        {/* Cerrar */}
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '36px',
            height: '36px',
            background: 'none',
            color: 'var(--color-silver)',
            fontSize: '22px',
            lineHeight: 1,
            borderRadius: '50%',
          }}
        >
          ×
        </button>

        {/* Producto */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px', paddingRight: '28px' }}>
          {gorra.fotos?.[0] && (
            <img
              src={gorra.fotos[0]}
              alt=""
              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
            />
          )}
          <div>
            <p style={{
              fontSize: '10px',
              color: 'var(--color-green-text)',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              {tipo === 'llegada' ? 'Llega pronto' : 'Agotada'}
            </p>
            <p style={{
              fontSize: '13px',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-cinzel)',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {gorra.nombre}
            </p>
          </div>
        </div>

        {estado === 'exito' ? (
          <div role="status" style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }} aria-hidden="true">✓</p>
            <h2 id={idTitulo} style={{
              fontSize: '18px',
              color: 'var(--color-white)',
              marginBottom: '10px',
            }}>
              ¡Listo!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-silver)', lineHeight: '1.6', marginBottom: '24px' }}>
              {trampa
                ? 'Te escribiremos pronto.'
                : `Te escribiremos al ${celularFormateado} ${tipo === 'llegada' ? 'cuando llegue' : 'cuando vuelva a estar disponible'}.`}
            </p>
            <button
              type="button"
              onClick={onCerrar}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: 'var(--color-green)',
                color: 'var(--color-white)',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderRadius: '6px',
              }}
            >
              Seguir viendo gorras
            </button>
          </div>
        ) : (
          <>
            <h2 id={idTitulo} style={{
              fontSize: 'clamp(17px, 4vw, 20px)',
              color: 'var(--color-white)',
              marginBottom: '8px',
            }}>
              {tipo === 'llegada' ? '¿Te avisamos cuando llegue?' : '¿Te avisamos si vuelve?'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-silver)', lineHeight: '1.6', marginBottom: '20px' }}>
              Déjanos tu número y nos pondremos en contacto contigo.
            </p>

            <form onSubmit={enviar} noValidate>
              <label htmlFor={idTelefono} style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--color-silver)',
                fontWeight: '600',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Tu número de celular
              </label>
              <input
                ref={inputRef}
                id={idTelefono}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="300 123 4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                aria-invalid={Boolean(errorCampo) && !celularValido(telefono)}
                aria-describedby={errorCampo ? idError : undefined}
                disabled={estado === 'enviando'}
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  backgroundColor: 'var(--color-black)',
                  color: 'var(--color-white)',
                  border: '1px solid rgba(199,199,199,0.2)',
                  borderRadius: '6px',
                  fontSize: '16px', // 16px evita el zoom automático en iPhone
                  fontFamily: 'var(--font-inter)',
                  marginBottom: '14px',
                }}
              />

              {/* Honeypot: invisible para personas */}
              <input
                type="text"
                name="empresa"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={trampa}
                onChange={(e) => setTrampa(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
              />

              <label style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                fontSize: '12px',
                color: 'var(--color-gray)',
                lineHeight: '1.5',
                marginBottom: '16px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  disabled={estado === 'enviando'}
                  style={{ marginTop: '2px', accentColor: 'var(--color-green)', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <span>
                  Autorizo a CROWNLUX a usar mi número para contactarme sobre esta gorra, según la Ley 1581 de 2012.
                </span>
              </label>

              {errorCampo && (
                <p id={idError} role="alert" style={{ fontSize: '12px', color: '#f87171', marginBottom: '14px' }}>
                  {errorCampo}
                </p>
              )}
              {estado === 'error' && (
                <p role="alert" style={{ fontSize: '12px', color: '#f87171', marginBottom: '14px', lineHeight: '1.5' }}>
                  No pudimos guardar tu número. Inténtalo de nuevo o escríbenos por WhatsApp.
                </p>
              )}

              <button
                type="submit"
                disabled={estado === 'enviando'}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'var(--color-green)',
                  color: 'var(--color-white)',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  opacity: estado === 'enviando' ? 0.7 : 1,
                  cursor: estado === 'enviando' ? 'wait' : 'pointer',
                }}
              >
                {estado === 'enviando' ? 'Enviando…' : 'Avísame'}
              </button>
            </form>

            {/* Alternativa: WhatsApp */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0',
              color: 'var(--color-gray)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(199,199,199,0.12)' }} />
              o
              <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(199,199,199,0.12)' }} />
            </div>

            <a
              href={whatsappLink(mensajeWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '13px',
                border: '1px solid rgba(37,211,102,0.5)',
                color: 'var(--color-white)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '6px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.5.5 0 00.611.61l5.638-1.447A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.034-1.378l-.361-.214-3.737.959.986-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
              </svg>
              Escríbenos a nuestro WhatsApp
            </a>
          </>
        )}
      </motion.div>
    </div>,
    document.body
  )
}
