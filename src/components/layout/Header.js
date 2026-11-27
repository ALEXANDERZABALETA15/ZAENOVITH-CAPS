// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// const navLinks = [
//   { nombre: 'Coleccion', href: '/#coleccion' },
//   { nombre: 'Novedades', href: '/novedades' },
//   { nombre: 'Ofertas', href: '/ofertas' },
//   { nombre: 'Contacto', href: '/#contacto' },
// ]

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false)

//   return (
//     <header
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1000,
//         backgroundColor: 'rgba(10,10,10,0.97)',
//         backdropFilter: 'blur(10px)',
//         borderBottom: '1px solid rgba(199,199,199,0.15)',
//         width: '100%',
//       }}
//     >
//       {/* Barra superior */}
//       <div
//         style={{
//           backgroundColor: 'var(--color-green)',
//           textAlign: 'center',
//           padding: '6px 16px',
//         }}
//       >
//         <p
//           style={{
//             fontSize: 'clamp(10px, 2vw, 12px)',
//             color: 'var(--color-white)',
//             fontWeight: '600',
//             letterSpacing: '0.15em',
//             fontFamily: 'var(--font-inter)',
//             textTransform: 'uppercase',
//           }}
//         >
//           Envios a Todo Colombia — Calidad Premium
//         </p>
//       </div>

//       {/* Navbar */}
//       <nav
//         style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           padding: '0 clamp(16px, 4vw, 24px)',
//           height: 'clamp(60px, 8vw, 70px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//         }}
//       >
//         {/* Logo */}
//         <Link href="/" style={{ textDecoration: 'none' }}>
//           <div>
//             <h1
//               style={{
//                 fontSize: 'clamp(16px, 3.5vw, 24px)',
//                 fontWeight: '800',
//                 color: 'var(--color-white)',
//                 letterSpacing: '0.2em',
//                 fontFamily: 'var(--font-cinzel)',
//                 textTransform: 'uppercase',
//                 transition: 'color 0.3s ease',
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.color = 'var(--color-green-text)')
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.color = 'var(--color-white)')
//               }
//             >
//               CROWNLUX
//             </h1>

//             <p
//               style={{
//                 fontSize: 'clamp(7px, 1.5vw, 9px)',
//                 color: 'var(--color-silver)',
//                 letterSpacing: '0.3em',
//                 textTransform: 'uppercase',
//                 marginTop: '-2px',
//                 fontFamily: 'var(--font-inter)',
//               }}
//             >
//               Premium Caps
//             </p>
//           </div>
//         </Link>

//         {/* Links desktop */}
//         <div
//           className="desktop-nav"
//           style={{
//             display: 'flex',
//             gap: 'clamp(16px, 3vw, 32px)',
//             alignItems: 'center',
//           }}
//         >
//           {navLinks.map((item) => (
//             <a
//               key={item.nombre}
//               href={item.href}
//               style={{
//                 fontSize: 'clamp(10px, 1.5vw, 12px)',
//                 color: 'var(--color-silver)',
//                 fontWeight: '500',
//                 letterSpacing: '0.15em',
//                 textTransform: 'uppercase',
//                 transition: 'color 0.3s ease',
//                 whiteSpace: 'nowrap',
//                 fontFamily: 'var(--font-inter)',
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-green-text)'}
//               onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-silver)'}
//             >
//               {item.nombre}
//             </a>
//           ))}
//         </div>

//         {/* Botón hamburguesa */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="mobile-menu-btn"
//           style={{
//             background: 'none',
//             border: 'none',
//             padding: '8px',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '5px',
//             cursor: 'pointer',
//           }}
//           aria-label="Abrir menu"
//         >
//           <span
//             style={{
//               display: 'block',
//               width: '24px',
//               height: '2px',
//               backgroundColor: 'var(--color-white)',
//               transition: 'all 0.3s ease',
//               transform: menuOpen
//                 ? 'rotate(45deg) translateY(7px)'
//                 : 'none',
//             }}
//           />
//           <span
//             style={{
//               display: 'block',
//               width: '24px',
//               height: '2px',
//               backgroundColor: 'var(--color-white)',
//               transition: 'all 0.3s ease',
//               opacity: menuOpen ? 0 : 1,
//             }}
//           />
//           <span
//             style={{
//               display: 'block',
//               width: '24px',
//               height: '2px',
//               backgroundColor: 'var(--color-white)',
//               transition: 'all 0.3s ease',
//               transform: menuOpen
//                 ? 'rotate(-45deg) translateY(-7px)'
//                 : 'none',
//             }}
//           />
//         </button>
//       </nav>

//       {/* Menú móvil */}
//       <div
//         style={{
//           backgroundColor: 'var(--color-black-soft)',
//           borderTop: '1px solid rgba(199,199,199,0.1)',
//           padding: menuOpen
//             ? '24px clamp(16px, 4vw, 24px)'
//             : '0 clamp(16px, 4vw, 24px)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: menuOpen ? '20px' : '0',
//           maxHeight: menuOpen ? '300px' : '0',
//           overflow: 'hidden',
//           transition: 'all 0.3s ease',
//         }}
//       >
//         {navLinks.map((item) => (
//           <a
//             key={item.nombre}
//             href={item.href}
//             onClick={() => setMenuOpen(false)}
//             style={{
//               fontSize: '13px',
//               color: 'var(--color-silver)',
//               fontWeight: '500',
//               letterSpacing: '0.15em',
//               textTransform: 'uppercase',
//               padding: '8px 0',
//               borderBottom: '1px solid rgba(199,199,199,0.08)',
//               fontFamily: 'var(--font-inter)',
//             }}
//           >
//             {item.nombre}
//           </a>
//         ))}
//       </div>
//     </header>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTemporada } from '@/lib/TemporadaContext'
import BarraTemporada from './BarraTemporada'
import SelloTemporada from '@/components/ui/SelloTemporada'

const navLinks = [
  { nombre: 'Catálogo', href: '/#catalogo' },
  { nombre: 'Novedades', href: '/novedades' },
  { nombre: 'Ofertas', href: '/ofertas' },
  { nombre: 'Contacto', href: '/#contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Temporada activa (src/lib/temporadas.js): cambia la barra superior, pone el sello
  // junto al logo y resalta "Ofertas"
  const temporada = useTemporada()
  const resaltar = (item) => Boolean(temporada?.etiquetaOferta) && item.href === '/ofertas'
  const colorLink = (item) => (resaltar(item) ? 'var(--color-green-text)' : 'var(--color-silver)')

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(10,10,10,0.97)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(199,199,199,0.15)',
      width: '100%',
    }}>

      {/* Barra superior */}
      {temporada ? (
        <BarraTemporada temporada={temporada} />
      ) : (
        <div style={{
          backgroundColor: 'var(--color-green)',
          textAlign: 'center',
          padding: '6px 16px',
        }}>
          <p style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: 'var(--color-white)',
            fontWeight: '600',
            letterSpacing: '0.15em',
            fontFamily: 'var(--font-inter)',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Envío gratis en Ibagué · Envíos a toda Colombia
          </p>
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 24px)',
        height: 'clamp(60px, 8vw, 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo (+ sello de la temporada) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.5vw, 16px)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              {/* No es <h1>: cada página tiene el suyo (el del home está en el Hero) */}
              <p style={{
                display: 'block',
                fontSize: 'clamp(16px, 3.5vw, 24px)',
                fontWeight: '800',
                color: 'var(--color-white)',
                letterSpacing: '0.2em',
                fontFamily: 'var(--font-cinzel)',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                margin: 0,
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-green-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-white)'}
              >
                CROWNLUX
              </p>
              <p style={{
                fontSize: 'clamp(7px, 1.5vw, 9px)',
                color: 'var(--color-silver)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '-2px',
                fontFamily: 'var(--font-inter)',
                margin: 0,
              }}>
                Premium Caps
              </p>
            </div>
          </Link>
          <SelloTemporada tamano={44} className="sello-temporada--cabecera" />
        </div>

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
            <Link
              key={item.nombre}
              href={item.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(10px, 1.5vw, 12px)',
                color: colorLink(item),
                fontWeight: resaltar(item) ? '600' : '500',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-inter)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = resaltar(item) ? 'var(--color-white)' : 'var(--color-green-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = colorLink(item)}
            >
              {item.nombre}
              {resaltar(item) && <span className="punto-temporada" aria-hidden="true" />}
            </Link>
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
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            transition: 'all 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
          }} />
        </button>

      </nav>

      {/* Menú móvil */}
      <div style={{
        backgroundColor: 'var(--color-black-soft)',
        borderTop: '1px solid rgba(199,199,199,0.1)',
        padding: menuOpen ? '24px clamp(16px, 4vw, 24px)' : '0 clamp(16px, 4vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: menuOpen ? '20px' : '0',
        maxHeight: menuOpen ? '300px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}>
        {navLinks.map((item) => (
          <Link
            key={item.nombre}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: colorLink(item),
              fontWeight: resaltar(item) ? '600' : '500',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '8px 0',
              borderBottom: '1px solid rgba(199,199,199,0.08)',
              fontFamily: 'var(--font-inter)',
            }}
          >
            {item.nombre}
            {resaltar(item) && (
              <>
                <span className="punto-temporada" aria-hidden="true" />
                <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-silver)' }}>
                  {temporada.etiquetaOferta}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>

    </header>
  )
}