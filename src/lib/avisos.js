import { supabase } from './supabase'

// Deja solo dígitos y quita el indicativo +57 si viene incluido.
export function normalizarCelular(valor) {
  const digitos = (valor || '').replace(/\D/g, '')
  return digitos.length === 12 && digitos.startsWith('57') ? digitos.slice(2) : digitos
}

// Celular colombiano: 10 dígitos y empieza por 3.
export function celularValido(valor) {
  return /^3\d{9}$/.test(normalizarCelular(valor))
}

// tipo: 'llegada' (próximamente) | 'restock' (agotado)
export async function registrarAviso({ gorra, tipo, telefono }) {
  const { error } = await supabase.from('avisos').insert({
    gorra_id: gorra.id,
    gorra_nombre: gorra.nombre,
    tipo,
    telefono: normalizarCelular(telefono),
    acepta_datos: true,
  })

  if (error) {
    console.error('Error al registrar aviso:', error)
    return false
  }
  return true
}
