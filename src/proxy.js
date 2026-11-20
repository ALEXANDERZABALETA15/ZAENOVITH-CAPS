import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Solo corre en /admin. Refresca el token de la sesión cuando vence (los Server Components
// no pueden escribir cookies) y manda al login a quien no tiene sesión.
// La verificación de que el usuario ES admin la hace el layout del panel (src/lib/admin/sesion.js).
export async function proxy(request) {
  let respuesta = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesNuevas, headers) {
          cookiesNuevas.forEach(({ name, value }) => request.cookies.set(name, value))
          respuesta = NextResponse.next({ request })
          cookiesNuevas.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options))
          Object.entries(headers || {}).forEach(([clave, valor]) => respuesta.headers.set(clave, valor))
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const enLogin = request.nextUrl.pathname === '/admin/login'

  if (!data?.claims && !enLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return respuesta
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
