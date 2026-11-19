import { Cinzel, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Analitica from '@/components/Analitica'
import { SITIO_URL } from '@/lib/contacto'  // Trae la dirección oficial del sitio desde un solo lugar
import { NOMBRE_SITIO, TITULO_SITIO, DESCRIPCION_SITIO, IMAGEN_COMPARTIR_SITIO } from '@/lib/seo'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

// Valores por defecto para las páginas que no definen los suyos.
// El canonical NO va aquí: Next lo heredaría a todas las páginas y cada gorra le diría a Google
// "mi versión oficial es el inicio". Cada página declara el suyo (ver metadatosPagina en src/lib/seo.js).
export const metadata = {
  metadataBase: new URL(SITIO_URL),   // Dirección base; Next la usa para completar los links relativos
  title: TITULO_SITIO,
  description: DESCRIPCION_SITIO,
  openGraph: {
    title: TITULO_SITIO,
    description: DESCRIPCION_SITIO,
    siteName: NOMBRE_SITIO,
    images: [IMAGEN_COMPARTIR_SITIO],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO_SITIO,
    description: DESCRIPCION_SITIO,
    images: [IMAGEN_COMPARTIR_SITIO.url],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${cinzel.variable} ${inter.variable}`}>
        <LoadingScreen />
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
        <Analitica />
      </body>
    </html>
  )
}