import { Event } from '@/types/database';

/**
 * Formatea una fecha ISO en una representación completa en español:
 * Ejemplo: "Sábado 3 de octubre de 2026 — 7:30 p. m."
 */
export function formatEventFullDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Sábado 3 de octubre de 2026 — 7:30 p. m.';

    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('es-ES', { month: 'long' });
    const year = d.getFullYear();
    const timeStr = d.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${capitalizedDay} ${dayNum} de ${monthName} de ${year} — ${timeStr}`;
  } catch {
    return 'Sábado 3 de octubre de 2026 — 7:30 p. m.';
  }
}

/**
 * Retorna solo la parte del día: "Sábado, 3 de Octubre"
 */
export function formatEventDateOnly(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Sábado, 3 de Octubre';

    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('es-ES', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return `${capitalizedDay}, ${dayNum} de ${capitalizedMonth}`;
  } catch {
    return 'Sábado, 3 de Octubre';
  }
}

/**
 * Retorna solo la hora: "7:30 p. m."
 */
export function formatEventTimeOnly(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '7:30 p. m.';
    return d.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '7:30 p. m.';
  }
}

/**
 * Genera el enlace oficial directo a Google Calendar para agendar el evento
 */
export function generateGoogleCalendarUrl(event: Event): string {
  const celebrant = event?.celebrant_name || 'María José Villegas';
  const locationName = event?.location_name || 'Cholas';
  const locationDetails = event?.location_details || 'Segundo piso';

  const title = encodeURIComponent(`👑 Mis XV Años — ${celebrant}`);
  const details = encodeURIComponent(
    `Acompáñame a celebrar mis 15 años este Sábado 3 de Octubre a las 7:30 p. m. en ${locationName} (${locationDetails}). Por favor confirma tu asistencia en la invitación digital 💜`
  );
  const location = encodeURIComponent(`${locationName} (${locationDetails}), Neiva, Huila`);
  
  // Sábado 3 de Octubre 2026 19:30 UTC-5 (Colombia) => 2026-10-04T00:30:00Z en UTC
  // Duración 5 horas (hasta las 00:30 AM del 4 de Octubre UTC-5) => 2026-10-04T05:30:00Z en UTC
  const startDate = '20261004T003000Z';
  const endDate = '20261004T053000Z';
  const dates = `${startDate}/${endDate}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Genera y dispara la descarga de un archivo de calendario estándar .ics
 */
export function downloadICSFile(event: Event): void {
  if (typeof window === 'undefined') return;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//XV Años Maria Jose//NONSGML v1.0//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'SUMMARY:Mis XV Años — María José Villegas',
    'DESCRIPTION:Celebración especial de los XV Años de María José. ¡Acompáñanos!',
    `LOCATION:${event.location_name || 'Cholas'}, ${event.location_details || 'Segundo piso'}`,
    'DTSTART:20261004T003000Z',
    'DTEND:20261004T053000Z',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'XV_Maria_Jose.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
