// Cliente de Supabase para el panel: usa la sesión del admin (cookies), así que cada consulta
// pasa por las reglas RLS de supabase/admin.sql. No se usa la service_role key en ningún lado.
import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function clienteAdmin() {
  const almacen = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => almacen.getAll(),
        setAll(cookiesNuevas) {
          // En un Server Component no se pueden escribir cookies; ahí la sesión ya la
          // refrescó src/proxy.js. En Server Actions (login, salir) sí se escriben.
          try {
            cookiesNuevas.forEach(({ name, value, options }) => almacen.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
