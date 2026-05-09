import { getGorraById } from '@/lib/getGorras'
import GaleriaDetalle from '@/components/ui/GaleriaDetalle'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { id } = await params
  const gorra = await getGorraById(Number(id))
  if (!gorra) return { title: 'Producto no encontrado' }
  return {
    title: `${gorra.nombre} — ZAHENOVITH`,
    description: gorra.descripcion,
  }
}

export default async function GorraDetalle({ params }) {
  const { id } = await params
  const gorra = await getGorraById(Number(id))

  if (!gorra) {
    return (
      <main style={{
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            color: '#C9A84C',
            fontSize: '48px',
            fontFamily: 'var(--font-playfair)',
            marginBottom: '16px',
          }}>
            404
          </h1>
          <p style={{ color: '#888', fontSize: '16px', fontFamily: 'var(--font-inter)' }}>
            Producto no encontrado
          </p>
        </div>
      </main>
    )
  }

  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'

  const mensaje =
    'Hola, quiero realizar un pedido!\n\n' +
    'Gorra: ' + gorra.nombre + '\n' +
    'Color: ' + gorra.color + '\n' +
    'Precio: $' + gorra.precio.toLocaleString('es-CO') + '\n' +
    'Cantidad: 1\n\n' +
    'Datos de envio:\n' +
    'Nombre completo: \n' +
    'Ciudad: \n' +
    'Direccion: \n' +
    'Barrio: \n' +
    'Telefono: \n\n' +
    'Quedo atento a tu confirmacion!'

  const whatsappURL = 'https://wa.me/573133635338?text=' + encodeURIComponent(mensaje)

  return (
    <main style={{
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      paddingTop: 'clamp(100px, 12vw, 140px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      {/* Botón volver */}
<div style={{
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 clamp(16px, 5vw, 40px)',
  marginBottom: 'clamp(24px, 4vw, 40px)',
}}>
  <Link
    href="/"
    className="btn-volver"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#888',
      textDecoration: 'none',
      fontSize: '13px',
      fontFamily: 'var(--font-inter)',
      letterSpacing: '0.05em',
    }}
  >
    <span style={{ fontSize: '16px' }}>←</span>
    Volver al catalogo
  </Link>
</div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 40px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: 'clamp(32px, 6vw, 80px)',
        alignItems: 'start',
      }}>

        {/* GALERÍA INTERACTIVA */}
        <GaleriaDetalle fotos={gorra.fotos} nombre={gorra.nombre} />

        {/* INFORMACIÓN */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 24px)',
          paddingTop: '8px',
        }}>

          {/* Colección */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{ width: '24px', height: '1px', backgroundColor: '#C9A84C' }} />
            <p style={{
              color: '#C9A84C',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}>
              {gorra.coleccion}
            </p>
          </div>

          {/* Nombre */}
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '800',
            lineHeight: '1.1',
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '0.03em',
          }}>
            {gorra.nombre}
          </h1>

          {/* Precio */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingBottom: 'clamp(16px, 3vw, 24px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{
              color: agotado ? '#888' : '#C9A84C',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: '700',
              fontFamily: 'var(--font-inter)',
            }}>
              ${gorra.precio.toLocaleString('es-CO')}
            </span>

            {gorra.precioAnterior && (
              <span style={{
                color: '#888',
                fontSize: 'clamp(16px, 2vw, 20px)',
                textDecoration: 'line-through',
                fontFamily: 'var(--font-inter)',
              }}>
                ${gorra.precioAnterior.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p style={{
            color: '#888888',
            fontSize: 'clamp(14px, 2vw, 16px)',
            lineHeight: '1.8',
            fontFamily: 'var(--font-inter)',
          }}>
            {gorra.descripcion}
          </p>

          {/* Detalles */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: 'clamp(16px, 3vw, 24px)',
            backgroundColor: '#111111',
            borderRadius: '2px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[
              { label: 'Color', value: gorra.color },
              { label: 'Coleccion', value: gorra.coleccion },
              { label: 'Estado', value: gorra.badge },
            ].map((detalle) => (
              <div
                key={detalle.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{
                  color: '#888',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                }}>
                  {detalle.label}
                </span>
                <span style={{
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'var(--font-inter)',
                }}>
                  {detalle.value}
                </span>
              </div>
            ))}
          </div>

          {/* Botón WhatsApp */}
          <a
            href={agotado || proximo ? undefined : whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: 'clamp(14px, 2vw, 18px)',
              backgroundColor: agotado || proximo ? 'transparent' : '#C9A84C',
              color: agotado || proximo ? '#888' : '#000000',
              border: agotado || proximo
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: agotado || proximo ? 'not-allowed' : 'pointer',
              borderRadius: '2px',
              pointerEvents: agotado || proximo ? 'none' : 'auto',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)',
            }}
          >
            {agotado ? 'Sin Stock' : proximo ? 'Proximamente' : 'Comprar por WhatsApp'}
          </a>

          {/* Nota envío */}
          {!agotado && !proximo && (
            <p style={{
              color: '#555',
              fontSize: '12px',
              textAlign: 'center',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.05em',
            }}>
              Envios a todo Colombia 🇨🇴
            </p>
          )}

        </div>
      </div>
    </main>
  )
}