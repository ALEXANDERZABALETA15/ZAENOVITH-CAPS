import { metadatosPagina } from '@/lib/seo'

// La página es un componente de cliente y no puede exportar metadatos:
// este layout le da título, descripción y canonical propios (sin él heredaría los del inicio).
export const metadata = metadatosPagina({
  titulo: 'Preguntas frecuentes — CROWNLUX',
  descripcion: 'Tiempos de envío, tallas, pagos y qué hacer si tu gorra llega dañada. Resolvemos tus dudas antes de comprar en CROWNLUX.',
  ruta: '/preguntas-frecuentes',
})

export default function Layout({ children }) {
  return children
}
