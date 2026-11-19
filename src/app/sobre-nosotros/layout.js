import { metadatosPagina } from '@/lib/seo'

// La página es un componente de cliente y no puede exportar metadatos:
// este layout le da título, descripción y canonical propios (sin él heredaría los del inicio).
export const metadata = metadatosPagina({
  titulo: 'Sobre nosotros — CROWNLUX',
  descripcion: 'La historia de CROWNLUX: gorras premium seleccionadas por su calidad, material y diseño, con envíos a toda Colombia.',
  ruta: '/sobre-nosotros',
})

export default function Layout({ children }) {
  return children
}
