'use client'

import { usePathname } from 'next/navigation'

// Muestra su contenido en la tienda y lo oculta en el panel (/admin):
// el header, el footer, el video de entrada, el botón de WhatsApp y la analítica
// no tienen sentido ahí (y no queremos contar las visitas del admin en GA/Meta).
export default function SoloTienda({ children }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return children
}
