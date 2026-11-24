// URL de cada gorra: /gorra/<slug>, por ejemplo /gorra/new-era-new-york-yankees-red-white-classic-cap
//
// El slug sale del nombre (sin id) y se guarda en Supabase al crear la gorra (ver slugUnico).
// No cambia al editarla, así los enlaces compartidos y los que ya conoce Google no se rompen.
// Las URLs viejas (/gorra/6 y /gorra/<nombre>-6) redirigen a la actual (ver app/gorra/[slug]/page.js).

// Solo minúsculas, números y guiones simples: lo demás no se usa como URL
export const FORMATO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugValido(slug) {
  return typeof slug === 'string' && FORMATO_SLUG.test(slug)
}

// Sin slug válido usa el id: la página lo muestra igual, sin redirigir (no hay a dónde)
export function rutaGorra(gorra) {
  return `/gorra/${slugValido(gorra.slug) ? gorra.slug : gorra.id}`
}

// "New Era Dodgers \"Black\" - 9FIFTY" → "new-era-dodgers-black-9fifty"
export function slugTexto(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) // suficiente para nombres largos con talla (7-1-8) sin cortar
    .replace(/-+$/, '')
}

// Slug de una gorra nueva: solo el nombre. Si ya lo usa otra gorra, se le suman datos que
// la distinguen (color, talla, marca) y, como último recurso, un consecutivo (-2, -3…). Nunca el id.
// ocupados: Set con los slugs de TODAS las gorras (también las ocultas: el slug es único en la base)
export function slugUnico(gorra, ocupados) {
  const candidatos = [
    [gorra.nombre],
    [gorra.nombre, gorra.color],
    [gorra.nombre, gorra.color, gorra.talla],
    [gorra.marca, gorra.nombre, gorra.color],
  ]
    .map((partes) => slugTexto(partes.filter(Boolean).join(' ')))
    // Un slug de solo números se confundiría con las URLs viejas por id (/gorra/6)
    .map((s) => (/^\d+$/.test(s) ? `gorra-${s}` : s || 'gorra'))

  const libre = candidatos.find((s) => !ocupados.has(s))
  if (libre) return libre

  for (let n = 2; ; n++) {
    const s = `${candidatos[0]}-${n}`
    if (!ocupados.has(s)) return s
  }
}

// ¿Es este texto de URL una versión vieja del slug de la gorra? Compara las palabras, sin importar
// cambios menores ("7-18" → "7-1-8", "gorra-" al inicio). Evita que una URL inventada que termina
// en número lleve a cualquier gorra.
export function pareceSlugDe(texto, slug) {
  const palabras = texto.split('-').filter((p) => p.length > 1 || /\d/.test(p))
  if (!palabras.length || !slug) return false
  const delSlug = new Set(slug.split('-'))
  const coinciden = palabras.filter((p) => delSlug.has(p)).length
  // 80 %: los slugs viejos reales coinciden en 87 % o más; dos gorras New Era parecidas, ~60 %
  return coinciden / palabras.length >= 0.8
}

// Página de cada marca: /marca/new-era (ver app/marca/[marca]/page.js)
export function rutaMarca(marca) {
  return `/marca/${slugTexto(marca)}`
}
