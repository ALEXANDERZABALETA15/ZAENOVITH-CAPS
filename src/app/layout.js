import { Cinzel, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LoadingScreen from '@/components/ui/LoadingScreen'

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

const imagenPreview = 'https://res.cloudinary.com/dg4kazsno/image/upload/v1787713702/Modifying_logo_in_image_2K_202608202128_uutkt2.jpg'
const titulo = 'CROWNLUX — Gorras Premium Originales en Colombia'
const descripcion = 'Tienda online de gorras premium: New Era, Supreme, Kith y mas. Ediciones exclusivas y limitadas con envios a todo Colombia. Calidad original garantizada.'

export const metadata = {
  title: titulo,
  description: descripcion,
  openGraph: {
    title: titulo,
    description: descripcion,
    url: 'https://zaenovith-caps.vercel.app',
    siteName: 'CROWNLUX',
    images: [
      {
        url: imagenPreview,
        width: 1200,
        height: 630,
        alt: 'CROWNLUX — Premium Caps',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: titulo,
    description: descripcion,
    images: [imagenPreview],
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
      </body>
    </html>
  )
}