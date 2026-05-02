'use client'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Coleccion: ['Clasicos', 'Urbano', 'Vintage', 'Premium', 'Ofertas'],
    Informacion: ['Sobre Nosotros', 'Envios', 'Politica de Cambios', 'Preguntas Frecuentes'],
    Contacto: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok'],
  }

  return (
    <footer style={{
      backgroundColor: '#0a0a0a',
      borderTop: '1px solid rgba(201,168,76,0.15)',
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
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: '800',
              color: '#C9A84C',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-playfair)',
              marginBottom: '6px',
            }}>
              ZAHENOVITH
            </h2>
            <p style={{
              fontSize: '9px',
              color: '#888',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              fontFamily: 'var(--font-inter)',
            }}>
              Premium Caps
            </p>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 14px)',
              color: '#888',
              lineHeight: '1.8',
              maxWidth: '260px',
              fontFamily: 'var(--font-inter)',
            }}>
              Gorras de edicion limitada con disenos exclusivos. Cada pieza cuenta una historia unica.
            </p>

            {/* Línea dorada decorativa */}
            <div style={{
              width: '40px',
              height: '1px',
              backgroundColor: '#C9A84C',
              marginTop: '24px',
            }} />
          </div>

          {/* Links */}
          {Object.entries(links).map(([categoria, items]) => (
            <div key={categoria}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#C9A84C',
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
                {items.map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      fontSize: 'clamp(12px, 1.5vw, 13px)',
                      color: '#888',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-inter)',
                      transition: 'color 0.3s ease',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C9A84C'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* Separador */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.06)',
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
            color: '#555',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
          }}>
            © {year} ZAHENOVITH. Todos los derechos reservados.
          </p>

          <p style={{
            fontSize: 'clamp(11px, 1.5vw, 12px)',
            color: '#555',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
          }}>
            Hecho con amor en Colombia 🇨🇴
          </p>
        </div>

      </div>
    </footer>
  )
}