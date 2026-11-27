'use client'

import { useEffect, useState } from 'react'

// [días, horas, minutos, segundos] que faltan, en texto de dos cifras
function cifras(ms) {
  let s = Math.max(0, Math.floor(ms / 1000))
  const dias = Math.floor(s / 86400)
  s -= dias * 86400
  const horas = Math.floor(s / 3600)
  s -= horas * 3600
  const minutos = Math.floor(s / 60)
  return [dias, horas, minutos, s - minutos * 60].map((n) => String(n).padStart(2, '0'))
}

const SIN_HORA = ['--', '--', '--', '--']

// Lo que falta hasta `fin` (fecha ISO), actualizado cada segundo.
// Devuelve "--" hasta cargar en el navegador: el HTML puede venir de caché y la hora del servidor ya no sirve.
export function useCuentaRegresiva(fin) {
  const [ahora, setAhora] = useState(null)

  useEffect(() => {
    const tic = () => setAhora(Date.now())
    tic()
    const intervalo = setInterval(tic, 1000)
    return () => clearInterval(intervalo)
  }, [])

  return ahora === null ? SIN_HORA : cifras(Date.parse(fin) - ahora)
}
