'use client'

import Link from 'next/link'

// Error dentro del panel (por ejemplo, la base de datos todavía no tiene las tablas nuevas).
// En producción Next oculta el detalle del error del servidor; en desarrollo se muestra.
export default function ErrorPanel({ error, reset }) {
  const sinPreparar = /admin\.sql|does not exist|Could not find|schema cache/i.test(error?.message || '')

  return (
    <section className="adm-tarjeta adm-form">
      <h1>No se pudo cargar</h1>
      <div className="adm-alerta" data-tono="error">
        {sinPreparar
          ? 'Falta preparar la base de datos: ejecuta supabase/admin.sql en Supabase.'
          : 'Algo falló al cargar esta sección.'}
        {error?.message && <span className="adm-ayuda" style={{ display: 'block', marginTop: 6 }}>{error.message}</span>}
      </div>
      <div className="adm-acciones">
        <button type="button" className="adm-btn" onClick={() => reset()}>Reintentar</button>
        <Link href="/admin/productos" className="adm-btn adm-btn--fantasma">Ir a Productos</Link>
      </div>
    </section>
  )
}
