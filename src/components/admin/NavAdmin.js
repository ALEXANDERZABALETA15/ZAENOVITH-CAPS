'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cerrarSesion } from '@/app/admin/login/acciones'
import {
  IconoInicio, IconoVentas, IconoProductos, IconoInventario, IconoAvisos, IconoTienda, IconoSalir,
} from './IconosAdmin'

const ENLACES = [
  { href: '/admin', nombre: 'Inicio', Icono: IconoInicio, exacto: true },
  { href: '/admin/ventas', nombre: 'Ventas', Icono: IconoVentas },
  { href: '/admin/productos', nombre: 'Productos', Icono: IconoProductos },
  { href: '/admin/inventario', nombre: 'Inventario', Icono: IconoInventario },
  { href: '/admin/avisos', nombre: 'Avisos', Icono: IconoAvisos, contador: true },
]

// En escritorio es una barra lateral; en celular se parte en una barra superior
// (marca, tienda, salir) y una barra de pestañas fija abajo con las secciones.
export default function NavAdmin({ avisosPendientes, correo }) {
  const ruta = usePathname()

  return (
    <aside className="adm-nav">
      <Link href="/admin" className="adm-marca" aria-label="CROWNLUX · Inicio del panel">
        <img src="/marca/crownlux-palabra.png" alt="" className="adm-marca-palabra" width="900" height="216" />
        <img src="/marca/crownlux-corona.png" alt="" className="adm-marca-corona" width="256" height="256" />
        <span className="adm-marca-tag">Admin</span>
      </Link>

      <nav className="adm-nav-enlaces" aria-label="Secciones del panel">
        {ENLACES.map(({ href, nombre, Icono, exacto, contador }) => {
          const activo = exacto ? ruta === href : ruta.startsWith(href)
          const pendientes = contador && avisosPendientes > 0 ? avisosPendientes : 0
          return (
            <Link key={href} href={href} aria-current={activo ? 'page' : undefined}>
              <span className="adm-nav-icono">
                <Icono />
                {pendientes > 0 && <span className="adm-contador-punto" aria-hidden="true" />}
              </span>
              <span className="adm-nav-texto">{nombre}</span>
              {pendientes > 0 && (
                <span className="adm-contador" aria-label={`${pendientes} pendientes`}>{pendientes}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="adm-nav-pie">
        {correo && (
          <div className="adm-usuario" title={correo}>
            <span className="adm-usuario-inicial" aria-hidden="true">{correo[0].toUpperCase()}</span>
            <span className="adm-usuario-correo">{correo}</span>
          </div>
        )}
        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-nav-accion">
          <IconoTienda size={18} />
          <span className="adm-nav-texto">Ver tienda</span>
        </a>
        <form action={cerrarSesion}>
          <button type="submit" className="adm-nav-accion">
            <IconoSalir size={18} />
            <span className="adm-nav-texto">Salir</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
