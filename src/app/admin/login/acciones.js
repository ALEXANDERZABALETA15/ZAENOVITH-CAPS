'use server'

import { redirect } from 'next/navigation'
import { clienteAdmin } from '@/lib/admin/supabase'

export async function iniciarSesion(_estado, formData) {
  const correo = String(formData.get('correo') || '').trim()
  // Al copiar y pegar la contraseña suele colarse un espacio al inicio o al final
  const clave = String(formData.get('clave') || '').trim()
  if (!correo || !clave) return { error: 'Escribe tu correo y tu contraseña.' }

  const supabase = await clienteAdmin()
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave })
  if (error) return { error: 'Correo o contraseña incorrectos.' }

  const { data: esAdmin } = await supabase.rpc('es_admin')
  if (!esAdmin) {
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no tiene permiso de administrador.' }
  }

  redirect('/admin')
}

export async function cerrarSesion() {
  const supabase = await clienteAdmin()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
