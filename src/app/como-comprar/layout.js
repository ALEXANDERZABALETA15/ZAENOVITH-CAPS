import { metadatosPagina } from '@/lib/seo'

// La página es un componente de cliente y no puede exportar metadatos:
// este layout le da título, descripción y canonical propios (sin él heredaría los del inicio).
export const metadata = metadatosPagina({
  titulo: 'Cómo comprar — CROWNLUX',
  descripcion: 'Así compras en CROWNLUX: eliges tu gorra, nos escribes por WhatsApp con el pedido listo, confirmas y pagas. Envío gratis en Ibagué y envíos a toda Colombia.',
  ruta: '/como-comprar',
})

export default function Layout({ children }) {
  return children
}
