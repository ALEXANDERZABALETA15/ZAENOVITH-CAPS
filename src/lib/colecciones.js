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
// titulo/descripcion: el encabezado de su página /coleccion/<clave> (lo que lee Google)
export const COLECCIONES_CONOCIDAS = [
  {
    clave: 'clasico',
    nombre: 'Clásicos',
    titulo: 'Gorras clásicas',
    descripcion: 'Estilos atemporales: gorras de líneas limpias y logos icónicos que combinan con todo.',
  },
  {
    clave: 'urbano',
    nombre: 'Urbano',
    titulo: 'Gorras urbanas',
    descripcion: 'Streetwear premium: snapbacks y diseños con actitud para el día a día.',
  },
  {
    clave: 'premium',
    nombre: 'Premium',
    titulo: 'Gorras premium',
    descripcion: 'Lo más exclusivo de CROWNLUX: ediciones especiales, colaboraciones y piezas limitadas.',
  },
  { clave: 'vintage', nombre: 'Vintage', titulo: 'Gorras vintage', descripcion: 'Diseños con aire retro.' },
]

export function datosColeccion(clave) {
  return COLECCIONES_CONOCIDAS.find((c) => c.clave === clave) ?? null
}

// Página propia de cada colección (ver app/coleccion/[clave]/page.js)
export function rutaColeccion(nombre) {
  return `/coleccion/${claveColeccion(nombre)}`
}

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
