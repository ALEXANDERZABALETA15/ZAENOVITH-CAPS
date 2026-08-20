'use client'

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Coleccion: ['Clasicos', 'Urbano', 'Premium'],
    Informacion: ['Sobre Nosotros', 'Envios', 'Politica de Cambios', 'Preguntas Frecuentes'],
    Contacto: ['WhatsApp', 'Instagram', 'TikTok'],
  }

  const hrefs = {
    'WhatsApp': 'https://wa.me/573133635338',
    'Instagram': 'https://www.instagram.com/crownlux.co/',
    'TikTok': 'https://www.tiktok.com/@crownluxco',
    'Clasicos': '/#coleccion',
    'Urbano': '/#coleccion',
    'Premium': '/#coleccion',
    'Sobre Nosotros': '/sobre-nosotros',
    'Envios': '#',
    'Politica de Cambios': '#',
    'Preguntas Frecuentes': '#',
  }

  const esExterno = (item) => ['WhatsApp', 'Instagram', 'TikTok'].includes(item)

  const linkStyle = {
    fontSize: 'clamp(12px, 1.5vw, 13px)',
    color: 'var(--color-gray)',
    textDecoration: 'none',
    fontFamily: 'var(--font-inter)',
    transition: 'color 0.3s ease',
    letterSpacing: '0.03em',
    fontWeight: '300',
  }

  return (
    <footer style={{
      backgroundColor: 'var(--color-black)',
      borderTop: '1px solid rgba(199,199,199,0.1)',
      padding: 'clamp(48px, 8vw, 80px) clamp(16px, 5vw, 40px) clamp(24px, 4vw, 40px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Grid principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(32px, 5vw, 60px)',
          marginBottom: 'clamp(40px, 6vw, 64px)',
        }}>

          {/* Marca */}
          <div>
            <h2 style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              fontWeight: '800',
              color: 'var(--color-white)',
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-cinzel)',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              CROWNLUX
            </h2>
            <p style={{
              fontSize: '9px',
              color: 'var(--color-silver)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              fontFamily: 'var(--font-inter)',
            }}>
              Premium Caps
            </p>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 13px)',
              color: 'var(--color-gray)',
              lineHeight: '1.8',
              maxWidth: '260px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '300',
            }}>
              Gorras de edicion limitada con disenos exclusivos. Cada pieza cuenta una historia unica.
            </p>
            <div style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-green)',
              marginTop: '24px',
            }} />
          </div>

          {/* Links */}
          {Object.entries(links).map(([categoria, items]) => (
            <div key={categoria}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--color-white)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: 'var(--font-inter)',
              }}>
                {categoria}
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {items.map((item) =>
                  esExterno(item) ? (
                    <a
                      key={item}
                      href={hrefs[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkStyle}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-green)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray)'}
                    >
                      {item}
                    </a>
                  ) : (
                    <Link
                      key={item}
                      href={hrefs[item] || '#'}
                      style={linkStyle}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-green)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray)'}
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

        </div>

        {/* Separador */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(199,199,199,0.08)',
          marginBottom: 'clamp(20px, 3vw, 32px)',
        }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}>
          <p style={{
            fontSize: 'clamp(11px, 1.5vw, 12px)',
            color: 'var(--color-gray)',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
            fontWeight: '300',
          }}>
            © {year} CROWNLUX. Todos los derechos reservados.
          </p>
          <p style={{
            fontSize: 'clamp(11px, 1.5vw, 12px)',
            color: 'var(--color-gray)',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
            fontWeight: '300',
          }}>
            Hecho con amor en Colombia 🇨🇴
          </p>
        </div>

      </div>
    </footer>
  )
}