import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { clienteAdmin } from './supabase'

// Verifica en el servidor que quien pide la página o la acción es un admin.
// - getUser() valida el token contra Supabase (no confía solo en la cookie).
// - es_admin() revisa la tabla admins (ver supabase/admin.sql).
// Se usa en el layout del panel Y en cada Server Action: las acciones son endpoints
// públicos y no pasan por el layout.
export const requerirAdmin = cache(async () => {
  const supabase = await clienteAdmin()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: esAdmin, error } = await supabase.rpc('es_admin')
  if (error || !esAdmin) redirect('/admin/login?error=sin-permiso')

  return { supabase, user }
})
