// Normaliza el nombre de una colección para comparar sin importar
// tildes, mayúsculas o plural ("Clasicos", "Clásicos", "clasico" → "clasico").
export function claveColeccion(nombre) {
  if (!nombre) return ''
  return nombre
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/s$/, '')
}

export const TODAS = 'todas'

// Orden y nombre visible de las colecciones conocidas.
// Una colección nueva en la base aparece igual, al final y con su nombre original.
const COLECCIONES_CONOCIDAS = [
  { clave: 'clasico', nombre: 'Clásicos' },
  { clave: 'urbano', nombre: 'Urbano' },
  { clave: 'premium', nombre: 'Premium' },
  { clave: 'vintage', nombre: 'Vintage' },
]

export function nombreColeccion(nombre) {
  const conocida = COLECCIONES_CONOCIDAS.find((c) => c.clave === claveColeccion(nombre))
  return conocida ? conocida.nombre : nombre
}

// Devuelve las colecciones presentes en el catálogo, en orden conocido.
export function coleccionesDisponibles(gorras) {
  const claves = new Map()
  gorras.forEach((g) => {
    const clave = claveColeccion(g.coleccion)
    if (clave && !claves.has(clave)) claves.set(clave, nombreColeccion(g.coleccion))
  })

  const orden = COLECCIONES_CONOCIDAS.map((c) => c.clave)
  return [...claves.entries()]
    .sort(([a], [b]) => {
      const ia = orden.indexOf(a) === -1 ? orden.length : orden.indexOf(a)
      const ib = orden.indexOf(b) === -1 ? orden.length : orden.indexOf(b)
      return ia - ib
    })
    .map(([clave, nombre]) => ({ clave, nombre }))
}
