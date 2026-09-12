'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Gift, Shirt, PhoneCall, Info } from 'lucide-react';
import { Event } from '@/types/database';
import { formatEventDateOnly, formatEventTimeOnly, generateGoogleCalendarUrl } from '@/lib/formatEventDate';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const mapsUrl = event.google_maps_url || 'https://www.google.com/maps/search/?api=1&query=Cholas+Neiva';
  const formattedDateOnly = formatEventDateOnly(event.event_date);
  const formattedTimeOnly = formatEventTimeOnly(event.event_date);
  const googleCalUrl = generateGoogleCalendarUrl(event);
  const whatsappContactUrl = 'https://wa.me/573135734507?text=%C2%A1Hola!%20Tengo%20una%20consulta%20sobre%20la%20invitaci%C3%B3n%20de%20XV%20a%C3%B1os';

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4" id="detalles">
      <div className="text-center mb-6">
        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal tracking-wide">
          El gran día
        </h3>
        <p className="text-xs uppercase tracking-widest text-lavender-700 font-medium mt-1">
          Detalles de la Recepción
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Tarjeta de Fecha */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Fecha</p>
            <p className="text-base font-semibold text-plum font-heading">{formattedDateOnly}</p>
            <p className="text-xs text-plum/70 font-light">2026</p>
          </div>
        </div>

        {/* Tarjeta de Hora */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Hora</p>
            <p className="text-base font-semibold text-plum font-heading">{formattedTimeOnly}</p>
            <p className="text-xs text-plum/70 font-light">Puntual asistencia</p>
          </div>
        </div>

        {/* Tarjeta de Lugar */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Lugar</p>
            <p className="text-base font-semibold text-plum font-heading">{event.location_name || 'Cholas'}</p>
            {event.location_details && (
              <p className="text-xs text-plum/70 font-light">{event.location_details}</p>
            )}
          </div>
        </div>

        {/* TARJETA: CÓDIGO DE VESTIMENTA (DRESS CODE) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-white/80 to-rose-blush/40 backdrop-blur-md border border-white/90 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-lavender-100 flex items-center justify-center text-lavender-700 border border-gold/20">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-plum font-heading">Código de Vestimenta</h4>
              <p className="text-xs text-lavender-700 font-medium">Formal / Traje de Cóctel</p>
            </div>
          </div>
          <p className="text-xs text-plum/80 font-light leading-relaxed mt-2 pt-2 border-t border-gold/20">
            ✨ <span className="font-medium text-plum">Nota especial:</span> Agradecemos reservar los tonos <span className="font-semibold text-lavender-700">lila y lavanda</span> exclusivamente para la quinceañera.
          </p>
        </div>

        {/* TARJETA: LLUVIA DE SOBRES */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-white/80 to-lavender-50/60 backdrop-blur-md border border-white/90 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-rose-blush flex items-center justify-center text-rose-accent border border-gold/20">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-plum font-heading">Lluvia de Sobres</h4>
              <p className="text-xs text-rose-accent font-medium">Regalo sugerido</p>
            </div>
          </div>
          <p className="text-xs text-plum/80 font-light leading-relaxed mt-2 pt-2 border-t border-gold/20">
            &ldquo;Tu presencia es mi mayor regalo. Si deseas hacerme un detalle, contaremos con lluvia de sobres en el salón.&rdquo;
          </p>
        </div>

        {/* TARJETA: APOYO LOGÍSTICO Y ACCESOS */}
        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 border border-purple-200">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-plum font-heading">Información Logística</h4>
              <p className="text-xs text-purple-700 font-medium">Accesos y Parqueadero</p>
            </div>
          </div>
          <ul className="text-xs text-plum/80 font-light leading-relaxed mt-2 pt-2 border-t border-purple-100 space-y-1.5 list-disc list-inside">
            <li>El salón se encuentra ubicado en el <span className="font-medium">segundo piso</span>.</li>
            <li>Contamos con parqueadero y zonas de ascenso en la recepción.</li>
          </ul>
        </div>
      </div>

      {/* Botones de Acción Prácticos para el Invitado */}
      <div className="mt-6 space-y-3 text-center">
        {/* Ubicación Google Maps */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-lavender-600 via-purple-600 to-lavender-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-gold-accent" />
          <span>Ver ubicación en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {/* Único Botón Limpio de Agendar en Google Calendar */}
        <div>
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-white border border-purple-200 text-plum font-medium text-xs shadow-xs hover:bg-purple-50 transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>📅 Agendar en Google Calendar</span>
          </a>
        </div>

        {/* Consultas por WhatsApp configurado a +57 313 5734507 */}
        <div className="pt-1">
          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs text-purple-700 hover:text-purple-900 font-medium transition py-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>¿Tienes dudas? Consultas por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
