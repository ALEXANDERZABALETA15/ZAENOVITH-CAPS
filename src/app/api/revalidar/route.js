import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'

// Refresca al instante las páginas en caché (home, novedades, ofertas, cada gorra, sitemap).
// Sin esto, un cambio en Supabase (precio, agotada, gorra nueva) tarda hasta 10 minutos en verse.
//
// Configuración (una sola vez):
// 1. En el hosting, variable de entorno REVALIDAR_SECRETO = una clave larga al azar.
// 2. En Supabase → Database → Webhooks → Create a new hook:
//    tabla `gorras`, eventos Insert/Update/Delete, tipo HTTP Request, método POST,
//    URL https://www.crownlux.co/api/revalidar
//    y el header  x-revalidar-secreto: <la misma clave>
//
// Prueba manual:
//    curl -X POST https://www.crownlux.co/api/revalidar -H "x-revalidar-secreto: <clave>"

function claveValida(recibida, esperada) {
  const a = Buffer.from(recibida || '')
  const b = Buffer.from(esperada)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request) {
  const secreto = process.env.REVALIDAR_SECRETO
  if (!secreto) {
    return Response.json({ ok: false, error: 'REVALIDAR_SECRETO no está configurado' }, { status: 503 })
  }

  if (!claveValida(request.headers.get('x-revalidar-secreto'), secreto)) {
    return Response.json({ ok: false, error: 'No autorizado' }, { status: 401 })
  }

  // Un cambio en una gorra afecta varias páginas (listados, relacionadas, sitemap):
  // se marca todo como desactualizado y cada página se regenera en su próxima visita.
  revalidatePath('/', 'layout')

  return Response.json({ ok: true, revalidado: new Date().toISOString() })
}
