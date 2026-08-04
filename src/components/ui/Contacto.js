'use client'

import { motion } from 'framer-motion'

export default function Contacto() {
  return (
    <section
      id="contacto"
      style={{
        backgroundColor: 'var(--color-black)',
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
        borderTop: '1px solid rgba(199,199,199,0.06)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}
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
              color: 'var(--color-green)',
              fontWeight: '600',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
              margin: 0,
            }}>
              Siguenos
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
            margin: '0 0 16px',
          }}>
            Encuentranos
          </h2>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: 'var(--color-gray)',
            fontFamily: 'var(--font-inter)',
            fontWeight: '300',
            maxWidth: '400px',
            margin: '0 auto',
            lineHeight: '1.8',
          }}>
            Siguenos en redes y se el primero en ver las nuevas colecciones
          </p>
        </motion.div>

        {/* Redes sociales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: 'clamp(16px, 3vw, 24px)',
          maxWidth: '900px',
          margin: '0 auto',
        }}>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/573133635338"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: 'clamp(20px, 3vw, 28px)',
              backgroundColor: 'var(--color-black-card)',
              border: '1px solid rgba(199,199,199,0.08)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(199,199,199,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style={{ width: '26px', height: '26px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.5.5 0 00.611.61l5.638-1.447A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.034-1.378l-.361-.214-3.737.959.986-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '11px',
                color: '#25D366',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                margin: '0 0 4px',
              }}>
                WhatsApp
              </p>
              <p style={{
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-inter)',
                fontWeight: '500',
                margin: 0,
              }}>
                Escríbenos directo
              </p>
            </div>
          </motion.a>

          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/crownlux.co/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: 'clamp(20px, 3vw, 28px)',
              backgroundColor: 'var(--color-black-card)',
              border: '1px solid rgba(199,199,199,0.08)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(225,48,108,0.4)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(225,48,108,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(199,199,199,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style={{ width: '26px', height: '26px' }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '11px',
                color: '#dc2743',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                margin: '0 0 4px',
              }}>
                Instagram
              </p>
              <p style={{
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-inter)',
                fontWeight: '500',
                margin: 0,
              }}>
                @crownlux.co
              </p>
            </div>
          </motion.a>

          {/* TikTok */}
          <motion.a
            href="https://www.tiktok.com/@crownluxco"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: 'clamp(20px, 3vw, 28px)',
              backgroundColor: 'var(--color-black-card)',
              border: '1px solid rgba(199,199,199,0.08)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,255,255,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(199,199,199,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style={{ width: '22px', height: '22px' }}>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '11px',
                color: 'var(--color-white)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: '600',
                margin: '0 0 4px',
              }}>
                TikTok
              </p>
              <p style={{
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-inter)',
                fontWeight: '500',
                margin: 0,
              }}>
                @crownluxco
              </p>
            </div>
          </motion.a>

        </div>
      </div>
    </section>
  )
}