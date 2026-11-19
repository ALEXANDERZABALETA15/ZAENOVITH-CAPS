import { metadatosPagina } from '@/lib/seo'

// La página es un componente de cliente y no puede exportar metadatos:
// este layout le da título, descripción y canonical propios (sin él heredaría los del inicio).
export const metadata = metadatosPagina({
  titulo: 'Política de cambios — CROWNLUX',
  descripcion: 'Cambios por producto dañado, defectuoso o modelo equivocado: plazos, evidencia requerida y condiciones del producto en CROWNLUX.',
  ruta: '/politica-de-cambios',
})

export default function Layout({ children }) {
  return children
}
