'use server'

import { requerirAdmin } from '@/lib/admin/sesion'
import { refrescarTienda, mensajeError, entero, texto } from '@/lib/admin/servidor'

// conteo    → la cantidad es el TOTAL contado (fija el stock)
// ingreso / devolucion → suman;  perdida → resta
const SIGNO = { ingreso: 1, devolucion: 1, perdida: -1 }

export async function moverStock({ gorraId, motivo, cantidad, nota }) {
  const { supabase } = await requerirAdmin()
  const numero = entero(cantidad)
  const id = entero(gorraId)

  if (!id) return { error: 'Gorra no válida.' }
  if (numero === null || numero < 0) return { error: 'Escribe una cantidad válida.' }

  let resultado
  if (motivo === 'conteo') {
    resultado = await supabase.rpc('fijar_stock', { p_gorra_id: id, p_stock: numero, p_nota: texto(nota) })
  } else if (SIGNO[motivo]) {
    if (numero === 0) return { error: 'La cantidad debe ser mayor que 0.' }
    resultado = await supabase.rpc('mover_stock', {
      p_gorra_id: id,
      p_cantidad: numero * SIGNO[motivo],
      p_motivo: motivo,
      p_nota: texto(nota),
    })
  } else {
    return { error: 'Motivo no válido.' }
  }

  if (resultado.error) return { error: mensajeError(resultado.error) }
  refrescarTienda()

  // Si la gorra quedó disponible, ¿alguien pidió que le avisaran?
  let avisos = 0
  if (resultado.data > 0) {
    const { count } = await supabase
      .from('avisos')
      .select('id', { count: 'exact', head: true })
      .eq('gorra_id', id)
      .eq('atendido', false)
    avisos = count || 0
  }

  return { ok: true, stock: resultado.data, avisos }
}
