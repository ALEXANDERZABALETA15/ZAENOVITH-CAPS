'use client'

import { useState } from 'react'

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  const whatsappURL = 'https://wa.me/573133635338?text=' +
    encodeURIComponent('Hola, estoy visitando CROWNLUX y quiero mas informacion sobre sus gorras.')

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: 'clamp(20px, 4vw, 32px)',
        right: 'clamp(20px, 4vw, 32px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#25D366',
        borderRadius: '50px',
        padding: isHovered
          ? '14px 20px 14px 16px'
          : '14px',
        boxShadow: isHovered
          ? '0 8px 32px rgba(37,211,102,0.4)'
          : '0 4px 20px rgba(37,211,102,0.25)',
        transition: 'all 0.4s ease',
        textDecoration: 'none',
        overflow: 'hidden',
        maxWidth: isHovered ? '220px' : '52px',
      }}
    >
      {/* Icono WhatsApp */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        style={{
          width: '24px',
          height: '24px',
          flexShrink: 0,
        }}
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.845L.057 23.428a.5.5 0 00.611.61l5.638-1.447A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.034-1.378l-.361-.214-3.737.959.986-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
      </svg>

      {/* Texto que aparece en hover */}
      <span style={{
        color: 'white',
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontFamily: 'var(--font-inter)',
      }}>
        Escríbenos
      </span>
    </a>
  )
}