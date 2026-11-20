'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cerrarSesion } from '@/app/admin/login/acciones'

const ENLACES = [
  { href: '/admin', nombre: 'Inicio', exacto: true },
  { href: '/admin/ventas', nombre: 'Ventas' },
  { href: '/admin/productos', nombre: 'Productos' },
  { href: '/admin/inventario', nombre: 'Inventario' },
  { href: '/admin/avisos', nombre: 'Avisos', contador: true },
]

export default function NavAdmin({ avisosPendientes }) {
  const ruta = usePathname()

  return (
    <nav className="adm-nav" aria-label="Panel">
      <div className="adm-marca">
        CROWNLUX
        <small>ADMIN</small>
      </div>

      {ENLACES.map((enlace) => {
        const activo = enlace.exacto ? ruta === enlace.href : ruta.startsWith(enlace.href)
        return (
          <Link key={enlace.href} href={enlace.href} aria-current={activo ? 'page' : undefined}>
            {enlace.nombre}
            {enlace.contador && avisosPendientes > 0 && (
              <span className="adm-contador" aria-label={`${avisosPendientes} pendientes`}>{avisosPendientes}</span>
            )}
          </Link>
        )
      })}

      <div className="adm-nav-pie">
        <a href="/" target="_blank" rel="noopener noreferrer">Ver tienda ↗</a>
        <form action={cerrarSesion}>
          <button type="submit" style={{ width: '100%' }}>Salir</button>
        </form>
      </div>
    </nav>
  )
}
