// URL de cada gorra: /gorra/<slug>, por ejemplo /gorra/new-era-new-york-yankees-red-white-classic-cap-6
//
// El slug se guarda en Supabase al crear la gorra (nombre + id) y no cambia al editarla,
// así los enlaces compartidos y los que ya conoce Google no se rompen.
// Las URLs viejas con número (/gorra/6) redirigen a la del slug (ver app/gorra/[slug]/page.js).

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
    .slice(0, 80)
    .replace(/-+$/, '')
}

// Página de cada marca: /marca/new-era (ver app/marca/[marca]/page.js)
export function rutaMarca(marca) {
  return `/marca/${slugTexto(marca)}`
}
