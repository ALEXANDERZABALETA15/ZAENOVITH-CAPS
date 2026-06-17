'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = ['Coleccion', 'Novedades', 'Ofertas', 'Contacto']

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        width: '100%',
      }}
    >

      {/* Barra superior */}
      <div
        style={{
          backgroundColor: 'var(--color-gold)',
          textAlign: 'center',
          padding: '6px 16px',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: 'var(--color-black)',
            fontWeight: '600',
            letterSpacing: '0.1em',
          }}
        >
          ENVIOS A TODO COLOMBIA — CALIDAD PREMIUM
        </p>
      </div>

      {/* Navbar */}
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          height: 'clamp(60px, 8vw, 70px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >

       {/* Logo — clic vuelve al inicio */}
<Link href="/" style={{ textDecoration: 'none' }}>
  <div>
    <h1
      style={{
        fontSize: 'clamp(18px, 4vw, 26px)',
        fontWeight: '800',
        color: 'var(--color-gold)',
        letterSpacing: '0.15em',
        fontFamily: 'var(--font-playfair)',
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      CROWNLUX
    </h1>
    <p
      style={{
        fontSize: 'clamp(7px, 1.5vw, 9px)',
        color: 'var(--color-gray)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginTop: '-2px',
      }}
    >
      Premium Caps
    </p>
  </div>
</Link>

        {/* Links desktop */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 32px)',
            alignItems: 'center',
          }}
        >
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: 'clamp(11px, 1.5vw, 13px)',
                color: 'var(--color-white-soft)',
                fontWeight: '500',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = 'var(--color-gold)')
              }
              onMouseLeave={(e) =>
                (e.target.style.color = 'var(--color-white-soft)')
              }
            >
              {item}
            </a>
          ))}
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            cursor: 'pointer',
          }}
          aria-label="Abrir menu"
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-gold)',
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? 'rotate(45deg) translateY(7px)'
                : 'none',
            }}
          />

          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-gold)',
              transition: 'all 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />

          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: 'var(--color-gold)',
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? 'rotate(-45deg) translateY(-7px)'
                : 'none',
            }}
          />
        </button>
      </nav>

      {/* Menú móvil */}
      <div
        style={{
          backgroundColor: 'var(--color-black-soft)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          padding: menuOpen
            ? '24px clamp(16px, 4vw, 24px)'
            : '0 clamp(16px, 4vw, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: menuOpen ? '20px' : '0',
          maxHeight: menuOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {navLinks.map((item) => (
          <a
            key={item}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '14px',
              color: 'var(--color-white-soft)',
              fontWeight: '500',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 0',
              borderBottom: '1px solid rgba(201,168,76,0.1)',
              textDecoration: 'none',
            }}
          >
            {item}
          </a>
        ))}
      </div>
    </header>
  )
}