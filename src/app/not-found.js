import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada — CROWNLUX',
}

export default function NoEncontrado() {
  return (
    <main style={{
      backgroundColor: 'var(--color-black)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px clamp(16px, 5vw, 40px) 60px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <p style={{
          color: 'var(--color-green-text)',
          fontSize: '48px',
          fontFamily: 'var(--font-cinzel)',
          fontWeight: '800',
          marginBottom: '12px',
        }}>
          404
        </p>
        <h1 style={{
          color: 'var(--color-white)',
          fontSize: 'clamp(20px, 4vw, 28px)',
          marginBottom: '12px',
        }}>
          Esta gorra ya no está aquí
        </h1>
        <p style={{
          color: 'var(--color-gray)',
          fontSize: '15px',
          lineHeight: '1.7',
          fontFamily: 'var(--font-inter)',
          marginBottom: '28px',
        }}>
          Puede que el link esté mal o que el producto ya no exista. Mira lo que tenemos disponible.
        </p>
        <Link href="/#catalogo" className="btn-cta btn-cta--primario">
          Ver catálogo
        </Link>
      </div>
    </main>
  )
}
