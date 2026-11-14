import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGorraById } from '@/lib/getGorras'
import { nombreColeccion, claveColeccion } from '@/lib/colecciones'
import { formatPrecio, porcentajeDescuento } from '@/lib/precio'
import { estiloBadge, textoBadge, mostrarBadge } from '@/lib/badges'
import { BENEFICIOS_COMPRA, INFO_DESPLEGABLE } from '@/lib/tienda'
import { SITIO_URL } from '@/lib/contacto'
import GaleriaDetalle from '@/components/ui/GaleriaDetalle'
import CompraDetalle from '@/components/ui/CompraDetalle'
import Relacionadas from '@/components/ui/Relacionadas'

export async function generateMetadata({ params }) {
  const { id } = await params
  const gorra = await getGorraById(Number(id))

  if (!gorra) notFound()

  const titulo = `${gorra.nombre} — CROWNLUX`
  const descripcionSeo = `${gorra.descripcion} Precio: ${formatPrecio(gorra.precio)}. Envío gratis en Ibagué y envíos a toda Colombia.`
  const imagenGorra = gorra.fotos[0]

  return {
    title: titulo,
    description: descripcionSeo,
    openGraph: {
      title: titulo,
      description: descripcionSeo,
      url: `${SITIO_URL}/gorra/${gorra.id}`,
      siteName: 'CROWNLUX',
      images: [
        {
          url: imagenGorra,
          width: 1200,
          height: 1200,
          alt: gorra.nombre,
        },
      ],
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcionSeo,
      images: [imagenGorra],
    },
  }
}

const estiloMiga = {
  color: 'var(--color-gray)',
  fontSize: '12px',
  fontFamily: 'var(--font-inter)',
  letterSpacing: '0.05em',
}

export default async function GorraDetalle({ params }) {
  const { id } = await params
  const gorra = await getGorraById(Number(id))

  // Responde 404 real (no una página "no encontrado" con estado 200)
  if (!gorra) notFound()

  const agotado = gorra.estado === 'agotado'
  const proximo = gorra.estado === 'proximo'
  const coleccion = nombreColeccion(gorra.coleccion)
  const descuento = agotado ? null : porcentajeDescuento(gorra.precio, gorra.precioAnterior)
  const ahorro = descuento ? gorra.precioAnterior - gorra.precio : 0
  const badge = estiloBadge(gorra.badge)

  // Solo se muestran las filas con dato (ver supabase/gorras_ficha.sql)
  const ficha = [
    { label: 'Marca', value: gorra.marca },
    { label: 'Tipo', value: gorra.tipo },
    { label: 'Talla', value: gorra.talla },
    { label: 'Material', value: gorra.material },
    { label: 'Visera', value: gorra.visera },
    { label: 'Color', value: gorra.color },
    { label: 'Colección', value: coleccion },
  ].filter((fila) => fila.value)

  // Datos estructurados: Google puede mostrar precio y disponibilidad en los resultados
  const urlProducto = `${SITIO_URL}/gorra/${gorra.id}`
  const datosEstructurados = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: gorra.nombre,
    image: gorra.fotos,
    description: gorra.descripcion || undefined,
    sku: String(gorra.id),
    category: coleccion,
    color: gorra.color || undefined,
    material: gorra.material || undefined,
    brand: { '@type': 'Brand', name: gorra.marca || 'CROWNLUX' },
    offers: {
      '@type': 'Offer',
      url: urlProducto,
      priceCurrency: 'COP',
      price: gorra.precio,
      itemCondition: 'https://schema.org/NewCondition',
      availability: agotado
        ? 'https://schema.org/OutOfStock'
        : proximo
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'CROWNLUX' },
    },
  }

  return (
    <main
      className="pagina-detalle"
      style={{
        backgroundColor: 'var(--color-black)',
        minHeight: '100vh',
        paddingTop: 'clamp(100px, 12vw, 140px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}
    >
      <script
        type="application/ld+json"
        // Se escapa "<" para que ningún texto de la base pueda cerrar el <script>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados).replace(/</g, '\\u003c') }}
      />

      {/* Ruta de navegación */}
      <nav
        aria-label="Ruta de navegación"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 5vw, 40px)',
          marginBottom: 'clamp(20px, 4vw, 36px)',
        }}
      >
        <ol style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
        }}>
          <li>
            <Link href="/" className="btn-volver" style={estiloMiga}>Inicio</Link>
          </li>
          <li aria-hidden="true" style={estiloMiga}>/</li>
          <li>
            <Link
              href={`/?coleccion=${claveColeccion(gorra.coleccion)}#catalogo`}
              className="btn-volver"
              style={estiloMiga}
            >
              {coleccion}
            </Link>
          </li>
          <li aria-hidden="true" style={estiloMiga}>/</li>
          <li aria-current="page" style={{ ...estiloMiga, color: 'var(--color-silver)' }}>
            {gorra.nombre}
          </li>
        </ol>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 40px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: 'clamp(28px, 6vw, 80px)',
        alignItems: 'start',
      }}>

        {/* GALERÍA */}
        <GaleriaDetalle fotos={gorra.fotos} nombre={gorra.nombre} />

        {/* INFORMACIÓN */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 22px)',
          paddingTop: '8px',
        }}>

          {/* Colección + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--color-green)' }} />
              <p style={{
                color: 'var(--color-green-text)',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
              }}>
                {coleccion}
              </p>
            </div>

            {mostrarBadge(gorra) && (
              <span style={{
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
              </span>
            )}
          </div>

          {/* Nombre */}
          <h1 style={{
            color: 'var(--color-white)',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: '800',
            lineHeight: '1.1',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {gorra.nombre}
          </h1>

          {/* Precio */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{
                color: agotado ? 'var(--color-gray)' : 'var(--color-green-text)',
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: '700',
                fontFamily: 'var(--font-inter)',
              }}>
                {formatPrecio(gorra.precio)}
              </span>

              {gorra.precioAnterior && (
                <span style={{
                  color: 'var(--color-gray)',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  textDecoration: 'line-through',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: '300',
                }}>
                  {formatPrecio(gorra.precioAnterior)}
                </span>
              )}

              {descuento && (
                <span style={{
                  backgroundColor: '#f87171',
                  color: '#0a0a0a',
                  fontSize: '12px',
                  fontWeight: '800',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-inter)',
                }}>
                  -{descuento}%
                </span>
              )}

              {(agotado || proximo) && (
                <span style={{
                  border: '1px solid var(--color-silver)',
                  color: 'var(--color-white)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-inter)',
                }}>
                  {agotado ? 'Agotada' : 'Próximamente'}
                </span>
              )}
            </div>

            {descuento && (
              <p style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-inter)' }}>
                Ahorras {formatPrecio(ahorro)}
              </p>
            )}

            {!agotado && !proximo && (
              <p style={{ color: 'var(--color-silver)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
                Envío gratis en Ibagué · Garantía de 7 días
              </p>
            )}
          </div>

          {/* Compra */}
          <div style={{
            paddingTop: 'clamp(16px, 3vw, 22px)',
            borderTop: '1px solid rgba(199,199,199,0.08)',
          }}>
            <CompraDetalle gorra={gorra} />
          </div>

          {/* Por qué comprar aquí */}
          <ul style={{
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '14px',
            padding: 'clamp(16px, 3vw, 22px)',
            backgroundColor: 'var(--color-black-card)',
            border: '1px solid rgba(199,199,199,0.06)',
            borderRadius: '6px',
          }}>
            {BENEFICIOS_COMPRA.map((b) => (
              <li key={b.titulo} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ fontSize: '18px', lineHeight: '1.2' }}>{b.icono}</span>
                <div>
                  <p style={{
                    color: 'var(--color-white)',
                    fontSize: '13px',
                    fontWeight: '600',
                    fontFamily: 'var(--font-inter)',
                    marginBottom: '2px',
                  }}>
                    {b.titulo}
                  </p>
                  <p style={{
                    color: 'var(--color-gray)',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-inter)',
                  }}>
                    {b.detalle}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Descripción */}
          {gorra.descripcion && (
            <div>
              <h2 style={{
                color: 'var(--color-white)',
                fontSize: '13px',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                letterSpacing: '0.2em',
                marginBottom: '10px',
              }}>
                Descripción
              </h2>
              <p style={{
                color: 'var(--color-silver)',
                fontSize: 'clamp(14px, 2vw, 15px)',
                lineHeight: '1.8',
                fontFamily: 'var(--font-inter)',
                fontWeight: '300',
              }}>
                {gorra.descripcion}
              </p>
            </div>
          )}

          {/* Ficha */}
          {ficha.length > 0 && (
            <dl style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: 'clamp(16px, 3vw, 22px)',
              backgroundColor: 'var(--color-black-card)',
              borderRadius: '6px',
              border: '1px solid rgba(199,199,199,0.06)',
            }}>
              {ficha.map((fila) => (
                <div
                  key={fila.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <dt style={{
                    color: 'var(--color-gray)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-inter)',
                  }}>
                    {fila.label}
                  </dt>
                  <dd style={{
                    color: 'var(--color-white)',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: 'var(--font-inter)',
                    textAlign: 'right',
                  }}>
                    {fila.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Envíos, cambios y cuidado: desplegables nativos (funcionan sin JavaScript) */}
          <div style={{ borderTop: '1px solid rgba(199,199,199,0.1)' }}>
            {INFO_DESPLEGABLE.map((seccion) => (
              <details
                key={seccion.titulo}
                className="desplegable"
                style={{ borderBottom: '1px solid rgba(199,199,199,0.1)' }}
              >
                <summary style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '16px 0',
                  color: 'var(--color-white)',
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                }}>
                  {seccion.titulo}
                  <span
                    className="desplegable-signo"
                    aria-hidden="true"
                    style={{ color: 'var(--color-green-text)', fontSize: '20px', fontWeight: '400', lineHeight: 1 }}
                  >
                    +
                  </span>
                </summary>
                <div style={{ paddingBottom: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {seccion.parrafos.map((parrafo) => (
                    <p key={parrafo} style={{
                      color: 'var(--color-silver)',
                      fontSize: '14px',
                      lineHeight: '1.7',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: '300',
                    }}>
                      {parrafo}
                    </p>
                  ))}
                  {seccion.enlace && (
                    <Link
                      href={seccion.enlace.href}
                      className="btn-volver"
                      style={{ ...estiloMiga, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                      {seccion.enlace.texto}
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>

        </div>
      </div>

      <Relacionadas coleccion={gorra.coleccion} idActual={gorra.id} />

    </main>
  )
}
