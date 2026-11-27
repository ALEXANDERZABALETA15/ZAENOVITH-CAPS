// Eventos comerciales con fecha (Black Friday, temporada, etc.).
// El panel del evento se muestra solo dentro de su ventana y se retira solo al terminar:
// no hay que acordarse de quitarlo. Horas de Colombia (UTC-5).
//
// Para verlo antes de que empiece (en local o en una vista previa): VISTA_EVENTOS=1 en .env.local

export const BLACK_FRIDAY = {
  inicio: '2026-11-27T00:00:00-05:00',
  fin: '2026-11-30T23:59:59-05:00',
  etiqueta: 'Black Week · 27 al 30 de noviembre',
  // Para lectores de pantalla, en vez del contador que cambia cada segundo
  cierre: 'el lunes 30 de noviembre a las 11:59 p. m.',
}

// Solo en el servidor (lee process.env). El home se regenera cada 10 minutos,
// así que el panel aparece y desaparece con hasta 10 minutos de diferencia;
// el contador del navegador lo retira en el segundo exacto en que termina.
export function eventoVigente(evento, ahora = Date.now()) {
  if (ahora >= Date.parse(evento.fin)) return false
  return ahora >= Date.parse(evento.inicio) || process.env.VISTA_EVENTOS === '1'
}
