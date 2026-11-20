'use server'

import { revalidatePath } from 'next/cache'
import { requerirAdmin } from '@/lib/admin/sesion'
import { mensajeError, entero } from '@/lib/admin/servidor'

export async function marcarAviso(id, atendido) {
  const { supabase } = await requerirAdmin()
  const { error } = await supabase.from('avisos').update({ atendido: Boolean(atendido) }).eq('id', entero(id))
  if (error) return { error: mensajeError(error) }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

// Los teléfonos son datos personales: se pueden borrar cuando ya no se necesitan
export async function borrarAviso(id) {
  const { supabase } = await requerirAdmin()
  const { error } = await supabase.from('avisos').delete().eq('id', entero(id))
  if (error) return { error: mensajeError(error) }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}
